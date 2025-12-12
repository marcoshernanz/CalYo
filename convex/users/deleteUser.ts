import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation } from "../_generated/server";

const deleteUser = mutation({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Unauthorized");
    }

    const profiles = await ctx.db
      .query("profiles")
      .withIndex("byUserId", (q) => q.eq("userId", userId))
      .collect();
    for (const profile of profiles) {
      await ctx.db.delete(profile._id);
    }

    const meals = await ctx.db
      .query("meals")
      .withIndex("byUserId", (q) => q.eq("userId", userId))
      .collect();

    for (const meal of meals) {
      const mealItems = await ctx.db
        .query("mealItems")
        .withIndex("byMealId", (q) => q.eq("mealId", meal._id))
        .collect();

      for (const item of mealItems) {
        await ctx.db.delete(item._id);
      }

      if (meal.photoStorageId) {
        await ctx.storage.delete(meal.photoStorageId);
      }

      await ctx.db.delete(meal._id);
    }

    const sessions = await ctx.db
      .query("authSessions")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();
    for (const session of sessions) {
      await ctx.db.delete(session._id);
    }

    const accounts = await ctx.db
      .query("authAccounts")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();
    for (const account of accounts) {
      await ctx.db.delete(account._id);
    }

    await ctx.db.delete(userId);
  },
});

export default deleteUser;
