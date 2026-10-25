import js from '@eslint/js';
import html from '@html-eslint/eslint-plugin';
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
  },

  // Node-side config files
  {
    files: ['*.config.{js,ts}'],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: {
      globals: globals.node,
    },
  },

  // index.html: markup best practices + Tailwind class checks
  {
    files: ['**/*.html'],
    plugins: { html },
    language: 'html/html',
    extends: [html.configs.recommended, betterTailwindcss.configs.recommended],
    settings: tailwindSettings,
    rules: {
      'html/indent': ['error', 2],
      // Match existing <meta ... /> style for void elements
      'html/require-closing-tags': ['error', { selfClosing: 'always' }],
      'html/no-extra-spacing-tags': ['error', { enforceBeforeSelfClose: true }],
      'html/attrs-newline': 'off',
      // Long Alpine/Tailwind class lists read better on one line than auto-wrapped
      'better-tailwindcss/enforce-consistent-line-wrapping': 'off',
      // Plain CSS classes defined in src/index.css
      'better-tailwindcss/no-unknown-classes': ['error', { ignore: ['^font-tabular$', '^checkerboard$'] }],
    },
  },
]);
