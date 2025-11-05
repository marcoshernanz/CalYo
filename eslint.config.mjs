// @ts-check

import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import { configs as tseslintConfigs } from "typescript-eslint";
import expoConfig from "eslint-config-expo/flat.js";
import reactCompiler from "eslint-plugin-react-compiler";

export default defineConfig(
  eslint.configs.recommended,
  expoConfig,
  reactCompiler.configs.recommended,
  tseslintConfigs.strict,
  tseslintConfigs.stylistic,
  {
    rules: {
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    },
  }
);
