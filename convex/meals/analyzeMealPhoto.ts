import { v } from "convex/values";
import { action, internalQuery } from "../_generated/server";
import { api, internal } from "../_generated/api";
import { embed, EmbeddingModel, generateObject, LanguageModel } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod/v4";
import l2Normalize from "../../lib/utils/l2Normalize";
import macrosToKcal from "../../lib/utils/macrosToKcal";
import detectMealItems from "./analyze/detectMealItems";
import searchFdcCandidates from "./analyze/searchFdcCandidates";
import selectCandidates from "./analyze/selectCandidates";

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

      // Persist mealItems and compute totals
      let totals = { calories: 0, protein: 0, fat: 0, carbs: 0 };

      // TODO
      for (const selectedItem of selectedItems) {
        // Resolve DB doc by fdcId
        const foodDoc = await ctx.db
          .query("fdcFoods")
          .withIndex("byFdcId", (q) => q.eq("fdcId", selectedItem.chosenFdcId))
          .unique();

        if (!foodDoc) continue;

        const nutrients = scaleNutrients(foodDoc.nutrients, selectedItem.grams);
        const calories = kcalFromMacros(nutrients);

        await ctx.db.insert("mealItems", {
          mealId,
          grams: selectedItem.grams,
          confidence: selectedItem.confidence ?? 0.6,
          food: foodDoc._id,
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
