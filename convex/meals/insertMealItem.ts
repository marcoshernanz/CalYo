import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { mealItemsFields } from "../tables/mealItems";

const insertMealItem = mutation({
  args: v.object(mealItemsFields),
  handler: async (ctx, args) => {
    ctx.db.insert("mealItems", args);
  },
});

export default insertMealItem;
