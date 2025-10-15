// npx ts-node scripts/importFdcData.ts data.json

import dotenv from "dotenv";
import fs from "node:fs";
import { z } from "zod";
import { chain } from "stream-chain";
import { parser } from "stream-json";
import { pick } from "stream-json/filters/Pick";
import { streamArray } from "stream-json/streamers/StreamArray";
import { WithoutSystemFields } from "convex/server";
import { Doc } from "../convex/_generated/dataModel";
import { api } from "../convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";

dotenv.config({ path: ".env.local" });

const FdcFood = z.object({
  fdcId: z.number(),
  description: z.string(),
  foodNutrients: z.array(
    z.object({
      amount: z.number().nullish(),
      nutrient: z.object({
        id: z.number(),
      }),
    })
  ),
});

type FoodItem = z.infer<typeof FdcFood>;

const nutrientTargets = {
  protein: [1003],
  fat: [1004, 1085],
  carbs: [1005, 1050],
  sugar: [1063],
  starch: [1009],
  fiber: [1079],
};

function getAmount(
  nutrients: FoodItem["foodNutrients"],
  target: number[]
): number | undefined {
  for (const nutrient of nutrients) {
    const amount = nutrient.amount ?? undefined;
    if (amount === undefined) continue;

    const id = nutrient.nutrient?.id;
    if (id && target.includes(id)) {
      return amount;
    }
  }

  return undefined;
}

function computeCarbs(nutrients: FoodItem["foodNutrients"]): number {
  const carbs = getAmount(nutrients, nutrientTargets.carbs);
  if (carbs !== undefined) return carbs;

  const sugar = getAmount(nutrients, nutrientTargets.sugar) ?? 0;
  const starch = getAmount(nutrients, nutrientTargets.starch) ?? 0;
  const fiber = getAmount(nutrients, nutrientTargets.fiber) ?? 0;
  const total = sugar + starch + fiber;
  return total > 0 ? total : 0;
}

function toConvexDoc(item: FoodItem): WithoutSystemFields<Doc<"fdcFoods">> {
  const protein = getAmount(item.foodNutrients, nutrientTargets.protein) ?? 0;
  const fat = getAmount(item.foodNutrients, nutrientTargets.fat) ?? 0;
  const carbs = computeCarbs(item.foodNutrients);

  return {
    fdcId: item.fdcId,
    dataType: "Foundation" as const,
    description: { en: item.description },
    nutrients: {
      protein,
      fat,
      carbs,
    },
  };
}

async function importFoundationFoods(jsonPath: string) {
  const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    throw new Error(
      "Set EXPO_PUBLIC_CONVEX_URL env var to your Convex deployment URL"
    );
  }
  const client = new ConvexHttpClient(convexUrl);

  const batchSize = 500;
  let batch: any[] = [];
  let totalInserted = 0;
  let totalUpdated = 0;

  console.time("import:FoundationFoods");

  await new Promise<void>((resolve, reject) => {
    const pipeline = chain([
      fs.createReadStream(jsonPath),
      parser(),
      pick({ filter: "FoundationFoods" }),
      streamArray(),
    ]);

    pipeline.on("data", async (data: any) => {
      const value = data.value;
      const parsed = FdcFood.safeParse(value);
      if (!parsed.success) {
        console.warn("Skipping malformed item:", value);
        return;
      }
      const doc = toConvexDoc(parsed.data);
      batch.push(doc);
      if (batch.length >= batchSize) {
        pipeline.pause();
        try {
          const { inserted, updated } = await client.mutation(
            api.fdc.upsertFdcFoods.default,
            { docs: batch }
          );

          console.log(`Inserted ${inserted} FoundationFoods`);
          console.log(`Updated ${updated} FoundationFoods`);
          totalInserted += inserted;
          totalUpdated += updated;

          batch = [];
        } catch (e) {
          console.error("Upsert error:", e);
          pipeline.destroy(e as Error);
          return;
        } finally {
          pipeline.resume();
        }
      }
    });

    pipeline.on("end", async () => {
      try {
        if (batch.length) {
          const { inserted, updated } = await client.mutation(
            api.fdc.upsertFdcFoods.default,
            { docs: batch }
          );
          totalInserted += inserted;
          totalUpdated += updated;
          batch = [];
        }
        console.timeEnd("import:FoundationFoods");
        console.log(`Done. Inserted ${totalInserted} Foundation foods.`);
        console.log(`Done. Updated ${totalUpdated} Foundation foods.`);
        resolve();
      } catch (e) {
        reject(e);
      }
    });

    pipeline.on("error", (err: any) => {
      reject(err);
    });
  });
}

async function main() {
  const jsonPath = process.argv[2];
  if (!jsonPath) {
    console.error("Pass path to the bulk JSON file.");
    process.exit(1);
  }

  await importFoundationFoods(jsonPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
