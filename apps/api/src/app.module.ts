import { join } from 'node:path';
import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // Code-first: resolvers are the source of truth; SDL is emitted to schema.gql.
      autoSchemaFile: join(process.cwd(), 'schema.gql'),
      sortSchema: true,
      // Disable Nest's legacy playground; use Apollo's modern local landing page (sandbox) instead.
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    HealthModule,
  ],
})
export class AppModule {}
