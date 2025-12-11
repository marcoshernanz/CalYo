import HomeDaySelector from "@/components/home/HomeDaySelector";
import HomeHeader from "@/components/home/HomeHeader";
import HomeMacroSummary from "@/components/home/HomeMacroSummary";
import HomeMicroSummary from "@/components/home/HomeMicroSummary";
import HomeRecentlyLogged from "@/components/home/HomeRecentlyLogged";
import Carousel from "@/components/ui/Carousel";
import SafeArea from "@/components/ui/SafeArea";
import { addNutrients, getEmptyNutrients } from "@/config/nutrientsConfig";
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

  const rawWeekMeals = useQuery(api.meals.getWeekMeals.default, {
    timezoneOffsetMinutes: new Date().getTimezoneOffset(),
  });
  const weekMeals = rawWeekMeals ?? Array.from({ length: 7 }, () => []);
  const dayMeals = weekMeals.at(selectedDay) ?? [];

  const weekTotalMacros = weekMeals.map((meals) =>
    meals.reduce(
      (acc, meal) => ({
        calories: acc.calories + (meal.totalMacros?.calories ?? 0),
        protein: acc.protein + (meal.totalMacros?.protein ?? 0),
        carbs: acc.carbs + (meal.totalMacros?.carbs ?? 0),
        fat: acc.fat + (meal.totalMacros?.fat ?? 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    )
  );

  const dayTotals = dayMeals.reduce(
    (acc, meal) => ({
      macros: {
        calories: acc.macros.calories + (meal.totalMacros?.calories ?? 0),
        protein: acc.macros.protein + (meal.totalMacros?.protein ?? 0),
        carbs: acc.macros.carbs + (meal.totalMacros?.carbs ?? 0),
        fat: acc.macros.fat + (meal.totalMacros?.fat ?? 0),
      },
      micros: {
        score: acc.micros.score + (meal.totalMicros?.score ?? 0),
        fiber: acc.micros.fiber + (meal.totalMicros?.fiber ?? 0),
        sugar: acc.micros.sugar + (meal.totalMicros?.sugar ?? 0),
        sodium: acc.micros.sodium + (meal.totalMicros?.sodium ?? 0),
      },
      nutrients: meal.totalNutrients
        ? addNutrients(acc.nutrients, meal.totalNutrients)
        : acc.nutrients,
    }),
    {
      macros: { calories: 0, protein: 0, carbs: 0, fat: 0 },
      micros: { score: 0, fiber: 0, sugar: 0, sodium: 0 },
      nutrients: getEmptyNutrients(),
    }
  );

  return (
    <SafeArea edges={["top"]}>
      <LinearGradient
        colors={[getColor("primaryLight", 0.75), getColor("background")]}
        style={[styles.gradient, { height: dimensions.height * 0.75 }]}
        pointerEvents="none"
      />
      <HomeHeader />
      <ScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <HomeDaySelector
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          weekTotalMacros={weekTotalMacros}
        />
        <Carousel>
          <HomeMacroSummary totalMacros={dayTotals.macros} />
          <HomeMicroSummary
            totalMicros={dayTotals.micros}
            totalNutrients={dayTotals.nutrients}
          />
        </Carousel>
        <HomeRecentlyLogged meals={dayMeals} />
      </ScrollView>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollView: {
    flexGrow: 1,
    paddingBottom: 24,
  },
});
