import HomeDaySelector from "@/components/home/HomeDaySelector";
import HomeHeader from "@/components/home/HomeHeader";
import HomeMacroSummary from "@/components/home/HomeMacroSummary";
import HomeRecentlyLogged from "@/components/home/HomeRecentlyLogged";
import SafeArea from "@/components/ui/SafeArea";
import getColor from "@/lib/ui/getColor";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, StyleSheet, useWindowDimensions } from "react-native";

export default function HomeScreen() {
  const dimensions = useWindowDimensions();

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
        <HomeMacroSummary />
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
