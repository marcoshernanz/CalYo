import React from "react";
import { StyleSheet } from "react-native";
import Text, { TextProps, FontSize } from "./Text";
import getColor from "@/lib/utils/getColor";

interface Props extends TextProps {
  size?: FontSize;
}

export default function Description({ size = "16", ...rest }: Props) {
  return (
    <Text {...rest} size={size} style={[styles.description, rest.style]} />
  );
}

const styles = StyleSheet.create({
  description: {
    color: getColor("mutedForeground"),
  },
});
