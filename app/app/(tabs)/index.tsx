import HomeDaySelector from "@/components/home/HomeDaySelector";
import HomeHeader from "@/components/home/HomeHeader";
import HomeMacroSummary from "@/components/home/HomeMacroSummary";
import HomeRecentlyLogged from "@/components/home/HomeRecentlyLogged";
import SafeArea from "@/components/ui/SafeArea";
import { api } from "@/convex/_generated/api";
import getColor from "@/lib/ui/getColor";
import { useQuery } from "convex/react";
import { getDay } from "date-fns";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { ScrollView, StyleSheet, useWindowDimensions } from "react-native";

export default function HomeScreen() {
  const dimensions = useWindowDimensions();
  const [selectedDay, setSelectedDay] = useState((getDay(new Date()) + 6) % 7);

  const weekMeals = useQuery(api.meals.getWeekMeals.default, {
    timezoneOffsetMinutes: new Date().getTimezoneOffset(),
  }) ?? [[], [], [], [], [], [], []];
  const dayMeals = weekMeals[selectedDay];

  const weekTotals = weekMeals.map((meals) =>
    meals.reduce(
      (acc, meal) => ({
        calories: acc.calories + (meal.totals?.calories ?? 0),
        protein: acc.protein + (meal.totals?.protein ?? 0),
        carbs: acc.carbs + (meal.totals?.carbs ?? 0),
        fat: acc.fat + (meal.totals?.fat ?? 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    )
  );
  const dayTotals = weekTotals[selectedDay];

  return (
    <ScrollView
      overScrollMode="never"
      bounces={false}
      showsVerticalScrollIndicator={false}
    >
      <SafeArea>
        <LinearGradient
          colors={[getColor("primaryLight", 0.75), getColor("background")]}
          style={[styles.gradient, { height: dimensions.height * 0.75 }]}
        />

        <HomeHeader />
        <HomeDaySelector
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          weekTotals={weekTotals}
        />
        <HomeMacroSummary totals={dayTotals} />
        <HomeRecentlyLogged />
      </SafeArea>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
});
