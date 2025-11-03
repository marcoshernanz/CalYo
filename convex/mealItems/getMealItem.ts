import { v } from "convex/values";
import { query } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

const getMealItem = query({
  args: { mealItemId: v.id("mealItems") },
  handler: async (ctx, { mealItemId }) => {
    try {
      const userId = await getAuthUserId(ctx);
      if (userId === null) throw new Error("Unauthorized");

      const mealItem = await ctx.db.get(mealItemId);
      if (!mealItem) return null;

      const meal = await ctx.db.get(mealItem.mealId);
      if (!meal) throw new Error("Meal not found");
      if (meal.userId !== userId) throw new Error("Forbidden");

      const food = await ctx.db.get(mealItem.foodId);
      if (!food) throw new Error("Food not found");

      const mealItemWithFood = { ...mealItem, food };

      return mealItemWithFood;
    } catch (error) {
      console.error("getMeal error", error);
      throw error;
    }
  },
});

export default getMealItem;
