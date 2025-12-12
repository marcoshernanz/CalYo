import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "../_generated/server";
import logError from "@/lib/utils/logError";

const getProfile = query({
  handler: async (ctx) => {
    try {
      const userId = await getAuthUserId(ctx);
      if (userId === null) return null;

      const profile = await ctx.db
        .query("profiles")
        .filter((q) => q.eq(q.field("userId"), userId))
        .first();

      if (!profile) {
        return null;
      }

      return profile;
    } catch (error) {
      logError("getProfile error", error);
      throw error;
    }
  },
});

export default getProfile;
