import React from "react";
import Text, { TextProps, FontSize } from "./Text";

interface Props extends TextProps {
  size?: FontSize;
}

export default function Title({ size = "32", ...rest }: Props) {
  return <Text {...rest} size={size} weight="600" style={rest.style} />;
}
