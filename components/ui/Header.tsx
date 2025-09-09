import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";

export default function Header(rest: ViewProps) {
  return <View {...rest} style={[styles.header, rest.style]} />;
}

const styles = StyleSheet.create({
  header: {
    gap: 8,
  },
});
