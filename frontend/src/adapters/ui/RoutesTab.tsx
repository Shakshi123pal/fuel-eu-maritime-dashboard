import { useEffect, useState } from 'react';
import axios from 'axios';

type Route = {
  id: number;
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;
  fuelConsumption: number;
  distance: number;
  totalEmissions: number;
  isBaseline: boolean;
};

const RoutesTab = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRoutes = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get<Route[]>('http://localhost:3000/routes');
      setRoutes(res.data);
    } catch (e: any) {
      setError(e?.message || 'Failed to load routes');
    } finally {
      setLoading(false);
    }
  };

  const setBaseline = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await axios.post(`http://localhost:3000/routes/${id}/baseline`);
      await loadRoutes();
    } catch (e: any) {
      setError(e?.message || 'Failed to set baseline');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoutes();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold">Routes</h2>
        <p className="text-gray-600">Manage and view maritime routes.</p>
      </div>

      {error ? (
        <div className="mt-4 rounded border border-red-200 bg-red-50 p-3 text-red-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="mt-6 text-gray-600">Loading routes…</div>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[800px] divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Route ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Vessel</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Fuel</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Year</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">GHG</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">Fuel Cons.</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">Distance</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">Emissions</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">Baseline</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {routes.map((route) => (
                <tr key={route.id} className={route.isBaseline ? 'bg-blue-50' : ''}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{route.routeId}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{route.vesselType}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{route.fuelType}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{route.year}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-700">{route.ghgIntensity.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-700">{route.fuelConsumption.toFixed(0)}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-700">{route.distance.toFixed(0)}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-700">{route.totalEmissions.toFixed(0)}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-700">
                    {route.isBaseline ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                        Baseline
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700">
                        —
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setBaseline(route.id)}
                      className="inline-flex items-center rounded bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={route.isBaseline || loading}
                    >
                      Set Baseline
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RoutesTab;
