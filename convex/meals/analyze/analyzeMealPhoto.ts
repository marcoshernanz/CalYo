import { v } from "convex/values";
import { action } from "../../_generated/server";
import { api, internal } from "../../_generated/api";
import macrosToKcal from "../../../lib/utils/macrosToKcal";
import detectMealItems from "./detectMealItems";
import searchFdcCandidates from "./searchFdcCandidates";
import selectCandidates from "./selectCandidates";
import scaleNutrients from "../../../lib/utils/scaleNutrients";
import nameMeal from "./nameMeal";
import translateFood from "./translateFood";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "../../_generated/dataModel";
import logError from "@/lib/utils/logError";
import { rateLimiter } from "../../rateLimit";

const analyzeMealPhoto = action({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, { storageId }): Promise<Id<"meals">> => {
    let mealId: Id<"meals"> | undefined = undefined;
    try {
      const userId = await getAuthUserId(ctx);
      if (userId === null) throw new Error("Unauthorized");

      await rateLimiter.limit(ctx, "analyzeMealPhoto", {
        key: userId,
        throws: true,
      });

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

      const detectedItems = await detectMealItems({ imageUrl });
      if (detectedItems.length === 0) {
        console.log("No meal items detected");
        await ctx.runMutation(api.meals.updateMeal.default, {
          id: mealId,
          meal: { status: "error" },
        });
        return mealId;
      }

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

        if (!mealId) throw new Error("Meal ID not found");

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

      return mealId;
    } catch (error) {
      logError("analyzeMealPhoto error", error);
      try {
        if (mealId) {
          await ctx.runMutation(api.meals.updateMeal.default, {
            id: mealId,
            meal: { status: "error" },
          });
        }
      } catch (updateError) {
        logError("Failed to mark meal as error", updateError);
      }
      throw error;
    }
  },
});

export default analyzeMealPhoto;
