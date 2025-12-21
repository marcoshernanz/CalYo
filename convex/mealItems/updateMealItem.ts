import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { partial } from "convex-helpers/validators";
import { mealItemsFields } from "../tables/mealItems";
import { updateMealTotals } from "../meals/updateMealTotals";

export default mutation({
  args: {
    mealItemId: v.id("mealItems"),
    mealItem: v.object(partial(mealItemsFields)),
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

    await ctx.db.patch(args.mealItemId, args.mealItem);

    await updateMealTotals(ctx, mealItem.mealId);
  },
});
