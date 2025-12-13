import { ActionCtx } from "../../_generated/server";
import { Id } from "../../_generated/dataModel";
import { DetectedItem } from "./detectMealItems";
import searchFdcCandidates from "./searchFdcCandidates";
import selectCandidates from "./selectCandidates";
import { api, internal } from "../../_generated/api";
import translateFood from "./translateFood";
import getFoodMacros from "../../../lib/food/getFoodMacros";
import getFoodNutrients from "../../../lib/food/getFoodNutrients";
import calculateHealthScore from "./calculateHealthScore";

type Params = {
  ctx: ActionCtx;
  mealId: Id<"meals">;
  detectedItems: DetectedItem[];
  imageUrl?: string;
  mealName: string;
  description?: string;
};

export async function processDetectedItems({
  ctx,
  mealId,
  detectedItems,
  imageUrl,
  mealName,
  description,
}: Params) {
  const candidatesByItem = await searchFdcCandidates({
    ctx,
    detectedItems,
  });

  const selectedItems = await selectCandidates({
    detectedItems,
    candidatesByItem,
    imageUrl,
    description,
  });

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

    return {
      foodId: fdcFood._id,
      grams: selectedItem.grams,
    };
  });

  const results = await Promise.all(itemPromises);
  const foods = results.filter((food) => food !== null);

  await ctx.runMutation(api.meals.replaceMealItems.default, {
    mealId,
    foods,
  });

  await ctx.runMutation(api.meals.updateMeal.default, {
    id: mealId,
    meal: { status: "done", name: mealName },
  });
}
