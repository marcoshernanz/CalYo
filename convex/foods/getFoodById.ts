import { query } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

const getFoodByIdentity = query({
  args: {
    identity: v.union(
      v.object({
        source: v.literal("fdc"),
        id: v.number(),
      })
    ),
  },
  handler: async (ctx, { identity }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Unauthorized");

    const food = await ctx.db
      .query("foods")
      .withIndex("byIdentitySourceId", (q) =>
        q.eq("identity.source", identity.source).eq("identity.id", identity.id)
      )
      .first();

    return food;
  },
});

export default getFoodByIdentity;
