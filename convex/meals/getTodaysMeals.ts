import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "../_generated/server";
import { v } from "convex/values";

const dayMs = 24 * 60 * 60 * 1000;

const getTodaysMeals = query({
  args: {
    timezoneOffsetMinutes: v.number(),
  },
  handler: async (ctx, { timezoneOffsetMinutes }) => {
    try {
      const userId = await getAuthUserId(ctx);
      if (userId === null) throw new Error("Unauthorized");

      const now = Date.now();
      const offsetMs = timezoneOffsetMinutes * 60_000;

      const localNowMs = now - offsetMs;
      const startLocalMs = Math.floor(localNowMs / dayMs) * dayMs;
      const startUtc = startLocalMs + offsetMs;
      const endUtc = startUtc + dayMs;

      const query = ctx.db
        .query("meals")
        .withIndex("byUserId_creationTime", (idx) =>
          idx
            .eq("userId", userId)
            .gte("_creationTime", startUtc)
            .lt("_creationTime", endUtc)
        );

      const meals = await query.collect();
      return meals;
    } catch (error) {
      console.error("getTodaysMeals error", error);
      throw error;
    }
  },
});

export default getTodaysMeals;
