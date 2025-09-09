import getColor from "@/lib/utils/getColor";
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
    paddingTop: 8,
    paddingHorizontal: 16,
  },
});
