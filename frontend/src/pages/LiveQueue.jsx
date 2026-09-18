import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Users, 
  Volume2, 
  VolumeX, 
  Radio, 
  MapPin, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useWebSocket } from '../context/WebSocketContext';
import QueueBadge from '../components/QueueBadge';
import api from '../services/api';

const playChimeSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  } catch (err) {
    console.log("Audio not supported or permitted", err);
  }
};

const LiveQueue = () => {
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const { subscribeToCentreQueue, liveQueueData } = useWebSocket();

  const [centres, setCentres] = useState([]);
  const [selectedCentreId, setSelectedCentreId] = useState(null);
  const [queueState, setQueueState] = useState(null);
  const [farmerBooking, setFarmerBooking] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isLiveConnected, setIsLiveConnected] = useState(true);

  // Load centres & farmer active booking
  useEffect(() => {
    Promise.all([
      api.get('/api/centres?active_only=true'),
      isAuthenticated ? api.get('/api/bookings/my') : Promise.resolve({ data: [] }),
    ])
      .then(([centresRes, bookingsRes]) => {
        setCentres(centresRes.data);

        // Check if farmer has active booking today
        const todayStr = new Date().toISOString().split('T')[0];
        const active = bookingsRes.data.find(
          (b) => b.booking_date === todayStr && b.status !== 'cancelled'
        ) || bookingsRes.data.find((b) => b.status !== 'completed' && b.status !== 'cancelled');

        if (active) {
          setFarmerBooking(active);
          setSelectedCentreId(active.centre_id);
          subscribeToCentreQueue(active.centre_id);
        } else if (centresRes.data.length > 0) {
          setSelectedCentreId(centresRes.data[0].id);
          subscribeToCentreQueue(centresRes.data[0].id);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  // Fetch initial queue snapshot when centre changes
  useEffect(() => {
    if (!selectedCentreId) return;

    api.get(`/api/queue/${selectedCentreId}`)
      .then((res) => {
        setQueueState(res.data);
      })
      .catch((err) => console.error("Error loading queue snapshot", err));

    subscribeToCentreQueue(selectedCentreId);
  }, [selectedCentreId]);

  // Handle WebSocket updates
  useEffect(() => {
    if (liveQueueData && liveQueueData.centre_id === selectedCentreId) {
      setQueueState(liveQueueData);

      // If farmer's token is called, play audio chime!
      if (
        farmerBooking &&
        liveQueueData.called_tokens?.includes(farmerBooking.token_display) &&
        soundEnabled
      ) {
        playChimeSound();
      }
    }
  }, [liveQueueData, selectedCentreId, farmerBooking, soundEnabled]);

  const handleCentreChange = (e) => {
    const id = parseInt(e.target.value);
    setSelectedCentreId(id);
  };

  const isMyTokenServing = farmerBooking && queueState?.serving_token === farmerBooking.token_display;
  const isMyTokenCalled = farmerBooking && queueState?.called_tokens?.includes(farmerBooking.token_display);

  return (
    <div className="min-h-screen bg-slate-900 text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Real-Time WebSocket Feed Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              {t('liveQueueFeed')}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {t('liveQueueDescription')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Audio Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2.5 rounded-xl border transition text-xs flex items-center gap-1.5 ${
                soundEnabled
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
              title="Token Alert Chime Sound"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">Sound {soundEnabled ? 'ON' : 'OFF'}</span>
            </button>

            {/* Centre Selector */}
            <div className="w-56">
              <select
                value={selectedCentreId || ''}
                onChange={handleCentreChange}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {centres.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.district})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Farmer Personal Queue Status Card (If Booked) */}
        {farmerBooking && (
          <div className={`rounded-3xl p-6 border transition-all ${
            isMyTokenServing
              ? 'bg-emerald-950/70 border-emerald-500 shadow-xl shadow-emerald-900/30'
              : isMyTokenCalled
              ? 'bg-purple-950/70 border-purple-500 shadow-xl shadow-purple-900/30 animate-pulse'
              : 'bg-slate-800/80 border-slate-700'
          }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-farmer-600 text-white flex flex-col items-center justify-center font-mono font-black text-2xl shadow-lg">
                  <span className="text-[10px] font-sans font-bold text-farmer-200">YOUR</span>
                  <span>{farmerBooking.token_number}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold">{farmerBooking.token_display}</span>
                    <QueueBadge status={isMyTokenServing ? 'serving' : isMyTokenCalled ? 'called' : 'waiting'} />
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Mandi: <strong>{farmerBooking.centre_name}</strong> • Scheduled Window: {farmerBooking.slot_time}
                  </p>
                </div>
              </div>

              {/* Status Alert */}
              <div className="bg-slate-900/80 rounded-2xl px-5 py-3 border border-slate-700/60 text-right">
                {isMyTokenServing ? (
                  <div className="text-emerald-400 font-bold text-sm flex items-center gap-1.5 justify-end">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Now Serving at Counter! Proceed with vehicle.</span>
                  </div>
                ) : isMyTokenCalled ? (
                  <div className="text-purple-300 font-bold text-sm flex items-center gap-1.5 justify-end animate-bounce">
                    <Volume2 className="w-4 h-4" />
                    <span>Your Token Has Been Called! Report to Counter 1.</span>
                  </div>
                ) : (
                  <div className="text-xs text-slate-300">
                    <div>Farmers Ahead: <strong className="text-amber-400 font-mono text-sm">{queueState?.people_ahead ?? 1}</strong></div>
                    <div>Est. Wait Time: <strong className="text-emerald-400 font-mono text-sm">~{queueState?.estimated_wait_minutes ?? 15} mins</strong></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Live Counter Display - Stadium / Mandi Board Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Serving Display */}
          <div className="md:col-span-2 bg-gradient-to-br from-slate-800 to-slate-850 rounded-3xl p-8 border border-slate-700 shadow-2xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -z-0"></div>

            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-2">
                COUNTER 1 • ACTIVE WEIGHBRIDGE & QUALITY CHECK
              </span>

              <div className="py-6 text-center">
                <span className="text-xs text-slate-400 font-medium block uppercase tracking-wider mb-2">
                  {t('nowServingAtCounter')}
                </span>
                <div className="text-6xl sm:text-8xl font-black font-mono text-emerald-400 tracking-wider filter drop-shadow-md">
                  {queueState?.serving_token || "STANDBY"}
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Live verification of moisture %, grain quality, and gross vehicle tare weight
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-700/60 text-center text-xs">
              <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Total in Queue</span>
                <span className="text-xl font-bold font-mono text-white mt-0.5 block">
                  {queueState?.total_in_queue || 0}
                </span>
              </div>

              <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Waiting in Line</span>
                <span className="text-xl font-bold font-mono text-amber-400 mt-0.5 block">
                  {queueState?.waiting_count || 0}
                </span>
              </div>

              <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Avg. Check Time</span>
                <span className="text-xl font-bold font-mono text-emerald-400 mt-0.5 block">
                  15 min
                </span>
              </div>
            </div>
          </div>

          {/* Tokens Side Column: Called & Upcoming */}
          <div className="space-y-6">
            {/* Tokens Called */}
            <div className="bg-slate-800/80 rounded-3xl p-6 border border-slate-700">
              <div className="flex items-center gap-2 mb-3">
                <Volume2 className="w-4 h-4 text-purple-400" />
                <h3 className="font-bold text-sm text-purple-300 uppercase tracking-wider">
                  {t('tokensCalled')}
                </h3>
              </div>

              {queueState?.called_tokens && queueState.called_tokens.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {queueState.called_tokens.map((token) => (
                    <span
                      key={token}
                      className="px-3 py-1.5 rounded-xl bg-purple-900/60 border border-purple-500/80 text-purple-200 font-mono font-bold text-base shadow-sm animate-pulse"
                    >
                      {token}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">No called tokens currently waiting to report.</p>
              )}
            </div>

            {/* Upcoming in Line */}
            <div className="bg-slate-800/80 rounded-3xl p-6 border border-slate-700">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm text-amber-300 uppercase tracking-wider">
                  {t('upcomingInLine')}
                </h3>
              </div>

              {queueState?.upcoming_tokens && queueState.upcoming_tokens.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {queueState.upcoming_tokens.slice(0, 8).map((token, idx) => (
                    <span
                      key={token}
                      className={`px-3 py-1.5 rounded-xl font-mono text-sm font-semibold border ${
                        farmerBooking && token === farmerBooking.token_display
                          ? 'bg-farmer-600 text-white border-farmer-400 shadow-md ring-2 ring-farmer-400'
                          : 'bg-slate-900/80 text-slate-300 border-slate-700'
                      }`}
                    >
                      {token}
                    </span>
                  ))}
                  {queueState.upcoming_tokens.length > 8 && (
                    <span className="px-3 py-1.5 text-xs text-slate-500">
                      +{queueState.upcoming_tokens.length - 8} more
                    </span>
                  )}
                </div>
              ) : (
                <p className="text-xs text-slate-500">Queue is clear.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveQueue;
