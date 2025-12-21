import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export default mutation({
  args: {
    mealItemId: v.id("mealItems"),
    grams: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Unauthorized");
    }

    const mealItem = await ctx.db.get(args.mealItemId);
    if (!mealItem) {
      throw new Error("Meal item not found");
    }

    const meal = await ctx.db.get(mealItem.mealId);
    if (!meal) {
      throw new Error("Meal not found");
    }

    if (meal.userId !== userId) {
      throw new Error("Forbidden");
    }

    await ctx.db.patch(args.mealItemId, {
      grams: args.grams,
    });
  },
});
