export interface Route {
  id: number;
  routeId: string;
  year: number;
  vesselType: string;
  fuelType: string;
  ghgIntensity: number;
  fuelConsumption: number;
  distance: number;
  totalEmissions: number;
  isBaseline: boolean;
}

