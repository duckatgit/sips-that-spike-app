import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

const basicRules = {
  'no-undef': 'error',
  'no-unused-vars': 'warn',
  'no-console': 'warn',
  'no-debugger': 'error',
  'eqeqeq': 'error',
  'curly': 'error',
  'no-eval': 'error',
  'no-implied-eval': 'error',
  'no-shadow': 'error',
  'no-redeclare': 'error',
  'semi': ['error', 'always'],
  'quotes': ['error', 'single'],
  'indent': ['error', 2],
  'comma-dangle': ['error', 'always-multiline'],
  'no-var': 'error',
  'prefer-const': 'error',
  'arrow-spacing': ['error', { 'before': true, 'after': true }],
};

export default defineConfig([
  { files: ['**/*.{js,mjs,cjs}'], plugins: { js }, extends: ['js/recommended'], rules: basicRules },
  { files: ['**/*.{js,mjs,cjs}'], languageOptions: { globals: globals.browser } },
]);
