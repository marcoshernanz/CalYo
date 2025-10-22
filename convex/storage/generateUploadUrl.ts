import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation } from "../_generated/server";

const generateUploadUrl = mutation({
  handler: async (ctx): Promise<string> => {
    try {
      const userId = await getAuthUserId(ctx);
      if (userId === null) throw new Error("Unauthorized");

      return await ctx.storage.generateUploadUrl();
    } catch (error) {
      console.error("generateUploadUrl error", error);
      throw error;
    }
  },
});

export default generateUploadUrl;
