import { ActionCtx } from "../../_generated/server";
import { Id } from "../../_generated/dataModel";
import { DetectedItem } from "./detectMealItems";
import searchFdcCandidates from "./searchFdcCandidates";
import selectCandidates from "./selectCandidates";
import nameMeal from "./nameMeal";
import { api, internal } from "../../_generated/api";
import translateFood from "./translateFood";
import getFoodMacros from "../../../lib/food/getFoodMacros";
import getFoodNutrients from "../../../lib/food/getFoodNutrients";
import calculateHealthScore from "./calculateHealthScore";

export async function processDetectedItems(
  ctx: ActionCtx,
  mealId: Id<"meals">,
  detectedItems: DetectedItem[],
  imageUrl: string,
  mealName?: string
) {
  const mealNamePromise = (async () => {
    if (mealName) return mealName;
    console.time("nameMeal");
    const name = await nameMeal({ items: detectedItems });
    console.timeEnd("nameMeal");
    return name;
  })();

  const selectedItemsPromise = (async () => {
    console.time("searchFdcCandidates");
    const candidatesByItem = await searchFdcCandidates({
      ctx,
      detectedItems,
    });
    console.timeEnd("searchFdcCandidates");

    console.time("selectCandidates");
    const selection = await selectCandidates({
      detectedItems,
      candidatesByItem,
      imageUrl,
    });
    console.timeEnd("selectCandidates");
    return selection;
  })();

  const [finalMealName, selectedItems] = await Promise.all([
    mealNamePromise,
    selectedItemsPromise,
  ]);
  console.timeLog("analyzeMealPhoto", "Meal named and items selected");

  const itemPromises = selectedItems.map(async (selectedItem, i) => {
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
    console.timeLog("analyzeMealPhoto", "Food translated:", i + 1);

    if (fdcFood.healthScore === undefined) {
      const macros = getFoodMacros(fdcFood);
      const nutrients = getFoodNutrients(fdcFood);
      const healthScore = await calculateHealthScore({
        name: fdcFood.name.en,
        macros,
        nutrients,
      });
      await ctx.runMutation(internal.foods.updateFoodHealthScore.default, {
        id: fdcFood._id,
        healthScore,
      });
    }
    console.timeLog("analyzeMealPhoto", "Health score calculated:", i + 1);

    return {
      foodId: fdcFood._id,
      grams: selectedItem.grams,
    };
  });
  console.timeLog("analyzeMealPhoto", "Processing selected items");

  const results = await Promise.all(itemPromises);
  const foods = results.filter((food) => food !== null);

  await ctx.runMutation(api.meals.replaceMealItems.default, {
    mealId,
    foods,
  });
  console.timeLog("analyzeMealPhoto", "Meal items replaced");

  await ctx.runMutation(api.meals.updateMeal.default, {
    id: mealId,
    meal: { status: "done", name: finalMealName },
  });

  console.timeLog("analyzeMealPhoto", "Meal updated");
}
