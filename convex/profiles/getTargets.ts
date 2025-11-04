import { query } from "../_generated/server";
import { api } from "../_generated/api";
import { Doc } from "../_generated/dataModel";

const getTargets = query({
  handler: async (ctx): Promise<Doc<"profiles">["targets"] | null> => {
    try {
      const profile = await ctx.runQuery(api.profiles.getProfile.default);
      if (!profile) return null;

      return profile.targets;
    } catch (error) {
      console.error("getTargets error", error);
      throw error;
    }
  },
});

export default getTargets;
