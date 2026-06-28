import type { Type } from '@nestjs/common';
import { HealthResolver } from './health/health.resolver';

/**
 * Single registration point for GraphQL resolvers used by schema codegen
 * (src/schema-emit.ts). codegen emits the SDL straight from these classes via
 * GraphQLSchemaFactory — without booting AppModule — so it never instantiates
 * infrastructure providers (PrismaService) or needs a database.
 *
 * When you add a resolver, append it here so it appears in schema.gql.
 */
export const schemaResolvers: Type[] = [HealthResolver];
