import { defineTable } from "convex/server";
import { v } from "convex/values";

export const mealsFields = {
  userId: v.id("users"),
  status: v.union(
    v.literal("pending"),
    v.literal("processing"),
    v.literal("done"),
    v.literal("error")
  ),
  name: v.optional(v.string()),
  photoStorageId: v.optional(v.id("_storage")),
  totals: v.optional(
    v.object({
      calories: v.number(),
      protein: v.number(),
      fat: v.number(),
      carbs: v.number(),
    })
  ),
};

export const meals = defineTable(mealsFields).index("byUserId_creationTime", [
  "userId",
  "_creationTime",
]);
