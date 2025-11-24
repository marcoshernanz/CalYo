import { v } from "convex/values";
import { action } from "../../_generated/server";
import { api } from "../../_generated/api";
import macrosToKcal from "../../../lib/utils/macrosToKcal";
import detectMealIngredients from "./detectMealIngredients";
import searchFdcCandidates from "./searchFdcCandidates";
import selectCandidates from "./selectCandidates";
import scaleNutrients from "../../../lib/utils/scaleNutrients";
import nameMeal from "./nameMeal";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Doc, Id } from "../../_generated/dataModel";

const analyzeMealPhoto = action({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, { storageId }): Promise<Id<"meals">> => {
    let mealId: Id<"meals"> | undefined = undefined;
    try {
      const userId = await getAuthUserId(ctx);
      if (userId === null) throw new Error("Unauthorized");

      const imageUrl = await ctx.storage.getUrl(storageId);
      if (!imageUrl) throw new Error("Image not found");

      mealId = await ctx.runMutation(api.meals.createMeal.default);

      await ctx.runMutation(api.meals.updateMeal.default, {
        id: mealId,
        meal: {
          status: "processing",
          photoStorageId: storageId,
        },
      });

      const detectedIngredients = await detectMealIngredients({ imageUrl });
      if (detectedIngredients.length === 0) {
        throw new Error("No meal ingredients detected");
      }

      const mealNamePromise = nameMeal(detectedIngredients);
      const selectedIngredientsPromise = (async () => {
        const candidatesByIngredient = await searchFdcCandidates({
          ctx,
          detectedItems: detectedIngredients,
        });

        return selectCandidates({
          detectedIngredients: detectedIngredients,
          candidatesByIngredient: candidatesByIngredient,
          imageUrl,
        });
      })();

      const [mealName, selectedItems] = await Promise.all([
        mealNamePromise,
        selectedIngredientsPromise,
      ]);

      const totals: Doc<"meals">["totals"] = {
        calories: 0,
        protein: 0,
        fat: 0,
        carbs: 0,
      };
      const ingredients: Doc<"meals">["ingredients"] = [];

      for (const selectedIngredient of selectedItems) {
        const food = await ctx.runQuery(api.foods.getFoodByIdentity.default, {
          identity: { source: "fdc", id: selectedIngredient.fdcId },
        });
        if (!food) continue;

        const nutrients = scaleNutrients({
          nutrients: food.macroNutrients,
          grams: selectedIngredient.grams,
        });
        const calories = macrosToKcal(nutrients);

        ingredients.push({
          foodId: food._id,
          grams: selectedIngredient.grams,
          nutrients,
        });

        totals.calories += calories;
        totals.protein += nutrients.protein;
        totals.fat += nutrients.fat;
        totals.carbs += nutrients.carbs;
      }

      totals.calories = +totals.calories.toFixed(0);
      totals.protein = +totals.protein.toFixed(1);
      totals.fat = +totals.fat.toFixed(1);
      totals.carbs = +totals.carbs.toFixed(1);

      await ctx.runMutation(api.meals.updateMeal.default, {
        id: mealId,
        meal: { status: "done", name: mealName, totals, ingredients },
      });

      return mealId;
    } catch (error) {
      console.error("analyzeMealPhoto error", error);
      try {
        if (mealId) {
          await ctx.runMutation(api.meals.updateMeal.default, {
            id: mealId,
            meal: { status: "error" },
          });
        }
      } catch (updateError) {
        console.error("Failed to mark meal as error", updateError);
      }
      throw error;
    }
  },
});

export default analyzeMealPhoto;
