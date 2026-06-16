import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import nextPlugin from '@next/eslint-plugin-next';
import base from './base.js';

/** Flat config for the Next.js web app (React, hooks, Next rules). */
export default [
  ...base,
  {
    plugins: {
      'react-hooks': reactHooks,
      '@next/next': nextPlugin,
    },
    languageOptions: { globals: { ...globals.browser } },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },
];
