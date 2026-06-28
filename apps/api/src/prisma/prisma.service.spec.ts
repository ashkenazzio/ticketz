import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;
  beforeEach(() => {
    service = new PrismaService();

    vi.spyOn(service, '$connect').mockResolvedValue(undefined);
    vi.spyOn(service, '$disconnect').mockResolvedValue(undefined);
  });

  it('should connect on module init', async () => {
    await service.onModuleInit();
    expect(service.$connect).toHaveBeenCalledOnce();
  });

  it('should disconnect on module destroy', async () => {
    await service.onModuleDestroy();
    expect(service.$disconnect).toHaveBeenCalledOnce();
  });
});
