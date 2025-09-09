import React from "react";
import { StyleSheet } from "react-native";
import Text, { TextProps } from "./Text";

export default function Description(rest: TextProps) {
  return <Text {...rest} style={[styles.description, rest.style]} />;
}

const styles = StyleSheet.create({
  description: {},
});
