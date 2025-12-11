import { v } from "convex/values";
import { internalMutation } from "../_generated/server";

export const updateFoodHealthScore = internalMutation({
  args: {
    id: v.id("foods"),
    healthScore: v.number(),
  },
  handler: async (ctx, { id, healthScore }) => {
    await ctx.db.patch(id, { healthScore });
  },
});

export default updateFoodHealthScore;
