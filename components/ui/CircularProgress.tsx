import getColor from "@/lib/utils/getColor";
import { Canvas, Group, Path, Skia } from "@shopify/react-native-skia";
import { useMemo, useState } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import {
  SharedValue,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

interface CircularProgressItemProps {
  progress: ProgressValue;
  size: number;
  strokeWidth: number;
  color: string;
}

function CircularProgressItem({
  progress,
  size,
  strokeWidth,
  color,
}: CircularProgressItemProps) {
  const radius = (size - strokeWidth) / 2;

  const isStaticProgress = typeof progress === "number";
  const staticProgress = useSharedValue(isStaticProgress ? progress : 0);
  const sharedProgress = isStaticProgress ? staticProgress : progress;

  const path = useMemo(() => {
    const skPath = Skia.Path.Make();
    skPath.addCircle(size / 2, size / 2, radius);
    return skPath;
  }, [radius, size]);

  const transform = useDerivedValue(() => [
    { rotate: sharedProgress.value - Math.PI / 2 },
  ]);

  return (
    <Canvas style={{ height: size, width: size, position: "absolute" }}>
      <Group origin={{ x: size / 2, y: size / 2 }} transform={transform}>
        <Path
          start={0}
          path={path}
          end={sharedProgress}
          style={"stroke"}
          strokeCap={"round"}
          color={color}
          strokeWidth={strokeWidth}
        />
      </Group>
    </Canvas>
  );
}

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
  color = getColor("foreground"),
  trackColor = getColor("secondary"),
}: Props) {
  const [resolvedSize, setResolvedSize] = useState(0);

  const radius = (resolvedSize - strokeWidth) / 2;
  const progresses = Array.isArray(progress) ? progress : [progress];
  const colors = Array.isArray(color) ? color : [color];

  const handleLayout = ({ nativeEvent }: LayoutChangeEvent) => {
    const nextSize = Math.min(
      nativeEvent.layout.width,
      nativeEvent.layout.height
    );

    if (nextSize && nextSize !== size) {
      setResolvedSize(size ?? nextSize);
    }
  };

  return (
    <View style={styles.container} onLayout={handleLayout}>
      <Svg width={resolvedSize} height={resolvedSize}>
        <Circle
          cx={resolvedSize / 2}
          cy={resolvedSize / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {progresses.map((progress, index) => (
          <CircularProgressItem
            key={`circular-progress-item-${index}`}
            progress={progress}
            size={resolvedSize}
            strokeWidth={strokeWidth}
            color={colors[index] ?? colors[0]}
          />
        ))}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
  },
});
