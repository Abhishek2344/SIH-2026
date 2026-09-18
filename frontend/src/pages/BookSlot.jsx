import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Printer, 
  ArrowRight, 
  Sparkles,
  ChevronLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const BookSlot = () => {
  const { isAuthenticated, isFarmer } = useAuth();
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [centres, setCentres] = useState([]);
  const [selectedCentreId, setSelectedCentreId] = useState(searchParams.get('centre_id') || '');
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [slots, setSlots] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [cropType, setCropType] = useState('Wheat');
  const [estimatedQuantity, setEstimatedQuantity] = useState(20);

  const [loadingCentres, setLoadingCentres] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [bookingConfirmation, setBookingConfirmation] = useState(null);

  // Load centres
  useEffect(() => {
    api.get('/api/centres?active_only=true')
      .then((res) => {
        setCentres(res.data);
        if (!selectedCentreId && res.data.length > 0) {
          setSelectedCentreId(res.data[0].id.toString());
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoadingCentres(false));
  }, []);

  // Fetch slots whenever centre or date changes
  useEffect(() => {
    if (!selectedCentreId || !selectedDate) return;

    setLoadingSlots(true);
    setSelectedSlotId(null);
    setError('');

    api.get(`/api/slots?centre_id=${selectedCentreId}&slot_date=${selectedDate}`)
      .then((res) => {
        setSlots(res.data);
        const firstAvail = res.data.find((s) => !s.is_full && s.is_active);
        if (firstAvail) setSelectedSlotId(firstAvail.id);
      })
      .catch((err) => console.error("Error loading slots", err))
      .finally(() => setLoadingSlots(false));
  }, [selectedCentreId, selectedDate]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!selectedSlotId) {
      setError("Please select an available time slot.");
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const payload = {
        centre_id: parseInt(selectedCentreId),
        slot_id: selectedSlotId,
        booking_date: selectedDate,
        crop_type: cropType,
        estimated_quantity_quintals: parseFloat(estimatedQuantity),
      };

      const res = await api.post('/api/bookings', payload);
      setBookingConfirmation(res.data);
    } catch (err) {
      const msg = err.response?.data?.detail || "Booking failed. Slot may be fully booked or you may already have a booking for this date.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedCentre = centres.find((c) => c.id.toString() === selectedCentreId.toString());

  // Available dates: today + next 4 days
  const dateOptions = Array.from({ length: 5 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const label = i === 0 ? "Today" : i === 1 ? "Tomorrow" : d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    return { dateStr, label };
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {t('bookSlot')}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Select date, centre, and time slot to receive your confirmed queue token pass
            </p>
          </div>
          <Link
            to="/centres"
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Centres</span>
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-2.5 text-xs text-red-700">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Booking Warning</p>
              <p className="mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleBookingSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          {/* Step 1: Centre */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              {t('selectCentre')}
            </label>
            {loadingCentres ? (
              <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
            ) : (
              <select
                value={selectedCentreId}
                onChange={(e) => setSelectedCentreId(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-farmer-500"
              >
                {centres.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.district}, {c.state}) - {c.current_queue_size} in queue
                  </option>
                ))}
              </select>
            )}

            {selectedCentre && (
              <p className="text-xs text-slate-500 flex items-center gap-1 pl-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{selectedCentre.address}</span>
              </p>
            )}
          </div>

          {/* Step 2: Date */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              {t('selectDate')}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {dateOptions.map(({ dateStr, label }) => (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => setSelectedDate(dateStr)}
                  className={`p-3 rounded-2xl border text-center transition ${
                    selectedDate === dateStr
                      ? 'bg-farmer-600 text-white border-farmer-600 font-bold shadow-md shadow-farmer-600/20'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="block text-xs uppercase tracking-wider">{label}</span>
                  <span className="block text-sm font-mono mt-0.5">{dateStr}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Slots */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              {t('selectSlot')}
            </label>

            {loadingSlots ? (
              <div className="py-8 text-center">
                <Loader2 className="w-6 h-6 text-farmer-600 animate-spin mx-auto mb-2" />
                <span className="text-xs text-slate-500">Checking slot availability...</span>
              </div>
            ) : slots.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
                No slots configured for this date. Please select another date.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {slots.map((slot) => {
                  const isSelected = selectedSlotId === slot.id;
                  const isFull = slot.is_full || !slot.is_active;

                  return (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={isFull}
                      onClick={() => setSelectedSlotId(slot.id)}
                      className={`p-4 rounded-2xl border text-left transition flex items-center justify-between ${
                        isFull
                          ? 'bg-slate-100 border-slate-200 opacity-50 cursor-not-allowed'
                          : isSelected
                          ? 'bg-farmer-50 border-farmer-600 ring-2 ring-farmer-600 text-farmer-900 font-semibold'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5 text-sm font-bold">
                          <Clock className="w-4 h-4 text-slate-500" />
                          <span>{slot.start_time} - {slot.end_time}</span>
                        </div>
                        <span className="text-xs text-slate-500 mt-1 block">
                          Capacity: {slot.booked_count} / {slot.capacity} booked
                        </span>
                      </div>

                      <div className="text-right">
                        {isFull ? (
                          <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                            {t('full')}
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                            {slot.available_count} left
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Step 4: Crop Details */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              {t('enterCropDetails')}
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  {t('cropType')} *
                </label>
                <select
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-farmer-500"
                >
                  <option value="Wheat">Wheat (गेहूं) - PBW 550 / Sharbati</option>
                  <option value="Paddy">Paddy / Rice (धान) - PR 126 / Basmati</option>
                  <option value="Mustard">Mustard (सरसों)</option>
                  <option value="Gram">Gram / Chana (चना)</option>
                  <option value="Maize">Maize (मक्का)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  {t('estimatedQuantity')} *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="1000"
                  step="0.5"
                  value={estimatedQuantity}
                  onChange={(e) => setEstimatedQuantity(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-farmer-500"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || !selectedSlotId}
            className="w-full bg-farmer-600 hover:bg-farmer-700 text-white font-bold py-4 px-6 rounded-2xl text-base transition shadow-lg shadow-farmer-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating Token Pass...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>{t('bookSlotBtn')}</span>
              </>
            )}
          </button>
        </form>

        {/* Confirmation Modal */}
        {bookingConfirmation && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 animate-in zoom-in-95">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-slate-900">
                  {t('bookingSuccess')}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Your arrival token has been logged into the procurement registry.
                </p>
              </div>

              {/* Token Pass Card */}
              <div className="bg-gradient-to-br from-farmer-50 to-emerald-50 border-2 border-dashed border-farmer-300 rounded-2xl p-6 text-center space-y-3">
                <span className="text-xs font-bold text-farmer-800 uppercase tracking-wider">
                  {t('tokenIssued')}
                </span>
                <div className="text-4xl sm:text-5xl font-black text-farmer-800 font-mono tracking-tight">
                  {bookingConfirmation.token_display}
                </div>
                <p className="text-xs text-slate-600">
                  Booking Ref: <strong className="font-mono">{bookingConfirmation.booking_number}</strong>
                </p>
                <div className="border-t border-farmer-200/60 pt-3 text-xs text-slate-700 space-y-1">
                  <p><strong>Mandi:</strong> {bookingConfirmation.centre_name}</p>
                  <p><strong>Date:</strong> {bookingConfirmation.booking_date}</p>
                  <p><strong>Window:</strong> {bookingConfirmation.slot_time}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Printer className="w-4 h-4" />
                  <span>{t('printPass')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/live-queue')}
                  className="flex-1 bg-farmer-600 hover:bg-farmer-700 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
                >
                  <span>Go to Live Queue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookSlot;
