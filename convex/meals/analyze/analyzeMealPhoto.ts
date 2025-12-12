import { v } from "convex/values";
import { action } from "../../_generated/server";
import { api } from "../../_generated/api";
import detectMealItems from "./detectMealItems";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "../../_generated/dataModel";
import logError from "@/lib/utils/logError";
import { rateLimiter } from "../../rateLimit";
import { processDetectedItems } from "./processDetectedItems";

const analyzeMealPhoto = action({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, { storageId }): Promise<Id<"meals">> => {
    let mealId: Id<"meals"> | undefined = undefined;
    try {
      console.time("analyzeMealPhoto");
      const userId = await getAuthUserId(ctx);
      if (userId === null) throw new Error("Unauthorized");
      console.timeLog("analyzeMealPhoto", "User authenticated");

      await rateLimiter.limit(ctx, "analyzeMealPhoto", {
        key: userId,
        throws: true,
      });
      console.timeLog("analyzeMealPhoto", "Rate limit passed");

      const imageUrl = await ctx.storage.getUrl(storageId);
      if (!imageUrl) throw new Error("Image not found");
      console.timeLog("analyzeMealPhoto", "Image URL retrieved");

      mealId = await ctx.runMutation(api.meals.createMeal.default, {
        status: "processing",
        photoStorageId: storageId,
      });
      console.timeLog("analyzeMealPhoto", "Meal record created", mealId);

      const { mealName, items: detectedItems } = await detectMealItems({
        imageUrl,
      });
      if (detectedItems.length === 0) {
        console.log("No meal items detected");
        await ctx.runMutation(api.meals.updateMeal.default, {
          id: mealId,
          meal: { status: "error" },
        });
        return mealId;
      }
      console.timeLog("analyzeMealPhoto", "Meal items detected");

      await processDetectedItems(
        ctx,
        mealId,
        detectedItems,
        imageUrl,
        mealName
      );

      console.timeLog("analyzeMealPhoto", "Detected items processed");

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
