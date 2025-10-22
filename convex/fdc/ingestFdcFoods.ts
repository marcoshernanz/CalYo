import { v } from "convex/values";
import { action, internalMutation } from "../_generated/server";
import { fdcFoodsFields } from "../tables/fdcFoods";
import { internal } from "../_generated/api";

// TODO: Make it safe
// TODO: Patch to avoid overwriting embeddings

export const upsertFdcFoods = internalMutation({
  args: {
    docs: v.array(v.object(fdcFoodsFields)),
  },
  handler: async (
    ctx,
    { docs }
  ): Promise<{ inserted: number; updated: number }> => {
    let inserted = 0;
    let updated = 0;

    for (const doc of docs) {
      const existing = await ctx.db
        .query("fdcFoods")
        .withIndex("byFdcId", (q) => q.eq("fdcId", doc.fdcId))
        .unique();

      if (existing) {
        await ctx.db.patch(existing._id, {
          dataType: doc.dataType,
          description: doc.description,
          category: doc.category,
          nutrients: doc.nutrients,
        });

        updated++;
      } else {
        await ctx.db.insert("fdcFoods", {
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
    docs: v.array(v.object(fdcFoodsFields)),
  },
  handler: async (
    ctx,
    { token, docs }
  ): Promise<{ inserted: number; updated: number }> => {
    if (token !== process.env.INGEST_TOKEN) {
      throw new Error("Unauthorized");
    }

    return await ctx.runMutation(internal.fdc.ingestFdcFoods.upsertFdcFoods, {
      docs,
    });
  },
});

export default ingestFdcFoods;
