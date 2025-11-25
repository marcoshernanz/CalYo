import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "../_generated/server";
import { v } from "convex/values";

const dayMs = 24 * 60 * 60 * 1000;

const getStreak = query({
  args: {
    timezoneOffsetMinutes: v.optional(v.number()),
  },
  handler: async (ctx, { timezoneOffsetMinutes }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return 0;

    const offsetMs = (timezoneOffsetMinutes ?? 0) * 60_000;
    const now = Date.now();
    const localNowMs = now - offsetMs;
    const todayLocalMidnight = Math.floor(localNowMs / dayMs) * dayMs;

    const meals = await ctx.db
      .query("meals")
      .withIndex("byUserId", (q) => q.eq("userId", userId))
      .order("desc")
      .filter((q) => q.neq(q.field("status"), "error"))
      .collect();

    if (meals.length === 0) return 0;

    let streak = 0;
    let lastDateProcessed: number | null = null;

    for (const meal of meals) {
      const localMealTime = meal._creationTime - offsetMs;
      const mealDate = Math.floor(localMealTime / dayMs) * dayMs;

      if (lastDateProcessed === mealDate) {
        continue;
      }

      if (lastDateProcessed === null) {
        if (mealDate === todayLocalMidnight) {
          streak = 1;
          lastDateProcessed = mealDate;
        } else if (mealDate === todayLocalMidnight - dayMs) {
          streak = 1;
          lastDateProcessed = mealDate;
        } else {
          return 0;
        }
      } else {
        if (mealDate === lastDateProcessed - dayMs) {
          streak++;
          lastDateProcessed = mealDate;
        } else {
          break;
        }
      }
    }

    return streak;
  },
});

export default getStreak;
