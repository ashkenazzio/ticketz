import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from './config/env';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  await app.listen(env.PORT);
  console.log(`🚀 API ready at http://localhost:${env.PORT}/graphql`);
}

void bootstrap();
