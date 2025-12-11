import { v } from "convex/values";
import { internalMutation } from "../_generated/server";
import { foodsFields } from "../tables/foods";
import { partial } from "convex-helpers/validators";
import { Doc } from "../_generated/dataModel";
import { WithoutSystemFields } from "convex/server";

const upsertFoods = internalMutation({
  args: {
    docs: v.array(partial(v.object(foodsFields))),
  },
  handler: async (
    ctx,
    { docs }
  ): Promise<{ inserted: number; updated: number }> => {
    let inserted = 0;
    let updated = 0;

    for (const doc of docs) {
      if (!doc.identity) continue;

      const identity = doc.identity;

      const existing = await ctx.db
        .query("foods")
        .withIndex("byIdentitySourceId", (q) =>
          q
            .eq("identity.source", identity.source)
            .eq("identity.id", identity.id)
        )
        .unique();

      if (existing) {
        await ctx.db.patch(existing._id, doc);
        updated++;
      } else {
        // TODO: Validate doc
        await ctx.db.insert("foods", doc as WithoutSystemFields<Doc<"foods">>);
        inserted++;
      }
    }

    return { inserted, updated };
  },
});

export default upsertFoods;
