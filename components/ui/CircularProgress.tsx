import getColor from "@/lib/utils/getColor";
import { useEffect, useState } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedProps,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type ProgressValue = number | SharedValue<number>;

interface Props {
  progress: ProgressValue | ProgressValue[];
  size?: number;
  strokeWidth?: number;
  color?: string | string[];
  trackColor?: string;
}

export default function CircularProgress({
  progress,
  size,
  strokeWidth = 8,
  color,
  trackColor = getColor("secondary"),
}: Props) {
  const [resolvedSize, setResolvedSize] = useState(size ?? 0);

  useEffect(() => {
    if (typeof size === "number") {
      setResolvedSize(size);
    }
  }, [size]);

  const radius = Math.max((resolvedSize - strokeWidth) / 2, 0);
  const circumference = 2 * Math.PI * radius;
  const fallbackColor = getColor("foreground");
  const progressList: ProgressValue[] = Array.isArray(progress)
    ? progress
    : [progress];
  const colorInput = color ?? fallbackColor;
  const colorList = Array.isArray(colorInput) ? colorInput : [colorInput];

  const handleLayout = ({ nativeEvent }: LayoutChangeEvent) => {
    if (typeof size === "number") {
      return;
    }

    const nextSize = Math.min(
      nativeEvent.layout.width,
      nativeEvent.layout.height
    );

    if (nextSize && nextSize !== resolvedSize) {
      setResolvedSize(nextSize);
    }
  };

  return (
    <View style={styles.container} onLayout={handleLayout}>
      <Svg width={resolvedSize} height={resolvedSize}>
        {radius > 0 && (
          <Circle
            cx={resolvedSize / 2}
            cy={resolvedSize / 2}
            r={radius}
            stroke={trackColor}
            strokeWidth={strokeWidth}
            fill="none"
          />
        )}
        {radius > 0 &&
          progressList.map((_, index) => {
            const segmentColor =
              colorList[index] ??
              colorList[colorList.length - 1] ??
              fallbackColor;

            return (
              <ProgressSegment
                key={`progress-segment-${index}`}
                index={index}
                center={resolvedSize / 2}
                radius={radius}
                strokeWidth={strokeWidth}
                circumference={circumference}
                progressList={progressList}
                color={segmentColor}
              />
            );
          })}
      </Svg>
    </View>
  );
}

function clamp01(value: number) {
  "worklet";
  return Math.max(0, Math.min(value, 1));
}

function getProgressValue(value: ProgressValue) {
  "worklet";
  return typeof value === "number" ? value : value.value;
}

interface ProgressSegmentProps {
  index: number;
  center: number;
  radius: number;
  strokeWidth: number;
  circumference: number;
  progressList: ProgressValue[];
  color: string;
}

function ProgressSegment({
  index,
  center,
  radius,
  strokeWidth,
  circumference,
  progressList,
  color,
}: ProgressSegmentProps) {
  const animatedProps = useAnimatedProps(() => {
    const clampedValues = progressList.map((item) =>
      clamp01(getProgressValue(item))
    );

    let accumulated = 0;
    for (let i = 0; i < index; i += 1) {
      accumulated += clampedValues[i] ?? 0;
    }

    const boundedStart = Math.min(accumulated, 1);
    const remainingCapacity = Math.max(0, 1 - boundedStart);
    const currentValue = clamp01(clampedValues[index] ?? 0);
    const safeLength = Math.min(currentValue, remainingCapacity);
    const dashLength = circumference * safeLength;
    const dashOffset = circumference * (1 - boundedStart);
    const hasProgress = dashLength > 0.0001;

    return {
      strokeDasharray: [dashLength, circumference],
      strokeDashoffset: dashOffset,
      rotation: -90,
      originX: center,
      originY: center,
      strokeOpacity: hasProgress ? 1 : 0,
    };
  }, [center, circumference, index, progressList]);

  return (
    <AnimatedCircle
      cx={center}
      cy={center}
      r={radius}
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      fill="none"
      animatedProps={animatedProps}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
  },
});
