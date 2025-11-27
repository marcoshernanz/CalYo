import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "../_generated/server";
import { v } from "convex/values";
import logError from "@/lib/utils/logError";

const dayMs = 24 * 60 * 60 * 1000;

const getWeekMeals = query({
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
      const localMidnightMs = Math.floor(localNowMs / dayMs) * dayMs;
      const localDayOfWeek = new Date(localNowMs).getUTCDay();
      const daysFromMonday = (localDayOfWeek + 6) % 7;
      const localMondayStartMs = localMidnightMs - daysFromMonday * dayMs;

      const weekStartUtc = localMondayStartMs + offsetMs;
      const weekEndUtc = weekStartUtc + 7 * dayMs;

      const mealsQuery = ctx.db
        .query("meals")
        .withIndex("byUserId", (idx) =>
          idx
            .eq("userId", userId)
            .gte("_creationTime", weekStartUtc)
            .lt("_creationTime", weekEndUtc)
        )
        .filter((q) =>
          q.and(
            q.neq(q.field("status"), "error"),
            q.neq(q.field("status"), "deleted")
          )
        );

      const meals = await mealsQuery.collect();

      const week = Array.from({ length: 7 }, () => [] as typeof meals);
      for (const meal of meals) {
        const localMealMs = meal._creationTime - offsetMs;
        const dayIndex = Math.floor((localMealMs - localMondayStartMs) / dayMs);
        if (dayIndex >= 0 && dayIndex < 7) {
          week[dayIndex].push(meal);
        }
      }

      for (const dayMeals of week) {
        dayMeals.sort((a, b) => b._creationTime - a._creationTime);
      }

      return week;
    } catch (error) {
      logError("getWeekMeals error", error);
      throw error;
    }
  },
});

export default getWeekMeals;
