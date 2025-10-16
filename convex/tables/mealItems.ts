import { defineTable } from "convex/server";
import { v } from "convex/values";

export const mealItemsFields = {
  mealId: v.id("meals"),
  grams: v.number(),
  confidence: v.number(),
  food: v.id("fdcFoods"),
  nutrients: v.optional(
    v.object({
      protein: v.number(),
      fat: v.number(),
      carbs: v.number(),
    })
  ),
};

export const mealItems = defineTable(mealItemsFields);
