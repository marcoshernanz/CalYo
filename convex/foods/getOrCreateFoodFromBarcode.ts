import { v } from "convex/values";
import { internalMutation } from "../_generated/server";
import { foodsFields } from "../tables/foods";
import { Doc } from "../_generated/dataModel";
import { WithoutSystemFields } from "convex/server";

export default internalMutation({
  args: {
    food: v.object(foodsFields),
  },
  handler: async (ctx, { food }): Promise<Doc<"foods">["_id"]> => {
    const identity = food.identity;
    // We only support barcode here for now, or generic if we want
    if (identity.source !== "barcode") {
      // Fallback or error?
      // For this specific mutation intended for barcode flow, we can enforce it or just handle generic.
      // But the query below depends on identity.
    }

    const existing = await ctx.db
      .query("foods")
      .withIndex("byIdentitySourceId", (q) =>
        q.eq("identity.source", identity.source).eq("identity.id", identity.id)
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, food);
      return existing._id;
    } else {
      const id = await ctx.db.insert(
        "foods",
        food as WithoutSystemFields<Doc<"foods">>
      );
      return id;
    }
  },
});
