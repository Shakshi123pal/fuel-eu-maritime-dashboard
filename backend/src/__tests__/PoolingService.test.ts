import { PoolingService } from '../core/application/PoolingService';
import { PrismaClient } from '@prisma/client';
import prisma from '../infrastructure/db/prismaClient';
import { PrismaPoolRepository } from '../adapters/outbound/postgres/PrismaPoolRepository';

describe('PoolingService', () => {
  const repo = new PrismaPoolRepository(prisma as unknown as PrismaClient);
  const service = new PoolingService(repo);

  beforeAll(async () => {
    await prisma.$connect();
    await prisma.poolMember.deleteMany();
    await prisma.pool.deleteMany();
  });
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('creates a valid pool with allocation', async () => {
    const members = [
      { shipId: 'A', cbBefore: 100, cbAfter: 0 },
      { shipId: 'B', cbBefore: -50, cbAfter: 0 },
    ];
    const pool = await service.create(2024, members);
    expect(pool.poolId).toBeDefined();
    const aAfter = pool.members.find(m => m.shipId === 'A')?.cbAfter;
    const bAfter = pool.members.find(m => m.shipId === 'B')?.cbAfter;
    expect(aAfter).toBe(50); // 100 - 50
    expect(bAfter).toBe(0); // -50 + 50
  });

  it('rejects negative total', async () => {
    const members = [
      { shipId: 'C', cbBefore: -10, cbAfter: 0 },
    ];
    await expect(service.create(2024, members)).rejects.toThrow('total CB must be non-negative');
  });

  it('rejects negative total CB', async () => {
    const members = [
      { shipId: 'D', cbBefore: 5, cbAfter: 0 },
      { shipId: 'E', cbBefore: -10, cbAfter: 0 },
    ];
    await expect(service.create(2024, members)).rejects.toThrow('total CB must be non-negative');
  });
});