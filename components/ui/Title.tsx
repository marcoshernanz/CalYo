import React from "react";
import { StyleSheet } from "react-native";
import Text, { TextProps, FontSize } from "./Text";

interface Props extends TextProps {
  size?: FontSize;
}

export default function Title({ size = "32", ...rest }: Props) {
  return <Text {...rest} size={size} style={[styles.title, rest.style]} />;
}

const styles = StyleSheet.create({
  title: {
    fontWeight: 600,
  },
});
