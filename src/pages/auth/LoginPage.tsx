import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  ShieldCheck,
  Phone,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Building2,
  UserCheck,
  RotateCw,
} from 'lucide-react';

interface LoginPageProps {
  onSuccess: () => void;
  setActiveTab: (tab: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess, setActiveTab }) => {
  const {
    switchUserRole,
    loginWithOtp,
    loginWithGoogle,
    loginWithEmail,
    completeFarmerProfile,
    completeVendorProfile,
  } = useApp();

  const [authMode, setAuthMode] = useState<'options' | 'otp' | 'email' | 'register_farmer' | 'register_vendor'>('options');
  const [mobileNumber, setMobileNumber] = useState('9829012345');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(30);
  const [emailInput, setEmailInput] = useState('ramesh.farmer@annadatasetu.gov.in');
  const [passwordInput, setPasswordInput] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Farmer registration form states
  const [farmerName, setFarmerName] = useState('');
  const [farmerMobile, setFarmerMobile] = useState('');
  const [farmerVillage, setFarmerVillage] = useState('');
  const [farmerLandArea, setFarmerLandArea] = useState(4.5);

  // Vendor registration form states
  const [vendorBusiness, setVendorBusiness] = useState('');
  const [vendorOwner, setVendorOwner] = useState('');
  const [vendorGst, setVendorGst] = useState('');
  const [vendorDistrict, setVendorDistrict] = useState('Jaipur');

  const handleSendOtp = () => {
    if (mobileNumber.length < 10) {
      setAuthError('Please enter a valid 10-digit mobile number');
      return;
    }
    setAuthError(null);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
      setOtpCountdown(30);
    }, 600);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== '123456' && otpCode !== '000000' && otpCode.length !== 6) {
      setAuthError('Invalid OTP code. For demo testing, enter 123456.');
      return;
    }
    setAuthError(null);
    setIsLoading(true);
    await loginWithOtp(mobileNumber, otpCode);
    setIsLoading(false);
    switchUserRole('farmer');
    setActiveTab('farmer-dashboard');
    onSuccess();
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    await loginWithGoogle();
    setIsLoading(false);
    switchUserRole('farmer');
    setActiveTab('farmer-dashboard');
    onSuccess();
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await loginWithEmail(emailInput, passwordInput);
    setIsLoading(false);
    switchUserRole('farmer');
    setActiveTab('farmer-dashboard');
    onSuccess();
  };

  const handleFarmerRegister = (e: React.FormEvent) => {
    e.preventDefault();
    switchUserRole('farmer');
    completeFarmerProfile({
      village: farmerVillage || 'Bassi',
      landAreaAcres: farmerLandArea,
    });
    setActiveTab('farmer-dashboard');
    onSuccess();
  };

  const handleVendorRegister = (e: React.FormEvent) => {
    e.preventDefault();
    switchUserRole('vendor');
    completeVendorProfile({
      businessName: vendorBusiness || 'New Agro Buyer',
      ownerName: vendorOwner || 'Owner',
      district: vendorDistrict,
    });
    setActiveTab('vendor-dashboard');
    onSuccess();
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#0b2238] to-[#133e66] text-white p-8 text-center relative">
          <div className="inline-block w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center font-bold text-lg text-amber-400 mb-2">
            अ•से
          </div>
          <h2 className="text-2xl font-black tracking-tight">Welcome to Annadata Setu</h2>
          <p className="text-xs text-slate-300 mt-1">
            Ministry of Consumer Affairs, Food & Public Distribution
          </p>
          <div className="mt-3 inline-flex items-center px-3 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            PROTOTYPE LOGIN PORTAL
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {authError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center space-x-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* 1. Standard Options View */}
          {authMode === 'options' && (
            <div className="space-y-4 text-xs">
              <button
                onClick={handleGoogleLogin}
                className="w-full py-3 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold flex items-center justify-center space-x-3 shadow-sm transition"
              >
                {/* Google Vector Icon */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <button
                onClick={() => setAuthMode('otp')}
                className="w-full py-3 px-4 rounded-xl bg-[#133e66] hover:bg-[#0b2238] text-white font-bold flex items-center justify-center space-x-2 shadow-sm transition"
              >
                <Phone className="w-4 h-4" />
                <span>Login with Mobile Number + OTP</span>
              </button>

              <button
                onClick={() => setAuthMode('email')}
                className="w-full py-3 px-4 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold flex items-center justify-center space-x-2 transition"
              >
                <Mail className="w-4 h-4" />
                <span>Login with Email / Admin</span>
              </button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-400">
                  <span className="bg-white px-2">Or Register New Profile</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setAuthMode('register_farmer')}
                  className="py-2.5 px-3 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 font-bold hover:bg-emerald-100 transition text-center"
                >
                  Register as Farmer
                </button>
                <button
                  onClick={() => setAuthMode('register_vendor')}
                  className="py-2.5 px-3 rounded-xl border border-blue-300 bg-blue-50 text-blue-800 font-bold hover:bg-blue-100 transition text-center"
                >
                  Register as Vendor
                </button>
              </div>
            </div>
          )}

          {/* 2. Mobile OTP Flow */}
          {authMode === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mobile Number (10 Digits)</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-300 bg-slate-100 text-slate-500 font-bold">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    required
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-r-xl border border-slate-300 bg-slate-50 font-semibold focus:bg-white text-xs"
                    placeholder="9829012345"
                  />
                </div>
              </div>

              {!otpSent ? (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isLoading}
                  className="w-full py-2.5 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded-xl shadow-sm transition"
                >
                  {isLoading ? 'Sending SMS OTP...' : 'Send OTP Code'}
                </button>
              ) : (
                <div className="space-y-3 animate-in fade-in">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Enter 6-Digit OTP Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 font-mono text-center text-base tracking-widest font-bold focus:bg-white"
                      placeholder="123456"
                    />
                    <p className="text-[11px] text-slate-500 mt-1 text-center">
                      * For SIH evaluation demo, enter <strong>123456</strong>
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-sm transition"
                  >
                    Verify & Access Farmer Portal
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="text-[11px] text-blue-600 hover:underline font-semibold"
                    >
                      Resend OTP Code
                    </button>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => setAuthMode('options')}
                className="w-full text-center text-slate-500 hover:text-slate-800 text-xs pt-2"
              >
                ← Back to Login Options
              </button>
            </form>
          )}

          {/* 3. Email / Admin Fallback */}
          {authMode === 'email' && (
            <form onSubmit={handleEmailLogin} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Official Email / ID</label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded-xl shadow-sm transition"
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={() => setAuthMode('options')}
                className="w-full text-center text-slate-500 hover:text-slate-800 text-xs pt-2"
              >
                ← Back to Login Options
              </button>
            </form>
          )}

          {/* 4. Farmer Registration Form */}
          {authMode === 'register_farmer' && (
            <form onSubmit={handleFarmerRegister} className="space-y-3 text-xs">
              <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
                New Farmer Registration / किसान पंजीकरण
              </h3>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Village & Tehsil</label>
                <input
                  type="text"
                  required
                  value={farmerVillage}
                  onChange={(e) => setFarmerVillage(e.target.value)}
                  placeholder="e.g. Bassi Rural, Jaipur"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Land Area (Acres)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={farmerLandArea}
                  onChange={(e) => setFarmerLandArea(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-xs"
                />
              </div>
              <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 text-emerald-900 text-[11px]">
                ✓ Mobile and Land title will be flagged as Verified in Prototype Demo mode.
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-sm transition"
              >
                Complete Registration & Proceed
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('options')}
                className="w-full text-center text-slate-500 hover:text-slate-800 text-xs pt-1"
              >
                ← Back
              </button>
            </form>
          )}

          {/* 5. Vendor Registration Form */}
          {authMode === 'register_vendor' && (
            <form onSubmit={handleVendorRegister} className="space-y-3 text-xs">
              <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
                New Commercial Vendor Registration
              </h3>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Business Name</label>
                <input
                  type="text"
                  required
                  value={vendorBusiness}
                  onChange={(e) => setVendorBusiness(e.target.value)}
                  placeholder="e.g. Rajasthan Flour Mills Ltd."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Owner / Director Name</label>
                <input
                  type="text"
                  required
                  value={vendorOwner}
                  onChange={(e) => setVendorOwner(e.target.value)}
                  placeholder="e.g. Rajeev Singhania"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Operating District</label>
                <input
                  type="text"
                  required
                  value={vendorDistrict}
                  onChange={(e) => setVendorDistrict(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-xs"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded-xl shadow-sm transition"
              >
                Register & Open Vendor Portal
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('options')}
                className="w-full text-center text-slate-500 hover:text-slate-800 text-xs pt-1"
              >
                ← Back
              </button>
            </form>
          )}

          {/* 6. Quick 1-Click Role Switcher for Hackathon Judges (Section 39 Requirement) */}
          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center space-x-1.5 text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>1-Click Hackathon Evaluator Accounts</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <button
                onClick={() => {
                  switchUserRole('farmer');
                  setActiveTab('farmer-dashboard');
                  onSuccess();
                }}
                className="p-2 rounded-lg border border-slate-200 hover:border-emerald-400 bg-slate-50 hover:bg-emerald-50 text-left transition"
              >
                <p className="font-bold text-slate-800">👨‍🌾 Farmer Demo</p>
                <p className="text-[10px] text-slate-500">Ramesh Kumar</p>
              </button>

              <button
                onClick={() => {
                  switchUserRole('vendor');
                  setActiveTab('vendor-dashboard');
                  onSuccess();
                }}
                className="p-2 rounded-lg border border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50 text-left transition"
              >
                <p className="font-bold text-slate-800">🏢 Vendor Demo</p>
                <p className="text-[10px] text-slate-500">AgriCorp Mills</p>
              </button>

              <button
                onClick={() => {
                  switchUserRole('centre_operator');
                  setActiveTab('centre-dashboard');
                  onSuccess();
                }}
                className="p-2 rounded-lg border border-slate-200 hover:border-purple-400 bg-slate-50 hover:bg-purple-50 text-left transition"
              >
                <p className="font-bold text-slate-800">⚖️ Operator Demo</p>
                <p className="text-[10px] text-slate-500">Jaipur Mandi</p>
              </button>

              <button
                onClick={() => {
                  switchUserRole('district_authority');
                  setActiveTab('district-dashboard');
                  onSuccess();
                }}
                className="p-2 rounded-lg border border-slate-200 hover:border-amber-400 bg-slate-50 hover:bg-amber-50 text-left transition"
              >
                <p className="font-bold text-slate-800">🏛️ DMO Officer</p>
                <p className="text-[10px] text-slate-500">Dr. Sunita Meena</p>
              </button>

              <button
                onClick={() => {
                  switchUserRole('ministry_admin');
                  setActiveTab('ministry-dashboard');
                  onSuccess();
                }}
                className="p-2 rounded-lg border border-slate-200 hover:border-blue-500 bg-slate-50 hover:bg-blue-50 text-left transition"
              >
                <p className="font-bold text-slate-800">🇮🇳 Ministry Admin</p>
                <p className="text-[10px] text-slate-500">Krishi Bhavan</p>
              </button>

              <button
                onClick={() => {
                  switchUserRole('ministry_admin');
                  setActiveTab('doca-intelligence');
                  onSuccess();
                }}
                className="p-2 rounded-lg border border-slate-200 hover:border-rose-400 bg-slate-50 hover:bg-rose-50 text-left transition"
              >
                <p className="font-bold text-slate-800">📊 DoCA Officer</p>
                <p className="text-[10px] text-slate-500">Price Monitor</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
