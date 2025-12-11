import { Doc } from "@/convex/_generated/dataModel";
import { MicrosType } from "@/convex/tables/mealItems";

export default function getFoodMicros(food: Doc<"foods">): MicrosType {
  return {
    score: food.healthScore ?? 50,
    fiber: food.nutrients.fiberTotalDietary ?? 0,
    sugar: food.nutrients.sugarsTotal ?? food.nutrients.totalSugars ?? 0,
    sodium: food.nutrients.sodiumNa ?? 0,
  };
}
