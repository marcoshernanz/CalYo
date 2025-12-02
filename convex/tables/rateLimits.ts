import { defineTable } from "convex/server";
import { v } from "convex/values";

export const rateLimits = defineTable({
  userId: v.id("users"),
  key: v.union(v.literal("analyzeMealPhoto")),
  period: v.string(),
  count: v.number(),
}).index("lookup", ["userId", "key", "period"]);
