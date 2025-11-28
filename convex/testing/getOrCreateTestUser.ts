import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { profilesConfig } from "../../config/profilesConfig";
import testingConfig from "../../config/testingConfig";

const getOrCreateTestUser = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    if (
      args.email !== testingConfig.testEmail ||
      args.password !== testingConfig.testPassword
    ) {
      throw new Error("Invalid credentials");
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (user) {
      return user._id;
    }

    const userId = await ctx.db.insert("users", {
      email: args.email,
    });

    await ctx.db.insert("profiles", {
      userId,
      ...profilesConfig.defaultValues,
    });

    return userId;
  },
});

export default getOrCreateTestUser;
