import { defineTable } from "convex/server";
import { v } from "convex/values";

export const fdcFoodsTable = defineTable({
  fdcId: v.number(),
  dataType: v.union(
    v.literal("Foundation"),
    v.literal("SR Legacy"),
    v.literal("Survey")
  ),
  description: v.object({
    en: v.string(),
  }),
  category: v.object({
    en: v.string(),
  }),
  nutrients: v.object({
    calories: v.number(),
    protein: v.number(),
    fat: v.number(),
    carbs: v.number(),
  }),
});
