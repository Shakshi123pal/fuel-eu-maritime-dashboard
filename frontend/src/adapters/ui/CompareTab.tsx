import { useEffect, useState } from 'react';
import axios from 'axios';

type ComparisonRow = {
  baseline: {
    routeId: string;
    ghgIntensity: number;
  };
  comparison: {
    routeId: string;
    ghgIntensity: number;
  };
  percentDiff: number;
  compliant: boolean;
};

const CompareTab = () => {
  const [rows, setRows] = useState<ComparisonRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadComparison = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get<ComparisonRow[]>('http://localhost:3000/routes/comparison');
      setRows(res.data);
    } catch (e: any) {
      setError(e?.message || 'Failed to load comparison');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComparison();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold">Compare</h2>
        <p className="text-gray-600">Compare routes and compliance data.</p>
      </div>

      {error ? (
        <div className="mt-4 rounded border border-red-200 bg-red-50 p-3 text-red-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="mt-6 text-gray-600">Loading comparison…</div>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[800px] divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Baseline ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Comparison ID</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">Baseline GHG</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">Comparison GHG</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">% Diff</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">Compliant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {rows.map((row, index) => (
                <tr key={`${row.baseline.routeId}-${row.comparison.routeId}-${index}`}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{row.baseline.routeId}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.comparison.routeId}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-700">{row.baseline.ghgIntensity.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-700">{row.comparison.ghgIntensity.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-700">{row.percentDiff.toFixed(2)}%</td>
                  <td className="px-4 py-3 text-sm text-right">
                    {row.compliant ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">✅</span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-800">❌</span>
                    )}
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

export default CompareTab;
