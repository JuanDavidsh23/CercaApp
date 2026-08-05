// @ts-check
import boundaries from "eslint-plugin-boundaries";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // ── Global ignores ──────────────────────────────────────────────
  {
    ignores: [
      "**/node_modules/**",
      "**/.expo/**",
      "**/dist/**",
      "**/build/**",
      "metro.config.js",
      "postcss.config.mjs",
    ],
  },

  // ── TypeScript base rules ───────────────────────────────────────
  ...tseslint.configs.strictTypeChecked.map((config) => ({
    ...config,
    files: ["**/*.ts", "**/*.tsx"],
  })),

  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Ban `any`
      "@typescript-eslint/no-explicit-any": "error",

      // Ban `as Type` assertions — use Zod .parse() instead
      "@typescript-eslint/consistent-type-assertions": [
        "error",
        { assertionStyle: "never" },
      ],

      // Ban floating promises
      "@typescript-eslint/no-floating-promises": "error",

      // Require exhaustive switch
      "@typescript-eslint/switch-exhaustiveness-check": "error",

      // Allow unused vars prefixed with _
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],

      // Relax some strict rules that conflict with our patterns
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/no-confusing-void-expression": "off",
    },
  },

  // ── Architecture boundary enforcement ───────────────────────────
  {
    files: ["src/**/*.ts", "src/**/*.tsx"],
    plugins: {
      boundaries,
    },
    settings: {
      "boundaries/elements": [
        {
          type: "domain",
          pattern: ["src/domain/*"],
          mode: "folder",
        },
        {
          type: "application",
          pattern: ["src/application/*"],
          mode: "folder",
        },
        {
          type: "infrastructure",
          pattern: ["src/infrastructure/*"],
          mode: "folder",
        },
        {
          type: "presentation",
          pattern: ["src/presentation/*"],
          mode: "folder",
        },
        {
          type: "app-routes",
          pattern: ["src/app/*"],
          mode: "folder",
        },
      ],
      "boundaries/dependency-nodes": ["import"],
    },
    rules: {
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            // Domain: no imports from other layers
            {
              from: ["domain"],
              allow: ["domain"],
            },
            // Application: can import domain
            {
              from: ["application"],
              allow: ["domain", "application"],
            },
            // Infrastructure: can import domain + application
            {
              from: ["infrastructure"],
              allow: ["domain", "application", "infrastructure"],
            },
            // Presentation: can import domain + application + infrastructure
            {
              from: ["presentation"],
              allow: ["domain", "application", "infrastructure", "presentation"],
            },
            // App routes (screens): can import everything
            {
              from: ["app-routes"],
              allow: [
                "domain",
                "application",
                "infrastructure",
                "presentation",
                "app-routes",
              ],
            },
          ],
        },
      ],
    },
  },

  // ── Domain layer: ban React/RN/Expo imports ─────────────────────
  {
    files: ["src/domain/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["react", "react-native", "react-native/*"],
              message: "Domain layer must not import React or React Native.",
            },
            { group: ["expo-*"], message: "Domain layer must not import Expo packages." },
            {
              group: ["@react-navigation/*"],
              message: "Domain layer must not import navigation.",
            },
          ],
        },
      ],
    },
  },
);
