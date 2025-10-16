import { defineTable } from "convex/server";
import { v } from "convex/values";

export const mealsFields = v.union(
  v.object({
    userId: v.id("users"),
    status: v.literal("pending"),
  }),
  v.object({
    userId: v.id("users"),
    name: v.string(),
    photoStorageId: v.string(), // TODO: photo, image or picture?
    status: v.union(
      v.literal("processing"),
      v.literal("done"),
      v.literal("error")
    ),
    totals: v.object({
      calories: v.number(),
      protein: v.number(),
      fat: v.number(),
      carbs: v.number(),
    }),
  })
);

export const meals = defineTable(mealsFields);
