import { Route } from "../domain/Route";

export interface RouteRepository {
  getAll(): Promise<Route[]>;
  setBaseline(id: number): Promise<void>;
  getBaseline(): Promise<Route | null>;
  compareWithBaseline(): Promise<Array<{
    baseline: Route;
    comparison: Route;
    percentDiff: number;
    compliant: boolean;
  }>>;
}
