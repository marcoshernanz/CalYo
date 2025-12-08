import { v } from "convex/values";
import { mutation } from "../_generated/server";

export default mutation({
  args: { mealId: v.id("meals") },
  handler: async (ctx, { mealId }) => {
    const items = await ctx.db
      .query("mealItems")
      .withIndex("byMealId", (q) => q.eq("mealId", mealId))
      .collect();

    for (const item of items) {
      await ctx.db.delete(item._id);
    }
  },
});
