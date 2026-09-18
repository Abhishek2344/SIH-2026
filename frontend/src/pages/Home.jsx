import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sprout, 
  Clock, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  ArrowRight, 
  Users, 
  CheckCircle2, 
  TrendingUp,
  LogIn,
  Radio,
  Building2,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const Home = () => {
  const { isAuthenticated, isFarmer, isStaff, isAdmin, login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [centres, setCentres] = useState([]);
  const [loadingCentres, setLoadingCentres] = useState(true);

  useEffect(() => {
    api.get('/api/centres?active_only=true')
      .then((res) => setCentres(res.data.slice(0, 4)))
      .catch((err) => console.error("Failed to load centres", err))
      .finally(() => setLoadingCentres(false));
  }, []);

  const handleQuickLogin = async (username, password, redirectPath) => {
    try {
      await login(username, password);
      navigate(redirectPath);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-farmer-900 via-farmer-950 to-slate-900 text-white pt-14 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-farmer-800/80 border border-farmer-700/60 text-xs font-semibold text-farmer-200 mb-6 backdrop-blur-sm">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Smart India Hackathon 2026 Initiative</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6">
              {t('appName')}
            </h1>

            <p className="text-base sm:text-xl text-slate-300 font-medium mb-8 leading-relaxed">
              {t('tagline')}. Eliminate long mandi queues, book dedicated arrival slots, track live token position via WebSockets, and receive guaranteed MSP payment direct to your bank.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/book-slot"
                className="w-full sm:w-auto bg-farmer-500 hover:bg-farmer-600 text-white font-bold px-8 py-3.5 rounded-xl text-base transition shadow-lg shadow-farmer-500/30 flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                {t('bookNow')}
              </Link>

              <Link
                to="/live-queue"
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-3.5 rounded-xl text-base border border-white/20 transition backdrop-blur-sm flex items-center justify-center gap-2"
              >
                <Clock className="w-5 h-5 text-emerald-400" />
                {t('liveQueue')}
              </Link>
            </div>
          </div>

          {/* Quick Demo Credentials Bar for Evaluators / Pair Programming */}
          <div className="mt-14 max-w-4xl mx-auto bg-white/10 border border-white/15 rounded-2xl p-4 sm:p-6 backdrop-blur-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Fast Evaluator Test Access</span>
                <p className="text-xs text-slate-300">Click any role below to instantly log in with pre-seeded active records:</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => handleQuickLogin('9876543210', 'Farmer@123', '/dashboard')}
                className="bg-farmer-800/80 hover:bg-farmer-700/80 border border-farmer-600 text-left p-3 rounded-xl transition text-xs flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <Sprout className="w-3.5 h-3.5 text-farmer-400" />
                    <span>Farmer: Ramesh Kumar</span>
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">Token: TK-103 (Active Queue)</div>
                </div>
                <ArrowRight className="w-4 h-4 text-farmer-300" />
              </button>

              <button
                onClick={() => handleQuickLogin('staff.centre1@gov.in', 'Staff@123', '/staff/dashboard')}
                className="bg-emerald-950/80 hover:bg-emerald-900/80 border border-emerald-600 text-left p-3 rounded-xl transition text-xs flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Staff: Harpreet Singh</span>
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">Counter Officer (Khanna Hub)</div>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-300" />
              </button>

              <button
                onClick={() => handleQuickLogin('admin@gov.in', 'Admin@123', '/admin/dashboard')}
                className="bg-purple-950/80 hover:bg-purple-900/80 border border-purple-600 text-left p-3 rounded-xl transition text-xs flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                    <span>Super Admin Console</span>
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">National Oversight & Stats</div>
                </div>
                <ArrowRight className="w-4 h-4 text-purple-300" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Value Pillars */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Guaranteed Slot Booking</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Choose your preferred date and time slot. No unorganized physical lines or overnight tractor parking.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Real-Time Live Queue</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Powered by WebSockets. See your exact position, current token, and estimated wait time without refreshing.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-farmer-50 text-farmer-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Transparent Procurement</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Digital moisture testing and electronic weighbridge entry with instant computerized digital receipts.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Direct Bank Payouts</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Direct Benefit Transfer (DBT) directly into farmer bank accounts with full UTR reference tracking.
            </p>
          </div>
        </div>
      </section>

      {/* Procurement Centres Directory Preview */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              {t('centres')}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Active government procurement centres with real-time capacity and queue status
            </p>
          </div>

          <Link
            to="/centres"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-farmer-700 hover:text-farmer-800"
          >
            <span>View all centres</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loadingCentres ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-56 bg-slate-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {centres.map((c) => (
              <div key={c.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="font-mono font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {c.code}
                    </span>
                    <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                      {c.current_queue_size} in queue
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-base mb-1 line-clamp-1">{c.name}</h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mb-3 line-clamp-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {c.district}, {c.state}
                  </p>

                  <div className="bg-slate-50 p-2.5 rounded-xl text-xs space-y-1 mb-4">
                    <div className="flex justify-between text-slate-600">
                      <span>Hours:</span>
                      <span className="font-medium text-slate-900">{c.opening_time} - {c.closing_time}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Commodities:</span>
                      <span className="font-medium text-slate-900 truncate max-w-[120px]">{c.commodities}</span>
                    </div>
                  </div>
                </div>

                <Link
                  to={`/book-slot?centre_id=${c.id}`}
                  className="w-full bg-farmer-600 hover:bg-farmer-700 text-white font-semibold py-2 rounded-xl text-xs text-center transition flex items-center justify-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Slot</span>
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
