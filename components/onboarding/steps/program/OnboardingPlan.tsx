import SafeArea from "@/components/ui/SafeArea";
import { StyleSheet } from "react-native";

export default function OnboardingPlan() {
  return (
    <SafeArea style={styles.safeArea} edges={["left", "right"]}></SafeArea>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    paddingVertical: 0,
    gap: 36,
  },
});
