import getColor from "@/lib/ui/getColor";
import { StyleSheet } from "react-native";
import {
  SafeAreaView,
  SafeAreaViewProps,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function SafeArea({ style, ...props }: SafeAreaViewProps) {
  return <SafeAreaView style={[styles.safeArea, style]} {...props} />;
}

export function useSafeArea() {
  const insets = useSafeAreaInsets();

  return {
    top: insets.top + styles.safeArea.paddingVertical,
    bottom: insets.bottom + styles.safeArea.paddingVertical,
    left: insets.left + styles.safeArea.paddingHorizontal,
    right: insets.right + styles.safeArea.paddingHorizontal,
  };
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: getColor("background"),
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
