import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "../_generated/server";
import { v } from "convex/values";
import { Doc } from "../_generated/dataModel";

const getMeal = query({
  args: { mealId: v.id("meals") },
  handler: async (
    ctx,
    { mealId }
  ): Promise<{ meal: Doc<"meals">; mealItems: Doc<"mealItems">[] }> => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Unauthorized");

    const meal = await ctx.db.get(mealId);
    if (!meal) throw new Error("Not found");
    if (meal.userId !== userId) throw new Error("Forbidden");

    const mealItems = await ctx.db
      .query("mealItems")
      .withIndex("byMealId", (q) => q.eq("mealId", mealId))
      .collect();

    return { meal, mealItems };
  },
});

export default getMeal;
