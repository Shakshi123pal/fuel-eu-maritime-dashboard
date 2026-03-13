import { BankEntry } from "../domain/Banking";

export interface BankingRepository {
  getBanked(shipId: string, year: number): Promise<number>;
  addEntry(entry: BankEntry): Promise<void>;
  applyBank(shipId: string, year: number, amount: number): Promise<void>;
}
