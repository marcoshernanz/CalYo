import { v } from "convex/values";
import { action } from "../_generated/server";
import { api } from "../_generated/api";

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

      await new Promise((r) => setTimeout(r, 3000));

      await ctx.runMutation(api.meals.updateMeal.default, {
        id: mealId,
        meal: {
          status: "done",
          totals: {
            calories: 400 + 400 + 900,
            protein: 100,
            fat: 100,
            carbs: 100,
          },
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
