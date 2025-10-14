import { z } from "zod";
import { Doc } from "../_generated/dataModel";
import { api } from "../_generated/api";
import { FdcFoodSchema } from "../../zod/schemas/FdcFoodSchema";
import { action } from "../_generated/server";
import tryCatch from "../../lib/utils/tryCatch";

const ingestFdcFoods = action({
  handler: async (ctx) => {
    const apiKey = process.env.FDC_API_KEY;
    if (!apiKey) throw new Error("Missing FDC_API_KEY");

    const url = new URL("https://api.nal.usda.gov/fdc/v1/foods/list");
    url.searchParams.set("api_key", apiKey);

    let pageNumber = 0;
    let data: any[] = [];

    while (true) {
      const { data: response, error } = await tryCatch(
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            dataType: ["Foundation"],
            pageNumber,
          }),
        })
      );
      if (error) {
        console.error("Error fetching FDC data:", error);
        return;
      }

      const json = await response.json();
      if (!json || !Array.isArray(json) || json.length === 0) break;

      data.push(...json);

      pageNumber++;
    }

    const parsed = await z.array(FdcFoodSchema).safeParseAsync(data);
    if (!parsed.success) {
      console.error("Error parsing FDC data:", parsed.error);
      return;
    }

    type FoodNutrient = (typeof parsed.data)[number]["foodNutrients"][number];

    const inGrams = (nutrient: FoodNutrient): number | null => {
      const amount = nutrient.amount ?? null;
      if (amount === null) return null;

      if (nutrient.unitName === "G") {
        return amount;
      } else if (nutrient.unitName === "MG") {
        return amount / 1000;
      } else if (nutrient.unitName === "UG") {
        return amount / 1_000_000;
      }
      return amount;
    };

    const resolveNutrient = (
      nutrients: FoodNutrient[],
      codes: string[]
    ): number | null => {
      for (const code of codes) {
        const nutrient = nutrients.find((item) => item.number === code);
        if (nutrient) {
          const amount = inGrams(nutrient);
          if (amount !== null) return amount;
        }
      }
      return null;
    };

    const resolveCarbs = (nutrients: FoodNutrient[]) => {
      const byDifference = resolveNutrient(nutrients, ["205", "205.2"]);
      if (byDifference !== null) return byDifference;

      const sugar = resolveNutrient(nutrients, ["269", "269.3"]) ?? 0;
      const starch = resolveNutrient(nutrients, ["209"]) ?? 0;
      const fiber = resolveNutrient(nutrients, ["291", "293"]) ?? 0;

      const total = sugar + starch + fiber;
      return total > 0 ? total : null;
    };

    const formattedData: Omit<Doc<"fdcFoods">, "_id" | "_creationTime">[] =
      parsed.data.map((item) => {
        const protein = resolveNutrient(item.foodNutrients, ["203"]) ?? 0;
        const fat = resolveNutrient(item.foodNutrients, ["204", "298"]) ?? 0;
        const carbs = resolveCarbs(item.foodNutrients) ?? 0;

        return {
          fdcId: item.fdcId,
          dataType: item.dataType,
          description: {
            en: item.description,
          },
          nutrients: {
            protein,
            fat,
            carbs,
          },
        };
      });

    await ctx.runMutation(api.fdc.insertFdcFoods.default, {
      docs: formattedData,
    });
  },
});

export default ingestFdcFoods;
