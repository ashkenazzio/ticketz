import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class HealthResolver {
  @Query(() => String, { description: 'Liveness check — returns "ok".' })
  health(): string {
    return 'ok';
  }
}
