import { Doc } from "@/convex/_generated/dataModel";
import macrosToKcal from "../utils/macrosToKcal";
import { MacrosType } from "@/convex/tables/mealItems";

export default function getFoodMacros(food: Doc<"foods">): MacrosType {
  return {
    calories: macrosToKcal(food.macroNutrients),
    protein: food.macroNutrients.protein,
    fat: food.macroNutrients.fat,
    carbs: food.macroNutrients.carbs,
  };
}
