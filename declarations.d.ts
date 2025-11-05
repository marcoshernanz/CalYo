declare module "*.svg" {
  import React from "react";
  import { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps>;
  export default content;
}

declare module "eslint-config-expo/flat.js" {
  import type { Linter } from "eslint";
  const config: Linter.FlatConfig[];
  export default config;
}
