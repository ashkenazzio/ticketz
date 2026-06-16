import { z } from 'zod';

/**
 * Validated web environment. NEXT_PUBLIC_* values are inlined at build time;
 * server-only values (GRAPHQL_INTERNAL_URL) are read at request time in RSC.
 */
const schema = z.object({
  NEXT_PUBLIC_GRAPHQL_URL: z.string().url().default('http://localhost:3000/graphql'),
  GRAPHQL_INTERNAL_URL: z.string().url().default('http://localhost:3000/graphql'),
});

export const env = schema.parse({
  NEXT_PUBLIC_GRAPHQL_URL: process.env.NEXT_PUBLIC_GRAPHQL_URL,
  GRAPHQL_INTERNAL_URL: process.env.GRAPHQL_INTERNAL_URL,
});
