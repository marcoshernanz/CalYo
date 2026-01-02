import { internalMutation } from "../_generated/server";
import { v } from "convex/values";
import logError from "@/lib/utils/logError";

export const updateProStatus = internalMutation({
  args: { isPro: v.boolean(), userId: v.string() },
  handler: async (ctx, { isPro, userId }) => {
    try {
      const profile = await ctx.db
        .query("profiles")
        .filter((q) => q.eq(q.field("userId"), userId))
        .first();

      if (!profile) {
        throw new Error("Profile not found");
      }

      if (profile.isPro !== isPro) {
        await ctx.db.patch(profile._id, { isPro });
      }
    } catch (error) {
      logError("updateProStatus error", error);
      throw error;
    }
  },
});

export default updateProStatus;
