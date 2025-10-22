import { v } from "convex/values";
import { query } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

const getFdcFood = query({
  args: { fdcId: v.number() },
  handler: async (ctx, { fdcId }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Unauthorized");

    const foodItem = await ctx.db
      .query("fdcFoods")
      .withIndex("byFdcId", (q) => q.eq("fdcId", fdcId))
      .first();

    return foodItem;
  },
});

export default getFdcFood;
