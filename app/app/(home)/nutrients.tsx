import Nutrients from "@/components/nutrients/Nutrients";
import { NutrientsType } from "@/convex/tables/mealItems";
import { useLocalSearchParams } from "expo-router";

export default function NutrientsScreen() {
  const { nutrients } = useLocalSearchParams<{ nutrients: string }>();
  const parsedNutrients = nutrients
    ? (JSON.parse(nutrients) as NutrientsType)
    : undefined;

  return <Nutrients nutrients={parsedNutrients} />;
}
