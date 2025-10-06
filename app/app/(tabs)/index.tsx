import CalyoLogo from "@/assets/svg/calyo-logo.svg";
import HomeDaySelector from "@/components/home/HomeDaySelector";
import HomeHeader from "@/components/home/HomeHeader";
import SafeArea from "@/components/ui/SafeArea";
import Text from "@/components/ui/Text";
import getColor from "@/lib/utils/getColor";
import { LinearGradient } from "expo-linear-gradient";
import { FlameIcon } from "lucide-react-native";
import { StyleSheet, useWindowDimensions, View } from "react-native";

export default function HomeScreen() {
  const dimensions = useWindowDimensions();

  return (
    <SafeArea>
      <LinearGradient
        colors={[getColor("primaryLight", 0.5), getColor("background")]}
        style={[styles.gradient, { height: dimensions.height / 2 }]}
      />

      <HomeHeader />
      <HomeDaySelector />
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
});
