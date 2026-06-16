import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

/** Shared flat config: TypeScript recommended + Prettier compatibility. */
export default tseslint.config(
  {
    ignores: [
      'dist',
      '.next',
      'coverage',
      'node_modules',
      '**/generated/**',
      '**/*.config.*',
      '**/next-env.d.ts',
    ],
  },
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  prettier,
);
