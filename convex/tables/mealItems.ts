import { defineTable } from "convex/server";
import { v } from "convex/values";

export const mealItemsFields = {
  mealId: v.id("meals"),
  foodId: v.id("foods"),
  grams: v.number(),
  nutrients: v.object({
    protein: v.number(),
    fat: v.number(),
    carbs: v.number(),
  }),
};

export const mealItems = defineTable(mealItemsFields).index("byMealId", [
  "mealId",
]);
