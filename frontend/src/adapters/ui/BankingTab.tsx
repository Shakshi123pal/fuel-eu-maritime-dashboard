import { useState } from 'react';
import axios from 'axios';

const SHIP_OPTIONS = ['R001', 'R002', 'R003', 'R004', 'R005'];

type BankResult = {
  shipId: string;
  year: number;
  cbBefore: number;
  bankedAmount: number;
  cbAfter: number;
};

const BankingTab = () => {
  const [shipId, setShipId] = useState(SHIP_OPTIONS[0]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [cb, setCb] = useState<number | null>(null);
  const [banked, setBanked] = useState<BankResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bankAmount, setBankAmount] = useState(0);

  const fetchCompliance = async () => {
    try {
      setLoading(true);
      setError(null);
      setBanked(null);
      const res = await axios.get<{ shipId: string; year: number; cbGco2eq: number }>(
        `http://localhost:3000/compliance/cb?shipId=${encodeURIComponent(shipId)}&year=${year}`,
      );
      setCb(res.data.cbGco2eq);
    } catch (e: any) {
      setError(e?.response?.data?.error || e?.message || 'Failed to load compliance balance');
      setCb(null);
    } finally {
      setLoading(false);
    }
  };

  const bankSurplus = async () => {
    if (cb === null) return;
    try {
      setLoading(true);
      setError(null);
      const res = await axios.post<BankResult>('http://localhost:3000/banking/bank', {
        shipId,
        year,
        amount: bankAmount,
      });
      setBanked(res.data);
      setCb(res.data.cbAfter);
    } catch (e: any) {
      setError(e?.response?.data?.error || e?.message || 'Failed to bank surplus');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold">Banking</h2>
        <p className="text-gray-600">Manage CB banking operations.</p>
      </div>

      {error ? (
        <div className="mt-4 rounded border border-red-200 bg-red-50 p-3 text-red-700">{error}</div>
      ) : null}

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="space-y-2 rounded border border-gray-200 bg-gray-50 p-4">
          <h3 className="text-lg font-semibold">Query Compliance Balance</h3>
          <label className="block text-sm font-medium text-gray-700">Ship</label>
          <select
            value={shipId}
            onChange={(e) => setShipId(e.target.value)}
            className="mt-1 w-full rounded border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            {SHIP_OPTIONS.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>

          <label className="block text-sm font-medium text-gray-700">Year</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="mt-1 w-full rounded border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />

          <button
            onClick={fetchCompliance}
            disabled={loading}
            className="mt-4 w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Get Compliance Balance
          </button>

          {cb !== null && (
            <div className="mt-4 rounded border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
              <div className="font-semibold">Compliance Balance</div>
              <div className="mt-1">{cb.toFixed(2)} gCO₂e</div>
            </div>
          )}
        </div>

        <div className="space-y-2 rounded border border-gray-200 bg-gray-50 p-4">
          <h3 className="text-lg font-semibold">Bank Surplus</h3>
          <label className="block text-sm font-medium text-gray-700">Amount to bank (positive)</label>
          <input
            type="number"
            min={0}
            value={bankAmount}
            onChange={(e) => setBankAmount(Number(e.target.value))}
            className="mt-1 w-full rounded border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />

          <button
            onClick={bankSurplus}
            disabled={loading || cb === null || cb <= 0 || bankAmount <= 0}
            className="mt-4 w-full rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Bank Surplus
          </button>

          {banked && (
            <div className="mt-4 rounded border border-green-200 bg-green-50 p-3 text-sm text-green-800">
              <div className="font-semibold">Bank Result</div>
              <div className="mt-2 grid gap-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">cb_before</span>
                  <span>{banked.cbBefore.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">banked_amount</span>
                  <span>{banked.bankedAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">cb_after</span>
                  <span>{banked.cbAfter.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BankingTab;
