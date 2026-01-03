import { StyleSheet, View } from "react-native";

export default function BarcodeOverlay() {
  return (
    <View style={styles.container}>
      <View style={styles.target} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  target: {
    width: "90%",
    aspectRatio: 1.5,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    borderRadius: 16,
    backgroundColor: "transparent",
    boxShadow: [
      {
        offsetX: 0,
        offsetY: 0,
        color: `rgba(0, 0, 0, 0.5)`,
        spreadDistance: 999,
      },
    ],
  },
});
