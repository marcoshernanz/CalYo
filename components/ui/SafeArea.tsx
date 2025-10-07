import getColor from "@/lib/ui/getColor";
import { StyleSheet } from "react-native";
import {
  SafeAreaView,
  SafeAreaViewProps,
} from "react-native-safe-area-context";

export default function SafeArea({ style, ...props }: SafeAreaViewProps) {
  return <SafeAreaView style={[styles.safeArea, style]} {...props} />;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: getColor("background"),
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
