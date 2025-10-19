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
  category: v.object({
    en: v.string(),
  }),
  nutrients: v.object({
    protein: v.number(),
    fat: v.number(),
    carbs: v.number(),
  }),
};

export const fdcFoods = defineTable(fdcFoodsFields).index("byFdcId", ["fdcId"]);
