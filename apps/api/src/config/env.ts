import { z } from 'zod';

/**
 * Validated process environment for the API. Fails fast at boot if invalid.
 * Add new vars here as features land (DATABASE_URL in E1, JWT_* in E2, STRIPE_* in E6).
 */
const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  WEB_ORIGIN: z.string().url().default('http://localhost:3001'),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid API environment:\n', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment variables');
}

export const env = parsed.data;
