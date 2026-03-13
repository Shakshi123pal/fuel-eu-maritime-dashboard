import request from 'supertest';
import { app } from '../infrastructure/server/server';
import prisma from '../infrastructure/db/prismaClient';

describe('HTTP routes', () => {
  beforeAll(async () => {
    await prisma.$connect();
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

  it('GET /routes returns data', async () => {
    const res = await request(app).get('/routes');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });

  it('POST /routes/:id/baseline sets baseline', async () => {
    const routes = await prisma.route.findMany();
    const id = routes[1].id;
    const res = await request(app).post(`/routes/${id}/baseline`);
    expect(res.status).toBe(204);
    const updated = await prisma.route.findUnique({ where: { id } });
    expect(updated?.is_baseline).toBe(true);
  });
});
