import { v } from "convex/values";
import { action } from "../_generated/server";
import { api } from "../_generated/api";

const analyzeMealPicture = action({
  args: {
    mealId: v.id("meals"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, { mealId, storageId }) => {
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

    // const uploadUrl = await ctx.runMutation(
    //   api.storage.generateUploadUrl.default
    // );
    // const response = await fetch(pictureUri);
    // const blob = await response.blob();
    // const result = await fetch(uploadUrl, {
    //   method: "POST",
    //   headers: { "Content-Type": blob.type },
    //   body: blob,
    // });
    // const { storageId } = await result.json();
  },
});

export default analyzeMealPicture;
