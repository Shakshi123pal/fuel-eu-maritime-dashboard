import { useMemo, useState } from 'react';
import axios from 'axios';

const SHIP_OPTIONS = ['R001', 'R002', 'R003', 'R004', 'R005'];

type PoolMember = {
  shipId: string;
  cbBefore: number;
  cbAfter: number;
};

type PoolResult = {
  poolId: number;
  year: number;
  members: PoolMember[];
};

const PoolingTab = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [selected, setSelected] = useState<string[]>([SHIP_OPTIONS[0]]);
  const [result, setResult] = useState<PoolResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalCb = useMemo(() => {
    if (!result) return 0;
    return result.members.reduce((acc, m) => acc + m.cbAfter, 0);
  }, [result]);

  const validPool = useMemo(() => totalCb >= 0, [totalCb]);

  const toggleShip = (shipId: string) => {
    setSelected((prev) =>
      prev.includes(shipId) ? prev.filter((s) => s !== shipId) : [...prev, shipId],
    );
  };

  const submitPool = async () => {
    if (selected.length === 0) {
      setError('Select at least one ship.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResult(null);
      const res = await axios.post<PoolResult>('http://localhost:3000/pools', {
        year,
        ships: selected.map((shipId) => ({ shipId })),
      });
      setResult(res.data);
    } catch (e: any) {
      setError(e?.response?.data?.error || e?.message || 'Failed to create pool');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold">Pooling</h2>
        <p className="text-gray-600">Create and manage CB pooling.</p>
      </div>

      {error ? (
        <div className="mt-4 rounded border border-red-200 bg-red-50 p-3 text-red-700">{error}</div>
      ) : null}

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="space-y-2 rounded border border-gray-200 bg-gray-50 p-4">
          <h3 className="text-lg font-semibold">Pool configuration</h3>

          <label className="block text-sm font-medium text-gray-700">Year</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="mt-1 w-full rounded border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />

          <label className="block text-sm font-medium text-gray-700">Ships</label>
          <div className="mt-1 space-y-2">
            {SHIP_OPTIONS.map((id) => (
              <label key={id} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selected.includes(id)}
                  onChange={() => toggleShip(id)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{id}</span>
              </label>
            ))}
          </div>

          <button
            onClick={submitPool}
            disabled={loading || selected.length === 0}
            className="mt-4 w-full rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Create Pool
          </button>

          {result ? (
            <div className="mt-4 rounded border border-gray-200 bg-white p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Pool Summary</span>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                    validPool ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {validPool ? 'Valid pool ✅' : 'Invalid pool ❌'}
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Total CB (after): <span className="font-medium">{totalCb.toFixed(2)}</span>
              </div>
            </div>
          ) : null}
        </div>

        {result ? (
          <div className="lg:col-span-2">
            <div className="overflow-x-auto rounded border border-gray-200 bg-white">
              <table className="w-full min-w-[600px] divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Ship ID</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">CB Before</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">CB After</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {result.members.map((m) => (
                    <tr key={m.shipId}>
                      <td className="px-4 py-3 text-sm text-gray-800">{m.shipId}</td>
                      <td className="px-4 py-3 text-right text-sm text-gray-700">{m.cbBefore.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right text-sm text-gray-700">{m.cbAfter.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default PoolingTab;
