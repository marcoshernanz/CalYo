import { ViewStyle } from "react-native";

export interface Props {
  size: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  color?: string;
  opacity?: number;
}

export default function getShadow({
  size,
  color = "#000",
  opacity = 0.15,
}: Props): ViewStyle {
  const shadowMap = {
    xs: { offsetX: 0, offsetY: 1, blurRadius: 2, spreadDistance: 0 },
    sm: { offsetX: 0, offsetY: 2, blurRadius: 4, spreadDistance: 0 },
    md: { offsetX: 0, offsetY: 4, blurRadius: 6, spreadDistance: 0 },
    lg: { offsetX: 0, offsetY: 8, blurRadius: 12, spreadDistance: 0 },
    xl: { offsetX: 0, offsetY: 12, blurRadius: 20, spreadDistance: 0 },
    "2xl": { offsetX: 0, offsetY: 16, blurRadius: 24, spreadDistance: 0 },
  };

  const { offsetX, offsetY, blurRadius, spreadDistance } = shadowMap[size];

  const colorRGBA = {
    r: parseInt(color.slice(1, 3), 16),
    g: parseInt(color.slice(3, 5), 16),
    b: parseInt(color.slice(5, 7), 16),
    a: opacity,
  };

  return {
    boxShadow: [
      {
        offsetX,
        offsetY,
        blurRadius,
        spreadDistance,
        color: `rgba(${colorRGBA.r}, ${colorRGBA.g}, ${colorRGBA.b}, ${colorRGBA.a})`,
      },
    ],
  };
}
