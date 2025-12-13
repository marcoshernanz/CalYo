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
      const userId = await getAuthUserId(ctx);
      if (userId === null) throw new Error("Unauthorized");

      await rateLimiter.limit(ctx, "analyzeMealPhoto", {
        key: userId,
        throws: true,
      });

      const imageUrl = await ctx.storage.getUrl(storageId);
      if (!imageUrl) throw new Error("Image not found");

      mealId = await ctx.runMutation(api.meals.createMeal.default, {
        status: "processing",
        photoStorageId: storageId,
      });

      const { mealName, items: detectedItems } = await detectMealItems({
        imageUrl,
      });
      if (detectedItems.length === 0) {
        await ctx.runMutation(api.meals.updateMeal.default, {
          id: mealId,
          meal: { status: "error" },
        });
        return mealId;
      }

      await processDetectedItems({
        ctx,
        mealId,
        detectedItems,
        imageUrl,
        mealName,
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
