import { PrismaClient } from "@prisma/client";
import { RouteRepository } from "../../../core/ports/RouteRepository";
import { Route } from "../../../core/domain/Route";

export class PrismaRouteRepository implements RouteRepository {
  constructor(private prisma: PrismaClient) {}

  private toDomain(r: any): Route {
    return {
      id: r.id,
      routeId: r.route_id,
      year: r.year,
      vesselType: r.vessel_type,
      fuelType: r.fuel_type,
      ghgIntensity: r.ghg_intensity,
      fuelConsumption: r.fuel_consumption,
      distance: r.distance,
      totalEmissions: r.total_emissions,
      isBaseline: r.is_baseline,
    };
  }

  async getAll(): Promise<Route[]> {
    const records = await this.prisma.route.findMany();
    return records.map(this.toDomain);
  }

  async setBaseline(id: number): Promise<void> {
    // unset previous
    await this.prisma.route.updateMany({ where: { is_baseline: true }, data: { is_baseline: false } });
    await this.prisma.route.update({ where: { id }, data: { is_baseline: true } });
  }

  async getBaseline(): Promise<Route | null> {
    const r = await this.prisma.route.findFirst({ where: { is_baseline: true } });
    return r ? this.toDomain(r) : null;
  }

  async compareWithBaseline(): Promise<Array<{ baseline: Route; comparison: Route; percentDiff: number; compliant: boolean }>> {
    const baseline = await this.getBaseline();
    if (!baseline) return [];
    const others = await this.prisma.route.findMany({ where: { NOT: { id: baseline.id } } });
    const results = others.map((o) => {
      const comp = this.toDomain(o);
      const percentDiff = ((comp.ghgIntensity / baseline.ghgIntensity) - 1) * 100;
      const compliant = percentDiff <= 0; // lower or equal intensity
      return { baseline, comparison: comp, percentDiff, compliant };
    });
    return results;
  }
}
