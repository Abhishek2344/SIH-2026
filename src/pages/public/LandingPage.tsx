import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Calendar,
  Clock,
  Scale,
  CreditCard,
  Building2,
  TrendingUp,
  FileCheck,
  ChevronRight,
  PlayCircle,
  Lock,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

interface LandingPageProps {
  setActiveTab: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ setActiveTab }) => {
  const { executeRameshDemoScenario, switchUserRole } = useApp();

  return (
    <div className="space-y-16 py-8">
      {/* 1. Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold shadow-sm">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
          <span>Ministry of Consumer Affairs, Food & Public Distribution • Govt of India</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-none">
          ANNADATA SETU
          <span className="block text-2xl sm:text-3xl font-extrabold text-[#133e66] mt-2 font-serif">
            Transparent Procurement. Smarter Markets. Empowered Farmers.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
          A digital procurement and commodity intelligence platform connecting farmers, procurement centres, verified market participants, and government authorities through transparent data and accountable workflows.
        </p>

        {/* Hero CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              switchUserRole('farmer');
              setActiveTab('farmer-dashboard');
            }}
            className="px-6 py-3 rounded-xl bg-[#133e66] hover:bg-[#0b2238] text-white font-bold text-sm shadow-md transition-all flex items-center space-x-2"
          >
            <span>Enter Farmer Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={executeRameshDemoScenario}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm shadow-md transition-all flex items-center space-x-2 border border-amber-400"
          >
            <PlayCircle className="w-4 h-4 text-slate-950" />
            <span>Launch SIH Benchmark Demo</span>
          </button>

          <button
            onClick={() => {
              switchUserRole('ministry_admin');
              setActiveTab('ministry-dashboard');
            }}
            className="px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm border border-slate-300 shadow-sm transition-all"
          >
            Ministry Control Tower
          </button>
        </div>

        {/* Prototype Disclaimer Badge */}
        <p className="text-xs text-slate-500 max-w-md mx-auto pt-2">
          Prototype / Demonstration — Not an Official Government Portal. Designed for Smart India Hackathon (SIH 2026).
        </p>
      </section>

      {/* 2. Visual Digital Chain Diagram (Section 1 Product Concept) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
              The End-To-End Trusted Digital Chain
            </h3>
            <h2 className="text-2xl font-black text-slate-900 mt-1">
              From Farm Gate to Central Commodity Intelligence
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-2xl">👨‍🌾</span>
              <p className="font-bold text-slate-800">1. Registration</p>
              <p className="text-[10px] text-slate-500">Khasra & Bank verification</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-2xl">🌾</span>
              <p className="font-bold text-slate-800">2. Stock Declaration</p>
              <p className="text-[10px] text-slate-500">Yield & variety tracking</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-2xl">📅</span>
              <p className="font-bold text-slate-800">3. Slot Booking</p>
              <p className="text-[10px] text-slate-500">Capacity-managed slots</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-2xl">⏱️</span>
              <p className="font-bold text-slate-800">4. Live Queue</p>
              <p className="text-[10px] text-slate-500">Token tracking & audio chime</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-2xl">⚖️</span>
              <p className="font-bold text-slate-800">5. Weighment & Lab</p>
              <p className="text-[10px] text-slate-500">Electronic tare/gross</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-2xl">💳</span>
              <p className="font-bold text-slate-800">6. PFMS / DBT Credit</p>
              <p className="text-[10px] text-slate-500">Zero intermediary fee</p>
            </div>
            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 space-y-1 text-blue-900">
              <span className="text-2xl">📊</span>
              <p className="font-bold">7. DoCA Radar</p>
              <p className="text-[10px] text-blue-700">Early anomaly alerts</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Role Portals Breakdown */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Dedicated Technology for Every Stakeholder
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Role-based authentication powered by Supabase Row-Level Security
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Farmers */}
          <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl font-bold">
              👨‍🌾
            </div>
            <h3 className="text-lg font-black text-slate-900">For Farmers</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Book procurement slots in advance, check live queue tokens from the farm, receive SMS alerts, and track direct bank payments with immutable digital vouchers.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-700">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Transparent slot capacity booking</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Live token countdown & wait estimation</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Zero unauthorized deductions guarantee</span>
              </li>
            </ul>
            <button
              onClick={() => {
                switchUserRole('farmer');
                setActiveTab('farmer-dashboard');
              }}
              className="pt-2 text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
            >
              <span>Explore Farmer Portal</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Mandi Centres */}
          <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center text-2xl font-bold">
              ⚖️
            </div>
            <h3 className="text-lg font-black text-slate-900">For Mandi Centres</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Eliminate yard traffic jams with daily bay capacity quotas. Record electronic gross/tare weights and moisture tests with immediate QR voucher generation.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-700">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                <span>Real-time bay capacity throttling</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                <span>Electronic weighbridge intake console</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                <span>Live token calling and yard display</span>
              </li>
            </ul>
            <button
              onClick={() => {
                switchUserRole('centre_operator');
                setActiveTab('centre-dashboard');
              }}
              className="pt-2 text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center space-x-1"
            >
              <span>Explore Operator Console</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 3: Ministry & DoCA */}
          <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-2xl font-bold">
              🇮🇳
            </div>
            <h3 className="text-lg font-black text-slate-900">For Ministry & DoCA</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              National procurement overview with GIS maps, farm-to-retail price spread monitoring, and early warning supply stress indicators across 7 essential commodities.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-700">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                <span>Price spread & supply stress engine</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                <span>National FCI buffer stock redistribution</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                <span>Complete immutable audit ledger</span>
              </li>
            </ul>
            <button
              onClick={() => {
                switchUserRole('ministry_admin');
                setActiveTab('ministry-dashboard');
              }}
              className="pt-2 text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center space-x-1"
            >
              <span>Explore Central Dashboard</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. Privacy & Anti-Intermediary Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Section 14 Mandi Statutory Guarantee</span>
            </div>
            <h3 className="text-2xl font-black">
              Zero Unauthorised Brokerage. Strict Data Privacy.
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No private intermediary is permitted to deduct handling tips or cash commissions. Aadhaar numbers and bank credentials are never stored or displayed in plain text. Commercial vendors see only aggregated district quantities.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setActiveTab('public-transparency')}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-sm transition"
            >
              View Transparency Charter
            </button>
            <button
              onClick={() => setActiveTab('public-verify')}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition"
            >
              Verify Receipt QR
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
