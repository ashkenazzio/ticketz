import { expect, test } from '@playwright/test';

// Pure assertion (no `page` fixture) so the runner is verified without a browser binary.
// Real browser-driven specs arrive in Epic 12.
test('playwright runner works', () => {
  expect(1 + 1).toBe(2);
});
