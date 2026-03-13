import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

export const app = express();
app.use(cors());
app.use(express.json());

// routers
import routesRouter from "../../adapters/inbound/http/routes";
import complianceRouter from "../../adapters/inbound/http/compliance";
import bankingRouter from "../../adapters/inbound/http/banking";
import poolsRouter from "../../adapters/inbound/http/pools";

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Fuel EU Backend Running" });
});

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.use(routesRouter);
app.use(complianceRouter);
app.use(bankingRouter);
app.use(poolsRouter);

if (process.argv[1]?.endsWith('server.ts') && process.env.NODE_ENV !== 'test') {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

