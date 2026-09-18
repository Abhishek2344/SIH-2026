import React from 'react';
import { Sprout, PhoneCall, ShieldCheck, HelpCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-400 text-sm mt-auto border-t border-slate-800">
      {/* Help Banner */}
      <div className="bg-farmer-900/60 border-b border-farmer-800/60 py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-farmer-600/30 border border-farmer-500/40 flex items-center justify-center text-farmer-400 shrink-0">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-base">Kisan Call Centre 24x7 Helpline</h4>
              <p className="text-xs text-farmer-200">Call Toll-Free for immediate assistance with slot booking and payments</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="tel:18001801551"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition shadow-lg shadow-emerald-900/40 inline-flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              1800-180-1551
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <Sprout className="w-5 h-5 text-farmer-400" />
              <span>Smart Farmer Platform</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering Indian farmers through transparent digital slot booking, real-time queue notifications, and guaranteed MSP payments.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium pt-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Direct Benefit Transfer (DBT)</span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h5 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Quick Navigation</h5>
            <ul className="space-y-2 text-xs">
              <li><a href="/centres" className="hover:text-white transition">Procurement Centres</a></li>
              <li><a href="/book-slot" className="hover:text-white transition">Book Slot</a></li>
              <li><a href="/live-queue" className="hover:text-white transition">Live Token Queue</a></li>
              <li><a href="/payments" className="hover:text-white transition">Track DBT Payment</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h5 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Portals & Roles</h5>
            <ul className="space-y-2 text-xs">
              <li><a href="/login" className="hover:text-white transition">Farmer Login</a></li>
              <li><a href="/login" className="hover:text-white transition">Staff Counter Portal</a></li>
              <li><a href="/login" className="hover:text-white transition">Super Admin Monitoring</a></li>
              <li><a href="/register" className="hover:text-white transition">New Farmer Registration</a></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h5 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Government Standards</h5>
            <p className="text-xs text-slate-400 mb-3">
              Standard Operating Procedures compliant with Food Corporation of India (FCI) & State Civil Supplies Corporations.
            </p>
            <span className="text-[10px] text-slate-500">
              Smart India Hackathon (SIH 2026) Initiative.
            </span>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Smart Farmer Procurement & Queue Management Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Accessibility</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
