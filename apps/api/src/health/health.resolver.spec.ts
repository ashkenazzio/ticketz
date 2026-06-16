import { describe, expect, it } from 'vitest';
import { HealthResolver } from './health.resolver';

describe('HealthResolver', () => {
  it('returns "ok"', () => {
    const resolver = new HealthResolver();
    expect(resolver.health()).toBe('ok');
  });
});
