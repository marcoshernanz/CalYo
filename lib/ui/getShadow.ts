import { ViewStyle } from "react-native";

type ShadowSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export default function getShadow(
  size: ShadowSize,
  opacity: number = 0.05
): ViewStyle {
  const shadowMap = {
    xs: { offsetX: 0, offsetY: 1, blurRadius: 2, spreadDistance: 0 },
    sm: { offsetX: 0, offsetY: 2, blurRadius: 4, spreadDistance: 0 },
    md: { offsetX: 0, offsetY: 4, blurRadius: 6, spreadDistance: 0 },
    lg: { offsetX: 0, offsetY: 8, blurRadius: 12, spreadDistance: 0 },
    xl: { offsetX: 0, offsetY: 12, blurRadius: 20, spreadDistance: 0 },
    "2xl": { offsetX: 0, offsetY: 16, blurRadius: 24, spreadDistance: 0 },
  };

  const { offsetX, offsetY, blurRadius, spreadDistance } = shadowMap[size];

  return {
    boxShadow: [
      {
        offsetX,
        offsetY,
        blurRadius,
        spreadDistance,
        color: `rgba(0, 0, 0, ${opacity})`,
      },
    ],
  };
}
