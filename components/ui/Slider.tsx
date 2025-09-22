import React from "react";
import getColor from "@/lib/utils/getColor";
import { Dimensions, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface Props {
  minValue: number;
  maxValue: number;
  value: SharedValue<number>;
  highlightedRange?: [number, number];
}

const dotSize = 24;
const lineWidth = Dimensions.get("window").width - 32 - dotSize;

const minOffset = -dotSize / 2;
const maxOffset = lineWidth - dotSize / 2;

export default function Slider({
  minValue = 0,
  maxValue = 100,
  value,
  highlightedRange,
}: Props) {
  const isPressed = useSharedValue(false);
  const offset = useSharedValue(0);
  const startOffset = useSharedValue(0);

  const calculateValue = (offset: number) => {
    "worklet";
    const ratio = (offset - minOffset) / (maxOffset - minOffset);
    const mapped = minValue + ratio * (maxValue - minValue);
    return mapped;
  };

  const gesture = Gesture.Pan()
    .onBegin(() => {
      isPressed.value = true;
    })
    .onUpdate((e) => {
      offset.value = Math.min(
        Math.max(e.translationX + startOffset.value, minOffset),
        maxOffset
      );
      value.value = calculateValue(offset.value);
    })
    .onEnd(() => {
      startOffset.value = offset.value;
    })
    .onFinalize(() => {
      isPressed.value = false;
    });

  const springConfig = { stiffness: 500, damping: 30, mass: 0.9 } as const;

  const animatedStyles = {
    dot: useAnimatedStyle(() => {
      return {
        transform: [
          { translateX: offset.value },
          { scale: withSpring(isPressed.value ? 0.9 : 1, springConfig) },
        ],
      };
    }),
  };

  return (
    <View style={styles.container}>
      <View style={styles.line}>
        {highlightedRange && (
          <View
            style={[
              styles.highlightLine,
              {
                width:
                  lineWidth *
                  ((highlightedRange[1] - highlightedRange[0]) /
                    (maxValue - minValue)),
                marginLeft:
                  lineWidth *
                  ((highlightedRange[0] - minValue) / (maxValue - minValue)),
              },
            ]}
          />
        )}
      </View>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.dotContainer, animatedStyles.dot]}>
          <View style={styles.dot} />
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: dotSize * 2,
    justifyContent: "center",
  },
  line: {
    width: lineWidth,
    height: 4,
    backgroundColor: getColor("secondary"),
    marginLeft: dotSize / 2,
  },
  highlightLine: {
    backgroundColor: getColor("primary"),
    height: "100%",
  },
  dotContainer: {
    width: dotSize * 2,
    height: dotSize * 2,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },
  dot: {
    width: dotSize,
    height: dotSize,
    borderRadius: 999,
    backgroundColor: getColor("foreground"),
  },
});
