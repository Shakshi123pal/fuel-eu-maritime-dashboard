import { Pool, PoolMember } from "../domain/Pooling";

export interface PoolRepository {
  createPool(year: number, members: PoolMember[]): Promise<Pool>;
}
