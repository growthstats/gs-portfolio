import { defineConfig } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  {
    ignores: [".claude/**", ".next/**", "src/sanity/sanity.types.ts"],
  },
  ...nextVitals,
  ...nextTypescript,
  {
    // React Compiler rules that eslint-config-next 16 turns on. The code they
    // flag gets fixed with the compiler itself (#136).
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/refs": "off",
    },
  },
]);
