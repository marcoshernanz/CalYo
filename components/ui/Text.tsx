import getColor from "@/lib/utils/getColor";
import React from "react";
import {
  Platform,
  Text as RNText,
  TextProps as RNTextProps,
  StyleSheet,
  TextStyle,
} from "react-native";

const interFamilies = {
  normal: {
    100: "Inter_100Thin",
    200: "Inter_200ExtraLight",
    300: "Inter_300Light",
    400: "Inter_400Regular",
    500: "Inter_500Medium",
    600: "Inter_600SemiBold",
    700: "Inter_700Bold",
    800: "Inter_800ExtraBold",
    900: "Inter_900Black",
  },
  italic: {
    100: "Inter_100Thin_Italic",
    200: "Inter_200ExtraLight_Italic",
    300: "Inter_300Light_Italic",
    400: "Inter_400Regular_Italic",
    500: "Inter_500Medium_Italic",
    600: "Inter_600SemiBold_Italic",
    700: "Inter_700Bold_Italic",
    800: "Inter_800ExtraBold_Italic",
    900: "Inter_900Black_Italic",
  },
} as const;

function normalizeWeight(
  w?: TextStyle["fontWeight"]
): 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 {
  if (!w || w === "normal") return 400;
  if (w === "bold") return 700;
  const n = typeof w === "string" ? parseInt(w, 10) : (w as number);
  if (n >= 900) return 900;
  if (n >= 800) return 800;
  if (n >= 700) return 700;
  if (n >= 600) return 600;
  if (n >= 500) return 500;
  if (n >= 400) return 400;
  if (n >= 300) return 300;
  if (n >= 200) return 200;
  return 100;
}

function TextWrapper(props: RNTextProps) {
  const flat = StyleSheet.flatten(props.style) || {};
  const weight = normalizeWeight(flat.fontWeight as any);
  const styleKey = flat.fontStyle === "italic" ? "italic" : "normal";
  const fontFamily = interFamilies[styleKey][weight];

  const { fontWeight, ...rest } = flat as TextStyle;

  return (
    <RNText
      {...props}
      style={[
        {
          fontFamily,
          color: getColor("foreground"),
          ...(Platform.OS === "android" ? { includeFontPadding: false } : null),
        },
        rest,
      ]}
    />
  );
}

export interface TextProps extends RNTextProps {
  children: React.ReactNode;
  size?: "16" | "18" | "20" | "24" | "30" | "36" | "48";
}

export default function Text({ size, ...rest }: TextProps) {
  const fontSize = size ? parseInt(size) : 18;
  return <TextWrapper {...rest} style={[{ fontSize }, rest.style]} />;
}
