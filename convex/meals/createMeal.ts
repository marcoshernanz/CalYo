import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation } from "../_generated/server";
import { Id } from "../_generated/dataModel";
import logError from "@/lib/utils/logError";

const createMeal = mutation({
  handler: async (ctx): Promise<Id<"meals">> => {
    try {
      const userId = await getAuthUserId(ctx);
      if (userId === null) throw new Error("Unauthorized");

      const mealId = await ctx.db.insert("meals", {
        userId,
        status: "pending",
      });

      return mealId;
    } catch (error) {
      logError("createMeal error", error);
      throw error;
    }
  },
});

export default createMeal;
