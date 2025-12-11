import Nutrients from "@/components/nutrients/Nutrients";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import scaleNutrientsPer100g from "@/lib/utils/nutrition/scaleNutrientsPer100g";
import { useQuery } from "convex/react";
import { useLocalSearchParams } from "expo-router";

export default function MealItemNutrientsScreen() {
  const { mealItemId } = useLocalSearchParams<{
    mealItemId: Id<"mealItems">;
  }>();
  const mealItem =
    useQuery(api.mealItems.getMealItem.default, { mealItemId }) ?? undefined;
  const nutrients = mealItem
    ? scaleNutrientsPer100g({
        grams: mealItem.grams,
        nutrientsPer100g: mealItem.nutrientsPer100g,
      })
    : undefined;

  return <Nutrients nutrients={nutrients} />;
}
