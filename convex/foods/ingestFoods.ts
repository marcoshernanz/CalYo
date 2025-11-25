import { v } from "convex/values";
import { action } from "../_generated/server";
import { foodsFields } from "../tables/foods";
import { internal } from "../_generated/api";

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

    return await ctx.runMutation(internal.foods.upsertFoods.default, {
      docs,
    });
  },
});

export default ingestFdcFoods;
