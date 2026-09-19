import React from 'react';
import {
  Code2,
  Database,
  ShieldCheck,
  Cpu,
  Layers,
  Activity,
  Server,
  Key,
} from 'lucide-react';

export const TechnologyPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10 text-slate-800">
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-semibold border border-blue-200">
          <Code2 className="w-4 h-4 text-blue-600" />
          <span>System Architecture • SIH 2026 Submission Blueprint</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Technology Stack & Architectural Specifications
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Technical design specifications of the smart-Mandi prototype built for the Ministry of Consumer Affairs, Food & Public Distribution.
        </p>
      </div>

      {/* Tech Stack Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
        {/* Frontend */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
            ⚛️
          </div>
          <h3 className="text-base font-bold text-slate-900">Frontend Presentation</h3>
          <p className="text-slate-600 leading-relaxed">
            <strong>React 19 + TypeScript + Vite</strong> styled with <strong>Tailwind CSS</strong>. High-performance, accessible, mobile-first responsive interfaces designed according to Government of India web guidelines.
          </p>
          <div className="pt-2 border-t border-slate-100 font-mono text-[11px] text-blue-700">
            Tailwind 3.4 • Lucide React
          </div>
        </div>

        {/* Database & Backend */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            🐘
          </div>
          <h3 className="text-base font-bold text-slate-900">Database & Storage</h3>
          <p className="text-slate-600 leading-relaxed">
            <strong>Supabase / PostgreSQL 15</strong> with UUID primary keys, transactional triggers, relational integrity across 24 tables, and strict <strong>Row-Level Security (RLS)</strong>.
          </p>
          <div className="pt-2 border-t border-slate-100 font-mono text-[11px] text-emerald-700">
            PostgreSQL • Supabase RLS
          </div>
        </div>

        {/* Authentication */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            🔐
          </div>
          <h3 className="text-base font-bold text-slate-900">Identity & Roles</h3>
          <p className="text-slate-600 leading-relaxed">
            Role-Based Access Control (RBAC) with 7 specialized portals (Farmer, Vendor, Operator, Assayer, DMO, Ministry, Super Admin) with Mobile OTP, OAuth, and instant 1-click evaluation modes.
          </p>
          <div className="pt-2 border-t border-slate-100 font-mono text-[11px] text-amber-700">
            Supabase Auth • RBAC Guard
          </div>
        </div>

        {/* Realtime Telemetry */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
            ⚡
          </div>
          <h3 className="text-base font-bold text-slate-900">Real-Time Queue Telemetry</h3>
          <p className="text-slate-600 leading-relaxed">
            WebSocket state distribution powered by <strong>Supabase Realtime</strong> ensuring that when a mandi operator advances token A-110 to A-111, the farmer screen and yard displays update instantaneously.
          </p>
          <div className="pt-2 border-t border-slate-100 font-mono text-[11px] text-purple-700">
            WebSockets • Supabase Realtime
          </div>
        </div>

        {/* Analytics Engine */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
            🧠
          </div>
          <h3 className="text-base font-bold text-slate-900">Rule-Based Analytics Engine</h3>
          <p className="text-slate-600 leading-relaxed">
            Deterministic statistical models tracking moving averages, price percentage deltas, arrival dips, and farm-to-retail price spreads without probabilistic hallucinations.
          </p>
          <div className="pt-2 border-t border-slate-100 font-mono text-[11px] text-rose-700">
            Deterministic Anomaly Engine
          </div>
        </div>

        {/* Geographic Intelligence */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold">
            🗺️
          </div>
          <h3 className="text-base font-bold text-slate-900">Geospatial Mapping</h3>
          <p className="text-slate-600 leading-relaxed">
            <strong>Leaflet & Vector GIS Mapping</strong> visualizing APMC yard locations, bay congestion, and regional buffer stock distribution without leaking private farmer farm coordinates.
          </p>
          <div className="pt-2 border-t border-slate-100 font-mono text-[11px] text-sky-700">
            Leaflet • Vector GIS Engine
          </div>
        </div>
      </div>

      {/* Dual Data Engine Architecture Highlight */}
      <div className="bg-slate-900 text-white p-8 rounded-3xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
          <Layers className="w-4 h-4" />
          <span>Hackathon Evaluation Architecture</span>
        </div>
        <h3 className="text-xl font-black">
          Dual Data Engine Architecture (Zero Friction Setup)
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          The application implements an intelligent dual-mode data layer:
          <br />
          1. <strong>Production Mode:</strong> Seamlessly connects to live Supabase PostgreSQL via environment variables (<code className="text-amber-400">VITE_SUPABASE_URL</code> & <code className="text-amber-400">VITE_SUPABASE_ANON_KEY</code>) using the provided migration scripts in <code className="text-amber-400">supabase/schema.sql</code> and <code className="text-amber-400">supabase/seed.sql</code>.
          <br />
          2. <strong>Demonstration Mode:</strong> Includes an integrated in-memory, reactive LocalStorage database that loads complete realistic Indian agricultural datasets out of the box with zero setup hurdles or database latency for hackathon judges.
        </p>
      </div>
    </div>
  );
};
