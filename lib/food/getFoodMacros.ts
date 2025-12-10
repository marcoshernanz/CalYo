import { Doc } from "@/convex/_generated/dataModel";
import macrosToKcal from "../utils/macrosToKcal";

export default function getFoodMacros(
  food: Doc<"foods">
): Doc<"mealItems">["macrosPer100g"] {
  return {
    calories: macrosToKcal(food.macroNutrients),
    protein: food.macroNutrients.protein,
    fat: food.macroNutrients.fat,
    carbs: food.macroNutrients.carbs,
  };
}
