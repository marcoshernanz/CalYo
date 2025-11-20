import { defineTable } from "convex/server";
import { v } from "convex/values";

export const foodsFields = {
  externalId: v.optional(v.string()), // fdc:12345

  identity: v.union(
    v.object({
      source: v.literal("fdc"),
      id: v.number(),
      dataType: v.union(
        v.literal("Foundation"),
        v.literal("Legacy"),
        v.literal("Survey")
      ),
    }),
    v.object({
      source: v.literal("off"),
      id: v.string(),
    })
  ),

  name: v.object({
    en: v.string(),
  }),
  category: v.optional(v.object({ en: v.string() })),

  macroNutrients: v.object({
    protein: v.number(),
    fat: v.number(),
    carbs: v.number(),
  }),
  microNutrients: v.object({}),

  embedding: v.optional(v.array(v.float64())),
  hasEmbedding: v.boolean(),
};

export const foods = defineTable(foodsFields)
  .index("by_externalId", ["externalId"])
  .index("byHasEmbedding", ["hasEmbedding"])
  .vectorIndex("byEmbedding", {
    vectorField: "embedding",
    dimensions: 768,
  });

// TODO
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
  hasEmbedding: v.boolean(),
};
export const fdcFoods = defineTable(fdcFoodsFields)
  .index("byFdcId", ["fdcId"])
  .index("byHasEmbedding", ["hasEmbedding"])
  .vectorIndex("byEmbedding", {
    vectorField: "embedding",
    dimensions: 768,
    filterFields: ["dataType"],
  });
