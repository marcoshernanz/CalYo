import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import getFoodMacros from "../../lib/food/getFoodMacros";
import getFoodNutrients from "../../lib/food/getFoodNutrients";

const replaceMealItems = mutation({
  args: {
    mealId: v.id("meals"),
    foods: v.array(v.object({ foodId: v.id("foods"), grams: v.number() })),
  },
  handler: async (ctx, { mealId, foods }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Unauthorized");

    const meal = await ctx.db.get(mealId);
    if (!meal) throw new Error("Meal not found");
    if (meal.userId !== userId) throw new Error("Forbidden");

    const existingItems = await ctx.db
      .query("mealItems")
      .withIndex("byMealId", (q) => q.eq("mealId", mealId))
      .collect();

    for (const item of existingItems) {
      await ctx.db.delete(item._id);
    }

    for (const { foodId, grams } of foods) {
      const food = await ctx.db.get(foodId);
      if (!food) throw new Error(`Food not found: ${foodId}`);

      await ctx.db.insert("mealItems", {
        mealId,
        foodId,
        grams,
        macrosPer100g: getFoodMacros(food),
        nutrientsPer100g: getFoodNutrients(food),
      });
    }
  },
});

export default replaceMealItems;
