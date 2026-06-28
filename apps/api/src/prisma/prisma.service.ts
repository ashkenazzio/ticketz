import { Injectable, type OnModuleInit, type OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { env } from '../config/env';

/**
 * Wraps the generated Prisma client as an injectable Nest provider and ties its
 * connection lifecycle to Nest's: connect when the module inits, disconnect on
 * shutdown. `enableShutdownHooks()` in main.ts is what makes onModuleDestroy fire.
 *
 * Prisma 7: the client connects through a driver adapter (pg) constructed with
 * the connection string, rather than reading `url` from schema.prisma.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // Constructing the adapter is side-effect-free — it doesn't dial the DB until
    // $connect(). Keeping the constructor effect-free lets build-time tooling
    // (schema codegen boots AppModule then closes it) instantiate this provider
    // without a DATABASE_URL. The requirement is enforced at connect time below.
    super({ adapter: new PrismaPg({ connectionString: env.DATABASE_URL }) });
  }

  async onModuleInit(): Promise<void> {
    if (!env.DATABASE_URL) {
      throw new Error('DATABASE_URL is required to start the API server.');
    }
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
