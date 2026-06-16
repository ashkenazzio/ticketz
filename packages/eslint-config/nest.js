import globals from 'globals';
import base from './base.js';

/** Flat config for the NestJS API (Node, decorators). */
export default [
  ...base,
  {
    languageOptions: { globals: { ...globals.node } },
    rules: {
      // Nest leans on decorators and DI; these are noisy there.
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-extraneous-class': 'off',
    },
  },
];
