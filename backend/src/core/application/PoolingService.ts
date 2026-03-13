import { PoolRepository } from "../ports/PoolRepository";
import { PoolMember } from "../domain/Pooling";

export class PoolingService {
  constructor(private repo: PoolRepository) {}

  async create(year: number, members: PoolMember[]) {
    const sum = members.reduce((acc, m) => acc + m.cbBefore, 0);
    if (sum < 0) {
      throw new Error("total CB must be non-negative");
    }

    const surpluses = members.filter(m => m.cbBefore > 0).sort((a, b) => b.cbBefore - a.cbBefore);
    const deficits = members.filter(m => m.cbBefore < 0).sort((a, b) => a.cbBefore - b.cbBefore); // most negative first

    const result = new Map<string, number>();
    members.forEach(m => result.set(m.shipId, m.cbBefore));

    let surplusIndex = 0;
    for (const def of deficits) {
      let needed = -def.cbBefore; // amount to cover deficit
      while (needed > 0 && surplusIndex < surpluses.length) {
        const sur = surpluses[surplusIndex];
        const available = result.get(sur.shipId)!;
        const transfer = Math.min(needed, available);
        result.set(sur.shipId, available - transfer);
        result.set(def.shipId, def.cbBefore + transfer);
        needed -= transfer;
        if (result.get(sur.shipId)! <= 0) surplusIndex++;
      }
      if (needed > 0) {
        throw new Error("unable to cover deficit");
      }
    }

    // enforce rules
    for (const m of members) {
      const after = result.get(m.shipId)!;
      if (m.cbBefore < 0 && after < m.cbBefore) {
        throw new Error("deficit ship exits worse");
      }
      if (m.cbBefore > 0 && after < 0) {
        throw new Error("surplus ship becomes negative");
      }
    }

    const finalMembers = members.map(m => ({ shipId: m.shipId, cbBefore: m.cbBefore, cbAfter: result.get(m.shipId)! }));
    return this.repo.createPool(year, finalMembers);
  }
}
