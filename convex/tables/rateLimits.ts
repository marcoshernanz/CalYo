import { defineTable } from "convex/server";
import { v } from "convex/values";

export const rateLimitsFields = {
  userId: v.id("users"),
  key: v.union(v.literal("analyzeMealPhoto"), v.literal("fixResults")),
  period: v.string(),
  count: v.number(),
};

export const rateLimits = defineTable(rateLimitsFields).index("lookup", [
  "userId",
  "key",
  "period",
]);
