import React from "react";
import { StyleSheet } from "react-native";
import Text, { TextProps, TextSize } from "./Text";

interface Props extends TextProps {
  size?: TextSize;
}

export default function Title({ size = "36", ...rest }: Props) {
  return <Text {...rest} size={size} style={[styles.title, rest.style]} />;
}

const styles = StyleSheet.create({
  title: {
    fontWeight: 600,
  },
});
