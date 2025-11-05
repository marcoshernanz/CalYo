import getColor from "@/lib/ui/getColor";
import { StyleSheet, View } from "react-native";

type Props = {
  size?: number;
  color?: string;
}

export default function Dot1Icon({
  size = 24,
  color = getColor("foreground"),
}: Props) {
  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
        },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    width: "60%",
    height: "60%",
    borderRadius: 999,
  },
});
