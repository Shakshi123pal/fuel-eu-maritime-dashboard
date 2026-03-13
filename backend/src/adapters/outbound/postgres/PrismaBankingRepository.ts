import { PrismaClient } from "@prisma/client";
import { BankingRepository } from "../../../core/ports/BankingRepository";
import { BankEntry } from "../../../core/domain/Banking";

export class PrismaBankingRepository implements BankingRepository {
  constructor(private prisma: PrismaClient) {}

  async getBanked(shipId: string, year: number): Promise<number> {
    const agg = await this.prisma.bankEntry.aggregate({
      where: { ship_id: shipId, year },
      _sum: { amount_gco2eq: true },
    });
    return agg._sum.amount_gco2eq || 0;
  }

  async addEntry(entry: BankEntry): Promise<void> {
    await this.prisma.bankEntry.create({ data: { ship_id: entry.shipId, year: entry.year, amount_gco2eq: entry.amount } });
  }

  async applyBank(shipId: string, year: number, amount: number): Promise<void> {
    // store negative entry to reflect application
    await this.prisma.bankEntry.create({ data: { ship_id: shipId, year, amount_gco2eq: -amount } });
  }
}
