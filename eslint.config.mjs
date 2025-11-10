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
  tseslintConfigs.strictTypeChecked,
  tseslintConfigs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/no-deprecated": "error",
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        {
          allowNumber: true,
        },
      ],
    },
  }
);
