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
      photoStorageId: v.optional(v.string()), // TODO: photo, image or picture?
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
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return; // TODO: Correct handling or throw error?

    const meal = await ctx.db.get(args.id);
    if (!meal) return null; // TODO: Correct handling or throw error?
    if (meal.userId !== userId) return null; // TODO: Correct handling or throw error?

    await ctx.db.patch(args.id, args.meal);
  },
});

export default updateMeal;
