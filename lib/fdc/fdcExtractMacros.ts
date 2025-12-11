import { FoodItem } from "@/scripts/importFdcData";

const nutrientTargets = {
  protein: [1003],
  fat: [1004, 1085],
  carbs: [1005, 1050],
  sugar: [1063],
  starch: [1009],
  fiber: [1079],
};

function getAmount(
  nutrients: FoodItem["foodNutrients"],
  target: number[]
): number | undefined {
  for (const nutrient of nutrients) {
    const amount = nutrient.amount ?? undefined;
    if (amount === undefined) continue;

    const id = nutrient.nutrient.id;
    if (id && target.includes(id) && amount >= 0) {
      return amount;
    }
  }

  return undefined;
}

function computeCarbs(nutrients: FoodItem["foodNutrients"]): number {
  const carbs = getAmount(nutrients, nutrientTargets.carbs);
  if (carbs !== undefined) return carbs;

  const sugar = getAmount(nutrients, nutrientTargets.sugar) ?? 0;
  const starch = getAmount(nutrients, nutrientTargets.starch) ?? 0;
  const fiber = getAmount(nutrients, nutrientTargets.fiber) ?? 0;
  const total = sugar + starch + fiber;
  return Math.max(0, total);
}

export default function fdcExtractMacros(item: FoodItem) {
  const protein = getAmount(item.foodNutrients, nutrientTargets.protein) ?? 0;
  const fat = getAmount(item.foodNutrients, nutrientTargets.fat) ?? 0;
  const carbs = computeCarbs(item.foodNutrients);

  return { protein, fat, carbs };
}
