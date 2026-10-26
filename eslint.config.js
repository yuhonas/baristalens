import js from '@eslint/js';
import html from '@html-eslint/eslint-plugin';
import alpinejs from 'eslint-plugin-alpinejs';
import betterTailwindcss from 'eslint-plugin-better-tailwindcss';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const tailwindSettings = {
  'better-tailwindcss': {
    entryPoint: 'src/index.css',
  },
};

export default defineConfig([
  globalIgnores(['dist', 'public']),

  // TypeScript app code: type-aware rules
  {
    files: ['src/**/*.ts'],
    extends: [
      js.configs.recommended,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Numbers in template strings are fine; still catches objects/undefined
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
    },
  },

  // Node-side config files and Playwright specs
  {
    files: ['*.config.{js,ts}', 'e2e/**/*.ts'],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: {
      globals: globals.node,
    },
  },

  // index.html: markup best practices + Tailwind class checks
  {
    files: ['**/*.html'],
    plugins: { html, alpinejs },
    language: 'html/html',
    extends: [html.configs.recommended, betterTailwindcss.configs.recommended],
    settings: tailwindSettings,
    rules: {
      ...alpinejs.configs.recommended.rules,
      'html/indent': ['error', 2],
      // Match existing <meta ... /> style for void elements
      'html/require-closing-tags': ['error', { selfClosing: 'always' }],
      'html/no-extra-spacing-tags': ['error', { enforceBeforeSelfClose: true }],
      'html/attrs-newline': 'off',
      // Accept Alpine-bound alt text
      'html/require-img-alt': ['error', { substitute: [':alt', 'x-bind:alt'] }],
      // Long Alpine/Tailwind class lists read better on one line than auto-wrapped
      'better-tailwindcss/enforce-consistent-line-wrapping': 'off',
      // Plain CSS classes defined in src/index.css
      'better-tailwindcss/no-unknown-classes': ['error', { ignore: ['^font-tabular$', '^checkerboard$'] }],
    },
  },
]);
