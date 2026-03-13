import { RouteRepository } from "../ports/RouteRepository";

export class RouteService {
  constructor(private repo: RouteRepository) {}

  async listRoutes() {
    return this.repo.getAll();
  }

  async setBaseline(id: number) {
    await this.repo.setBaseline(id);
  }

  async comparison() {
    return this.repo.compareWithBaseline();
  }
}
