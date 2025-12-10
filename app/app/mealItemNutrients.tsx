import Nutrients from "@/components/nutrients/Nutrients";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useLocalSearchParams } from "expo-router";

export default function MealItemNutrients() {
  const { mealItemId } = useLocalSearchParams<{
    mealItemId: Id<"mealItems">;
  }>();
  const mealItem =
    useQuery(api.mealItems.getMealItem.default, { mealItemId }) ?? undefined;

  return <Nutrients nutrients={mealItem?.nutrientsPer100g} />;
}
