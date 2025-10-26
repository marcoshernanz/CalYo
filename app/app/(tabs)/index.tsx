import HomeDaySelector from "@/components/home/HomeDaySelector";
import HomeHeader from "@/components/home/HomeHeader";
import HomeMacroSummary from "@/components/home/HomeMacroSummary";
import HomeRecentlyLogged from "@/components/home/HomeRecentlyLogged";
import SafeArea from "@/components/ui/SafeArea";
import { api } from "@/convex/_generated/api";
import getColor from "@/lib/ui/getColor";
import { useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, StyleSheet, useWindowDimensions } from "react-native";

export default function HomeScreen() {
  const dimensions = useWindowDimensions();

  const meals =
    useQuery(api.meals.getTodaysMeals.default, {
      timezoneOffsetMinutes: new Date().getTimezoneOffset(),
    }) ?? [];

  const totals = meals?.reduce(
    (acc, meal) => ({
      calories: acc.calories + (meal.totals?.calories ?? 0),
      protein: acc.protein + (meal.totals?.protein ?? 0),
      carbs: acc.carbs + (meal.totals?.carbs ?? 0),
      fat: acc.fat + (meal.totals?.fat ?? 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

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
        <HomeDaySelector />
        <HomeMacroSummary totals={totals} />
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
