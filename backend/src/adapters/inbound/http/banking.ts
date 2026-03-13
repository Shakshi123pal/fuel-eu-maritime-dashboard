import { Router, Request, Response } from "express";
import prisma from "../../../infrastructure/db/prismaClient";
import { PrismaBankingRepository } from "../../outbound/postgres/PrismaBankingRepository";
import { BankingService } from "../../../core/application/BankingService";
import { PrismaComplianceRepository } from "../../outbound/postgres/PrismaComplianceRepository";

const repo = new PrismaBankingRepository(prisma);
const complianceRepo = new PrismaComplianceRepository(prisma);
const service = new BankingService(repo, complianceRepo);

const router = Router();

router.get("/banking/records", async (req: Request, res: Response) => {
  const shipId = req.query.shipId as string;
  const year = parseInt(req.query.year as string, 10);
  const entries = await prisma.bankEntry.findMany({ where: { ship_id: shipId, year } });
  res.json(entries);
});

router.post("/banking/bank", async (req: Request, res: Response) => {
  const { shipId, year, amount } = req.body;
  try {
    const result = await service.bank(shipId, year, amount);
    res.status(201).json(result);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

router.post("/banking/apply", async (req: Request, res: Response) => {
  const { shipId, year, amount } = req.body;
  try {
    const result = await service.apply(shipId, year, amount);
    res.status(201).json(result);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
