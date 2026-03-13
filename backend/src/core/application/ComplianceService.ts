import { ComplianceRepository } from "../ports/ComplianceRepository";

export class ComplianceService {
  constructor(private repo: ComplianceRepository) {}

  async computeCB(shipId: string, year: number, target = 89.3368, energyFactor = 41000) {
    // logic should be implemented outside maybe
    return this.repo.getCB(shipId, year);
  }

  async getAdjustedCB(shipId: string, year: number) {
    return this.repo.getAdjustedCB(shipId, year);
  }
}
