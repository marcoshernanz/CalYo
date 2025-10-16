import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation } from "../_generated/server";

const createMeal = mutation({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return; // TODO: Correct handling or throw error?

    const mealId = await ctx.db.insert("meals", {
      userId,
      status: "pending",
    });
    return mealId;
  },
});

export default createMeal;
