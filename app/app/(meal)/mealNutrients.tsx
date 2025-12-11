import Nutrients from "@/components/nutrients/Nutrients";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useLocalSearchParams } from "expo-router";

export default function MealNutrientsScreen() {
  const { mealId } = useLocalSearchParams<{
    mealId: Id<"meals">;
  }>();
  const meal = useQuery(api.meals.getMeal.default, { mealId }) ?? undefined;

  return <Nutrients nutrients={meal?.meal.totalNutrients} />;
}
