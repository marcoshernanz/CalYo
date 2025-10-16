import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation } from "../_generated/server";
import { mealsFields } from "../tables/meals";
import { v } from "convex/values";

const updateMeal = mutation({
  args: { id: v.id("meals"), meal: v.object(mealsFields) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return; // TODO: Correct handling or throw error?

    const meal = await ctx.db.get(args.id);
    if (!meal) return null; // TODO: Correct handling or throw error?
    if (meal.userId !== userId) return null; // TODO: Correct handling or throw error?

    await ctx.db.patch(args.id, args.meal);
  },
});

export default updateMeal;
