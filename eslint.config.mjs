import globals from "globals";

export default [
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": "off",
      "no-undef": "error",
      "no-redeclare": "error",
      "no-extra-semi": "warn",
    },
  },
  { ignores: ["dist/", "node_modules/", "coverage/", "eslint.config.mjs", "src/__tests__/"] },
];
