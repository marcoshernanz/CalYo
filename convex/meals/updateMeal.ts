import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { mealsFields } from "../tables/meals";
import { partial } from "convex-helpers/validators";
import logError from "@/lib/utils/logError";

const updateMeal = mutation({
  args: {
    id: v.id("meals"),
    meal: v.object(partial(mealsFields)),
  },
  handler: async (ctx, { id, meal }): Promise<null> => {
    try {
      const userId = await getAuthUserId(ctx);
      if (userId === null) throw new Error("Unauthorized");

      const existingMeal = await ctx.db.get(id);
      if (!existingMeal) throw new Error("Not found");
      if (existingMeal.userId !== userId) throw new Error("Forbidden");

      if (meal.totalMacros || meal.totalNutrients) {
        throw new Error(
          "Updating totalMacros or totalNutrients is not allowed"
        );
      }

      await ctx.db.patch(id, meal);
      return null;
    } catch (error) {
      logError("updateMeal error", error);
      throw error;
    }
  },
});

export default updateMeal;
