import 'reflect-metadata';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { NestFactory } from '@nestjs/core';
import { GraphQLSchemaBuilderModule, GraphQLSchemaFactory } from '@nestjs/graphql';
import { lexicographicSortSchema, printSchema } from 'graphql';
import { schemaResolvers } from './schema.resolvers';

/**
 * Emits the code-first GraphQL SDL to schema.gql (the web app's graphql-codegen
 * input, wired in E1-T8).
 *
 * Uses GraphQLSchemaFactory to build the schema directly from resolver metadata,
 * WITHOUT booting AppModule. This deliberately keeps codegen decoupled from
 * infrastructure: no DI of PrismaService, no database connection, no DATABASE_URL
 * required. Schema is sorted lexicographically to match the previous
 * `sortSchema: true` output and keep diffs stable.
 */
const HEADER = `# ------------------------------------------------------
# THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
# ------------------------------------------------------
`;

async function emit(): Promise<void> {
  const app = await NestFactory.create(GraphQLSchemaBuilderModule, { logger: false });
  await app.init();

  const schemaFactory = app.get(GraphQLSchemaFactory);
  const schema = await schemaFactory.create(schemaResolvers);
  await app.close();

  const sdl = `${HEADER}\n${printSchema(lexicographicSortSchema(schema))}\n`;
  await writeFile(join(process.cwd(), 'schema.gql'), sdl, 'utf8');
}

emit()
  .then(() => process.exit(0))
  .catch((err: unknown) => {
    console.error(err);
    process.exit(1);
  });
