import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  ChevronRight,
  ShieldCheck,
  Scale,
} from 'lucide-react';

interface SlotBookingPageProps {
  setActiveTab: (tab: string) => void;
}

export const SlotBookingPage: React.FC<SlotBookingPageProps> = ({ setActiveTab }) => {
  const { currentFarmer, crops, centres, slots, bookSlot } = useApp();

  const [selectedCropId, setSelectedCropId] = useState<string>('wheat');
  const [selectedCentreId, setSelectedCentreId] = useState<string>('centre-jaipur-01');
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [selectedTimeWindow, setSelectedTimeWindow] = useState<string>('10:00 – 11:00 AM');
  const [quantity, setQuantity] = useState<number>(12);
  const [confirmedBooking, setConfirmedBooking] = useState<{
    reference: string;
    token: string;
    centreName: string;
    timeWindow: string;
  } | null>(null);

  const selectedCrop = crops.find((c) => c.id === selectedCropId) || crops[0];
  const selectedCentre = centres.find((c) => c.id === selectedCentreId) || centres[0];

  const availableSlots = slots.filter((s) => s.centreId === selectedCentreId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0) return;

    const booking = bookSlot({
      farmerId: currentFarmer?.id || 'farmer-01',
      centreId: selectedCentreId,
      cropId: selectedCropId,
      slotDate: selectedDate,
      timeWindow: selectedTimeWindow,
      quantity,
    });

    setConfirmedBooking({
      reference: booking.bookingReference,
      token: booking.tokenNumber || 'A-125',
      centreName: selectedCentre.name,
      timeWindow: selectedTimeWindow,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Title */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
              SLOT RESERVATION PORTAL
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Book Mandi Procurement Slot
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Avoid long queue waiting times with transparent time slot scheduling & pre-allocated bay access
          </p>
        </div>

        <button
          onClick={() => setActiveTab('farmer-queue')}
          className="text-xs font-bold text-blue-700 hover:text-blue-600 flex items-center space-x-1"
        >
          <span>Check Active Queue Status</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {confirmedBooking ? (
        /* Confirmation Screen */
        <div className="bg-white p-8 rounded-2xl border border-emerald-300 shadow-md text-center space-y-5 animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Procurement Slot Confirmed
            </span>
            <h3 className="text-2xl font-black text-slate-900 mt-2">
              Queue Token: {confirmedBooking.token}
            </h3>
            <p className="text-xs font-mono font-semibold text-slate-500 mt-0.5">
              Booking Ref: {confirmedBooking.reference}
            </p>
          </div>

          <div className="max-w-md mx-auto bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Procurement Centre:</span>
              <span className="font-bold text-slate-800">{confirmedBooking.centreName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Date & Window:</span>
              <span className="font-bold text-slate-800">{selectedDate} ({confirmedBooking.timeWindow})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Declared Quantity:</span>
              <span className="font-bold text-slate-800">{quantity} Quintals ({selectedCrop.name})</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-emerald-800">
              <span>MSP Rate Guarantee:</span>
              <span>₹{selectedCrop.mspRate.toLocaleString('en-IN')}/Qtl (₹{(quantity * selectedCrop.mspRate).toLocaleString('en-IN')})</span>
            </div>
          </div>

          <div className="pt-2 flex justify-center space-x-3">
            <button
              onClick={() => setActiveTab('farmer-queue')}
              className="px-5 py-2.5 bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-sm transition"
            >
              Track Live Token in Queue
            </button>
            <button
              onClick={() => setConfirmedBooking(null)}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition"
            >
              Book Another Slot
            </button>
          </div>
        </div>
      ) : (
        /* Slot Booking Form */
        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            {/* 1. Crop Selection */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Select Crop / फसल का चयन
              </label>
              <select
                value={selectedCropId}
                onChange={(e) => setSelectedCropId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-600 text-xs"
              >
                {crops.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — MSP: ₹{c.mspRate}/Qtl
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-emerald-700 font-medium mt-1">
                ✓ Guaranteed Government MSP: ₹{selectedCrop.mspRate.toLocaleString('en-IN')} per quintal
              </p>
            </div>

            {/* 2. Centre Selection */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Select Procurement Centre / खरीद केंद्र
              </label>
              <select
                value={selectedCentreId}
                onChange={(e) => setSelectedCentreId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-600 text-xs"
              >
                {centres.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.district})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 mt-1">
                📍 {selectedCentre.mandiLocation}
              </p>
            </div>

            {/* 3. Date Selection */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Procurement Date / दिनांक
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-600 text-xs"
              />
            </div>

            {/* 4. Declared Quantity */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Estimated Quantity / अनुमानित मात्रा (Quintals)
              </label>
              <input
                type="number"
                min={1}
                max={500}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-semibold focus:bg-white focus:ring-2 focus:ring-blue-600 text-xs"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Estimated Payout: <strong>₹{(quantity * selectedCrop.mspRate).toLocaleString('en-IN')}</strong> (Gross)
              </p>
            </div>
          </div>

          {/* 5. Live Slot Capacity Grid */}
          <div>
            <label className="block font-bold text-slate-700 mb-2 text-xs">
              Select Time Window & Live Bay Capacity / समय स्लॉट और उपलब्ध क्षमता
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              {availableSlots.map((slot) => {
                const remaining = slot.capacity - slot.bookedCount;
                const isFull = remaining <= 0;
                const isSelected = selectedTimeWindow === slot.timeWindow;

                return (
                  <button
                    type="button"
                    key={slot.id}
                    disabled={isFull}
                    onClick={() => setSelectedTimeWindow(slot.timeWindow)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-blue-900 text-white border-blue-900 shadow-md ring-2 ring-blue-500'
                        : isFull
                        ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                        : 'bg-slate-50 hover:bg-white hover:border-slate-300 text-slate-800 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold">{slot.timeWindow}</span>
                      {isFull && (
                        <span className="text-[9px] font-bold uppercase bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded">
                          FULL
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span>{isFull ? 'Capacity Exhausted' : `${remaining} / ${slot.capacity} slots left`}</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            isFull ? 'bg-rose-500' : remaining < 5 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${(slot.bookedCount / slot.capacity) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Anti-Congestion Advisory */}
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 flex items-start space-x-3 text-xs text-blue-900">
            <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold">Transparent Mandi Queue Guarantee</p>
              <p className="text-blue-800 text-[11px] leading-relaxed">
                By booking a slot, your vehicle is reserved entry at the allocated bay. The real-time queue algorithm prevents middleman queue-jumping and enforces electronic weighment verification.
              </p>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setActiveTab('farmer-dashboard')}
              className="px-4 py-2.5 text-slate-600 hover:text-slate-900 text-xs font-semibold"
            >
              Back to Dashboard
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-sm transition"
            >
              Confirm Slot & Generate Token
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
