import React, { useState } from 'react';
import { ProcurementCentre } from '../../types';
import { MapPin, Navigation, Clock, Users, ShieldAlert, CheckCircle } from 'lucide-react';

interface ProcurementMapProps {
  centres: ProcurementCentre[];
  onSelectCentre?: (centre: ProcurementCentre) => void;
  selectedCentreId?: string;
}

export const ProcurementMap: React.FC<ProcurementMapProps> = ({
  centres,
  onSelectCentre,
  selectedCentreId,
}) => {
  const [selectedState, setSelectedState] = useState<string>('All');
  const [activeCentre, setActiveCentre] = useState<ProcurementCentre>(centres[0]);

  const filteredCentres =
    selectedState === 'All'
      ? centres
      : centres.filter((c) => c.state.toLowerCase() === selectedState.toLowerCase());

  const getCapacityStatus = (centre: ProcurementCentre) => {
    const booked = centre.todayBookingsCount || 0;
    const capacity = centre.dailyFarmerCapacity;
    const pct = (booked / capacity) * 100;
    if (pct >= 95) return { label: 'Over Capacity', color: 'bg-rose-500 text-white', border: 'border-rose-300' };
    if (pct >= 75) return { label: 'Near Capacity', color: 'bg-amber-500 text-white', border: 'border-amber-300' };
    return { label: 'Normal Flow', color: 'bg-emerald-600 text-white', border: 'border-emerald-300' };
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>National Procurement Centre Geo-Map</span>
          </h3>
          <p className="text-[11px] text-slate-500">
            Real-time yard congestion, processing rates, and arrival status
          </p>
        </div>

        {/* State Filter Buttons */}
        <div className="flex items-center space-x-1.5 overflow-x-auto text-xs">
          {['All', 'Rajasthan', 'Punjab', 'Haryana', 'Madhya Pradesh'].map((state) => (
            <button
              key={state}
              onClick={() => setSelectedState(state)}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
                selectedState === state
                  ? 'bg-blue-700 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {state}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3">
        {/* Visual Map Canvas (Styled Vector India Regional Representation) */}
        <div className="lg:col-span-2 bg-[#0b2238] p-6 relative min-h-[380px] flex flex-col justify-between overflow-hidden">
          {/* Subtle Background Grid & Coordinate lines */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle, #38bdf8 1px, transparent 1px), linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)',
              backgroundSize: '32px 32px, 64px 64px, 64px 64px',
            }}
          ></div>

          {/* Top Geo Info Overlay */}
          <div className="relative z-10 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center space-x-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-700 backdrop-blur-sm">
              <Navigation className="w-3.5 h-3.5 text-blue-400 animate-spin" style={{ animationDuration: '8s' }} />
              <span>National Mandi Radar: <strong>{filteredCentres.length} Centres Active</strong></span>
            </div>
            <div className="flex items-center space-x-3 text-[11px]">
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                <span>Normal (&lt;75%)</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                <span>Near Capacity (75-95%)</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
                <span>Over Capacity (&gt;95%)</span>
              </span>
            </div>
          </div>

          {/* Interactive Mandi Pin Nodes */}
          <div className="relative z-10 my-auto py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
              {filteredCentres.map((centre) => {
                const status = getCapacityStatus(centre);
                const isSelected = (selectedCentreId || activeCentre.id) === centre.id;
                const bookedPct = Math.round(((centre.todayBookingsCount || 0) / centre.dailyFarmerCapacity) * 100);

                return (
                  <div
                    key={centre.id}
                    onClick={() => {
                      setActiveCentre(centre);
                      if (onSelectCentre) onSelectCentre(centre);
                    }}
                    className={`p-4 rounded-xl cursor-pointer transition-all border backdrop-blur-md ${
                      isSelected
                        ? 'bg-blue-900/60 border-blue-400 shadow-lg shadow-blue-500/20 scale-[1.02]'
                        : 'bg-slate-900/70 border-slate-700 hover:border-slate-500 hover:bg-slate-900/90'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0" />
                          <h4 className="font-bold text-white text-xs leading-tight">{centre.name}</h4>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          {centre.district}, {centre.state} • {centre.code}
                        </p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${status.color}`}>
                        {status.label}
                      </span>
                    </div>

                    {/* Capacity Bar */}
                    <div className="mt-3 space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-300">
                        <span>Daily Load: {centre.todayBookingsCount} / {centre.dailyFarmerCapacity}</span>
                        <span className="font-bold">{bookedPct}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            bookedPct > 90 ? 'bg-rose-500' : bookedPct > 70 ? 'bg-amber-400' : 'bg-emerald-400'
                          }`}
                          style={{ width: `${Math.min(100, bookedPct)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-blue-400" />
                        <span>Avg Wait: ~{centre.avgWaitMinutes} mins</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Users className="w-3 h-3 text-green-400" />
                        <span>Completed: {centre.todayCompletedCount}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative z-10 text-[10px] text-slate-400 text-center">
            * GIS geo-coordinates mapped across APMC Mandi yards • Updates live with token flow
          </div>
        </div>

        {/* Selected Centre Deep Dive Sidebar */}
        <div className="p-6 bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              <span>Selected Mandi Inspectorate</span>
            </div>
            <h4 className="text-base font-extrabold text-slate-900 leading-tight">
              {activeCentre.name}
            </h4>
            <p className="text-xs text-slate-600 mt-1">{activeCentre.mandiLocation}</p>

            <div className="mt-4 space-y-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <p className="text-slate-400 text-[11px]">Centre In-Charge</p>
                <p className="font-bold text-slate-800 text-sm mt-0.5">{activeCentre.centreManagerName}</p>
                <p className="text-blue-700 text-xs font-mono mt-0.5">{activeCentre.contactNumber}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <p className="text-slate-400 text-[10px]">Active Assaying Bays</p>
                  <p className="font-black text-slate-800 text-base mt-0.5">{activeCentre.activeBays} Bays</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <p className="text-slate-400 text-[10px]">Daily Capacity</p>
                  <p className="font-black text-slate-800 text-base mt-0.5">{activeCentre.dailyFarmerCapacity}</p>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Today's Bookings:</span>
                  <span className="font-bold text-slate-900">{activeCentre.todayBookingsCount} farmers</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Arrived at Yard:</span>
                  <span className="font-bold text-amber-700">{activeCentre.todayArrivedCount} farmers</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Intake Completed:</span>
                  <span className="font-bold text-emerald-700">{activeCentre.todayCompletedCount} farmers</span>
                </div>
                <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-100">
                  <span>Remaining Daily Slots:</span>
                  <span className="font-bold text-blue-700">
                    {activeCentre.dailyFarmerCapacity - (activeCentre.todayBookingsCount || 0)} slots
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <div className="text-[11px] text-slate-500 bg-blue-50 p-2.5 rounded-lg border border-blue-200 flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>Anti-congestion load balancing active. Capacity updates every minute.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
