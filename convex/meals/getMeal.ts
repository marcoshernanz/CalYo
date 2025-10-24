import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "../_generated/server";
import { v } from "convex/values";

const getMeal = query({
  args: { mealId: v.id("meals") },
  handler: async (ctx, { mealId }) => {
    try {
      const userId = await getAuthUserId(ctx);
      if (userId === null) throw new Error("Unauthorized");

      const meal = await ctx.db.get(mealId);
      if (!meal) throw new Error("Not found");
      if (meal.userId !== userId) throw new Error("Forbidden");

      const mealItems = await ctx.db
        .query("mealItems")
        .withIndex("byMealId", (q) => q.eq("mealId", mealId))
        .collect();

      const mealItemsWithFood = await Promise.all(
        mealItems.map(async (mealItem) => {
          const food = await ctx.db.get(mealItem.food);
          if (!food) throw new Error("Food not found");

          return { ...mealItem, food };
        })
      );

      return { meal, mealItems: mealItemsWithFood };
    } catch (error) {
      console.error("getMeal error", error);
      throw error;
    }
  },
});

export default getMeal;
