import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Printer, 
  ArrowRight,
  Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import QueueBadge from '../components/QueueBadge';
import api from '../services/api';

const MyBookings = () => {
  const { t } = useLanguage();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchBookings = () => {
    setLoading(true);
    api.get('/api/bookings/my')
      .then((res) => setBookings(res.data))
      .catch((err) => {
        console.error(err);
        setError("Failed to load bookings");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking? This will release your token.")) {
      return;
    }

    setCancellingId(id);
    setError('');
    setSuccess('');

    try {
      await api.post(`/api/bookings/${id}/cancel`);
      setSuccess("Booking successfully cancelled.");
      fetchBookings();
    } catch (err) {
      setError(err.response?.data?.detail || "Could not cancel booking");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {t('myBookings')}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Track arrival appointments, print token badges, and view procurement status
            </p>
          </div>

          <Link
            to="/book-slot"
            className="self-start sm:self-auto bg-farmer-600 hover:bg-farmer-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm"
          >
            <Calendar className="w-4 h-4" />
            <span>Book New Slot</span>
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-2xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-xs p-3.5 rounded-2xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-32 bg-slate-200 animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm space-y-4">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">No bookings recorded</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven't scheduled any crop procurement appointments yet.
            </p>
            <Link
              to="/book-slot"
              className="inline-flex items-center gap-1.5 bg-farmer-600 hover:bg-farmer-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition"
            >
              <span>{t('bookNow')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => {
              const canCancel = ['booked', 'waiting'].includes(b.status.toLowerCase());

              return (
                <div
                  key={b.id}
                  className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-farmer-50 border border-farmer-200 flex flex-col items-center justify-center text-farmer-800 shrink-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-farmer-600">TOKEN</span>
                      <span className="text-xl font-black font-mono leading-none">{b.token_number}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 text-base">{b.centre_name}</span>
                        <QueueBadge status={b.status} />
                      </div>

                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{b.centre_address}</span>
                      </p>

                      <div className="flex items-center gap-4 text-xs text-slate-600 pt-1 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <strong>Date:</strong> {b.booking_date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <strong>Window:</strong> {b.slot_time}
                        </span>
                        <span>
                          <strong>Crop:</strong> {b.estimated_quantity_quintals} Qtl {b.crop_type}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end md:self-center border-t md:border-t-0 pt-3 md:pt-0 w-full md:w-auto justify-end">
                    <Link
                      to="/live-queue"
                      className="bg-farmer-50 hover:bg-farmer-100 text-farmer-800 border border-farmer-200 font-semibold px-3 py-2 rounded-xl text-xs transition flex items-center gap-1"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Queue</span>
                    </Link>

                    {canCancel && (
                      <button
                        onClick={() => handleCancelBooking(b.id)}
                        disabled={cancellingId === b.id}
                        className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-semibold px-3 py-2 rounded-xl text-xs transition flex items-center gap-1 disabled:opacity-50"
                      >
                        {cancellingId === b.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5" />
                        )}
                        <span>Cancel</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
