import getColor from "@/lib/ui/getColor";
import resolveFontFamily from "@/lib/ui/resolveFontFamily";
import React from "react";
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleSheet,
  TextStyle,
} from "react-native";

function TextWrapper(props: RNTextProps) {
  const flat = StyleSheet.flatten<TextStyle>(props.style) ?? {};
  const fontFamily = resolveFontFamily({
    weight: flat.fontWeight,
    style: flat.fontStyle,
  });

  const { fontWeight, ...rest } = flat;

  return (
    <RNText
      {...props}
      style={[{ fontFamily, includeFontPadding: false }, rest]}
    />
  );
}

export type FontSize =
  | "10"
  | "12"
  | "14"
  | "16"
  | "18"
  | "20"
  | "24"
  | "28"
  | "32"
  | "40"
  | "48";

export type FontWeight =
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900";

export type TextProps = {
  children: React.ReactNode;
  size?: FontSize;
  weight?: FontWeight;
  color?: string;
} & RNTextProps;

export default function Text({
  size = "18",
  weight = "400",
  color = getColor("foreground"),
  ...rest
}: TextProps) {
  const fontSize = size ? parseInt(size) : 18;
  return (
    <TextWrapper
      {...rest}
      style={[{ fontSize, fontWeight: weight, color }, rest.style]}
    />
  );
}
