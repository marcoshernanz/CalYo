import { StyleSheet } from "react-native";
import Button from "../ui/Button";
import SafeArea from "../ui/SafeArea";
import getShadow from "@/lib/ui/getShadow";
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

interface Props {
  scrollY: SharedValue<number>;
  contentHeight: SharedValue<number>;
  layoutHeight: SharedValue<number>;
}

export default function MealFooter({
  scrollY,
  contentHeight,
  layoutHeight,
}: Props) {
  const shadowStyle = useAnimatedStyle(() => {
    const maxOffset = Math.max(contentHeight.value - layoutHeight.value, 0);
    const remaining = Math.max(maxOffset - scrollY.value, 0);
    const opacity = interpolate(
      remaining,
      [0, 24],
      [0, 1],
      Extrapolation.CLAMP
    );

    return { opacity };
  });

  return (
    <SafeArea edges={["bottom", "left", "right"]} style={styles.container}>
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFillObject, styles.shadow, shadowStyle]}
      />
      <Button style={styles.doneButton}>Hecho</Button>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    zIndex: 10,
    flexDirection: "row",
    paddingTop: 12,
    position: "relative",
  },
  doneButton: {
    flex: 1,
    height: 48,
  },
  shadow: {
    ...getShadow("md"),
  },
});
