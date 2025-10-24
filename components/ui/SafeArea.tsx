import getColor from "@/lib/ui/getColor";
import { StyleSheet } from "react-native";
import {
  Edge,
  Edges,
  SafeAreaView,
  SafeAreaViewProps,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const paddingVertical = 12;
const paddingHorizontal = 16;

export default function SafeArea({ style, ...props }: SafeAreaViewProps) {
  const edges = props.edges;

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        hasEdge(edges, "top") && { paddingTop: paddingVertical },
        hasEdge(edges, "bottom") && { paddingBottom: paddingVertical },
        hasEdge(edges, "left") && { paddingLeft: paddingHorizontal },
        hasEdge(edges, "right") && { paddingRight: paddingHorizontal },
        style,
      ]}
      {...props}
    />
  );
}

export function useSafeArea() {
  const insets = useSafeAreaInsets();

  return {
    top: insets.top + paddingVertical,
    bottom: insets.bottom + paddingVertical,
    left: insets.left + paddingHorizontal,
    right: insets.right + paddingHorizontal,
  };
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: getColor("background"),
  },
});

function hasEdge(edges: Edges | undefined, edge: Edge) {
  if (edges === undefined) {
    return true;
  }

  if (Array.isArray(edges)) {
    return edges.includes(edge);
  }

  return false;
}
