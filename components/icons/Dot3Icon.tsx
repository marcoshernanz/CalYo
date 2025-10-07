import getColor from "@/lib/ui/getColor";
import { StyleSheet, View } from "react-native";

interface Props {
  size?: number;
  color?: string;
}

export default function Dot1Icon({
  size = 24,
  color = getColor("foreground"),
}: Props) {
  const padding = size * 0.2;
  const side = size - padding * 2;

  const height = (Math.sqrt(3) / 2) * side;
  const positions = [
    { x: 0, y: 0 },
    { x: side, y: 0 },
    { x: side / 2, y: height },
  ];

  const centroidShiftY = -height / 6;

  return (
    <View
      style={[
        styles.container,
        {
          width: side,
          height: side,
        },
      ]}
    >
      <View
        style={[
          styles.innerContainer,
          { height, transform: [{ translateY: centroidShiftY }] },
        ]}
      >
        {positions.map((pos, index) => (
          <View
            key={`dot-${index}`}
            style={[
              styles.dot,
              { backgroundColor: color, left: pos.x, bottom: pos.y },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  innerContainer: {
    width: "100%",
  },
  dot: {
    position: "absolute",
    width: "60%",
    aspectRatio: 1,
    borderRadius: 999,
    transform: [{ translateX: "-50%" }, { translateY: "50%" }],
  },
});
