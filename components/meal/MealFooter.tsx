import { StyleSheet, View } from "react-native";
import Button from "../ui/Button";

export default function MealFooter() {
  return (
    <View style={styles.container}>
      <Button style={styles.doneButton}>Hecho</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingTop: 12,
  },
  doneButton: {
    flex: 1,
    height: 48,
  },
});
