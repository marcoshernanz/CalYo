import { MacrosType } from "@/convex/tables/mealItems";

type Params = {
  grams: number;
  macrosPer100g: MacrosType;
};

export default function scaleMacrosPer100g({
  macrosPer100g,
  grams,
}: Params): MacrosType {
  const factor = grams / 100;
  return {
    calories: macrosPer100g.calories * factor,
    protein: macrosPer100g.protein * factor,
    fat: macrosPer100g.fat * factor,
    carbs: macrosPer100g.carbs * factor,
  };
}
