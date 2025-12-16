import { v } from "convex/values";
import { action } from "../../_generated/server";
import { api, internal } from "../../_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "../../_generated/dataModel";
import logError from "@/lib/utils/logError";
import { fetchProduct } from "../../scan/fetchProduct";
import offExtractMacros from "@/lib/off/offExtractMacros";
import offExtractNutrients from "@/lib/off/offExtractNutrients";

const analyzeMealBarcode = action({
  args: { barcode: v.string(), locale: v.string() },
  handler: async (ctx, { barcode, locale }): Promise<Id<"meals">> => {
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
        const product = await fetchProduct(barcode, locale);

        if (!product) {
          await ctx.runMutation(api.meals.updateMeal.default, {
            id: mealId,
            meal: { status: "error" },
          });
          return mealId;
        }

        name = product.name;
        const nutriments = product.nutriments;
        const macroNutrients = offExtractMacros(nutriments);
        const nutrients = offExtractNutrients(nutriments);

        foodId = await ctx.runMutation(internal.foods.createFood.default, {
          food: {
            identity: { source: "off", id: barcode },
            name: { en: product.name, es: product.name },
            macroNutrients,
            nutrients,
            hasEmbedding: false,
          },
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
