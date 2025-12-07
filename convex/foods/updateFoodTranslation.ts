import { v } from "convex/values";
import { internalMutation } from "../_generated/server";

export const updateFoodTranslation = internalMutation({
  args: {
    id: v.id("foods"),
    nameEs: v.string(),
    categoryEs: v.optional(v.string()),
  },
  handler: async (ctx, { id, nameEs, categoryEs }) => {
    const food = await ctx.db.get(id);
    if (!food) return;

    await ctx.db.patch(id, {
      name: { ...food.name, es: nameEs },
      category: food.category
        ? { ...food.category, es: categoryEs ?? food.category.es }
        : undefined,
    });
  },
});

export default updateFoodTranslation;
