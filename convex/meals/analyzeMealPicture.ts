import { v } from "convex/values";
import { action } from "../_generated/server";
import { api } from "../_generated/api";

const analyzeMealPicture = action({
  args: {
    pictureUri: v.string(),
  },
  handler: async (ctx, { pictureUri }) => {
    const uploadUrl = await ctx.runMutation(
      api.storage.generateUploadUrl.default
    );

    const response = await fetch(pictureUri);
    const blob = await response.blob();

    const result = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": blob.type },
      body: blob,
    });
    const { storageId } = await result.json();
  },
});

export default analyzeMealPicture;
