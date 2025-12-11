import Nutrients from "@/components/nutrients/Nutrients";
import { api } from "@/convex/_generated/api";
import { calculateDayTotals } from "@/lib/nutrition/calculateDayTotals";
import { useQuery } from "convex/react";
import { useLocalSearchParams } from "expo-router";
import { addDays, format, startOfWeek } from "date-fns";
import { es } from "date-fns/locale";

export default function NutrientsScreen() {
  const { dayIndex } = useLocalSearchParams<{ dayIndex: string }>();

  const rawWeekMeals = useQuery(api.meals.getWeekMeals.default, {
    timezoneOffsetMinutes: new Date().getTimezoneOffset(),
  });

  const index = dayIndex ? parseInt(dayIndex, 10) : 0;
  const dayMeals = rawWeekMeals?.at(index) ?? [];

  const { nutrients } = calculateDayTotals(dayMeals);

  const today = new Date();
  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });
  const targetDate = addDays(startOfCurrentWeek, index);
  const title = format(targetDate, "EEEE, d 'de' MMMM", { locale: es });
  const capitalizedTitle = title.charAt(0).toUpperCase() + title.slice(1);

  return <Nutrients nutrients={nutrients} title={capitalizedTitle} />;
}
