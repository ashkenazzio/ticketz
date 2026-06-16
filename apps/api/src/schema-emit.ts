import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * Boots the app just far enough for GraphQLModule to emit schema.gql, then exits.
 * This is the API's `codegen` task — the committed schema.gql is the web app's
 * graphql-codegen input (wired in E1-T8).
 */
async function emit(): Promise<void> {
  const app = await NestFactory.create(AppModule, { logger: false });
  await app.init();
  await app.close();
}

emit()
  .then(() => process.exit(0))
  .catch((err: unknown) => {
    console.error(err);
    process.exit(1);
  });
