import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { mealsFields } from "../tables/meals";
import { partial } from "convex-helpers/validators";

const updateMeal = mutation({
  args: {
    id: v.id("meals"),
    meal: v.object(partial(mealsFields)),
  },
  handler: async (ctx, args): Promise<null> => {
    try {
      const userId = await getAuthUserId(ctx);
      if (userId === null) throw new Error("Unauthorized");

      const meal = await ctx.db.get(args.id);
      if (!meal) throw new Error("Not found");
      if (meal.userId !== userId) throw new Error("Forbidden");

      await ctx.db.patch(args.id, args.meal);

      return null;
    } catch (error) {
      console.error("updateMeal error", error);
      throw error;
    }
  },
});

export default updateMeal;
