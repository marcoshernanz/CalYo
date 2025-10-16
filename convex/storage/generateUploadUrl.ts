import { mutation } from "../_generated/server";

const generateUploadUrl = mutation({
  handler: async (ctx): Promise<string> => {
    return await ctx.storage.generateUploadUrl();
  },
});

export default generateUploadUrl;
