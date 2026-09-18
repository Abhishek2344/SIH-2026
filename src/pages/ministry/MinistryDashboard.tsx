import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProcurementMap } from '../../components/maps/ProcurementMap';
import {
  Users,
  Building2,
  Scale,
  CreditCard,
  Clock,
  AlertTriangle,
  FileCheck,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Search,
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
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface MinistryDashboardProps {
  setActiveTab: (tab: string) => void;
}

export const MinistryDashboard: React.FC<MinistryDashboardProps> = ({ setActiveTab }) => {
  const {
    farmers,
    centres,
    transactions,
    complaints,
    alerts,
    prices,
    govStocks,
    auditLogs,
  } = useApp();

  const totalRegisteredFarmers = 18450 + farmers.length;
  const totalVerifiedFarmers = 17920 + farmers.length;
  const activeCentresCount = centres.length;
  const totalQuantityMT = 245800 + transactions.reduce((acc, t) => acc + t.quantityQuintals * 0.1, 0);
  const totalDisbursedCr = (596.2 + transactions.reduce((acc, t) => acc + t.netPayableAmount / 10000000, 0)).toFixed(2);
  const resolvedComplaints = complaints.filter((c) => c.status === 'Resolved').length;
  const resolutionPct = Math.round((resolvedComplaints / (complaints.length || 1)) * 100);

  // Charts Data
  const procurementTrendData = [
    { day: '13 Mar', WheatMT: 18200, PaddyMT: 12400 },
    { day: '14 Mar', WheatMT: 21500, PaddyMT: 14100 },
    { day: '15 Mar', WheatMT: 26800, PaddyMT: 15300 },
    { day: '16 Mar', WheatMT: 31200, PaddyMT: 16800 },
    { day: '17 Mar', WheatMT: 38400, PaddyMT: 17200 },
    { day: '18 Mar', WheatMT: 42100, PaddyMT: 19500 },
    { day: '19 Mar (Today)', WheatMT: 48900, PaddyMT: 22100 },
  ];

  const paymentVelocityData = [
    { status: 'Credited (DBT)', value: 88, color: '#15803d' },
    { status: 'Processing (Bank)', value: 8, color: '#d97706' },
    { status: 'Initiated (PFMS)', value: 4, color: '#0284c7' },
  ];

  const stateProcurementData = [
    { state: 'Punjab', WheatMT: 92000, TargetMT: 110000 },
    { state: 'Haryana', WheatMT: 68000, TargetMT: 75000 },
    { state: 'Rajasthan', WheatMT: 45000, TargetMT: 55000 },
    { state: 'Madhya Pradesh', WheatMT: 38000, TargetMT: 45000 },
    { state: 'Uttar Pradesh', WheatMT: 31000, TargetMT: 40000 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-[#0b2238] text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-700 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              CENTRAL POLICY & MONITORING CONTROL TOWER
            </span>
            <span className="text-xs text-slate-400 font-mono">KRISHI BHAVAN, NEW DELHI</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
            National Procurement & Commodity Intelligence Dashboard
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Integrated decision support system for the Ministry of Consumer Affairs, Food & Public Distribution. Real-time telemetry monitoring procurement throughput, DBT disbursements, yard congestion, and supply-risk early warnings.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('doca-intelligence')}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition"
          >
            Open DoCA Intelligence
          </button>
        </div>
      </div>

      {/* 2. Top Ministry KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-xs">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-400 text-[10px] uppercase font-bold">Registered Farmers</p>
          <p className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
            {totalRegisteredFarmers.toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] text-emerald-700 font-medium">97.1% verified</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-400 text-[10px] uppercase font-bold">Active Mandis</p>
          <p className="text-xl sm:text-2xl font-black text-blue-700 mt-0.5">
            {activeCentresCount}
          </p>
          <p className="text-[10px] text-slate-500">across 5 States</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-400 text-[10px] uppercase font-bold">Today's Bookings</p>
          <p className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">1,471</p>
          <p className="text-[10px] text-slate-500">trolleys scheduled</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-400 text-[10px] uppercase font-bold">Total Procured</p>
          <p className="text-xl sm:text-2xl font-black text-emerald-700 mt-0.5">
            {totalQuantityMT.toLocaleString('en-IN')} MT
          </p>
          <p className="text-[10px] text-emerald-600 font-semibold">Rabi Season</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-400 text-[10px] uppercase font-bold">Disbursed (DBT)</p>
          <p className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
            ₹{totalDisbursedCr} Cr
          </p>
          <p className="text-[10px] text-emerald-600 font-semibold">Zero Fee Deductions</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-400 text-[10px] uppercase font-bold">Avg Mandi Wait</p>
          <p className="text-xl sm:text-2xl font-black text-slate-800 mt-0.5">34 min</p>
          <p className="text-[10px] text-emerald-600 font-semibold">↓ 68% vs unslotted</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-400 text-[10px] uppercase font-bold">Active Alerts</p>
          <p className="text-xl sm:text-2xl font-black text-rose-600 mt-0.5">{alerts.length}</p>
          <p className="text-[10px] text-rose-700 font-semibold">Supply / Spreads</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-400 text-[10px] uppercase font-bold">Grievances</p>
          <p className="text-xl sm:text-2xl font-black text-amber-700 mt-0.5">{complaints.length}</p>
          <p className="text-[10px] text-emerald-600 font-semibold">{resolutionPct}% resolved</p>
        </div>
      </div>

      {/* 3. National Geo Map Component */}
      <ProcurementMap centres={centres} />

      {/* 4. Charts: Procurement Trends & Payment Throughput */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: 7-Day Procurement Volume Ramp */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Procurement Velocity by Commodity (MT / Day)
              </h3>
              <p className="text-xs text-slate-500">
                Daily intake volume comparison across major procurement belts
              </p>
            </div>
            <span className="text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
              Peak Season Flow
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={procurementTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  formatter={(val: any) => [`${val.toLocaleString('en-IN')} MT`, '']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="WheatMT" name="Wheat Procurement (MT)" fill="#d97706" radius={[4, 4, 0, 0]} />
                <Bar dataKey="PaddyMT" name="Paddy Procurement (MT)" fill="#0284c7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Direct Benefit Transfer Settlement Velocity */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900">
                DBT Payment Settlement Velocity
              </h3>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                PFMS Direct
              </span>
            </div>
            <p className="text-xs text-slate-500">
              88% of payments credited within 24 hours of weighbridge receipt
            </p>

            <div className="h-48 w-full mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentVelocityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {paymentVelocityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: any) => [`${val}%`, '']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
            {paymentVelocityData.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-slate-700">
                <span className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span>{item.status}</span>
                </span>
                <span className="font-bold">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. State Procurement Targets vs Achievements */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              State-Wise Procurement Targets & Achievement (Rabi 2026)
            </h3>
            <p className="text-xs text-slate-500">
              Progress against central allocation targets set by the Food Corporation of India (FCI)
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded">
            Overall Achievement: 81.2%
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-xs">
          {stateProcurementData.map((s, idx) => {
            const pct = Math.round((s.WheatMT / s.TargetMT) * 100);
            return (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-900 text-sm">{s.state}</h4>
                  <span className="font-mono text-emerald-700 font-bold">{pct}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${pct}%` }}></div>
                </div>
                <div className="flex justify-between text-[11px] text-slate-600 pt-1">
                  <span>Procured: {s.WheatMT.toLocaleString('en-IN')} MT</span>
                  <span>Target: {s.TargetMT.toLocaleString('en-IN')} MT</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. System-Wide Audit Log Stream (Section 26 Requirement) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Central Sensitive Action Audit Trail (Immutable Log)
            </h3>
            <p className="text-xs text-slate-500">
              Every price update, transaction finalization, queue shift, and grievance resolution logged with gateway IP
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
            {auditLogs.length} audit records
          </span>
        </div>

        <div className="overflow-x-auto max-h-72">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-slate-50 z-10">
              <tr className="text-slate-500 font-semibold border-b border-slate-200">
                <th className="py-2.5 px-4">Action</th>
                <th className="py-2.5 px-4">Officer / User</th>
                <th className="py-2.5 px-4">Record Ref</th>
                <th className="py-2.5 px-4">Details / Delta</th>
                <th className="py-2.5 px-4">Gateway IP</th>
                <th className="py-2.5 px-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition">
                  <td className="py-2.5 px-4">
                    <span className="inline-block font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                      {log.actionType}
                    </span>
                  </td>
                  <td className="py-2.5 px-4">
                    <span className="font-semibold text-slate-800">{log.userName}</span>
                    <span className="block text-[10px] text-slate-400 capitalize">{log.userRole.replace('_', ' ')}</span>
                  </td>
                  <td className="py-2.5 px-4 font-mono font-bold text-slate-700">
                    {log.recordId}
                  </td>
                  <td className="py-2.5 px-4 text-slate-600 max-w-xs truncate">
                    {log.newValue || log.oldValue || 'Record modified'}
                  </td>
                  <td className="py-2.5 px-4 font-mono text-[10px] text-slate-400">
                    {log.ipAddress}
                  </td>
                  <td className="py-2.5 px-4 text-slate-400 font-mono text-[10px]">
                    {new Date(log.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
