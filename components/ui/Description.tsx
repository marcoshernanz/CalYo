import React from "react";
import { StyleSheet } from "react-native";
import Text, { TextProps } from "./Text";
import getColor from "@/lib/utils/getColor";

export default function Description(rest: TextProps) {
  return <Text {...rest} size="16" style={[styles.description, rest.style]} />;
}

const styles = StyleSheet.create({
  description: {
    color: getColor("mutedForeground"),
  },
});
