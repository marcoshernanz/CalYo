import getColor from "@/lib/utils/getColor";
import { useState } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface Props {
  size: number;
  progress: number;
  strokeWidth?: number;
  color?: string;
}

export default function CircularProgress({
  size,
  progress,
  strokeWidth = 8,
  color = getColor("foreground"),
}: Props) {
  const [finalSize, setFinalSize] = useState(size);
  const radius = (finalSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const handleLayout = ({ nativeEvent }: LayoutChangeEvent) => {
    const nextSize = Math.min(
      nativeEvent.layout.width,
      nativeEvent.layout.height
    );
    if (nextSize && nextSize !== size) {
      setFinalSize(size ?? nextSize);
    }
  };

  return (
    <View style={styles.container} onLayout={handleLayout}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={(size - strokeWidth) / 2}
          stroke={getColor("secondary")}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={(size - strokeWidth) / 2}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={circumference * (1 - progress)}
          strokeLinecap="round"
          transform={`rotate(-90, ${size / 2}, ${size / 2})`}
          fill="none"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
