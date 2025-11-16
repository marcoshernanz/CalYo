import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation } from "../_generated/server";
import { profilesFields } from "../tables/profiles";
import { Doc } from "../_generated/dataModel";

const completeOnboarding = mutation({
  args: {
    data: profilesFields.data,
    targets: profilesFields.targets,
  },
  handler: async (ctx, args): Promise<null> => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Unauthorized");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("byUserId", (q) => q.eq("userId", userId))
      .first();
    if (!profile) throw new Error("Profile not found");

    const patch: Partial<Doc<"profiles">> = {
      hasCompletedOnboarding: true,
      ...args,
    };

    await ctx.db.patch(profile._id, patch);

    return null;
  },
});

export default completeOnboarding;
