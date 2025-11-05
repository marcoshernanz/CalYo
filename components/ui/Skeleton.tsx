import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  LayoutChangeEvent,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  cancelAnimation,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import getColor from "@/lib/ui/getColor";

type Props = {
  style?: StyleProp<ViewStyle>;
}

const duration = 2000;
const bandFraction = 1;

export default function Skeleton({ style }: Props) {
  const [width, setWidth] = useState(0);
  const translateX = useSharedValue(0);

  const onLayout = (e: LayoutChangeEvent) => {
    setWidth(e.nativeEvent.layout.width);
  };

  useEffect(() => {
    if (!width) return;
    const bandW = Math.max(48, width * bandFraction);
    translateX.value = -bandW;
    translateX.value = withRepeat(withTiming(width, { duration }), -1, false);
    return () => cancelAnimation(translateX);
  }, [width, translateX]);

  const bandW = Math.max(48, width * bandFraction);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const baseColor = getColor("secondary");
  const highlightColor = getColor("muted");

  return (
    <View
      onLayout={onLayout}
      style={[styles.base, { backgroundColor: baseColor }, style]}
    >
      {width > 0 && (
        <Animated.View
          pointerEvents="none"
          style={[styles.shimmer, { width: bandW }, shimmerStyle]}
        >
          <LinearGradient
            colors={[baseColor, highlightColor, baseColor]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
    overflow: "hidden",
  },
  shimmer: {
    position: "absolute",
    top: 0,
    bottom: 0,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
});
