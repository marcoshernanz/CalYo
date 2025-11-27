import { partial } from "convex-helpers/validators";
import { mutation } from "../_generated/server";
import { profilesFields } from "../tables/profiles";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import logError from "@/lib/utils/logError";

const updateProfile = mutation({
  args: { profile: v.object(partial(profilesFields)) },
  handler: async (ctx, args) => {
    try {
      const userId = await getAuthUserId(ctx);
      if (userId === null) throw new Error("Unauthorized");

      const profile = await ctx.db
        .query("profiles")
        .filter((q) => q.eq(q.field("userId"), userId))
        .first();
      if (!profile) throw new Error("Profile not found");

      await ctx.db.patch(profile._id, args.profile);
      return null;
    } catch (error) {
      logError("updateProfile error", error);
      throw error;
    }
  },
});

export default updateProfile;
