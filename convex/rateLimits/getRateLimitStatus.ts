import { query } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { analyzeMealConfig } from "../meals/analyze/analyzeMealConfig";
import { rateLimitsFields } from "../tables/rateLimits";

const getRateLimitStatus = query({
  args: {
    key: rateLimitsFields.key,
  },
  handler: async (ctx, { key }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const today = new Date().toISOString().split("T")[0];

    const existing = await ctx.db
      .query("rateLimits")
      .withIndex("lookup", (q) =>
        q
          .eq("userId", userId)
          .eq("key", key as "analyzeMealPhoto")
          .eq("period", today)
      )
      .unique();

    const count = existing ? existing.count : 0;
    let limit = 100;
    if (key === "analyzeMealPhoto") {
      limit = analyzeMealConfig.limitPerDay;
    }

    return {
      count,
      limit,
      remaining: Math.max(0, limit - count),
    };
  },
});

export default getRateLimitStatus;
