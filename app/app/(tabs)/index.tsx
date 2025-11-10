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
import {
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";

export default function HomeScreen() {
  const dimensions = useWindowDimensions();
  const [selectedDay, setSelectedDay] = useState((getDay(new Date()) + 6) % 7);

  const rawWeekMeals = useQuery(api.meals.getWeekMeals.default, {
    timezoneOffsetMinutes: new Date().getTimezoneOffset(),
  });
  const weekMeals = rawWeekMeals ?? Array.from({ length: 7 }, () => []);
  const dayMeals = weekMeals.at(selectedDay) ?? [];

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

  const dayTotals = weekTotals.at(selectedDay) ?? {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[getColor("primaryLight", 0.75), getColor("background")]}
        style={[styles.gradient, { height: dimensions.height * 0.75 }]}
        pointerEvents="none"
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <SafeArea style={styles.safeAreaContent}>
          <HomeHeader />
          <HomeDaySelector
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            weekTotals={weekTotals}
          />
          <HomeMacroSummary totals={dayTotals} />
          <HomeRecentlyLogged meals={dayMeals} />
        </SafeArea>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: getColor("background"),
  },
  scrollView: {
    flex: 1,
    backgroundColor: "transparent",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  safeAreaContent: {
    backgroundColor: "transparent",
  },
});
