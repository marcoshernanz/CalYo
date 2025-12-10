import MealItem from "@/components/meal/MealItem";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useLocalSearchParams } from "expo-router";

export default function MealItemScreen() {
  const { mealItemId } = useLocalSearchParams<{
    mealItemId: Id<"mealItems">;
  }>();
  const mealItem = useQuery(
    api.mealItems.getMealItem.default,
    mealItemId ? { mealItemId } : "skip"
  );

  const isLoading = mealItem === undefined;

  return (
    <MealItem
      name={mealItem?.food.name.es ?? mealItem?.food.name.en}
      mealItem={mealItem ?? undefined}
      loading={isLoading}
    />
  );
}
