import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { profilesFields } from "../tables/profiles";
import { partial } from "convex-helpers/validators";

const updateProfile = mutation({
  args: {
    id: v.id("profiles"),
    profile: v.object(partial(profilesFields)),
  },
  handler: async (ctx, args): Promise<null> => {
    try {
      const userId = await getAuthUserId(ctx);
      if (userId === null) throw new Error("Unauthorized");

      const profile = await ctx.db.get(args.id);
      if (!profile) throw new Error("Not found");
      if (profile.userId !== userId) throw new Error("Forbidden");

      await ctx.db.patch(args.id, args.profile);

      return null;
    } catch (error) {
      console.error("updateProfile error", error);
      throw error;
    }
  },
});

export default updateProfile;
