// eslint.config.mjs
import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import prettierConfig from "eslint-config-prettier";

export default [
  // 1. Ignore build artifacts and dependencies
  { ignores: ["dist", "build", "node_modules", "coverage", "*.config.js"] },

  // 2. Base JavaScript & React Rules
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: "detect" },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,

      // React Refresh (Fast Refresh) Safety
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      // Modern React Adjustments
      "react/react-in-jsx-scope": "off", // Not needed in React 17+
      "react/prop-types": "off", // Optional: Disable if not using PropTypes
    },
  },

  // 3. Prettier Integration (Must be last to override other rules)
  prettierConfig,
];
