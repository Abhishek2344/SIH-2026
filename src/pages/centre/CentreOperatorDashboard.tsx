import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DigitalReceiptModal } from '../../components/receipt/DigitalReceiptModal';
import { QueueToken, QueueTokenStatus, ProcurementTransaction } from '../../types';
import {
  Scale,
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  FileCheck,
  ChevronRight,
  ShieldCheck,
  Building2,
  X,
} from 'lucide-react';

interface CentreOperatorDashboardProps {
  setActiveTab: (tab: string) => void;
}

export const CentreOperatorDashboard: React.FC<CentreOperatorDashboardProps> = ({ setActiveTab }) => {
  const {
    currentUser,
    centres,
    tokens,
    advanceQueueToken,
    completeProcurement,
    transactions,
  } = useApp();

  // Active centre is Jaipur Central Mandi
  const centre = centres[0];

  const [selectedTokenForIntake, setSelectedTokenForIntake] = useState<QueueToken | null>(null);
  const [moisturePct, setMoisturePct] = useState<number>(11.2);
  const [foreignMatterPct, setForeignMatterPct] = useState<number>(0.35);
  const [grossWeightKg, setGrossWeightKg] = useState<number>(13240);
  const [tareWeightKg, setTareWeightKg] = useState<number>(12040);
  const [qualityGrade, setQualityGrade] = useState<string>('Grade A');
  const [generatedTxn, setGeneratedTxn] = useState<ProcurementTransaction | null>(null);

  const bookedCount = centre.todayBookingsCount || 274;
  const capacity = centre.dailyFarmerCapacity;
  const remaining = capacity - bookedCount;
  const loadPct = Math.round((bookedCount / capacity) * 100);

  const getLoadBadge = () => {
    if (loadPct >= 95) {
      return { label: 'Over Capacity', bg: 'bg-rose-100 text-rose-800 border-rose-200' };
    }
    if (loadPct >= 75) {
      return { label: 'Near Capacity (Active Throttling)', bg: 'bg-amber-100 text-amber-800 border-amber-200' };
    }
    return { label: 'Normal Flow', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
  };

  const loadBadge = getLoadBadge();

  const handleAdvance = (token: QueueToken, targetStatus: QueueTokenStatus) => {
    advanceQueueToken(token.id, targetStatus);
  };

  const handleOpenIntakeModal = (token: QueueToken) => {
    setSelectedTokenForIntake(token);
    // Prefill weights based on quantity
    const netKg = (token.quantityQuintals || 12) * 100;
    setTareWeightKg(12000);
    setGrossWeightKg(12000 + netKg);
  };

  const handleFinalizeIntake = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTokenForIntake) return;

    const netKg = grossWeightKg - tareWeightKg;
    const netQuintals = Number((netKg / 100).toFixed(2));

    const txn = completeProcurement({
      bookingId: selectedTokenForIntake.bookingId,
      tokenId: selectedTokenForIntake.id,
      farmerId: selectedTokenForIntake.farmerId,
      centreId: centre.id,
      cropId: 'wheat',
      quantityQuintals: netQuintals,
      mspRate: 2425,
      qualityGrade,
      moisturePct,
      foreignMatterPct,
      grossWeightKg,
      tareWeightKg,
    });

    setSelectedTokenForIntake(null);
    setGeneratedTxn(txn);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* 1. Header & Centre Identity */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
              MANDI OPERATIONAL CONSOLE
            </span>
            <span className="font-mono text-xs font-semibold text-slate-500">
              {centre.code} • 6 Active Electronic Bays
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            {centre.name}
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Centre Supervisor: {centre.centreManagerName} • Contact: {centre.contactNumber} • {centre.mandiLocation}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1.5 rounded-xl font-bold text-xs border ${loadBadge.bg}`}>
            {loadBadge.label} ({loadPct}%)
          </span>
        </div>
      </div>

      {/* 2. Centre Capacity & Wait Time KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-slate-400 text-[10px] uppercase font-bold">Daily Capacity</p>
          <p className="text-2xl font-black text-slate-900 mt-0.5">{capacity}</p>
          <p className="text-[10px] text-slate-500">farmers/day</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-slate-400 text-[10px] uppercase font-bold">Today's Bookings</p>
          <p className="text-2xl font-black text-blue-700 mt-0.5">{bookedCount}</p>
          <p className="text-[10px] text-slate-500">{remaining} slots left</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-slate-400 text-[10px] uppercase font-bold">Arrived At Yard</p>
          <p className="text-2xl font-black text-amber-600 mt-0.5">{centre.todayArrivedCount || 198}</p>
          <p className="text-[10px] text-slate-500">vehicles in holding</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-slate-400 text-[10px] uppercase font-bold">Completed Intake</p>
          <p className="text-2xl font-black text-emerald-600 mt-0.5">{centre.todayCompletedCount || 165}</p>
          <p className="text-[10px] text-slate-500">vouchers issued</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-slate-400 text-[10px] uppercase font-bold">Average Wait</p>
          <p className="text-2xl font-black text-slate-800 mt-0.5">~38m</p>
          <p className="text-[10px] text-emerald-600 font-semibold">↓ 22% vs baseline</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-slate-400 text-[10px] uppercase font-bold">Process Speed</p>
          <p className="text-2xl font-black text-slate-800 mt-0.5">4.2m</p>
          <p className="text-[10px] text-slate-500">per weighment bay</p>
        </div>
      </div>

      {/* 3. Live Token Queue Controller & Action Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Live Queue Dispatcher & Weighbridge Operator Desk</span>
            </h3>
            <p className="text-xs text-slate-500">
              Advance tokens to update yard display boards and farmer mobile notifications in real time
            </p>
          </div>

          <span className="text-xs font-mono font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded">
            {tokens.filter((t) => t.status !== 'COMPLETED').length} active in yard
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <th className="py-3 px-4">Token No.</th>
                <th className="py-3 px-4">Farmer Name</th>
                <th className="py-3 px-4">Crop & Declared Qty</th>
                <th className="py-3 px-4">Queue State</th>
                <th className="py-3 px-4">Timeline</th>
                <th className="py-3 px-4 text-right">Operator Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tokens.map((token) => (
                <tr
                  key={token.id}
                  className={`hover:bg-slate-50 transition ${
                    token.tokenNumber === 'A-124' ? 'bg-amber-50/40' : ''
                  }`}
                >
                  <td className="py-3.5 px-4 font-mono font-black text-sm text-slate-900">
                    {token.tokenNumber}
                    {token.tokenNumber === 'A-124' && (
                      <span className="block text-[9px] font-sans font-bold text-amber-700 uppercase">
                        SIH Benchmark
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-800">{token.farmerName}</p>
                    <p className="text-[11px] text-slate-400 font-mono">ID: {token.farmerId}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-900">{token.cropName}</span>
                    <span className="block text-slate-500 text-[11px]">
                      {token.quantityQuintals} Quintals declared
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        token.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : token.status === 'WEIGHING'
                          ? 'bg-purple-100 text-purple-800'
                          : token.status === 'IN_VERIFICATION'
                          ? 'bg-blue-100 text-blue-800'
                          : token.status === 'CALLED'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {token.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                    {token.calledAt ? `Called: ${new Date(token.calledAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}` : 'Waiting'}
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1">
                    {token.status === 'WAITING' && (
                      <button
                        onClick={() => handleAdvance(token, 'CALLED')}
                        className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] rounded transition shadow-sm"
                      >
                        Call to Bay
                      </button>
                    )}

                    {token.status === 'CALLED' && (
                      <button
                        onClick={() => handleAdvance(token, 'IN_VERIFICATION')}
                        className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] rounded transition shadow-sm"
                      >
                        Start Assaying
                      </button>
                    )}

                    {token.status === 'IN_VERIFICATION' && (
                      <button
                        onClick={() => handleAdvance(token, 'WEIGHING')}
                        className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] rounded transition shadow-sm"
                      >
                        Move to Weighbridge
                      </button>
                    )}

                    {token.status === 'WEIGHING' && (
                      <button
                        onClick={() => handleOpenIntakeModal(token)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded transition shadow-sm"
                      >
                        Complete Intake
                      </button>
                    )}

                    {token.status === 'COMPLETED' && (
                      <span className="text-[11px] font-semibold text-emerald-700 px-2 py-1">
                        ✓ Dispatched
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Complete Intake & Weighbridge Assaying Modal */}
      {selectedTokenForIntake && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Record Weighment & Assaying Inspection
                </h3>
                <p className="text-[11px] text-slate-500">
                  Token: {selectedTokenForIntake.tokenNumber} • {selectedTokenForIntake.farmerName}
                </p>
              </div>
              <button
                onClick={() => setSelectedTokenForIntake(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFinalizeIntake} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Gross Vehicle Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="10"
                    required
                    value={grossWeightKg}
                    onChange={(e) => setGrossWeightKg(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tare Empty Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="10"
                    required
                    value={tareWeightKg}
                    onChange={(e) => setTareWeightKg(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 font-mono text-xs"
                  />
                </div>
              </div>

              {/* Net Weight Display */}
              <div className="bg-blue-50 p-3 rounded-xl border border-blue-200 flex justify-between items-center text-blue-900 font-bold">
                <span>Calculated Net Weight:</span>
                <span className="text-sm">
                  {grossWeightKg - tareWeightKg} kg ({((grossWeightKg - tareWeightKg) / 100).toFixed(2)} Quintals)
                </span>
              </div>

              {/* Assaying Quality Inputs */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Moisture Content (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={moisturePct}
                    onChange={(e) => setMoisturePct(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 text-xs"
                  />
                  <span className="text-[10px] text-slate-400">Max limit: 12.0%</span>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Foreign Matter (%)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    required
                    value={foreignMatterPct}
                    onChange={(e) => setForeignMatterPct(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 text-xs"
                  />
                  <span className="text-[10px] text-slate-400">Max limit: 0.75%</span>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Quality Grade
                  </label>
                  <select
                    value={qualityGrade}
                    onChange={(e) => setQualityGrade(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 text-xs font-semibold"
                  >
                    <option value="Grade A">Grade A (Standard)</option>
                    <option value="Grade B">Grade B</option>
                    <option value="FAQ">FAQ Standard</option>
                  </select>
                </div>
              </div>

              {/* Transparent MSP Valuation */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1 text-slate-700">
                <div className="flex justify-between">
                  <span>Procurement MSP Rate:</span>
                  <span className="font-bold">₹2,425.00 / Quintal</span>
                </div>
                <div className="flex justify-between">
                  <span>Gross Valuation:</span>
                  <span className="font-bold text-slate-900">
                    ₹{(((grossWeightKg - tareWeightKg) / 100) * 2425).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-emerald-700">
                  <span>Unauthorised Fees:</span>
                  <span>₹0.00 (Strict Zero Intermediary Rule)</span>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedTokenForIntake(null)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-sm transition"
                >
                  Finalize Intake & Issue Digital Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Digital Receipt Modal if generated */}
      {generatedTxn && (
        <DigitalReceiptModal
          transaction={generatedTxn}
          onClose={() => setGeneratedTxn(null)}
          onVerifyClick={() => {
            setGeneratedTxn(null);
            setActiveTab('public-verify');
          }}
        />
      )}
    </div>
  );
};
