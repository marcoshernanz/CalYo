import { mutation } from "../_generated/server";

const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export default generateUploadUrl;
