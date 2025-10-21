import { v } from "convex/values";
import { query } from "../_generated/server";

const getFdcFood = query({
  args: { fdcId: v.number() },
  handler: async (ctx, { fdcId }) => {
    const foodItem = await ctx.db
      .query("fdcFoods")
      .withIndex("byFdcId", (q) => q.eq("fdcId", fdcId))
      .first();

    return foodItem;
  },
});

export default getFdcFood;
