import { action, mutation } from "../_generated/server";
import { v } from "convex/values";
import tryCatch from "../../lib/utils/tryCatch";

type DataTypeArg = "Foundation" | "SR Legacy" | "Survey";

const PAGE_SIZE_DEFAULT = 200;
const FDC_NUMBERS = {
  calories: "1008",
  protein: "1003",
  fat: "1004",
  carbs: "1005",
} as const;

function mapDataTypeForFdc(param: DataTypeArg): string {
  return param === "Survey" ? "Survey (FNDDS)" : param;
}

function normalizeCategory(f: any): string {
  return (
    f?.foodCategory?.description ??
    f?.wweiaFoodCategory?.wweiaFoodCategoryDescription ??
    "Unknown"
  );
}

function mapNutrients(f: any) {
  let calories = 0,
    protein = 0,
    fat = 0,
    carbs = 0;
  for (const n of f.foodNutrients ?? []) {
    const number = n?.nutrient?.number;
    const amount = typeof n?.amount === "number" ? n.amount : 0;
    if (number === FDC_NUMBERS.calories) calories = amount;
    else if (number === FDC_NUMBERS.protein) protein = amount;
    else if (number === FDC_NUMBERS.fat) fat = amount;
    else if (number === FDC_NUMBERS.carbs) carbs = amount;
  }
  return { calories, protein, fat, carbs };
}

// export const insertFdcFoods = mutation({
//   args: {
//     docs: v.array(
//       v.object({
//         fdcId: v.number(),
//         dataType: v.union(
//           v.literal("Foundation"),
//           v.literal("SR Legacy"),
//           v.literal("Survey")
//         ),
//         description: v.object({ en: v.string() }),
//         category: v.object({ en: v.string() }),
//         nutrients: v.object({
//           calories: v.number(),
//           protein: v.number(),
//           fat: v.number(),
//           carbs: v.number(),
//         }),
//       })
//     ),
//   },
//   handler: async (ctx, { docs }) => {
//     for (const d of docs) {
//       await ctx.db.insert("fdcFoods", d);
//     }
//     return { inserted: docs.length };
//   },
// });

// // Optional helper to clear all rows before a fresh import (avoids duplicates)
// export const wipeFdcFoods = mutation({
//   args: {},
//   handler: async (ctx) => {
//     let count = 0;
//     for await (const row of ctx.db.query("fdcFoods")) {
//       await ctx.db.delete(row._id);
//       count++;
//     }
//     return { deleted: count };
//   },
// });

const ingestFdcFoods = action({
  args: {
    // dataType: v.union(
    //   v.literal("Foundation"),
    //   v.literal("SR Legacy"),
    //   v.literal("Survey")
    // ),
    // startPage: v.number(), // e.g. 1
    // pages: v.number(), // how many pages to fetch this run, e.g. 10
    // pageSize: v.optional(v.number()), // default 200 (FDC max)
  },
  handler: async (
    ctx
    // { dataType, startPage, pages, pageSize = PAGE_SIZE_DEFAULT }
  ) => {
    const apiKey = process.env.FDC_API_KEY;
    if (!apiKey) throw new Error("Missing FDC_API_KEY");

    const url = new URL("https://api.nal.usda.gov/fdc/v1/foods/list");
    url.searchParams.set("api_key", apiKey);

    let pageNumber = 0;
    let data: any[] = [];

    while (true) {
      const { data: response, error } = await tryCatch(
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            dataType: ["Foundation"],
            pageNumber,
          }),
        })
      );
      if (error) {
        console.error("Error fetching FDC data:", error);
        break;
      }

      const json = await response.json();
      if (!json || !Array.isArray(json) || json.length === 0) break;

      data.push(...json);

      pageNumber++;
    }

    console.log(data);

    // let page = startPage;
    // let totalInserted = 0;
    // let done = false;

    // for (let i = 0; i < pages; i++) {
    //   const url = new URL("https://api.nal.usda.gov/fdc/v1/foods/list");
    //   url.searchParams.set("api_key", apiKey);
    //   url.searchParams.set("dataType", mapDataTypeForFdc(dataType));
    //   url.searchParams.set("pageSize", String(pageSize));
    //   url.searchParams.set("pageNumber", String(page));

    //   const res = await fetch(url.toString());
    //   if (!res.ok)
    //     throw new Error(`FDC error ${res.status} on ${dataType} page ${page}`);

    //   const batch = (await res.json()) as any[];
    //   if (!batch.length) {
    //     done = true;
    //     break;
    //   }

    //   const docs = batch.map((f: any) => ({
    //     fdcId: f.fdcId as number,
    //     dataType, // mapped to your union; FDC returns "Survey (FNDDS)" but we pass "Survey"
    //     description: { en: f.description as string },
    //     category: { en: normalizeCategory(f) },
    //     nutrients: mapNutrients(f),
    //   }));

    //   await ctx.runMutation(insertFdcFoods, { docs });

    //   totalInserted += docs.length;
    //   page += 1;
    //   // polite throttle
    //   await new Promise((r) => setTimeout(r, 150));
    // }

    // return { inserted: totalInserted, nextPage: page, done };
  },
});

export default ingestFdcFoods;
