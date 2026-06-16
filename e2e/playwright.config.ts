import { defineConfig, devices } from '@playwright/test';

/**
 * E2E config. The vertical-slice spec (register → buy → wallet) lands in Epic 12;
 * for now a runner-sanity test keeps the pipeline green without downloading browsers.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3001',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
