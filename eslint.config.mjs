import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import expoConfig from "eslint-config-expo/flat.js";
import reactCompiler from "eslint-plugin-react-compiler";

export default defineConfig(
  eslint.configs.recommended,
  expoConfig,
  reactCompiler.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic
);
