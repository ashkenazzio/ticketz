import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.spec.ts'],
    root: './',
    // Satisfy env.ts's zod validation at import time. Unit tests never open a real
    // connection (DB calls are mocked), so this is a placeholder, not a live DB.
    env: {
      DATABASE_URL: 'postgresql://test:test@localhost:5432/test?schema=public',
    },
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.spec.ts', 'src/main.ts', 'src/schema-emit.ts'],
    },
  },
  // SWC compiles decorators + emits metadata so Nest DI works under Vitest.
  plugins: [swc.vite()],
});
