import { mutation } from "../_generated/server";

const generateUploadUrl = mutation({
  handler: async (ctx): Promise<string> => {
    try {
      return await ctx.storage.generateUploadUrl();
    } catch (error) {
      console.error("generateUploadUrl error", error);
      throw error;
    }
  },
});

export default generateUploadUrl;
