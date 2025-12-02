import { v } from "convex/values";
import { action } from "../../_generated/server";
import { api } from "../../_generated/api";
import macrosToKcal from "../../../lib/utils/macrosToKcal";
import detectMealItems from "./detectMealItems";
import searchFdcCandidates from "./searchFdcCandidates";
import selectCandidates from "./selectCandidates";
import scaleNutrients from "../../../lib/utils/scaleNutrients";
import nameMeal from "./nameMeal";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "../../_generated/dataModel";
import logError from "@/lib/utils/logError";
import { analyzeMealConfig } from "./analyzeMealConfig";

const analyzeMealPhoto = action({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, { storageId }): Promise<Id<"meals">> => {
    let mealId: Id<"meals"> | undefined = undefined;
    try {
      const userId = await getAuthUserId(ctx);
      if (userId === null) throw new Error("Unauthorized");

      await ctx.runMutation(api.rateLimits.checkAndIncrement.default, {
        key: "analyzeMealPhoto",
        limit: analyzeMealConfig.limitPerDay,
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

      let totals = { calories: 0, protein: 0, fat: 0, carbs: 0 };

      for (const selectedItem of selectedItems) {
        const fdcFood = await ctx.runQuery(api.foods.getFoodById.default, {
          identity: { source: "fdc", id: selectedItem.fdcId },
        });
        if (!fdcFood) continue;

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

        totals = {
          calories: totals.calories + calories,
          protein: +(totals.protein + nutrients.protein).toFixed(1),
          fat: +(totals.fat + nutrients.fat).toFixed(1),
          carbs: +(totals.carbs + nutrients.carbs).toFixed(1),
        };
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
