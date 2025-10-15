import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { fdcFoodsFields } from "../tables/fdcFoods";

// TODO: Make it safe

const upsertFdcFoods = mutation({
  args: {
    docs: v.array(v.object(fdcFoodsFields)),
  },
  handler: async (ctx, { docs }) => {
    let inserted = 0;
    let updated = 0;

    for (const doc of docs) {
      const existing = await ctx.db
        .query("fdcFoods")
        .withIndex("byFdcId", (q) => q.eq("fdcId", doc.fdcId))
        .unique();

      if (existing) {
        await ctx.db.patch(existing._id, doc);
        updated++;
      } else {
        await ctx.db.insert("fdcFoods", doc);
        inserted++;
      }
    }

    return { inserted, updated };
  },
});

export default upsertFdcFoods;
