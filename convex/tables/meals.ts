import { defineTable } from "convex/server";
import { v } from "convex/values";

export const mealsFields = {
  userId: v.id("users"),
  photoStorageId: v.string(), // TODO: photo, image or picture?
  name: v.string(),
  // Nutrients? Or just compute from mealItems?
};

export const meals = defineTable(mealsFields);
