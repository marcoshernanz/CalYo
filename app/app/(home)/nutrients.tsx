import Nutrients from "@/components/nutrients/Nutrients";
import { api } from "@/convex/_generated/api";
import { calculateDayTotals } from "@/lib/nutrition/calculateDayTotals";
import { useQuery } from "convex/react";
import { useLocalSearchParams } from "expo-router";

export default function NutrientsScreen() {
  const { dayIndex } = useLocalSearchParams<{ dayIndex: string }>();

  const rawWeekMeals = useQuery(api.meals.getWeekMeals.default, {
    timezoneOffsetMinutes: new Date().getTimezoneOffset(),
  });

  const index = dayIndex ? parseInt(dayIndex, 10) : 0;
  const dayMeals = rawWeekMeals?.at(index) ?? [];

  const { nutrients } = calculateDayTotals(dayMeals);

  return <Nutrients nutrients={nutrients} />;
}
