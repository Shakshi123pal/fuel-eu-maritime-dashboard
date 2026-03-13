import { PrismaClient } from "@prisma/client";
import { PoolRepository } from "../../../core/ports/PoolRepository";
import { PoolMember } from "../../../core/domain/Pooling";

export class PrismaPoolRepository implements PoolRepository {
  constructor(private prisma: PrismaClient) {}

  async createPool(year: number, members: PoolMember[]) {
    const pool = await this.prisma.pool.create({
      data: {
        year,
        members: {
          create: members.map((m) => ({ ship_id: m.shipId, cb_before: m.cbBefore, cb_after: m.cbAfter })),
        },
      },
      include: { members: true },
    });
    return {
      poolId: pool.id,
      year: pool.year,
      members: pool.members.map((m) => ({ shipId: m.ship_id, cbBefore: m.cb_before, cbAfter: m.cb_after })),
    };
  }
}
