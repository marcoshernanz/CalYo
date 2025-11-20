import { v } from "convex/values";
import { action, internalMutation } from "../_generated/server";
import { foodsFields } from "../tables/foods";
import { internal } from "../_generated/api";

export const upsertFoods = internalMutation({
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
        .withIndex("byExternalId", (q) => q.eq("externalId", doc.externalId))
        .unique();

      if (existing) {
        await ctx.db.patch(existing._id, doc);

        updated++;
      } else {
        await ctx.db.insert("foods", {
          ...doc,
          hasEmbedding: false,
        });
        inserted++;
      }
    }

    return { inserted, updated };
  },
});

export const ingestFdcFoods = action({
  args: {
    token: v.string(),
    docs: v.array(v.object(foodsFields)),
  },
  handler: async (
    ctx,
    { token, docs }
  ): Promise<{ inserted: number; updated: number }> => {
    if (token !== process.env.INGEST_TOKEN) {
      throw new Error("Unauthorized");
    }

    return await ctx.runMutation(internal.fdc.ingestFoods.upsertFoods, {
      docs,
    });
  },
});

export default ingestFdcFoods;
