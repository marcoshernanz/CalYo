import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { profilesFields } from "../tables/profiles";
import { partial } from "convex-helpers/validators";
import { Doc } from "../_generated/dataModel";

const updateProfile = mutation({
  args: {
    id: v.id("profiles"),
    profile: v.object({
      ...partial(profilesFields),
      targets: v.optional(partial(profilesFields.targets)),
      data: v.optional(partial(profilesFields.data)),
    }),
  },
  handler: async (ctx, args): Promise<null> => {
    try {
      const userId = await getAuthUserId(ctx);
      if (userId === null) throw new Error("Unauthorized");

      const profile = await ctx.db.get(args.id);
      if (!profile) throw new Error("Not found");
      if (profile.userId !== userId) throw new Error("Forbidden");

      const { targets, data, ...profilePatch } = args.profile;
      const patch: Partial<Doc<"profiles">> = { ...profilePatch };
      if (targets) {
        patch.targets = {
          ...profile.targets,
          ...targets,
        };
      }
      if (data && profile.data) {
        patch.data = {
          ...profile.data,
          ...data,
        };
      }

      await ctx.db.patch(args.id, patch);

      return null;
    } catch (error) {
      console.error("updateProfile error", error);
      throw error;
    }
  },
});

export default updateProfile;
