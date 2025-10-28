import React from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import Skeleton from "./Skeleton";

interface Props {
  loading: boolean;
  skeletonStyle?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

export default function WithSkeleton({
  loading,
  skeletonStyle,
  children,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={{ opacity: loading ? 0 : 1 }}>{children}</View>
      {loading && <Skeleton style={[StyleSheet.absoluteFill, skeletonStyle]} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignSelf: "flex-start",
  },
});
