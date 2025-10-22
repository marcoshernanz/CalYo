import dotenv from "dotenv";
import fs from "node:fs";
import { z } from "zod";
import { chain } from "stream-chain";
import { parser } from "stream-json";
import { pick } from "stream-json/filters/Pick.js";
import { streamArray } from "stream-json/streamers/StreamArray.js";
import type { WithoutSystemFields } from "convex/server";
import type { Doc } from "../convex/_generated/dataModel";
import { api } from "../convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";

dotenv.config({ path: ".env.local" });

const FdcFood = z.object({
  fdcId: z.number(),
  description: z.string(),
  dataType: z.enum(["Foundation", "SR Legacy", "Survey (FNDDS)"]),
  foodNutrients: z.array(
    z.object({
      amount: z.number().nullish(),
      nutrient: z.object({
        id: z.number(),
      }),
    })
  ),
  foodCategory: z
    .object({
      description: z.string(),
    })
    .optional(),
});

type FoodItem = z.infer<typeof FdcFood>;

const nutrientTargets = {
  protein: [1003],
  fat: [1004, 1085],
  carbsByDiff: [1005],
  carbsBySum: [1050],
  sugar: [1063],
  starch: [1009],
  fiber: [1079],
};

const dataTypeMap = {
  Foundation: "Foundation",
  "SR Legacy": "Legacy",
  "Survey (FNDDS)": "Survey",
} as const;

function getAmount(
  nutrients: FoodItem["foodNutrients"],
  target: number[]
): number | undefined {
  for (const nutrient of nutrients) {
    const amount = nutrient.amount ?? undefined;
    if (amount === undefined) continue;

    const id = nutrient.nutrient?.id;
    if (id && target.includes(id) && amount >= 0) {
      return amount;
    }
  }

  return undefined;
}

function computeCarbs(nutrients: FoodItem["foodNutrients"]): number {
  const byDiff = getAmount(nutrients, nutrientTargets.carbsByDiff);
  if (byDiff !== undefined) return byDiff;

  const bySum = getAmount(nutrients, nutrientTargets.carbsBySum);
  if (bySum !== undefined) return bySum;

  const sugar = getAmount(nutrients, nutrientTargets.sugar) ?? 0;
  const starch = getAmount(nutrients, nutrientTargets.starch) ?? 0;
  const fiber = getAmount(nutrients, nutrientTargets.fiber) ?? 0;
  const total = sugar + starch + fiber;
  return Math.max(0, total);
}

function toConvexDoc(item: FoodItem): WithoutSystemFields<Doc<"fdcFoods">> {
  const protein = getAmount(item.foodNutrients, nutrientTargets.protein) ?? 0;
  const fat = getAmount(item.foodNutrients, nutrientTargets.fat) ?? 0;
  const carbs = computeCarbs(item.foodNutrients);

  return {
    fdcId: item.fdcId,
    dataType: dataTypeMap[item.dataType],
    description: { en: item.description },
    category: item.foodCategory
      ? { en: item.foodCategory.description }
      : undefined,
    nutrients: {
      protein,
      fat,
      carbs,
    },
    hasEmbedding: false,
  };
}

async function detectRootKey(jsonPath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const p = chain([fs.createReadStream(jsonPath), parser()]);
    let found = false;

    p.on("data", (token: any) => {
      if (!found && token?.name === "keyValue") {
        found = true;
        resolve(token.value as string);
        p.destroy();
      }
    });
    p.on("error", reject);
    p.on("end", () => {
      if (!found) {
        reject(new Error("No top-level key found in JSON"));
      }
    });
  });
}

async function importFdcData(jsonPath: string) {
  const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    throw new Error(
      "Set EXPO_PUBLIC_CONVEX_URL env var to your Convex deployment URL"
    );
  }
  const client = new ConvexHttpClient(convexUrl);

  const rootKey = await detectRootKey(jsonPath);
  const label = `import:${rootKey}`;

  const batchSize = 500;
  let batch: WithoutSystemFields<Doc<"fdcFoods">>[] = [];
  let totalInserted = 0;
  let totalUpdated = 0;

  console.time(label);

  await new Promise<void>((resolve, reject) => {
    const pipeline = chain([
      fs.createReadStream(jsonPath),
      parser(),
      pick({ filter: rootKey }),
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

          totalInserted += inserted;
          totalUpdated += updated;
          console.log(`Inserted ${totalInserted}, updated ${totalUpdated}.`);

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
        console.timeEnd(label);
        console.log(
          `Done. Inserted ${totalInserted}, updated ${totalUpdated} (${rootKey}).`
        );
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

  await importFdcData(jsonPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
