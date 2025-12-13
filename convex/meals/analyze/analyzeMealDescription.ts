import { v } from "convex/values";
import { action } from "../../_generated/server";
import { api } from "../../_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "../../_generated/dataModel";
import logError from "@/lib/utils/logError";
import { rateLimiter } from "../../rateLimit";
import { processDetectedItems } from "./processDetectedItems";
import detectMealItemsFromText from "./detectMealItemsFromText";

const analyzeMealDescription = action({
  args: { description: v.string() },
  handler: async (ctx, { description }): Promise<Id<"meals">> => {
    let mealId: Id<"meals"> | undefined = undefined;
    try {
      const userId = await getAuthUserId(ctx);
      if (userId === null) throw new Error("Unauthorized");

      await rateLimiter.limit(ctx, "analyzeMealDescription", {
        key: userId,
        throws: true,
      });

      mealId = await ctx.runMutation(api.meals.createMeal.default, {
        status: "processing",
      });

      const { mealName, items: detectedItems } = await detectMealItemsFromText({
        description,
      });

      if (detectedItems.length === 0) {
        await ctx.runMutation(api.meals.updateMeal.default, {
          id: mealId,
          meal: { status: "error" },
        });
        return mealId;
      }

      await processDetectedItems(
        ctx,
        mealId,
        detectedItems,
        undefined,
        mealName,
        description
      );

      return mealId;
    } catch (error) {
      logError("analyzeMealDescription error", error);
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

export default analyzeMealDescription;
