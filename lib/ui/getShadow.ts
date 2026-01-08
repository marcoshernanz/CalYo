import type { ViewStyle } from "react-native";

type ShadowSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

type ShadowOptions = {
  opacity?: number;
  inverted?: boolean;
};

export default function getShadow(
  size: ShadowSize,
  options: ShadowOptions = {}
): Pick<ViewStyle, "boxShadow"> {
  const shadowMap = {
    xs: { offsetX: 0, offsetY: 1, blurRadius: 2, spreadDistance: 0 },
    sm: { offsetX: 0, offsetY: 2, blurRadius: 4, spreadDistance: 0 },
    md: { offsetX: 0, offsetY: 4, blurRadius: 6, spreadDistance: 0 },
    lg: { offsetX: 0, offsetY: 8, blurRadius: 12, spreadDistance: 0 },
    xl: { offsetX: 0, offsetY: 12, blurRadius: 20, spreadDistance: 0 },
    "2xl": { offsetX: 0, offsetY: 16, blurRadius: 24, spreadDistance: 0 },
  };

  const { opacity = 0.05, inverted = false } = options;

  const { offsetX, offsetY, blurRadius, spreadDistance } = shadowMap[size];
  const resolvedOffsetY = inverted ? -offsetY : offsetY;

  return {
    boxShadow: [
      {
        offsetX,
        offsetY: resolvedOffsetY,
        blurRadius,
        spreadDistance,
        color: `rgba(0, 0, 0, ${opacity})`,
      },
    ],
  };
}
