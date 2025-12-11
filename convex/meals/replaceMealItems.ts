import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import getFoodMacros from "../../lib/food/getFoodMacros";
import getFoodNutrients from "../../lib/food/getFoodNutrients";
import { MacrosType, MicrosType, NutrientsType } from "../tables/mealItems";
import { WithoutSystemFields } from "convex/server";
import { Doc } from "../_generated/dataModel";
import getFoodMicros from "../../lib/food/getFoodMicros";
import {
  getEmptyNutrients,
  addNutrients,
  multiplyNutrients,
} from "../../config/nutrientsConfig";

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

    await Promise.all(existingItems.map((item) => ctx.db.delete(item._id)));

    const totalMacros: MacrosType = {
      calories: 0,
      protein: 0,
      fat: 0,
      carbs: 0,
    };
    const totalMicros: MicrosType = {
      score: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
    };
    let totalNutrients: NutrientsType = getEmptyNutrients();

    const uniqueFoodIds = [...new Set(foods.map((f) => f.foodId))];
    const foodDocs = await Promise.all(
      uniqueFoodIds.map((id) => ctx.db.get(id))
    );
    const foodMap = new Map(foodDocs.map((f, i) => [uniqueFoodIds[i], f]));

    const itemsToInsert: WithoutSystemFields<Doc<"mealItems">>[] = [];

    for (const { foodId, grams } of foods) {
      const food = foodMap.get(foodId);
      if (!food) throw new Error(`Food not found: ${foodId}`);

      const macrosPer100g = getFoodMacros(food);
      const microsPer100g = getFoodMicros(food);
      const nutrientsPer100g = getFoodNutrients(food);

      itemsToInsert.push({
        mealId,
        foodId,
        grams,
        macrosPer100g,
        microsPer100g,
        nutrientsPer100g,
      });

      const ratio = grams / 100;

      totalMacros.calories += macrosPer100g.calories * ratio;
      totalMacros.protein += macrosPer100g.protein * ratio;
      totalMacros.fat += macrosPer100g.fat * ratio;
      totalMacros.carbs += macrosPer100g.carbs * ratio;

      totalMicros.score += microsPer100g.score * ratio;
      totalMicros.fiber += microsPer100g.fiber * ratio;
      totalMicros.sugar += microsPer100g.sugar * ratio;
      totalMicros.sodium += microsPer100g.sodium * ratio;

      const scaledNutrients = multiplyNutrients(nutrientsPer100g, ratio);
      totalNutrients = addNutrients(totalNutrients, scaledNutrients);
    }

    await Promise.all(
      itemsToInsert.map((item) => ctx.db.insert("mealItems", item))
    );

    await ctx.db.patch(mealId, {
      totalMacros,
      totalMicros,
      totalNutrients,
    });

    return null;
  },
});

export default replaceMealItems;
