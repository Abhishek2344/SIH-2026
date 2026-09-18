import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Clock,
  CheckCircle2,
  Users,
  Volume2,
  VolumeX,
  AlertCircle,
  Building,
  Navigation,
  RefreshCw,
} from 'lucide-react';

export const QueueStatusPage: React.FC = () => {
  const { currentFarmer, tokens, centres } = useApp();
  const [audioAlertEnabled, setAudioAlertEnabled] = useState(true);

  // Jaipur Centre
  const centre = centres[0];
  const activeToken = tokens.find((t) => t.farmerId === currentFarmer?.id && t.status !== 'COMPLETED') || tokens.find((t) => t.tokenNumber === 'A-124') || tokens[tokens.length - 1];

  // Currently serving tokens
  const servingToken = tokens.find(
    (t) => t.status === 'CALLED' || t.status === 'WEIGHING' || t.status === 'IN_VERIFICATION'
  ) || tokens[1];

  const tokensAhead =
    activeToken && servingToken
      ? Math.max(0, activeToken.sequenceOrder - servingToken.sequenceOrder)
      : 0;

  const estimatedMins = tokensAhead * 4;

  const isMyTokenCalled = activeToken?.status === 'CALLED';
  const isMyTokenProcessing = activeToken?.status === 'IN_VERIFICATION' || activeToken?.status === 'WEIGHING';
  const isMyTokenCompleted = activeToken?.status === 'COMPLETED';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Banner Alert if Token is called */}
      {isMyTokenCalled && (
        <div className="bg-amber-500 text-slate-950 p-4 rounded-2xl shadow-lg border-2 border-amber-300 flex items-center justify-between animate-pulse">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-slate-950 text-amber-400 flex items-center justify-center font-bold text-lg">
              📢
            </div>
            <div>
              <h3 className="text-base font-black uppercase tracking-tight">
                Attention Ramesh Kumar: Token {activeToken?.tokenNumber} is CALLED!
              </h3>
              <p className="text-xs font-semibold text-slate-900">
                Please bring your tractor/trolley to Bay No. 3 for digital moisture sampling and weighment.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold uppercase bg-slate-950 text-white px-3 py-1 rounded-lg">
            Proceed Immediately
          </span>
        </div>
      )}

      {/* Main Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>LIVE QUEUE BROADCAST</span>
            </span>
            <span className="text-xs font-mono text-slate-500">
              {centre.name} ({centre.code})
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Real-Time Mandi Queue Status
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Synchronized with weighbridge telemetry and inspection bay token counter
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setAudioAlertEnabled(!audioAlertEnabled)}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
              audioAlertEnabled
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-slate-100 text-slate-500 border-slate-300'
            }`}
          >
            {audioAlertEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>{audioAlertEnabled ? 'Audio Chime ON' : 'Audio Muted'}</span>
          </button>
        </div>
      </div>

      {/* Hero Personal Queue Card */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0b2238] to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
          {/* Your Token */}
          <div className="py-2">
            <p className="text-slate-400 text-xs uppercase font-semibold">Your Token Number</p>
            <p className="text-4xl sm:text-5xl font-black text-amber-400 font-mono tracking-tight mt-1">
              {activeToken?.tokenNumber || 'A-124'}
            </p>
            <p className="text-xs text-slate-300 mt-1 font-semibold">
              Ramesh Kumar (12 Qtl Wheat)
            </p>
          </div>

          {/* Currently Serving */}
          <div className="py-2">
            <p className="text-slate-400 text-xs uppercase font-semibold">Currently Serving</p>
            <p className="text-4xl sm:text-5xl font-black text-emerald-400 font-mono tracking-tight mt-1">
              {servingToken?.tokenNumber || 'A-113'}
            </p>
            <p className="text-xs text-slate-300 mt-1">
              Counter / Assaying Bay 3
            </p>
          </div>

          {/* Farmers Ahead */}
          <div className="py-2">
            <p className="text-slate-400 text-xs uppercase font-semibold">Trolleys Ahead of You</p>
            <p className="text-4xl sm:text-5xl font-black text-white tracking-tight mt-1">
              {tokensAhead}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {tokensAhead <= 5 && tokensAhead > 0 ? (
                <span className="text-amber-400 font-bold">Only {tokensAhead} ahead! Stand by.</span>
              ) : tokensAhead === 0 ? (
                <span className="text-emerald-400 font-bold">Your turn at bay!</span>
              ) : (
                'In Waiting Area B'
              )}
            </p>
          </div>

          {/* Estimated Waiting Time */}
          <div className="py-2">
            <p className="text-slate-400 text-xs uppercase font-semibold">Estimated Waiting Time</p>
            <p className="text-3xl sm:text-4xl font-black text-sky-400 tracking-tight mt-1 flex items-center justify-center space-x-1">
              <Clock className="w-7 h-7 inline-block text-sky-400" />
              <span>~{estimatedMins} min</span>
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Avg Processing: 4.2 min/trolley
            </p>
          </div>
        </div>

        {/* Dynamic Status Progress Indicator */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <div className="flex justify-between text-xs text-slate-300 mb-2">
            <span>Intake Stage Status</span>
            <span className="font-bold text-amber-400 uppercase">
              {activeToken?.status || 'WAITING'}
            </span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isMyTokenCompleted
                  ? 'w-full bg-emerald-500'
                  : isMyTokenProcessing
                  ? 'w-3/4 bg-amber-400 animate-pulse'
                  : isMyTokenCalled
                  ? 'w-1/2 bg-blue-500 animate-pulse'
                  : 'w-1/4 bg-slate-500'
              }`}
            ></div>
          </div>
        </div>
      </div>

      {/* Live Mandi Queue Board (Public Display Style) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Electronic Mandi Queue Board (Bay 1 – 6)
            </h3>
            <p className="text-xs text-slate-500">
              Real-time sequence of arriving, assaying, and weighed vehicles
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-md">
            Active Tokens: {tokens.length}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Col 1: Serving & Weighing */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase text-emerald-800 flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>At Inspection / Weighment</span>
              </span>
            </div>
            <div className="space-y-2">
              {tokens
                .filter((t) => ['CALLED', 'IN_VERIFICATION', 'WEIGHING'].includes(t.status))
                .map((t) => (
                  <div
                    key={t.id}
                    className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
                      t.tokenNumber === activeToken?.tokenNumber
                        ? 'bg-amber-100 border-amber-400 font-bold'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div>
                      <span className="font-mono text-sm font-black text-slate-900">{t.tokenNumber}</span>
                      <p className="text-[11px] text-slate-500">{t.farmerName} • {t.quantityQuintals} Qtl</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                      {t.status}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Col 2: Waiting Queue */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase text-blue-800 flex items-center space-x-1.5">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                <span>Waiting in Yard (Next in Line)</span>
              </span>
            </div>
            <div className="space-y-2">
              {tokens
                .filter((t) => t.status === 'WAITING')
                .slice(0, 5)
                .map((t) => (
                  <div
                    key={t.id}
                    className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
                      t.tokenNumber === activeToken?.tokenNumber
                        ? 'bg-amber-100 border-amber-400 font-bold'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div>
                      <span className="font-mono text-sm font-bold text-slate-800">{t.tokenNumber}</span>
                      <p className="text-[11px] text-slate-500">{t.farmerName} • {t.quantityQuintals} Qtl</p>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      ~{Math.max(0, t.sequenceOrder - (servingToken?.sequenceOrder || 110)) * 4}m
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Col 3: Recently Completed Intakes */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase text-slate-600 flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Recently Completed (Today)</span>
              </span>
            </div>
            <div className="space-y-2">
              {tokens
                .filter((t) => t.status === 'COMPLETED')
                .slice(0, 5)
                .map((t) => (
                  <div
                    key={t.id}
                    className="p-3 rounded-lg border border-slate-200 bg-white text-xs flex items-center justify-between opacity-80"
                  >
                    <div>
                      <span className="font-mono text-sm font-bold text-slate-600">{t.tokenNumber}</span>
                      <p className="text-[11px] text-slate-400">{t.farmerName} • Procured</p>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold">
                      ✓ Done
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
