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

    const id = nutrient.nutrient.id;
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

function toConvexDoc(item: FoodItem): WithoutSystemFields<Doc<"foods">> {
  const protein = getAmount(item.foodNutrients, nutrientTargets.protein) ?? 0;
  const fat = getAmount(item.foodNutrients, nutrientTargets.fat) ?? 0;
  const carbs = computeCarbs(item.foodNutrients);

  return {
    identity: {
      source: "fdc",
      id: item.fdcId,
      dataType: dataTypeMap[item.dataType],
    },
    name: { en: item.description },
    category: item.foodCategory
      ? { en: item.foodCategory.description }
      : undefined,
    macroNutrients: { protein, fat, carbs },
    microNutrients: {},
    hasEmbedding: false,
  };
}

async function detectRootKey(jsonPath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const p = chain([fs.createReadStream(jsonPath), parser()]);
    let found = false;

    p.on("data", (token: { name: string; value: unknown }) => {
      if (!found && token.name === "keyValue") {
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
  const ingestToken = process.env.CONVEX_INGEST_TOKEN;
  if (!convexUrl) throw new Error("Set EXPO_PUBLIC_CONVEX_URL");
  if (!ingestToken) throw new Error("Set CONVEX_INGEST_TOKEN");

  const client = new ConvexHttpClient(convexUrl);

  const rootKey = await detectRootKey(jsonPath);
  const label = `import:${rootKey}`;

  const batchSize = 500;
  let batch: WithoutSystemFields<Doc<"foods">>[] = [];
  let totalInserted = 0;
  let totalUpdated = 0;

  console.time(label);

  const toError = (error: unknown): Error =>
    error instanceof Error ? error : new Error(String(error));

  const flushBatch = async () => {
    if (!batch.length) return;

    const docs = batch;
    batch = [];

    const { inserted, updated } = await client.action(
      api.foods.ingestFoods.default,
      { token: ingestToken, docs }
    );

    totalInserted += inserted;
    totalUpdated += updated;
    console.log(`Inserted ${totalInserted}, updated ${totalUpdated}.`);
  };

  await new Promise<void>((resolve, reject) => {
    const pipeline = chain([
      fs.createReadStream(jsonPath),
      parser(),
      pick({ filter: rootKey }),
      streamArray(),
    ]);

    pipeline.on("data", (data: { value: unknown; key: number }) => {
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
        void flushBatch()
          .then(() => {
            pipeline.resume();
          })
          .catch((error: unknown) => {
            console.error("Upsert error:", error);
            pipeline.destroy(toError(error));
          });
      }
    });

    pipeline.on("end", () => {
      void flushBatch()
        .then(() => {
          console.timeEnd(label);
          console.log(
            `Done. Inserted ${totalInserted}, updated ${totalUpdated} (${rootKey}).`
          );
          resolve();
        })
        .catch((error: unknown) => {
          reject(toError(error));
        });
    });

    pipeline.on("error", (err: unknown) => {
      reject(toError(err));
    });
  });
}

async function main() {
  const jsonPath = process.argv.at(2);
  if (!jsonPath) {
    console.error("Pass path to the bulk JSON file.");
    process.exit(1);
  }

  await importFdcData(jsonPath);
}

main().catch((e: unknown) => {
  console.error(e);
  process.exit(1);
});
