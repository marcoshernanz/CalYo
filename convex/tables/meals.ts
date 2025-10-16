import { defineTable } from "convex/server";
import { v } from "convex/values";

export const mealsFields = {
  userId: v.id("users"),
  photoStorageId: v.string(),
  name: v.string(),
  // Nutrients? Or just compute from mealItems?
};

export const meals = defineTable(mealsFields);
