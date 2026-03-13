import { BankingService } from '../core/application/BankingService';
import { PrismaClient } from '@prisma/client';
import prisma from '../infrastructure/db/prismaClient';
import { PrismaBankingRepository } from '../adapters/outbound/postgres/PrismaBankingRepository';
import { PrismaComplianceRepository } from '../adapters/outbound/postgres/PrismaComplianceRepository';

describe('BankingService', () => {
  const repo = new PrismaBankingRepository(prisma as unknown as PrismaClient);
  const complianceRepo = new PrismaComplianceRepository(prisma as unknown as PrismaClient);
  const service = new BankingService(repo, complianceRepo);

  beforeAll(async () => {
    await prisma.$connect();
    await prisma.shipCompliance.deleteMany();
    await prisma.bankEntry.deleteMany();
    // seed compliance for ship
    await prisma.shipCompliance.create({ data: { ship_id: 'S1', year: 2024, cb_gco2eq: 100 } });
  });
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('banks positive CB', async () => {
    const result = await service.bank('S1', 2024, 50);
    expect(result.cb_before).toBe(100);
    expect(result.banked_amount).toBe(50);
    expect(result.cb_after).toBe(100);
  });

  it('rejects banking when no positive CB', async () => {
    await prisma.shipCompliance.create({ data: { ship_id: 'S2', year: 2024, cb_gco2eq: -10 } });
    await expect(service.bank('S2', 2024, 10)).rejects.toThrow('no positive compliance balance');
  });

  it('applies banked amount', async () => {
    // assume S1 has 50 banked now
    const applyRes = await service.apply('S1', 2024, 30);
    expect(applyRes.cb_before).toBe(100);
    expect(applyRes.applied).toBe(30);
    expect(applyRes.cb_after).toBe(70);
  });

  it('rejects overapply', async () => {
    await expect(service.apply('S1', 2024, 1000)).rejects.toThrow('insufficient banked');
  });
});