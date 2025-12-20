import { v } from "convex/values";
import { action } from "../../_generated/server";
import { api, internal } from "../../_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Doc, Id } from "../../_generated/dataModel";
import logError from "@/lib/utils/logError";
import offExtractMacros from "@/lib/off/offExtractMacros";
import offExtractNutrients from "@/lib/off/offExtractNutrients";
import calculateHealthScore from "./calculateHealthScore";
import getFoodMacros from "@/lib/food/getFoodMacros";
import getFoodNutrients from "@/lib/food/getFoodNutrients";

const analyzeMealBarcode = action({
  args: {
    barcode: v.string(),
    product: v.optional(
      v.object({
        name: v.string(),
        nutriments: v.record(v.string(), v.any()),
      })
    ),
  },
  handler: async (ctx, { barcode, product }): Promise<Id<"meals">> => {
    let mealId: Id<"meals"> | undefined = undefined;
    try {
      const userId = await getAuthUserId(ctx);
      if (userId === null) throw new Error("Unauthorized");

      mealId = await ctx.runMutation(api.meals.createMeal.default, {
        status: "processing",
      });

      const existingFood = await ctx.runQuery(
        api.foods.getFoodByIdentity.default,
        {
          identity: { source: "off", id: barcode },
        }
      );
      let foodId = existingFood?._id;
      let name = existingFood?.name.es ?? existingFood?.name.en;
      if (!foodId) {
        if (!product) {
          await ctx.runMutation(api.meals.updateMeal.default, {
            id: mealId,
            meal: { status: "error" },
          });
          return mealId;
        }

        name = product.name;
        const nutriments = product.nutriments as Record<string, unknown>;
        const macroNutrients = offExtractMacros(nutriments);
        const nutrients = offExtractNutrients(nutriments);

        const food = { macroNutrients, nutrients } as Doc<"foods">;
        const macros = getFoodMacros(food);
        const structuredNutrients = getFoodNutrients(food);

        const healthScore = await calculateHealthScore({
          name: product.name,
          macros,
          nutrients: structuredNutrients,
        });

        foodId = await ctx.runMutation(internal.foods.createFood.default, {
          food: {
            identity: { source: "off", id: barcode },
            name: { en: product.name, es: product.name },
            macroNutrients,
            nutrients,
            hasEmbedding: false,
            healthScore,
          },
        });
      } else if (existingFood && existingFood.healthScore === undefined) {
        const macros = getFoodMacros(existingFood);
        const structuredNutrients = getFoodNutrients(existingFood);

        const healthScore = await calculateHealthScore({
          name: existingFood.name.en,
          macros,
          nutrients: structuredNutrients,
        });
        await ctx.runMutation(internal.foods.updateFoodHealthScore.default, {
          id: existingFood._id,
          healthScore,
        });
      }
      await ctx.runMutation(api.meals.replaceMealItems.default, {
        mealId,
        foods: [{ foodId, grams: 100 }],
      });

      await ctx.runMutation(api.meals.updateMeal.default, {
        id: mealId,
        meal: { status: "done", name },
      });

      return mealId;
    } catch (error) {
      logError("analyzeMealBarcode error", error);
      try {
        if (mealId) {
          await ctx.runMutation(api.meals.updateMeal.default, {
            id: mealId,
            meal: { status: "error" },
          });
        }
      } catch (updateError) {
        logError("Failed to mark meal as error", updateError);
      }
      throw error;
    }
  },
});

export default analyzeMealBarcode;
