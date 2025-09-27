import getColor from "@/lib/utils/getColor";
import { useState } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface Props {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export default function CircularProgress({
  progress,
  size,
  strokeWidth = 8,
  color = getColor("foreground"),
}: Props) {
  const [finalSize, setFinalSize] = useState(0);
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
      <Svg width={size} height={finalSize}>
        <Circle
          cx={finalSize / 2}
          cy={finalSize / 2}
          r={radius}
          stroke={getColor("secondary")}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={finalSize / 2}
          cy={finalSize / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={circumference * (1 - progress)}
          strokeLinecap="round"
          transform={`rotate(-90, ${finalSize / 2}, ${finalSize / 2})`}
          fill="none"
        />
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
