import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { fdcFoodsFields } from "../tables/fdcFoods";

const insertFdcFoods = mutation({
  args: {
    docs: v.array(v.object(fdcFoodsFields)),
  },
  handler: async (ctx, { docs }) => {
    for (const d of docs) {
      await ctx.db.insert("fdcFoods", d);
    }
    return { inserted: docs.length };
  },
});

export default insertFdcFoods;
