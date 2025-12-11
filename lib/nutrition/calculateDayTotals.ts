import { addNutrients, getEmptyNutrients } from "@/config/nutrientsConfig";
import { Doc } from "@/convex/_generated/dataModel";

export function calculateDayTotals(meals: Doc<"meals">[]) {
  return meals.reduce(
    (acc, meal) => ({
      macros: {
        calories: acc.macros.calories + (meal.totalMacros?.calories ?? 0),
        protein: acc.macros.protein + (meal.totalMacros?.protein ?? 0),
        carbs: acc.macros.carbs + (meal.totalMacros?.carbs ?? 0),
        fat: acc.macros.fat + (meal.totalMacros?.fat ?? 0),
      },
      micros: {
        score: acc.micros.score + (meal.totalMicros?.score ?? 0),
        fiber: acc.micros.fiber + (meal.totalMicros?.fiber ?? 0),
        sugar: acc.micros.sugar + (meal.totalMicros?.sugar ?? 0),
        sodium: acc.micros.sodium + (meal.totalMicros?.sodium ?? 0),
      },
      nutrients: meal.totalNutrients
        ? addNutrients(acc.nutrients, meal.totalNutrients)
        : acc.nutrients,
    }),
    {
      macros: { calories: 0, protein: 0, carbs: 0, fat: 0 },
      micros: { score: 0, fiber: 0, sugar: 0, sodium: 0 },
      nutrients: getEmptyNutrients(),
    }
  );
}
