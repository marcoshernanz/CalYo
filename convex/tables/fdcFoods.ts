import { defineTable } from "convex/server";
import { v } from "convex/values";

export const fdcFoodsFields = {
  fdcId: v.number(),
  dataType: v.union(
    v.literal("Foundation"),
    v.literal("Legacy"),
    v.literal("Survey")
  ),
  description: v.object({
    en: v.string(),
  }),
  category: v.optional(v.object({ en: v.string() })),
  nutrients: v.object({
    protein: v.number(),
    fat: v.number(),
    carbs: v.number(),
  }),

  embedding: v.optional(v.array(v.float64())),
};

export const fdcFoods = defineTable(fdcFoodsFields)
  .index("byFdcId", ["fdcId"])
  .vectorIndex("byEmbedding", {
    vectorField: "embedding",
    dimensions: 768,
    filterFields: ["dataType"],
  });
