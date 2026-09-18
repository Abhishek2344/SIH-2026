import React from 'react';
import {
  ShieldCheck,
  Lock,
  Eye,
  FileCheck,
  CreditCard,
  Scale,
  Building2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const TransparencyPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10 text-slate-800">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-semibold border border-blue-200">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>Public Charter • खुला प्रशासन और पारदर्शिता</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Transparency & Accountability Framework
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          How the Ministry of Consumer Affairs, Food & Public Distribution guarantees fair farmer compensation, data privacy, and immutable procurement audit trails.
        </p>
      </div>

      {/* Digital Audit Trail Pillar */}
      <div className="bg-[#0b2238] text-white p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-xl text-center space-y-3">
        <span className="text-amber-400 font-mono text-xs font-bold uppercase tracking-widest">
          Core Architectural Guarantee
        </span>
        <h2 className="text-2xl font-black tracking-tight">
          "Every Procurement Transaction Generates a Digital Audit Trail"
        </h2>
        <p className="text-xs text-slate-300 max-w-xl mx-auto leading-relaxed">
          From the instant a farmer books a bay slot to the weighbridge electronic receipt and PFMS direct credit, all events are timestamped, SHA-256 hashed, and logged into an immutable government ledger.
        </p>
      </div>

      {/* Public vs Private Information Boundary (Section 6 & 41) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Private Data Guard */}
        <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-3">
          <div className="flex items-center space-x-2 text-rose-700 font-bold text-sm">
            <Lock className="w-4 h-4" />
            <span>Strictly Confidential (Private & Protected)</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            The following data is never published or exposed to commercial buyers, traders, or unauthenticated users:
          </p>
          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-start space-x-2">
              <span className="text-rose-500 font-bold">✕</span>
              <span><strong>Aadhaar Numbers:</strong> Zero plaintext storage. Verification flags only.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-rose-500 font-bold">✕</span>
              <span><strong>Bank Details:</strong> Full account numbers and IFSC are masked (e.g. XXXX-4819).</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-rose-500 font-bold">✕</span>
              <span><strong>Private Mobile & Residence:</strong> Private phone numbers and home addresses hidden.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-rose-500 font-bold">✕</span>
              <span><strong>Individual Farm Coordinates:</strong> Precise GIS farm boundaries kept confidential.</span>
            </li>
          </ul>
        </div>

        {/* Public Transparency Scope */}
        <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-3">
          <div className="flex items-center space-x-2 text-emerald-700 font-bold text-sm">
            <Eye className="w-4 h-4" />
            <span>Open & Publicly Auditable Information</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            The following macro and verification data is openly visible to foster market transparency:
          </p>
          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-start space-x-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>Aggregated District Stock:</strong> Total quintals available per district & commodity.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>Live Mandi Yard Congestion:</strong> Real-time token queues and average waiting times.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>Daily Agmarknet & DoCA Prices:</strong> Farm-gate, wholesale, and retail commodity feeds.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>Voucher Verification:</strong> Public QR verification of transaction ID, date, and MSP volume.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 5 Operational Transparency Pillars */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
          Core Pillars of Government Accountability
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              1
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Zero Intermediary Fee Rule</h4>
            <p className="text-slate-600 leading-relaxed">
              All administrative fees are borne by the government. Authorised deductions are explicitly shown as ₹0.00. Demanding tips or unauthorized deductions is a cognizable offence.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              2
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Direct PFMS / DBT Settlement</h4>
            <p className="text-slate-600 leading-relaxed">
              No cash payments or middleman cheques. Funds are credited electronically to the farmer's linked Aadhaar/bank account through the Public Financial Management System (PFMS).
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              3
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Objective Anomaly Detection</h4>
            <p className="text-slate-600 leading-relaxed">
              Algorithms detect statistical deviations in prices, spreads, and weighbridge times without human bias. The platform flags anomalies for review by authorised district officials.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
