import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import jestPlugin from "eslint-plugin-jest";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // regras base do Next.js
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // configuração específica para testes
  {
    files: ["tests/**/*.{js,ts,jsx,tsx}"], // ou ["**/*.test.ts", "**/*.spec.ts"]
    plugins: {
      jest: jestPlugin,
    },
    languageOptions: {
      globals: jestPlugin.environments.globals.globals,
    },
    rules: {
      ...jestPlugin.configs.recommended.rules,
    },
  },
];

export default eslintConfig;
