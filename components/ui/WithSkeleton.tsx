import React from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import Skeleton from "./Skeleton";

interface Props {
  loading: boolean;
  skeletonStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

export default function WithSkeleton({
  loading,
  skeletonStyle,
  containerStyle,
  children,
}: Props) {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={{ opacity: loading ? 0 : 1 }}>{children}</View>
      {loading && (
        <View pointerEvents="none" style={styles.overlay}>
          <Skeleton style={skeletonStyle} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flexShrink: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "flex-start",
  },
});
