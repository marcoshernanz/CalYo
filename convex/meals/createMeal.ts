import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation } from "../_generated/server";
import { Id } from "../_generated/dataModel";

const createMeal = mutation({
  handler: async (ctx): Promise<Id<"meals">> => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Unauthorized");

    const mealId = await ctx.db.insert("meals", {
      userId,
      status: "pending",
    });

    return mealId;
  },
});

export default createMeal;
