import React from "react";
import { StyleSheet } from "react-native";
import Text, { TextProps } from "./Text";

export default function Title(rest: TextProps) {
  return <Text {...rest} style={[styles.title, rest.style]} />;
}

const styles = StyleSheet.create({
  title: {
    fontSize: 36,
    fontWeight: 700,
  },
});
