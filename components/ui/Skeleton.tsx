import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";
import getColor from "@/lib/ui/getColor";

interface Props {
  style?: StyleProp<ViewStyle> | undefined;
}

export default function Skeleton({ style }: Props) {
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.base, animatedStyle, style]} />;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: getColor("secondary", 0.5),
  },
});
