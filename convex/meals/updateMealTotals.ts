import { MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";
import { MacrosType, MicrosType, NutrientsType } from "../tables/mealItems";
import {
  getEmptyNutrients,
  addNutrients,
  multiplyNutrients,
} from "../../config/nutrientsConfig";

export const updateMealTotals = async (
  ctx: MutationCtx,
  mealId: Id<"meals">
) => {
  const mealItems = await ctx.db
    .query("mealItems")
    .withIndex("byMealId", (q) => q.eq("mealId", mealId))
    .collect();

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
  let totalWeightedScore = 0;

  for (const item of mealItems) {
    const ratio = item.grams / 100;
    const itemCalories = item.macrosPer100g.calories * ratio;

    totalMacros.calories += itemCalories;
    totalMacros.protein += item.macrosPer100g.protein * ratio;
    totalMacros.fat += item.macrosPer100g.fat * ratio;
    totalMacros.carbs += item.macrosPer100g.carbs * ratio;

    totalWeightedScore += item.microsPer100g.score * itemCalories;
    totalMicros.fiber += item.microsPer100g.fiber * ratio;
    totalMicros.sugar += item.microsPer100g.sugar * ratio;
    totalMicros.sodium += item.microsPer100g.sodium * ratio;

    const scaledNutrients = multiplyNutrients(item.nutrientsPer100g, ratio);
    totalNutrients = addNutrients(totalNutrients, scaledNutrients);
  }

  if (totalMacros.calories > 0) {
    totalMicros.score = totalWeightedScore / totalMacros.calories;
  } else {
    totalMicros.score = 0;
  }

  await ctx.db.patch(mealId, {
    totalMacros,
    totalMicros,
    totalNutrients,
  });
};
