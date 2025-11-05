// @ts-check
import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import expoConfig from "eslint-config-expo/flat";
import reactCompiler from "eslint-plugin-react-compiler";

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  expoConfig,
  reactCompiler.configs.recommended
);
