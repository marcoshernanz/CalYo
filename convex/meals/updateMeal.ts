import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation } from "../_generated/server";
import { v } from "convex/values";

const updateMeal = mutation({
  args: {
    id: v.id("meals"),
    meal: v.object({
      userId: v.optional(v.id("users")),
      status: v.optional(
        v.union(
          v.literal("pending"),
          v.literal("processing"),
          v.literal("done"),
          v.literal("error")
        )
      ),
      name: v.optional(v.string()),
      photoStorageId: v.optional(v.id("_storage")),
      totals: v.optional(
        v.object({
          calories: v.number(),
          protein: v.number(),
          fat: v.number(),
          carbs: v.number(),
        })
      ),
    }),
  },
  handler: async (ctx, args): Promise<null> => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Unauthorized");

    const meal = await ctx.db.get(args.id);
    if (!meal) throw new Error("Not found");
    if (meal.userId !== userId) throw new Error("Forbidden");

    await ctx.db.patch(args.id, args.meal);

    return null;
  },
});

export default updateMeal;
