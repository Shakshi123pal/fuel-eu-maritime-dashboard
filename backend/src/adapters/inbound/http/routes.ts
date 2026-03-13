import { Router, Request, Response } from "express";
import prisma from "../../../infrastructure/db/prismaClient";
import { PrismaRouteRepository } from "../../outbound/postgres/PrismaRouteRepository";
import { RouteService } from "../../../core/application/RouteService";

const repo = new PrismaRouteRepository(prisma);
const service = new RouteService(repo);

const router = Router();

router.get("/routes", async (req: Request, res: Response) => {
  const list = await service.listRoutes();
  res.json(list);
});

router.post("/routes/:id/baseline", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  await service.setBaseline(id);
  res.status(204).send();
});

router.get("/routes/comparison", async (req: Request, res: Response) => {
  const comp = await service.comparison();
  res.json(comp);
});

export default router;
