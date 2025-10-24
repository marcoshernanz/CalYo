import { StyleSheet } from "react-native";
import Button from "../ui/Button";
import SafeArea from "../ui/SafeArea";
import getShadow from "@/lib/ui/getShadow";

export default function MealFooter() {
  return (
    <SafeArea edges={["bottom", "left", "right"]} style={styles.container}>
      <Button style={styles.doneButton}>Hecho</Button>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    zIndex: 10,
    flexDirection: "row",
    paddingTop: 12,
    ...getShadow("md"),
  },
  doneButton: {
    flex: 1,
    height: 48,
  },
});
