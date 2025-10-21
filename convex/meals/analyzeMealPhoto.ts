import { v } from "convex/values";
import { action } from "../_generated/server";
import { api } from "../_generated/api";
import { EmbeddingModel, LanguageModel } from "ai";
import { google } from "@ai-sdk/google";
import macrosToKcal from "../../lib/utils/macrosToKcal";
import detectMealItems from "./analyze/detectMealItems";
import searchFdcCandidates from "./analyze/searchFdcCandidates";
import selectCandidates from "./analyze/selectCandidates";
import scaleNutrients from "../../lib/utils/scaleNutrients";

type AnalyzeConfig = {
  maxDetectionItems: number;
  temperature: number;
  candidatesPerItem: number;
  imageProcessingModel: LanguageModel;
  embeddingsModel: EmbeddingModel;
  candidateSelectionModel: LanguageModel;
};

export const analyzeConfig: AnalyzeConfig = {
  maxDetectionItems: 10,
  temperature: 0.2,
  candidatesPerItem: 3,
  imageProcessingModel: google("gemini-2.5-flash"),
  embeddingsModel: google.textEmbeddingModel("gemini-embedding-001"),
  candidateSelectionModel: google("models/gemini-1.5-flash"),
};

const analyzeMealPhoto = action({
  args: {
    mealId: v.id("meals"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, { mealId, storageId }): Promise<null> => {
    try {
      const meal = await ctx.runQuery(api.meals.getMeal.default, { mealId });
      if (!meal) throw new Error("Meal not found");

      const imageUrl = await ctx.storage.getUrl(storageId);
      if (!imageUrl) throw new Error("Image not found");

      await ctx.runMutation(api.meals.updateMeal.default, {
        id: mealId,
        meal: {
          status: "processing",
          photoStorageId: storageId,
        },
      });

      const detectedItems = await detectMealItems({ imageUrl });

      if (!detectedItems) {
        await ctx.runMutation(api.meals.updateMeal.default, {
          id: mealId,
          meal: { status: "error" },
        });
        return null;
      }

      const candidatesByItem = await searchFdcCandidates({
        ctx,
        detectedItems,
      });

      const selectedItems = await selectCandidates({
        detectedItems,
        candidatesByItem,
      });

      let totals = { calories: 0, protein: 0, fat: 0, carbs: 0 };

      for (const selectedItem of selectedItems) {
        const fdcFood = await ctx.runQuery(api.fdc.getFdcFood.default, {
          fdcId: selectedItem.fdcId,
        });
        if (!fdcFood) continue;

        const nutrients = scaleNutrients({
          nutrients: fdcFood.nutrients,
          grams: selectedItem.grams,
        });
        const calories = macrosToKcal(nutrients);

        await ctx.runMutation(api.meals.insertMealItem.default, {
          mealId,
          food: fdcFood._id,
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
          totals,
        },
      });

      return null;
    } catch (error) {
      console.error("analyzeMealPhoto error", error);
      try {
        await ctx.runMutation(api.meals.updateMeal.default, {
          id: mealId,
          meal: { status: "error" },
        });
      } catch (updateError) {
        console.error("Failed to mark meal as error", updateError);
      }
      throw error;
    }
  },
});

export default analyzeMealPhoto;
