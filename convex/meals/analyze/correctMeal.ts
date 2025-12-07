import { v } from "convex/values";
import { action } from "../../_generated/server";
import { api } from "../../_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";
import correctMealItems from "./correctMealItems";
import { processDetectedItems } from "./processDetectedItems";

export const correctMeal = action({
  args: {
    mealId: v.id("meals"),
    correction: v.string(),
  },
  handler: async (ctx, { mealId, correction }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

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

    const newDetectedItems = await correctMealItems({
      imageUrl,
      previousItems,
      correction,
    });

    await processDetectedItems(ctx, mealId, newDetectedItems, imageUrl);
  },
});
