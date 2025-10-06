import getColor from "@/lib/utils/getColor";
import { useEffect, useState } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedProps,
  useSharedValue,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type ProgressValue = number | SharedValue<number>;

interface Props {
  progress: ProgressValue | ProgressValue[];
  size?: number;
  strokeWidth?: number;
  color?: string | string[];
}

export default function CircularProgress({
  progress,
  size,
  strokeWidth = 8,
  color,
}: Props) {
  const [resolvedSize, setResolvedSize] = useState(size ?? 0);

  useEffect(() => {
    if (size) {
      setResolvedSize(size);
    }
  }, [size]);

  const radius = (resolvedSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const fallbackColor = getColor("foreground");
  const progressList = normalizeToArray(progress);
  const colorList = normalizeToArray(color ?? fallbackColor);

  const handleLayout = ({ nativeEvent }: LayoutChangeEvent) => {
    if (size) {
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
            stroke={getColor("secondary")}
            strokeWidth={strokeWidth}
            fill="none"
          />
        )}
        {radius > 0 &&
          progressList.map((_, index) => (
            <ProgressSegment
              key={`progress-segment-${index}`}
              index={index}
              center={resolvedSize / 2}
              radius={radius}
              strokeWidth={strokeWidth}
              circumference={circumference}
              progressList={progressList}
              color={
                colorList[index] ??
                colorList[colorList.length - 1] ??
                fallbackColor
              }
            />
          ))}
      </Svg>
    </View>
  );
}

function normalizeToArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

function clamp01(value: number) {
  "worklet";
  return Math.max(0, Math.min(value, 1));
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
  const staticProgress = useSharedValue(0);

  const animatedProps = useAnimatedProps(() => {
    const clampedValues = progressList.map((item, itemIndex) => {
      if (typeof item === "number") {
        return clamp01(item);
      }

      if (
        item === progressList[index] &&
        typeof progressList[index] === "number"
      ) {
        return clamp01(progressList[index] as number);
      }

      return clamp01(item.value);
    });

    const currentValue = clamp01(clampedValues[index] ?? 0);
    const priorSum = clampedValues
      .slice(0, index)
      .reduce((acc, value) => acc + clamp01(value), 0);
    const boundedStart = Math.min(priorSum, 1);
    const safeCurrent = Math.min(currentValue, Math.max(0, 1 - boundedStart));
    const rotation = -90 + boundedStart * 360;

    return {
      strokeDashoffset: circumference * (1 - safeCurrent),
      transform: `rotate(${rotation}, ${center}, ${center})`,
    };
  }, [center, circumference, index, progressList]);

  return (
    <AnimatedCircle
      cx={center}
      cy={center}
      r={radius}
      stroke={color}
      strokeWidth={strokeWidth}
      strokeDasharray={`${circumference} ${circumference}`}
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
