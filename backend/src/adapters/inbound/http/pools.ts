import { Router, Request, Response } from "express";
import prisma from "../../../infrastructure/db/prismaClient";
import { PrismaPoolRepository } from "../../outbound/postgres/PrismaPoolRepository";
import { PoolingService } from "../../../core/application/PoolingService";
import { PrismaComplianceRepository } from "../../outbound/postgres/PrismaComplianceRepository";

const poolRepo = new PrismaPoolRepository(prisma);
const complianceRepo = new PrismaComplianceRepository(prisma);
const service = new PoolingService(poolRepo);

const router = Router();

router.post("/pools", async (req: Request, res: Response) => {
  const { year, ships } = req.body;
  if (!Array.isArray(ships) || ships.length === 0) {
    return res.status(400).json({ error: "ships must be a non-empty array" });
  }
  for (const ship of ships) {
    if (!ship.shipId || typeof ship.shipId !== 'string') {
      return res.status(400).json({ error: "each ship must have a shipId string" });
    }
  }
  try {
    const members = [];
    for (const ship of ships) {
      const cbBefore = await complianceRepo.getAdjustedCB(ship.shipId, year);
      members.push({ shipId: ship.shipId, cbBefore, cbAfter: 0 }); // cbAfter will be set by service
    }
    const pool = await service.create(year, members);
    res.status(201).json(pool);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
