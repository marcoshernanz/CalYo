import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation } from "../_generated/server";
import { v } from "convex/values";

const deleteMeal = mutation({
  args: {
    id: v.id("meals"),
  },
  handler: async (ctx, { id }): Promise<null> => {
    try {
      const userId = await getAuthUserId(ctx);
      if (userId === null) throw new Error("Unauthorized");

      const meal = await ctx.db.get(id);
      if (!meal) throw new Error("Not found");
      if (meal.userId !== userId) throw new Error("Forbidden");

      await ctx.db.delete(id);

      return null;
    } catch (error) {
      console.error("deleteMeal error", error);
      throw error;
    }
  },
});

export default deleteMeal;
