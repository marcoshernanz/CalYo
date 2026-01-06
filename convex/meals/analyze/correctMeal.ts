import { v } from "convex/values";
import { action } from "../../_generated/server";
import { api } from "../../_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";
import correctMealItems from "./correctMealItems";
import { processDetectedItems } from "./processDetectedItems";
import { rateLimiter } from "../../rateLimit";
import { analyzeMealConfig } from "./analyzeMealConfig";

export const correctMeal = action({
  args: {
    mealId: v.id("meals"),
    correction: v.string(),
  },
  handler: async (ctx, { mealId, correction }) => {
    if (correction.length > analyzeMealConfig.maxUserInputLength) {
      throw new Error("Correction too long");
    }
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const profile = await ctx.runQuery(api.profiles.getProfile.default);
    if (!profile?.isPro) throw new Error("Pro subscription required");

    await rateLimiter.limit(ctx, "aiFeatures", { key: userId, throws: true });

    const result = await ctx.runQuery(api.meals.getMeal.default, { mealId });
    if (!result) throw new Error("Meal not found");
    const { meal, mealItems } = result;

    if (!meal.photoStorageId) throw new Error("Meal has no photo");

    await ctx.runMutation(api.meals.updateMeal.default, {
      id: mealId,
      meal: { status: "processing" },
    });

    const imageUrl = await ctx.storage.getUrl(meal.photoStorageId);
    if (!imageUrl) throw new Error("Image not found");

    const previousItems = mealItems.map((item) => ({
      name: item.food.name.en,
      grams: item.grams,
    }));

    const { mealName, items: newDetectedItems } = await correctMealItems({
      imageUrl,
      previousItems,
      correction,
    });

    await processDetectedItems({
      ctx,
      mealId,
      detectedItems: newDetectedItems,
      imageUrl,
      mealName,
    });
  },
});
