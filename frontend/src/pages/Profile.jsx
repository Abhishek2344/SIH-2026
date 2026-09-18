import React from 'react';
import { User, Phone, MapPin, Globe, Shield, LogOut, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const { lang, changeLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const farmer = user?.farmer_profile;
  const staff = user?.staff_profile;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t('profile')}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Verified registration credentials and regional preferences
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
            <div className="w-16 h-16 rounded-2xl bg-farmer-600 text-white flex items-center justify-center font-bold text-2xl shadow-md">
              {farmer?.full_name?.[0] || staff?.full_name?.[0] || user?.role?.[0]?.toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {farmer?.full_name || staff?.full_name || "Authorized User"}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-semibold uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  Role: {user?.role}
                </span>
                {farmer?.farmer_id && (
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-farmer-100 text-farmer-800">
                    {farmer.farmer_id}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl">
              <span className="text-slate-500 flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" /> Registered Mobile:
              </span>
              <span className="font-mono font-bold text-slate-900">{user?.mobile}</span>
            </div>

            {farmer && (
              <>
                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl">
                  <span className="text-slate-500 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" /> Residential Address:
                  </span>
                  <span className="font-semibold text-slate-900">{farmer.address}</span>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl">
                  <span className="text-slate-500">District & State:</span>
                  <span className="font-semibold text-slate-900">{farmer.district}, {farmer.state}</span>
                </div>
              </>
            )}

            {staff && (
              <>
                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl">
                  <span className="text-slate-500">Staff Code:</span>
                  <span className="font-mono font-bold text-slate-900">{staff.staff_code}</span>
                </div>
                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl">
                  <span className="text-slate-500">Designation:</span>
                  <span className="font-semibold text-slate-900">{staff.designation}</span>
                </div>
              </>
            )}

            {/* Language Preference */}
            <div className="p-4 bg-slate-50 rounded-2xl space-y-2">
              <span className="text-slate-600 font-bold block">Preferred Language:</span>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => changeLanguage('en')}
                  className={`flex-1 py-2 rounded-xl font-bold border transition ${
                    lang === 'en'
                      ? 'bg-farmer-600 text-white border-farmer-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => changeLanguage('hi')}
                  className={`flex-1 py-2 rounded-xl font-bold border transition ${
                    lang === 'hi'
                      ? 'bg-farmer-600 text-white border-farmer-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  हिन्दी (Hindi)
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleLogout}
              className="bg-red-50 hover:bg-red-100 text-red-700 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('logout')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
