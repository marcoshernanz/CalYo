import { StyleSheet, View } from "react-native";
import ScannerRect from "@/components/ui/ScannerRect";

export default function PhotoOverlay() {
  return (
    <View style={styles.container}>
      <View style={styles.target}>
        <ScannerRect />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  target: {
    width: "90%",
    height: "90%",
  },
});
