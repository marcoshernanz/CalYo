import getColor from "@/lib/utils/getColor";
import { StyleSheet, View } from "react-native";

interface Props {
  size?: number;
  color?: string;
}

export default function Dot6Icon({
  size = 24,
  color = getColor("foreground"),
}: Props) {
  const rows = 3;
  const cols = 2;

  const gap = size / 6;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          gap,
        },
      ]}
    >
      {Array(rows)
        .fill(0)
        .map((_, rowIndex) => (
          <View
            key={`row-${rowIndex}`}
            style={[
              styles.row,
              {
                gap,
              },
            ]}
          >
            {Array(cols)
              .fill(0)
              .map((_, colIndex) => (
                <View
                  key={`dot-${rowIndex}-${colIndex}`}
                  style={[
                    styles.dot,
                    {
                      backgroundColor: color,
                    },
                  ]}
                />
              ))}
          </View>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
  },
  dot: {
    width: "25%",
    aspectRatio: 1,
    borderRadius: 999,
  },
});
