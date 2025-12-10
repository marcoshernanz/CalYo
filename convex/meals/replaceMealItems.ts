import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import getFoodMacros from "../../lib/food/getFoodMacros";
import getFoodNutrients from "../../lib/food/getFoodNutrients";
import { MacrosType, MicrosType, NutrientsType } from "../tables/mealItems";
import { WithoutSystemFields } from "convex/server";
import { Doc } from "../_generated/dataModel";
import getFoodMicros from "../../lib/food/getFoodMicros";

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
    const totalNutrients: NutrientsType = {
      carbs: {
        total: 0,
        net: 0,
        fiber: 0,
        sugar: 0,
      },
      fats: {
        total: 0,
        saturated: 0,
        monounsaturated: 0,
        polyunsaturated: 0,
        trans: 0,
        cholesterol: 0,
      },
      protein: {
        total: 0,
        leucine: 0,
        isoleucine: 0,
        valine: 0,
        tryptophan: 0,
      },
      vitamins: {
        a: 0,
        b12: 0,
        b9: 0,
        c: 0,
        d: 0,
        e: 0,
        k: 0,
      },
      minerals: {
        sodium: 0,
        potassium: 0,
        magnesium: 0,
        calcium: 0,
        iron: 0,
        zinc: 0,
      },
      other: {
        water: 0,
        caffeine: 0,
        alcohol: 0,
      },
    };

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

      totalNutrients.carbs.total += nutrientsPer100g.carbs.total * ratio;
      totalNutrients.carbs.net += nutrientsPer100g.carbs.net * ratio;
      totalNutrients.carbs.fiber += nutrientsPer100g.carbs.fiber * ratio;
      totalNutrients.carbs.sugar += nutrientsPer100g.carbs.sugar * ratio;
      totalNutrients.fats.total += nutrientsPer100g.fats.total * ratio;
      totalNutrients.fats.saturated += nutrientsPer100g.fats.saturated * ratio;
      totalNutrients.fats.monounsaturated +=
        nutrientsPer100g.fats.monounsaturated * ratio;
      totalNutrients.fats.polyunsaturated +=
        nutrientsPer100g.fats.polyunsaturated * ratio;
      totalNutrients.fats.trans += nutrientsPer100g.fats.trans * ratio;
      totalNutrients.fats.cholesterol +=
        nutrientsPer100g.fats.cholesterol * ratio;
      totalNutrients.protein.total += nutrientsPer100g.protein.total * ratio;
      totalNutrients.protein.leucine +=
        nutrientsPer100g.protein.leucine * ratio;
      totalNutrients.protein.isoleucine +=
        nutrientsPer100g.protein.isoleucine * ratio;
      totalNutrients.protein.valine += nutrientsPer100g.protein.valine * ratio;
      totalNutrients.protein.tryptophan +=
        nutrientsPer100g.protein.tryptophan * ratio;
      totalNutrients.vitamins.a += nutrientsPer100g.vitamins.a * ratio;
      totalNutrients.vitamins.b12 += nutrientsPer100g.vitamins.b12 * ratio;
      totalNutrients.vitamins.b9 += nutrientsPer100g.vitamins.b9 * ratio;
      totalNutrients.vitamins.c += nutrientsPer100g.vitamins.c * ratio;
      totalNutrients.vitamins.d += nutrientsPer100g.vitamins.d * ratio;
      totalNutrients.vitamins.e += nutrientsPer100g.vitamins.e * ratio;
      totalNutrients.vitamins.k += nutrientsPer100g.vitamins.k * ratio;
      totalNutrients.minerals.sodium +=
        nutrientsPer100g.minerals.sodium * ratio;
      totalNutrients.minerals.potassium +=
        nutrientsPer100g.minerals.potassium * ratio;
      totalNutrients.minerals.magnesium +=
        nutrientsPer100g.minerals.magnesium * ratio;
      totalNutrients.minerals.calcium +=
        nutrientsPer100g.minerals.calcium * ratio;
      totalNutrients.minerals.iron += nutrientsPer100g.minerals.iron * ratio;
      totalNutrients.minerals.zinc += nutrientsPer100g.minerals.zinc * ratio;
      totalNutrients.other.water += nutrientsPer100g.other.water * ratio;
      totalNutrients.other.caffeine += nutrientsPer100g.other.caffeine * ratio;
      totalNutrients.other.alcohol += nutrientsPer100g.other.alcohol * ratio;
    }

    await Promise.all(
      itemsToInsert.map((item) => ctx.db.insert("mealItems", item))
    );

    await ctx.db.patch(mealId, {
      totalMacros,
      totalNutrients,
    });

    return null;
  },
});

export default replaceMealItems;
