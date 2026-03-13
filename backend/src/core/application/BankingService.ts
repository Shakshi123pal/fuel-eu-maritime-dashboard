import { BankingRepository } from "../ports/BankingRepository";
import { ComplianceRepository } from "../ports/ComplianceRepository";

export interface BankResult {
  cb_before: number;
  banked_amount: number;
  cb_after: number;
}

export interface ApplyResult {
  cb_before: number;
  applied: number;
  cb_after: number;
}

export class BankingService {
  constructor(
    private repo: BankingRepository,
    private compliance: ComplianceRepository
  ) {}

  async bank(shipId: string, year: number, amount: number): Promise<BankResult> {
    if (amount <= 0) throw new Error("amount must be positive");
    const rec = await this.compliance.getCB(shipId, year);
    if (!rec || rec.cbGco2eq <= 0) {
      throw new Error("no positive compliance balance to bank");
    }
    const cb_before = rec.cbGco2eq;
    await this.repo.addEntry({ shipId, year, amount });
    const cb_after = cb_before; // CB itself isn't changed by banking
    return { cb_before, banked_amount: amount, cb_after };
  }

  async apply(shipId: string, year: number, amount: number): Promise<ApplyResult> {
    const available = await this.repo.getBanked(shipId, year);
    if (amount > available) throw new Error("insufficient banked balance");
    const rec = await this.compliance.getCB(shipId, year);
    const cb_before = rec ? rec.cbGco2eq : 0;
    await this.repo.applyBank(shipId, year, amount);
    const cb_after = cb_before - amount;
    return { cb_before, applied: amount, cb_after };
  }
}
