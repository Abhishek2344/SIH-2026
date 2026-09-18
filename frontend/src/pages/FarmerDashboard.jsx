import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Hourglass, 
  CheckCircle2, 
  CreditCard, 
  Bell, 
  ArrowRight, 
  Sparkles,
  RefreshCw,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useWebSocket } from '../context/WebSocketContext';
import QueueBadge from '../components/QueueBadge';
import StatusStepper from '../components/StatusStepper';
import api from '../services/api';

const FarmerDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { subscribeToCentreQueue, liveQueueData } = useWebSocket();

  const [activeBooking, setActiveBooking] = useState(null);
  const [queueStatus, setQueueStatus] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [bookingsRes, paymentsRes] = await Promise.all([
        api.get('/api/bookings/my'),
        api.get('/api/payments/my'),
      ]);

      const myBookings = bookingsRes.data;
      setPayments(paymentsRes.data);

      // Look for today's active or upcoming booking
      const todayStr = new Date().toISOString().split('T')[0];
      const todayBooking = myBookings.find(
        (b) => b.booking_date === todayStr && b.status !== 'cancelled'
      ) || myBookings.find((b) => b.status !== 'completed' && b.status !== 'cancelled');

      if (todayBooking) {
        setActiveBooking(todayBooking);
        subscribeToCentreQueue(todayBooking.centre_id);

        // Fetch precise farmer queue position
        try {
          const qRes = await api.get(`/api/queue/farmer/status?centre_id=${todayBooking.centre_id}`);
          setQueueStatus(qRes.data);
        } catch (err) {
          console.error("No active queue entry yet", err);
        }
      }
    } catch (err) {
      console.error("Error loading dashboard data", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Update when WebSocket message arrives
  useEffect(() => {
    if (liveQueueData && activeBooking) {
      setQueueStatus((prev) => ({
        ...prev,
        ...liveQueueData,
        farmer_token: activeBooking.token_display,
      }));
    }
  }, [liveQueueData]);

  const handleManualRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const farmerProfile = user?.farmer_profile;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-farmer-800 to-farmer-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-farmer-200 uppercase tracking-wider">
                {t('welcome')},
              </span>
              <span className="bg-farmer-700 text-farmer-200 text-[11px] font-mono px-2 py-0.5 rounded-full">
                {farmerProfile?.farmer_id || "FID-DEMO"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {farmerProfile?.full_name || user?.email || user?.mobile}
            </h1>
            <p className="text-xs text-farmer-200 mt-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {farmerProfile?.address}, {farmerProfile?.district}, {farmerProfile?.state}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleManualRefresh}
              disabled={refreshing}
              className="bg-white/10 hover:bg-white/20 text-white font-medium px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition border border-white/20"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{t('refresh')}</span>
            </button>

            <Link
              to="/book-slot"
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition shadow-md flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4" />
              <span>{t('bookNow')}</span>
            </Link>
          </div>
        </div>

        {/* Active Booking Card */}
        {activeBooking ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-farmer-50 border border-farmer-200 flex items-center justify-center text-farmer-700 font-black text-xl">
                  {activeBooking.token_number}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-lg">
                      {activeBooking.token_display}
                    </span>
                    <QueueBadge status={queueStatus?.farmer_status || activeBooking.status} />
                  </div>
                  <p className="text-xs text-slate-500">
                    Booking ID: <span className="font-mono font-medium">{activeBooking.booking_number}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to="/live-queue"
                  className="bg-farmer-600 hover:bg-farmer-700 text-white font-semibold px-4 py-2 rounded-xl text-xs transition flex items-center gap-1.5 shadow-sm"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Open Live Queue Monitor</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Stepper */}
            <div>
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Procurement Progress:
              </p>
              <StatusStepper status={queueStatus?.farmer_status || activeBooking.status} />
            </div>

            {/* Live Counter Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  {t('currentToken')}
                </span>
                <span className="text-2xl font-black text-slate-900 font-mono">
                  {queueStatus?.serving_token || "None Active"}
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">Currently at counter</span>
              </div>

              <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/80">
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
                  {t('peopleAhead')}
                </span>
                <span className="text-2xl font-black text-amber-900">
                  {queueStatus?.people_ahead ?? activeBooking.people_ahead ?? 0}
                </span>
                <span className="text-[11px] text-amber-700 block mt-1">Farmers waiting before you</span>
              </div>

              <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200/80">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                  {t('estimatedWait')}
                </span>
                <span className="text-2xl font-black text-emerald-900">
                  ~{queueStatus?.estimated_wait_minutes ?? activeBooking.estimated_wait_minutes ?? 0} {t('minutes')}
                </span>
                <span className="text-[11px] text-emerald-700 block mt-1">Calculated in real-time</span>
              </div>
            </div>

            {/* Details Strip */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span className="font-semibold text-slate-900">{activeBooking.centre_name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Date: <strong className="text-slate-900">{activeBooking.booking_date}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Time: <strong className="text-slate-900">{activeBooking.slot_time}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>Commodity: <strong className="text-slate-900">{activeBooking.estimated_quantity_quintals} Qtl {activeBooking.crop_type}</strong></span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-full bg-farmer-50 text-farmer-600 flex items-center justify-center mx-auto">
              <Calendar className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{t('noActiveBooking')}</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                Select your nearest procurement centre and book a verified arrival slot to receive a priority queue token.
              </p>
            </div>
            <Link
              to="/book-slot"
              className="inline-flex items-center gap-2 bg-farmer-600 hover:bg-farmer-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition shadow-md shadow-farmer-600/20"
            >
              <Calendar className="w-4 h-4" />
              <span>{t('bookNow')}</span>
            </Link>
          </div>
        )}

        {/* Bottom Grid: Quick Links & Payment Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quick Access Tiles */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 text-base mb-4">Farmer Services</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/centres"
                className="p-4 rounded-2xl bg-slate-50 hover:bg-farmer-50 border border-slate-200 hover:border-farmer-300 transition text-left group"
              >
                <MapPin className="w-5 h-5 text-farmer-600 mb-2 group-hover:scale-110 transition" />
                <span className="font-bold text-slate-900 text-xs block">Procurement Centres</span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">View map & live queue</span>
              </Link>

              <Link
                to="/my-bookings"
                className="p-4 rounded-2xl bg-slate-50 hover:bg-farmer-50 border border-slate-200 hover:border-farmer-300 transition text-left group"
              >
                <Calendar className="w-5 h-5 text-farmer-600 mb-2 group-hover:scale-110 transition" />
                <span className="font-bold text-slate-900 text-xs block">My Bookings</span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">History & passes</span>
              </Link>

              <Link
                to="/procurement"
                className="p-4 rounded-2xl bg-slate-50 hover:bg-farmer-50 border border-slate-200 hover:border-farmer-300 transition text-left group"
              >
                <FileText className="w-5 h-5 text-farmer-600 mb-2 group-hover:scale-110 transition" />
                <span className="font-bold text-slate-900 text-xs block">Procurement Slips</span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Quality & MSP receipts</span>
              </Link>

              <Link
                to="/payments"
                className="p-4 rounded-2xl bg-slate-50 hover:bg-farmer-50 border border-slate-200 hover:border-farmer-300 transition text-left group"
              >
                <CreditCard className="w-5 h-5 text-farmer-600 mb-2 group-hover:scale-110 transition" />
                <span className="font-bold text-slate-900 text-xs block">DBT Payments</span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Direct bank transfers</span>
              </Link>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 text-base">Direct Benefit Transfer (DBT)</h3>
                <Link to="/payments" className="text-xs text-farmer-700 font-semibold hover:underline">
                  View all →
                </Link>
              </div>

              {payments.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl">
                  No procurement payments processed yet. Once your crop is inspected, your DBT payout will appear here.
                </div>
              ) : (
                <div className="space-y-3">
                  {payments.slice(0, 2).map((p) => (
                    <div key={p.id} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">
                            ₹{p.amount.toLocaleString('en-IN')}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            p.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {p.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {p.crop_name} • Ref: {p.transaction_id || 'Pending UTR'}
                        </p>
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {p.payment_date ? new Date(p.payment_date).toLocaleDateString() : 'Processing'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3 text-[11px] text-emerald-800 flex items-center gap-2 mt-4">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>All payments are directly disbursed into your Aadhaar-linked bank account.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
