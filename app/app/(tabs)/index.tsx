import HomeDaySelector from "@/components/home/HomeDaySelector";
import HomeHeader from "@/components/home/HomeHeader";
import Button from "@/components/ui/Button";
import SafeArea from "@/components/ui/SafeArea";
import { useAuthContext } from "@/context/AuthContext";
import getColor from "@/lib/utils/getColor";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, useWindowDimensions } from "react-native";

export default function HomeScreen() {
  const dimensions = useWindowDimensions();
  const { signOut } = useAuthContext();

  return (
    <SafeArea>
      <LinearGradient
        colors={[getColor("primaryLight", 0.75), getColor("background")]}
        style={[styles.gradient, { height: dimensions.height * 0.75 }]}
      />

      <HomeHeader />
      <HomeDaySelector />
      {/* <Button onPress={signOut}>Sign Out</Button> */}
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
});
