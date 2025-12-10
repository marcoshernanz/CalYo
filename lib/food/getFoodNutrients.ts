import { Doc } from "@/convex/_generated/dataModel";

export default function getFoodNutrients(
  food: Doc<"foods">
): Doc<"mealItems">["nutrientsPer100g"] {
  // TODO
  return {};
}
