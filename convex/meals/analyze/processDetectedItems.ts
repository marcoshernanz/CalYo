import { ActionCtx } from "../../_generated/server";
import { Id } from "../../_generated/dataModel";
import { DetectedItem } from "./detectMealItems";
import searchFdcCandidates from "./searchFdcCandidates";
import selectCandidates from "./selectCandidates";
import nameMeal from "./nameMeal";
import { api, internal } from "../../_generated/api";
import translateFood from "./translateFood";
import scaleNutrients from "../../../lib/utils/scaleNutrients";
import macrosToKcal from "../../../lib/utils/macrosToKcal";

export async function processDetectedItems(
  ctx: ActionCtx,
  mealId: Id<"meals">,
  detectedItems: DetectedItem[],
  imageUrl: string
) {
  const mealNamePromise = nameMeal({ items: detectedItems });
  const selectedItemsPromise = (async () => {
    const candidatesByItem = await searchFdcCandidates({
      ctx,
      detectedItems,
    });

    return selectCandidates({
      detectedItems,
      candidatesByItem,
      imageUrl,
    });
  })();

  const [mealName, selectedItems] = await Promise.all([
    mealNamePromise,
    selectedItemsPromise,
  ]);

  await ctx.runMutation(api.meals.clearMealItems.default, { mealId });

  const itemPromises = selectedItems.map(async (selectedItem) => {
    const fdcFood = await ctx.runQuery(api.foods.getFoodById.default, {
      identity: { source: "fdc", id: selectedItem.fdcId },
    });
    if (!fdcFood) return null;

    if (!fdcFood.name.es) {
      const { nameEs, categoryEs } = await translateFood({
        nameEn: fdcFood.name.en,
        categoryEn: fdcFood.category?.en,
      });
      await ctx.runMutation(internal.foods.updateFoodTranslation.default, {
        id: fdcFood._id,
        nameEs,
        categoryEs,
      });
    }

    const nutrients = scaleNutrients({
      nutrients: fdcFood.macroNutrients,
      grams: selectedItem.grams,
    });
    const calories = macrosToKcal(nutrients);

    await ctx.runMutation(api.meals.insertMealItem.default, {
      mealId,
      foodId: fdcFood._id,
      grams: selectedItem.grams,
      nutrients,
    });

    return {
      calories,
      protein: nutrients.protein,
      fat: nutrients.fat,
      carbs: nutrients.carbs,
    };
  });

  const results = await Promise.all(itemPromises);

  const totals = { calories: 0, protein: 0, fat: 0, carbs: 0 };
  for (const result of results) {
    if (!result) continue;
    totals.calories += result.calories;
    totals.protein = +(totals.protein + result.protein).toFixed(1);
    totals.fat = +(totals.fat + result.fat).toFixed(1);
    totals.carbs = +(totals.carbs + result.carbs).toFixed(1);
  }

  await ctx.runMutation(api.meals.updateMeal.default, {
    id: mealId,
    meal: {
      status: "done",
      name: mealName,
      totals,
    },
  });
}
