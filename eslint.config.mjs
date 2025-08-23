import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import jsdoc from "eslint-plugin-jsdoc";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  jsdoc.configs["recommended"], // Kích hoạt các quy tắc khuyến nghị của JSDoc
  {
    rules: {
      "jsdoc/require-param": "error",
      "jsdoc/check-param-names": "error",
      // Bạn có thể tùy chỉnh các quy tắc khác
    },
  },
]);
