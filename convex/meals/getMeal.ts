import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "../_generated/server";
import { v } from "convex/values";

const getMeal = query({
  args: { mealId: v.id("meals") },
  handler: async (ctx, { mealId }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return; // TODO: Correct handling or throw error?

    const meal = await ctx.db.get(mealId);
    if (!meal) return null;

    if (meal.userId !== userId) return null;

    return meal;
  },
});

export default getMeal;
