import { defineTable } from "convex/server";
import { v } from "convex/values";
import { macrosFields, microsFields, nutrientsFields } from "./mealItems";

export const mealsFields = {
  userId: v.id("users"),
  status: v.union(
    v.literal("pending"),
    v.literal("processing"),
    v.literal("done"),
    v.literal("error"),
    v.literal("deleted")
  ),
  name: v.optional(v.string()),
  photoStorageId: v.optional(v.id("_storage")),
  totalMacros: v.optional(v.object(macrosFields)),
  totalMicros: v.optional(v.object(microsFields)),
  totalNutrients: v.optional(v.object(nutrientsFields)),
};

export const meals = defineTable(mealsFields).index("byUserId", ["userId"]);
