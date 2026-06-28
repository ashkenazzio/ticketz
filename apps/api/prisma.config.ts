import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

/**
 * Prisma 7 CLI config. The connection URL lives here (and on the client's driver
 * adapter), not in schema.prisma's datasource block — that's a v7 breaking change.
 * `prisma migrate`/`generate` read DATABASE_URL through this file.
 */
type Env = {
  DATABASE_URL: string;
};

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env<Env>('DATABASE_URL'),
  },
});
