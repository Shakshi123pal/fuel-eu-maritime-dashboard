export interface PoolMember {
  shipId: string;
  cbBefore: number;
  cbAfter: number;
}

export interface Pool {
  poolId?: number;
  year: number;
  members: PoolMember[];
}

