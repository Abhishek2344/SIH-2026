import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sprout, Lock, User, AlertCircle, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Login = () => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userData = await login(username, password);
      if (userData.role === 'staff') {
        navigate('/staff/dashboard');
      } else if (userData.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate(from === '/login' ? '/dashboard' : from);
      }
    } catch (err) {
      const msg = err.response?.data?.detail || "Invalid mobile number/ID or password. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (u, p) => {
    setUsername(u);
    setPassword(p);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-farmer-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-farmer-600/30">
            <Sprout className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {t('login')}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Access your procurement booking, live token queue, and payments
          </p>
        </div>

        {/* Quick Fill Demo Badges */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
          <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2 text-center">
            ⚡ 1-Click Demo Credentials
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('9876543210', 'Farmer@123')}
              className="px-2 py-1.5 bg-white hover:bg-farmer-50 border border-slate-200 rounded-xl text-center text-xs font-semibold text-slate-800 transition"
            >
              🌾 Farmer
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('staff.centre1@gov.in', 'Staff@123')}
              className="px-2 py-1.5 bg-white hover:bg-emerald-50 border border-slate-200 rounded-xl text-center text-xs font-semibold text-slate-800 transition"
            >
              🏢 Staff
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('admin@gov.in', 'Admin@123')}
              className="px-2 py-1.5 bg-white hover:bg-purple-50 border border-slate-200 rounded-xl text-center text-xs font-semibold text-slate-800 transition"
            >
              👑 Admin
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Mobile Number / Email / ID
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. 9876543210 or FID-2026-001"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-farmer-500 focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-farmer-500 focus:bg-white transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-farmer-600 hover:bg-farmer-700 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition shadow-md shadow-farmer-600/30 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>{t('login')}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-600">
            Don't have a farmer registration yet?{' '}
            <Link to="/register" className="font-bold text-farmer-700 hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
