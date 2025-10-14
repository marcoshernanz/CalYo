// /* Usage:
//   CONVEX_URL=https://<your>.convex.cloud \
//   ts-node scripts/fdc_import_foundation_json.ts /path/to/FoodData_Central_full.json
// */

// import fs from "node:fs";
// import "dotenv/config";
// import { chain } from "stream-chain";
// import { parser } from "stream-json";
// import { pick } from "stream-json/filters/Pick";
// import { streamArray } from "stream-json/streamers/StreamArray";
// import { z } from "zod";
// import { ConvexHttpClient } from "convex/browser";
// import { api } from "../convex/_generated/api";

// // Zod: only validate the fields we use
// const FoodItem = z
//   .object({
//     fdcId: z.number(),
//     description: z.string(),
//     // optional in case some items are missing it, we fallback to 0s
//     foodNutrients: z
//       .array(
//         z.object({
//           amount: z.number().nullish(),
//           nutrient: z
//             .object({
//               id: z.number().optional(),
//               number: z.string().optional(), // e.g. "203", "208"
//             })
//             .partial(),
//         })
//       )
//       .default([]),
//   })
//   .passthrough();

// type FoodItem = z.infer<typeof FoodItem>;

// // Nutrient targets (support both id and number)
// const N = {
//   protein: { ids: [1003], nums: ["203"] },
//   fat: { ids: [1004, 1085], nums: ["204", "298"] }, // Total lipid; NLEA fallback
//   carbsDiff: { ids: [1005], nums: ["205"] },        // by difference
//   carbsSum: { ids: [1050], nums: ["205.2"] },       // by summation (fallback)
//   kcal: { ids: [1008], nums: ["208"] },
//   kJ: { ids: [1062], nums: ["268"] },
//   sugar: { ids: [1063], nums: ["269", "269.3"] },
//   starch: { ids: [1009], nums: ["209"] },
//   fiber: { ids: [1079], nums: ["291", "293"] },
// } as const;

// function getAmount(
//   nutrients: FoodItem["foodNutrients"],
//   target: { ids: number[]; nums: string[] }
// ): number | undefined {
//   for (const fn of nutrients) {
//     const amount = fn.amount ?? undefined;
//     if (amount == null) continue;
//     const id = fn.nutrient?.id;
//     const num = fn.nutrient?.number;
//     if ((id && target.ids.includes(id)) || (num && target.nums.includes(num))) {
//       return amount;
//     }
//   }
//   return undefined;
// }

// function computeCarbs(nutrients: FoodItem["foodNutrients"]): number {
//   const byDiff = getAmount(nutrients, N.carbsDiff);
//   if (byDiff !== undefined) return byDiff;
//   const bySum = getAmount(nutrients, N.carbsSum);
//   if (bySum !== undefined) return bySum;
//   const sugar = getAmount(nutrients, N.sugar) ?? 0;
//   const starch = getAmount(nutrients, N.starch) ?? 0;
//   const fiber = getAmount(nutrients, N.fiber) ?? 0;
//   const total = sugar + starch + fiber;
//   return total > 0 ? total : 0;
// }

// function toConvexDoc(item: FoodItem) {
//   const protein = getAmount(item.foodNutrients, N.protein) ?? 0;
//   const fat = getAmount(item.foodNutrients, N.fat) ?? 0; // prefers 1004; falls back 1085
//   const carbs = computeCarbs(item.foodNutrients);

//   // Calories: prefer kcal (1008/"208"); else convert kJ; else compute 4/4/9
//   const kcal = getAmount(item.foodNutrients, N.kcal);
//   const kJ = getAmount(item.foodNutrients, N.kJ);
//   const calories =
//     kcal ?? (kJ !== undefined ? kJ / 4.184 : 4 * protein + 4 * carbs + 9 * fat);

//   return {
//     fdcId: item.fdcId,
//     dataType: "Foundation" as const,
//     description: { en: item.description },
//     nutrients: {
//       calories,
//       protein,
//       fat,
//       carbs,
//     },
//   };
// }

// async function importFoundationFoods(jsonPath: string) {
//   const convexUrl = process.env.CONVEX_URL;
//   if (!convexUrl) {
//     throw new Error("Set CONVEX_URL env var to your Convex deployment URL");
//   }
//   const client = new ConvexHttpClient(convexUrl);

//   // Optional: wipe before importing to avoid duplicates between runs
//   // await client.mutation(api.fdc.wipeFdcFoods, {});

//   const BATCH_SIZE = 500;
//   let batch: any[] = [];
//   let total = 0;

//   console.time("import:FoundationFoods");

//   await new Promise<void>((resolve, reject) => {
//     // Build the streaming pipeline:
//     // - parser: stream JSON tokens
//     // - pick('FoundationFoods'): jump to that array in the top-level object
//     // - streamArray(): emit each element of the array
//     const pipeline = chain([
//       fs.createReadStream(jsonPath),
//       parser(),
//       pick({ filter: "FoundationFoods" }),
//       streamArray(),
//     ]);

//     // For every item in FoundationFoods...
//     pipeline.on("data", async (data: any) => {
//       const value = data.value; // the actual food object

//       // Validate with Zod (only fields we use)
//       const parsed = FoodItem.safeParse(value);
//       if (!parsed.success) {
//         // Skip malformed items, but don’t crash the import
//         return;
//       }

//       const doc = toConvexDoc(parsed.data);
//       batch.push(doc);

//       // If batch is full, pause, insert, then resume
//       if (batch.length >= BATCH_SIZE) {
//         pipeline.pause();
//         try {
//           await client.mutation(api.fdc.insertFdcFoods, { docs: batch });
//           total += batch.length;
//           console.log(`Inserted ${total} FoundationFoods`);
//           batch = [];
//         } catch (e) {
//           console.error("Insert error:", e);
//           pipeline.destroy(e as Error);
//           return;
//         } finally {
//           pipeline.resume();
//         }
//       }
//     });

//     pipeline.on("end", async () => {
//       try {
//         if (batch.length) {
//           await client.mutation(api.fdc.insertFdcFoods, { docs: batch });
//           total += batch.length;
//           batch = [];
//         }
//         console.timeEnd("import:FoundationFoods");
//         console.log(`Done. Inserted ${total} Foundation foods.`);
//         resolve();
//       } catch (e) {
//         reject(e);
//       }
//     });

//     pipeline.on("error", (err: any) => {
//       reject(err);
//     });
//   });
// }

// async function main() {
//   const jsonPath = process.argv[2];
//   if (!jsonPath) {
//     console.error("Usage: ts-node scripts/fdc_import_foundation_json.ts /path/to/FoodData_Central_full.json");
//     process.exit(1);
//   }
//   await importFoundationFoods(jsonPath);
// }

// main().catch((e) => {
//   console.error(e);
//   process.exit(1);
// });

// npx ts-node scripts/importFdcData.ts data.json

const fs = require("node:fs");
const { z } = require("zod");
const { chain } = require("stream-chain");
const { parser } = require("stream-json");
const { pick } = require("stream-json/filters/Pick.js");
const { streamArray } = require("stream-json/streamers/StreamArray.js");

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

async function importFoundationFoods(jsonPath: string) {
  // const convexUrl = process.env.CONVEX_URL;
  // if (!convexUrl) {
  //   throw new Error("Set CONVEX_URL env var to your Convex deployment URL");
  // }
  // const client = new ConvexHttpClient(convexUrl);

  // Optional: wipe before importing to avoid duplicates between runs
  // await client.mutation(api.fdc.wipeFdcFoods, {});

  const BATCH_SIZE = 500;
  let batch: any[] = [];
  let total = 0;

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
      // const doc = toConvexDoc(parsed.data);
      // batch.push(doc);
      // // If batch is full, pause, insert, then resume
      // if (batch.length >= BATCH_SIZE) {
      //   pipeline.pause();
      //   try {
      //     await client.mutation(api.fdc.insertFdcFoods, { docs: batch });
      //     total += batch.length;
      //     console.log(`Inserted ${total} FoundationFoods`);
      //     batch = [];
      //   } catch (e) {
      //     console.error("Insert error:", e);
      //     pipeline.destroy(e as Error);
      //     return;
      //   } finally {
      //     pipeline.resume();
      //   }
      // }
    });

    pipeline.on("end", async () => {
      console.log("end");
      // try {
      //   if (batch.length) {
      //     await client.mutation(api.fdc.insertFdcFoods, { docs: batch });
      //     total += batch.length;
      //     batch = [];
      //   }
      //   console.timeEnd("import:FoundationFoods");
      //   console.log(`Done. Inserted ${total} Foundation foods.`);
      //   resolve();
      // } catch (e) {
      //   reject(e);
      // }
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
