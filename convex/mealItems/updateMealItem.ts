import { mutation } from "../_generated/server";
import { v } from "convex/values";

export default mutation({
  args: {
    mealItemId: v.id("mealItems"),
    grams: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.mealItemId, {
      grams: args.grams,
    });
  },
});
