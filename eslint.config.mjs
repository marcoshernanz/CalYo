// @ts-check

import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import { configs as tseslintConfigs } from "typescript-eslint";
import expoConfig from "eslint-config-expo/flat.js";
import reactCompiler from "eslint-plugin-react-compiler";
import convexPlugin from "@convex-dev/eslint-plugin";

export default defineConfig(
  eslint.configs.recommended,
  expoConfig,
  reactCompiler.configs.recommended,
  tseslintConfigs.strictTypeChecked,
  tseslintConfigs.stylisticTypeChecked,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  ...convexPlugin.configs.recommended,
  {
    files: ["convex/**/*.{ts,tsx,js,jsx}"],
    rules: {
      "@convex-dev/import-wrong-runtime": "error",
    },
  },
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
  },
  {
    ignores: ["convex/_generated/**", "babel.config.js", "metro.config.js"],
  }
);
