import { PrismaClient } from "@prisma/client";
import { ComplianceRepository } from "../../../core/ports/ComplianceRepository";
import { ShipCompliance } from "../../../core/domain/Compliance";

export class PrismaComplianceRepository implements ComplianceRepository {
  constructor(private prisma: PrismaClient) {}

  async getCB(shipId: string, year: number): Promise<ShipCompliance | null> {
    const rec = await this.prisma.shipCompliance.findFirst({ where: { ship_id: shipId, year } });
    if (rec) {
      return { shipId: rec.ship_id, year: rec.year, cbGco2eq: rec.cb_gco2eq };
    }

    // If no stored record exists, compute CB from route data (FuelEU formula)
    const route = await this.prisma.route.findFirst({ where: { route_id: shipId, year } });
    if (!route) {
      return null;
    }

    const TARGET = 89.3368;
    const energy = route.fuel_consumption * 41000;
    const cb = (TARGET - route.ghg_intensity) * energy;

    const stored = await this.prisma.shipCompliance.create({
      data: { ship_id: shipId, year, cb_gco2eq: cb },
    });

    return { shipId: stored.ship_id, year: stored.year, cbGco2eq: stored.cb_gco2eq };
  }

  async storeCB(record: ShipCompliance): Promise<void> {
    await this.prisma.shipCompliance.create({ data: { ship_id: record.shipId, year: record.year, cb_gco2eq: record.cbGco2eq } });
  }

  async getAdjustedCB(shipId: string, year: number): Promise<number> {
    // naive: cb + sum(bank entries) - sum(applied)
    const cbRec = await this.prisma.shipCompliance.findFirst({ where: { ship_id: shipId, year } });
    const cb = cbRec ? cbRec.cb_gco2eq : 0;
    const bank = await this.prisma.bankEntry.aggregate({
      where: { ship_id: shipId, year },
      _sum: { amount_gco2eq: true },
    });
    const amount = bank._sum.amount_gco2eq || 0;
    return cb + amount;
  }
}
