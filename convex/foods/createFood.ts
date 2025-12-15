import { v } from "convex/values";
import { internalMutation } from "../_generated/server";
import { foodsFields } from "../tables/foods";

const createFood = internalMutation({
  args: { food: v.object(foodsFields) },
  handler: async (ctx, { food }) => {
    const foodId = await ctx.db.insert("foods", food);
    return foodId;
  },
});

export default createFood;
