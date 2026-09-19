import React from 'react';
import { ShieldCheck, Phone, FileText, CheckCircle2, Lock } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-16">
      {/* Top Banner Notice */}
      <div className="bg-slate-950/80 border-b border-slate-800/80 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <div className="flex items-center space-x-2 text-slate-300">
            <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span className="font-semibold text-slate-200">
              Strict Aadhaar & Banking Privacy Safeguards Active
            </span>
            <span className="hidden lg:inline text-slate-400">
              — Zero plain-text Aadhaar storage. Public vendor views display aggregated district quantities only.
            </span>
          </div>

          <div className="flex items-center space-x-4 text-slate-300">
            <div className="flex items-center space-x-1.5 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>Toll-Free Kisan Helpline: <strong>1800-180-1551</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Platform Overview */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded bg-blue-700 flex items-center justify-center text-white font-bold text-xs">
                स्•मं
              </div>
              <span className="text-white font-bold text-sm tracking-wide">
                smart-Mandi
              </span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Transparent Procurement & Commodity Intelligence Platform built for the Ministry of Consumer Affairs, Food & Public Distribution, Government of India.
            </p>
            <p className="text-amber-400/90 text-[11px] font-medium border-l-2 border-amber-500 pl-2">
              Prototype / Demonstration — Not an Official Government Portal
            </p>
          </div>

          {/* Col 2: Smart India Hackathon Solution Scope */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              SIH Problem Statement
            </h4>
            <p className="text-slate-400 text-[11px] leading-relaxed mb-2">
              Addressing farmer waiting times, scheduling opacity, and payment uncertainties through slot reservation, real-time queue orchestration, anti-intermediary transaction ledgers, and early commodity price intelligence.
            </p>
            <ul className="space-y-1 text-[11px]">
              <li className="flex items-center space-x-1 text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
                <span>Zero Unauthorised Intermediary Charges</span>
              </li>
              <li className="flex items-center space-x-1 text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
                <span>Direct PFMS / DBT Payment Ledgers</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              Platform Links
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button
                  onClick={() => setActiveTab('public-transparency')}
                  className="hover:text-white transition-colors"
                >
                  Transparency & Accountability Charter
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('public-verify')}
                  className="hover:text-white transition-colors"
                >
                  Verify Digital Procurement Receipt
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('public-technology')}
                  className="hover:text-white transition-colors"
                >
                  Architecture & Technology Stack
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('doca-intelligence')}
                  className="hover:text-white transition-colors"
                >
                  Department of Consumer Affairs (DoCA) Monitor
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Anti-Intermediary & Legal Security */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              Anti-Intermediary Mandate
            </h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Every procurement transaction is cryptographically hashed, immutable, and audited. Any extortion of unapproved handling fees or private brokerage is immediately reported to the District Marketing Officer (DMO).
            </p>
            <div className="mt-3 inline-flex items-center space-x-1.5 text-xs text-slate-300 bg-slate-800/80 px-2.5 py-1.5 rounded border border-slate-700">
              <Lock className="w-3.5 h-3.5 text-blue-400" />
              <span>Full Audit Trail Enabled</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <p>© 2026 smart-Mandi Project Prototype. Prepared for Smart India Hackathon (SIH).</p>
          <p className="text-slate-400">
            Designed for Desktop & Mobile • Dual Engine (Supabase + Instant Demo)
          </p>
        </div>
      </div>
    </footer>
  );
};
