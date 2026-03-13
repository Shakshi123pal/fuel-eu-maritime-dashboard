import { ShipCompliance } from "../domain/Compliance";

export interface ComplianceRepository {
  getCB(shipId: string, year: number): Promise<ShipCompliance | null>;
  storeCB(record: ShipCompliance): Promise<void>;
  getAdjustedCB(shipId: string, year: number): Promise<number>;
}
