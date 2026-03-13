import { PrismaClient } from '@prisma/client';
import prisma from '../infrastructure/db/prismaClient';
import { PrismaRouteRepository } from '../adapters/outbound/postgres/PrismaRouteRepository';
import { RouteService } from '../core/application/RouteService';

describe('RouteService', () => {
  const repo = new PrismaRouteRepository(prisma as unknown as PrismaClient);
  const service = new RouteService(repo);

  beforeAll(async () => {
    await prisma.$connect();
    // seed minimal data
    await prisma.route.deleteMany();
    await prisma.route.createMany({
      data: [
        { route_id: 'R1', year: 2024, vessel_type: 'A', fuel_type: 'X', ghg_intensity: 90, fuel_consumption: 100, distance: 100, total_emissions: 1000, is_baseline: true },
        { route_id: 'R2', year: 2024, vessel_type: 'B', fuel_type: 'Y', ghg_intensity: 95, fuel_consumption: 200, distance: 200, total_emissions: 2000 },
      ],
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should list routes', async () => {
    const list = await service.listRoutes();
    expect(list.length).toBe(2);
  });

  it('should set baseline', async () => {
    const routes = await service.listRoutes();
    const other = routes.find((r) => !r.isBaseline)!;
    await service.setBaseline(other.id);
    const baseline = await repo.getBaseline();
    expect(baseline?.id).toBe(other.id);
  });

  it('should compare with baseline', async () => {
    // ensure baseline exists by using one of the listed routes
    const routes = await service.listRoutes();
    expect(routes.length).toBeGreaterThan(0);
    const firstId = routes[0].id;
    await service.setBaseline(firstId);
    const comp = await service.comparison();
    expect(comp.length).toBeGreaterThanOrEqual(1);
    expect(comp[0].percentDiff).toBeDefined();
  });
});
