import { v } from "convex/values";
import { internalMutation } from "../_generated/server";
import { foodsFields } from "../tables/foods";

const upsertFoods = internalMutation({
  args: {
    docs: v.array(v.object(foodsFields)),
  },
  handler: async (
    ctx,
    { docs }
  ): Promise<{ inserted: number; updated: number }> => {
    let inserted = 0;
    let updated = 0;

    for (const doc of docs) {
      const existing = await ctx.db
        .query("foods")
        .withIndex("byIdentitySourceId", (q) =>
          q
            .eq("identity.source", doc.identity.source)
            .eq("identity.id", doc.identity.id)
        )
        .unique();

      if (existing) {
        await ctx.db.patch(existing._id, doc);
        updated++;
      } else {
        await ctx.db.insert("foods", doc);
        inserted++;
      }
    }

    return { inserted, updated };
  },
});

export default upsertFoods;
