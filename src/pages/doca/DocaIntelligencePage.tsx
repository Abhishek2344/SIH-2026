import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Layers,
  Building,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Search,
  Sliders,
  Share2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';

export const DocaIntelligencePage: React.FC = () => {
  const { prices, govStocks, alerts, updateCommodityPrice } = useApp();

  const [selectedCommodity, setSelectedCommodity] = useState<string>('Tomato');
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [newRetailInput, setNewRetailInput] = useState<number>(52);
  const [newWholesaleInput, setNewWholesaleInput] = useState<number>(38);

  // Filter prices by selected commodity
  const currentPriceRecord = prices.find((p) => p.commodity === selectedCommodity) || prices[0];

  // Farm-to-retail price chain data for visual chart
  const priceChainData = prices.map((p) => ({
    commodity: p.commodity,
    farmGate: p.farmGatePrice,
    wholesale: p.wholesalePrice,
    retail: p.retailPrice,
    spread: p.spread,
  }));

  // Historical 7-day trend simulation for the selected commodity
  const trendHistory = [
    { day: 'Day 1', price: currentPriceRecord.farmGatePrice * 1.3 },
    { day: 'Day 2', price: currentPriceRecord.farmGatePrice * 1.35 },
    { day: 'Day 3', price: currentPriceRecord.farmGatePrice * 1.4 },
    { day: 'Day 4', price: currentPriceRecord.farmGatePrice * 1.48 },
    { day: 'Day 5', price: currentPriceRecord.farmGatePrice * 1.55 },
    { day: 'Day 6', price: currentPriceRecord.retailPrice * 0.95 },
    { day: 'Today', price: currentPriceRecord.retailPrice },
  ];

  const handlePriceUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPriceId) {
      updateCommodityPrice(editingPriceId, newRetailInput, newWholesaleInput);
      setEditingPriceId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#0b2238] via-[#133e66] to-[#0b2238] text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-700 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
              DoCA PRICE MONITORING DIVISION (PMD)
            </span>
            <span className="text-xs text-slate-300 font-mono">
              7 ESSENTIAL COMMODITIES MONITORED
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
            Department of Consumer Affairs • Market & Price Intelligence
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Deterministic AI & statistical rule engine detecting abnormal price spreads, supply stress, and logistics bottlenecks before retail consumer spikes occur.
          </p>
        </div>

        {/* Advisory Principle Badge */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700 text-xs text-slate-300 max-w-xs">
          <p className="text-amber-400 font-bold mb-0.5">Policy Safeguard Notice</p>
          <p className="text-[11px] leading-snug">
            The platform does NOT accuse market participants or automate policy decisions. Anomaly signals are flagged for human review by authorised officials.
          </p>
        </div>
      </div>

      {/* 2. Early Warning Anomaly Radar (Section 19, 20 & 21) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
              <span>Active Commodity Anomalies & Supply Stress Warnings</span>
            </h3>
            <p className="text-xs text-slate-500">
              Statistical deviation flags requiring inspector verification
            </p>
          </div>
          <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-3 py-1 rounded">
            {alerts.length} Flagged Anomalies
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-5 rounded-2xl border transition shadow-sm space-y-3 ${
                alert.severity === 'High Alert'
                  ? 'bg-rose-50/60 border-rose-300 text-rose-950'
                  : 'bg-amber-50/60 border-amber-300 text-amber-950'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-75">
                    {alert.alertType} • {alert.district}
                  </span>
                  <h4 className="text-lg font-black leading-tight mt-0.5">
                    {alert.commodity}
                  </h4>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    alert.severity === 'High Alert'
                      ? 'bg-rose-600 text-white'
                      : 'bg-amber-600 text-white'
                  }`}
                >
                  {alert.severity}
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between font-semibold">
                  <span>Current Retail Price:</span>
                  <span className="font-bold text-sm">₹{alert.currentPrice}/kg</span>
                </div>
                <div className="flex justify-between">
                  <span>Benchmark Baseline:</span>
                  <span>₹{alert.benchmarkPrice}/kg</span>
                </div>
                <div className="flex justify-between font-bold text-rose-700">
                  <span>Deviation:</span>
                  <span>+{alert.percentageDeviation}% in 24h</span>
                </div>
              </div>

              <p className="text-[11px] leading-relaxed pt-2 border-t border-slate-300/60">
                {alert.anomalyReason}
              </p>

              <div className="pt-2 flex justify-between items-center text-[10px] font-bold uppercase opacity-80">
                <span>Status: {alert.status}</span>
                <span>Requires DMO Review</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Farm-to-Retail Price Spread Chain (Section 20 Requirement) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Farm-to-Retail Price Spread Chain (₹ / kg)
              </h3>
              <p className="text-xs text-slate-500">
                Tracking value chain margins: Farm-gate MSP → Wholesale APMC → Retail Counter
              </p>
            </div>
            <span className="text-xs font-mono font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded">
              Intermediary Margin Radar
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priceChainData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="commodity" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} unit="₹" />
                <Tooltip
                  formatter={(val: any) => [`₹${val}/kg`, '']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="farmGate" name="Farm-Gate Price (₹/kg)" fill="#15803d" radius={[2, 2, 0, 0]} />
                <Bar dataKey="wholesale" name="Wholesale APMC (₹/kg)" fill="#0284c7" radius={[2, 2, 0, 0]} />
                <Bar dataKey="retail" name="Consumer Retail (₹/kg)" fill="#d97706" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Commodity Deep-Dive Selector */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900">Commodity Inspector</h3>
              <select
                value={selectedCommodity}
                onChange={(e) => setSelectedCommodity(e.target.value)}
                className="px-2 py-1 rounded-lg border border-slate-200 text-xs font-bold bg-slate-50 text-slate-800"
              >
                {prices.map((p) => (
                  <option key={p.id} value={p.commodity}>
                    {p.commodity} ({p.district})
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Mandi Name:</span>
                <span className="font-bold text-slate-900">{currentPriceRecord.mandiName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Daily Arrivals:</span>
                <span className="font-semibold text-slate-800">
                  {currentPriceRecord.dailyArrivalQuintals} Quintals
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Farm-Gate Rate:</span>
                <span className="font-bold text-emerald-700">₹{currentPriceRecord.farmGatePrice}/kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Retail Rate:</span>
                <span className="font-bold text-slate-900">₹{currentPriceRecord.retailPrice}/kg</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span className="font-bold text-slate-700">Price Spread Markup:</span>
                <span className="font-mono font-black text-rose-700 text-sm">
                  ₹{currentPriceRecord.spread}/kg
                </span>
              </div>
            </div>

            {/* Test Simulation Trigger */}
            <div className="mt-4">
              <button
                onClick={() => {
                  setEditingPriceId(currentPriceRecord.id);
                  setNewRetailInput(currentPriceRecord.retailPrice + 8);
                  setNewWholesaleInput(currentPriceRecord.wholesalePrice + 4);
                }}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg text-xs transition text-center"
              >
                Simulate Price Spike (+₹8/kg)
              </button>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            * Source: DoCA Price Monitoring Division (PMD) & Agmarknet Integrated Gateway
          </div>
        </div>
      </div>

      {/* 4. Government Buffer Stock Intelligence & Redistribution Support (Section 22 & 23) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Central & State Buffer Stock Intelligence (FCI / CWC Godowns)
            </h3>
            <p className="text-xs text-slate-500">
              Capacity utilization, stock age, condition rating, and regional balancing recommendations
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded">
            Redistribution Decision Support Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {govStocks.map((stock) => (
            <div
              key={stock.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2.5"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {stock.commodity} • {stock.district}, {stock.state}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm leading-snug mt-0.5">
                    {stock.warehouseName}
                  </h4>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  {stock.conditionRating}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Stock Available:</span>
                  <span className="font-bold text-slate-900">
                    {stock.currentStockMt.toLocaleString('en-IN')} MT / {stock.capacityMt.toLocaleString('en-IN')} MT
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      stock.utilizationPct > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${stock.utilizationPct}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Utilization: {stock.utilizationPct}%</span>
                  <span>Avg Age: {stock.averageStockAgeDays} days</span>
                </div>
              </div>

              {/* Redistribution Opportunity (Section 23) */}
              {stock.utilizationPct > 80 && (
                <div className="mt-2 p-2 rounded bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-snug">
                  <strong>Redistribution Opportunity:</strong> High warehouse utilization in {stock.district}. Recommended for transfer to low-stock eastern buffer depots upon official review.
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Price Simulation Modal */}
      {editingPriceId && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 text-xs animate-in fade-in zoom-in-95">
            <h3 className="text-sm font-bold text-slate-900">
              Simulate Price Movement & Anomaly Trigger
            </h3>
            <p className="text-slate-500">
              Testing the prototype deterministic analytics engine (Section 19). Sudden price spikes will trigger automated flags.
            </p>

            <form onSubmit={handlePriceUpdateSubmit} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  New Retail Price (₹ / kg)
                </label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={newRetailInput}
                  onChange={(e) => setNewRetailInput(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 font-bold text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  New Wholesale Price (₹ / kg)
                </label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={newWholesaleInput}
                  onChange={(e) => setNewWholesaleInput(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingPriceId(null)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded-lg shadow-sm"
                >
                  Simulate & Re-evaluate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
