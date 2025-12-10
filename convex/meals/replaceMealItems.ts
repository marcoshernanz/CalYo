import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import getFoodMacros from "../../lib/food/getFoodMacros";
import getFoodNutrients from "../../lib/food/getFoodNutrients";
import { Doc } from "../_generated/dataModel";

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

    const totalMacros: NonNullable<Doc<"meals">["totalMacros"]> = {
      calories: 0,
      protein: 0,
      fat: 0,
      carbs: 0,
    };
    const totalNutrients: NonNullable<Doc<"meals">["totalNutrients"]> = {
      carbs: {},
      fats: {},
      protein: {},
      vitamins: {},
      minerals: {},
      other: {},
    };

    for (const { foodId, grams } of foods) {
      const food = await ctx.db.get(foodId);
      if (!food) throw new Error(`Food not found: ${foodId}`);

      const macrosPer100g = getFoodMacros(food);
      const nutrientsPer100g = getFoodNutrients(food);

      await ctx.db.insert("mealItems", {
        mealId,
        foodId,
        grams,
        macrosPer100g,
        nutrientsPer100g,
      });

      const ratio = grams / 100;

      totalMacros.calories += macrosPer100g.calories * ratio;
      totalMacros.protein += macrosPer100g.protein * ratio;
      totalMacros.fat += macrosPer100g.fat * ratio;
      totalMacros.carbs += macrosPer100g.carbs * ratio;

      const categories = [
        "carbs",
        "fats",
        "protein",
        "vitamins",
        "minerals",
        "other",
      ] as const;

      for (const category of categories) {
        const sourceGroup = nutrientsPer100g[category];
        const targetGroup = totalNutrients[category];

        for (const key in sourceGroup) {
          const k = key as keyof typeof sourceGroup;
          const val = sourceGroup[k];
          if (typeof val === "number") {
            const tgt = targetGroup as Record<string, number | undefined>;
            tgt[k] = (tgt[k] ?? 0) + val * ratio;
          }
        }
      }
    }

    await ctx.db.patch(mealId, {
      totalMacros,
      totalNutrients,
    });

    return null;
  },
});

export default replaceMealItems;
