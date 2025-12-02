import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation } from "@/convex/_generated/server";
import { rateLimitsFields } from "../rateLimits";

const checkAndIncrement = mutation({
  args: {
    key: rateLimitsFields.key,
    limit: v.number(),
  },
  handler: async (ctx, { key, limit }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const today = new Date().toISOString().split("T")[0];

    const existing = await ctx.db
      .query("rateLimits")
      .withIndex("lookup", (q) =>
        q.eq("userId", userId).eq("key", key).eq("period", today)
      )
      .unique();

    if (existing) {
      if (existing.count >= limit) {
        throw new Error(
          `Rate limit exceeded. You can only use this feature ${limit} times per day.`
        );
      }
      await ctx.db.patch(existing._id, { count: existing.count + 1 });
    } else {
      await ctx.db.insert("rateLimits", {
        userId,
        key,
        period: today,
        count: 1,
      });
    }
  },
});

export default checkAndIncrement;
