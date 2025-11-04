import { defineTable } from "convex/server";
import { v } from "convex/values";

export const profilesFields = {
  userId: v.id("users"),
  targets: v.object({
    carbs: v.number(),
    protein: v.number(),
    fat: v.number(),
  }),
};

export const profiles = defineTable(profilesFields).index("byUserId", [
  "userId",
]);
