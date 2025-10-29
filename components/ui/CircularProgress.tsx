import getColor from "@/lib/ui/getColor";
import {
  Canvas,
  Group,
  Path,
  Skia,
  type SkPath,
} from "@shopify/react-native-skia";
import { useMemo, useState } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import { SharedValue, useDerivedValue } from "react-native-reanimated";

type ProgressValue = number | SharedValue<number>;

function CircularProgressItem({
  path,
  progress,
  previousProgresses,
  strokeWidth,
  color,
}: {
  path: SkPath;
  progress: ProgressValue;
  previousProgresses: ProgressValue[];
  strokeWidth: number;
  color: string;
}) {
  const start = useDerivedValue(() => {
    let total = 0;
    for (const p of previousProgresses)
      total += typeof p === "number" ? p : p.value;
    return Math.min(Math.max(total, 0), 1);
  }, [previousProgresses]);

  const end = useDerivedValue(() => {
    const v = typeof progress === "number" ? progress : progress.value;
    return Math.min(Math.max(start.value + v, start.value), 1);
  }, [progress, start]);

  return (
    <Path
      path={path}
      start={start}
      end={end}
      style="stroke"
      strokeCap="round"
      color={color}
      strokeWidth={strokeWidth}
    />
  );
}

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
  const [measured, setMeasured] = useState(0);
  const resolvedSize = size ?? measured;

  const onLayout = ({ nativeEvent }: LayoutChangeEvent) => {
    if (size) return;
    const next = Math.min(nativeEvent.layout.width, nativeEvent.layout.height);
    if (next && next !== measured) setMeasured(next);
  };

  const circlePath = useMemo(() => {
    if (!resolvedSize) return null;
    const r = (resolvedSize - strokeWidth) / 2;
    const p = Skia.Path.Make();
    p.addCircle(resolvedSize / 2, resolvedSize / 2, r);
    return p;
  }, [resolvedSize, strokeWidth]);

  const progresses = Array.isArray(progress) ? progress : [progress];
  const colors = Array.isArray(color) ? color : [color];

  if (!resolvedSize || !circlePath) {
    return <View style={styles.container} onLayout={onLayout} />;
  }

  return (
    <View
      style={[styles.container, { height: resolvedSize, width: resolvedSize }]}
      onLayout={onLayout}
    >
      <Canvas style={{ height: resolvedSize, width: resolvedSize }}>
        <Group
          origin={{ x: resolvedSize / 2, y: resolvedSize / 2 }}
          transform={[{ rotate: -Math.PI / 2 }]}
        >
          <Path
            path={circlePath}
            style="stroke"
            color={trackColor}
            strokeWidth={strokeWidth}
          />
          {progresses.map((p, i) => (
            <CircularProgressItem
              key={i}
              path={circlePath}
              progress={p}
              previousProgresses={progresses.slice(0, i)}
              strokeWidth={strokeWidth}
              color={colors[i] ?? colors[0]}
            />
          ))}
        </Group>
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
});
