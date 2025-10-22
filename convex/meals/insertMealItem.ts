import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { mealItemsFields } from "../tables/mealItems";
import { getAuthUserId } from "@convex-dev/auth/server";

const insertMealItem = mutation({
  args: v.object(mealItemsFields),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Unauthorized");

    const meal = await ctx.db.get(args.mealId);
    if (!meal) throw new Error("Meal not found");
    if (meal.userId !== userId) throw new Error("Forbidden");

    await ctx.db.insert("mealItems", args);
  },
});

export default insertMealItem;
