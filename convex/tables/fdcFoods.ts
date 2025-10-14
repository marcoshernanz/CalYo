import { defineTable } from "convex/server";
import { v } from "convex/values";

export const fdcFoodsFields = {
  fdcId: v.number(),
  dataType: v.union(v.literal("Foundation")),
  description: v.object({
    en: v.string(),
  }),
  nutrients: v.object({
    calories: v.number(),
    protein: v.number(),
    fat: v.number(),
    carbs: v.number(),
  }),
};

export const fdcFoods = defineTable(fdcFoodsFields);
