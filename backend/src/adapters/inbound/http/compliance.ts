import { Router, Request, Response } from "express";
import prisma from "../../../infrastructure/db/prismaClient";
import { PrismaComplianceRepository } from "../../outbound/postgres/PrismaComplianceRepository";
import { ComplianceService } from "../../../core/application/ComplianceService";
import { PrismaRouteRepository } from "../../outbound/postgres/PrismaRouteRepository";

const complianceRepo = new PrismaComplianceRepository(prisma);
const service = new ComplianceService(complianceRepo);
const routeRepo = new PrismaRouteRepository(prisma);

const router = Router();

// GET /compliance/cb?shipId=&year=
router.get("/compliance/cb", async (req: Request, res: Response) => {
  const shipId = req.query.shipId as string;
  const year = parseInt(req.query.year as string, 10);
  // compute if not exists
  let record = await complianceRepo.getCB(shipId, year);
  if (!record) {
    // simple computation using route data for shipId == route_id
    const route = await prisma.route.findFirst({ where: { route_id: shipId, year } });
    if (!route) {
      return res.status(404).json({ error: "route not found" });
    }
    const target = 89.3368;
    const energy = route.fuel_consumption * 41000;
    const cb = (target - route.ghg_intensity) * energy;
    record = { shipId, year, cbGco2eq: cb };
    await complianceRepo.storeCB(record);
  }
  res.json(record);
});

router.get("/compliance/adjusted-cb", async (req: Request, res: Response) => {
  const shipId = req.query.shipId as string;
  const year = parseInt(req.query.year as string, 10);
  const adjusted = await complianceRepo.getAdjustedCB(shipId, year);
  res.json({ shipId, year, adjusted });
});

export default router;
