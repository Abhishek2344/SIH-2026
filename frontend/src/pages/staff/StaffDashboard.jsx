import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Users, 
  Clock, 
  Volume2, 
  Scale, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Plus, 
  Edit, 
  Trash2, 
  Loader2, 
  RefreshCw, 
  CreditCard,
  FileCheck,
  Building2,
  Calendar
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useWebSocket } from '../../context/WebSocketContext';
import QueueBadge from '../../components/QueueBadge';
import api from '../../services/api';

const StaffDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { subscribeToCentreQueue, liveQueueData } = useWebSocket();

  const [centre, setCentre] = useState(null);
  const [todayTokens, setTodayTokens] = useState([]);
  const [slots, setSlots] = useState([]);
  const [payments, setPayments] = useState([]);
  const [activeTab, setActiveTab] = useState('queue'); // 'queue', 'procurement', 'slots', 'payments'

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Procurement Modal state
  const [procurementModalOpen, setProcurementModalOpen] = useState(false);
  const [selectedEntryForProcurement, setSelectedEntryForProcurement] = useState(null);
  const [procFormData, setProcFormData] = useState({
    crop_name: 'Wheat',
    variety: 'PBW 550 / Sharbati',
    grade: 'Grade A',
    moisture_percentage: 12.0,
    quantity_quintals: 20,
    msp_rate_per_quintal: 2275,
    remarks: 'Grain quality certified and within moisture limits.',
  });

  // Payment update modal state
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [payFormData, setPayFormData] = useState({
    status: 'paid',
    transaction_id: '',
    bank_name: 'State Bank of India',
    account_last4: '',
    remarks: 'DBT cleared via PFMS portal',
  });

  // Slot modal state
  const [slotModalOpen, setSlotModalOpen] = useState(false);
  const [slotFormData, setSlotFormData] = useState({
    start_time: '08:00 AM',
    end_time: '10:00 AM',
    capacity: 15,
  });

  const loadData = async () => {
    try {
      setError('');
      const centreRes = await api.get('/api/staff/centre');
      const centreData = centreRes.data;
      setCentre(centreData);
      subscribeToCentreQueue(centreData.id);

      const todayStr = new Date().toISOString().split('T')[0];

      const [tokensRes, slotsRes, paymentsRes] = await Promise.all([
        api.get(`/api/staff/all-tokens?centre_id=${centreData.id}`),
        api.get(`/api/slots?centre_id=${centreData.id}&slot_date=${todayStr}`),
        api.get('/api/payments'),
      ]);

      setTodayTokens(tokensRes.data);
      setSlots(slotsRes.data);
      setPayments(paymentsRes.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load staff dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update whenever WebSocket receives a queue change
  useEffect(() => {
    if (liveQueueData && centre && liveQueueData.centre_id === centre.id) {
      // Refresh token list to keep state perfectly synchronized
      api.get(`/api/staff/all-tokens?centre_id=${centre.id}`)
        .then((res) => setTodayTokens(res.data))
        .catch((err) => console.error(err));
    }
  }, [liveQueueData, centre]);

  const handleCallNext = async () => {
    if (!centre) return;
    setActionLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await api.post(`/api/queue/${centre.id}/call-next`);
      setMessage(`Token ${res.data.token_display || res.data.token_number} called! Notification dispatched.`);
      loadData();
    } catch (err) {
      setError(err.response?.data?.detail || "No waiting farmers in queue");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateStatus = async (entryId, status) => {
    setActionLoading(true);
    setError('');
    setMessage('');
    try {
      await api.put(`/api/queue/entries/${entryId}/status`, { status });
      setMessage(`Queue status updated to '${status}'. Real-time update broadcasted.`);
      loadData();
    } catch (err) {
      setError(err.response?.data?.detail || "Status update failed");
    } finally {
      setActionLoading(false);
    }
  };

  const openProcurementModal = (entry) => {
    setSelectedEntryForProcurement(entry);
    setProcFormData({
      crop_name: entry.crop_type || 'Wheat',
      variety: 'Standard FAQ',
      grade: 'Grade A',
      moisture_percentage: 12.0,
      quantity_quintals: entry.estimated_quantity || 20,
      msp_rate_per_quintal: 2275,
      remarks: 'Moisture within permissible limit (12%). Passed quality check.',
    });
    setProcurementModalOpen(true);
  };

  const handleProcurementSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEntryForProcurement) return;

    setActionLoading(true);
    setError('');
    setMessage('');

    try {
      const payload = {
        booking_id: selectedEntryForProcurement.booking_id,
        crop_name: procFormData.crop_name,
        variety: procFormData.variety,
        grade: procFormData.grade,
        moisture_percentage: parseFloat(procFormData.moisture_percentage),
        quantity_quintals: parseFloat(procFormData.quantity_quintals),
        msp_rate_per_quintal: parseFloat(procFormData.msp_rate_per_quintal),
        remarks: procFormData.remarks,
      };

      const res = await api.post('/api/procurement', payload);
      setMessage(`Procurement recorded! Receipt #${res.data.receipt_number}. Payout ₹${res.data.total_amount.toLocaleString()}. Queue automatically advanced to next waiting token.`);
      setProcurementModalOpen(false);
      loadData();
    } catch (err) {
      setError(err.response?.data?.detail || "Procurement entry failed");
    } finally {
      setActionLoading(false);
    }
  };

  const openPaymentModal = (payment) => {
    setSelectedPayment(payment);
    const randUTR = `UTR2026${Math.floor(10000000 + Math.random() * 90000000)}`;
    setPayFormData({
      status: 'paid',
      transaction_id: randUTR,
      bank_name: payment.bank_name || 'State Bank of India',
      account_last4: payment.account_last4 || '1234',
      remarks: 'Direct Benefit Transfer credited successfully.',
    });
    setPaymentModalOpen(true);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPayment) return;

    setActionLoading(true);
    setError('');
    try {
      await api.put(`/api/payments/${selectedPayment.id}/status`, payFormData);
      setMessage(`Payment updated to PAID with UTR #${payFormData.transaction_id}. Farmer alerted.`);
      setPaymentModalOpen(false);
      loadData();
    } catch (err) {
      setError(err.response?.data?.detail || "Payment update failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateSlot = async (e) => {
    e.preventDefault();
    if (!centre) return;
    setActionLoading(true);
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      await api.post('/api/slots', {
        centre_id: centre.id,
        slot_date: todayStr,
        start_time: slotFormData.start_time,
        end_time: slotFormData.end_time,
        capacity: parseInt(slotFormData.capacity),
        is_active: true,
      });
      setMessage("New slot created successfully.");
      setSlotModalOpen(false);
      loadData();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create slot");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCloseSlot = async (slotId) => {
    try {
      await api.post(`/api/slots/${slotId}/close`);
      setMessage("Slot capacity closed.");
      loadData();
    } catch (err) {
      setError("Failed to close slot");
    }
  };

  const servingToken = todayTokens.find((t) => t.status === 'serving');

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Centre Status Bar */}
        <div className="bg-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-800 text-emerald-200 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Staff Counter Station
              </span>
              <span className="text-xs text-emerald-300 font-mono">
                Staff: {user?.staff_profile?.full_name} ({user?.staff_profile?.staff_code})
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {centre?.name || "Procurement Mandi"}
            </h1>
            <p className="text-xs text-emerald-200">
              {centre?.address} • Operating: {centre?.opening_time} - {centre?.closing_time}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => { setRefreshing(true); loadData(); }}
              disabled={refreshing}
              className="bg-white/10 hover:bg-white/20 text-white font-medium px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition border border-white/20"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh Queue</span>
            </button>

            <button
              onClick={handleCallNext}
              disabled={actionLoading}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs transition shadow-lg flex items-center gap-2 disabled:opacity-50"
            >
              <Volume2 className="w-4 h-4" />
              <span>{t('callNextFarmer')}</span>
            </button>
          </div>
        </div>

        {/* Notices */}
        {message && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs p-4 rounded-2xl flex items-center gap-2 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{message}</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-300 text-red-800 text-xs p-4 rounded-2xl flex items-center gap-2 shadow-sm">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm w-fit">
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'queue' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Live Queue & Counter
          </button>
          <button
            onClick={() => setActiveTab('slots')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'slots' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('slotManagement')}
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'payments' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            DBT Payments ({payments.filter(p => p.status !== 'paid').length} Pending)
          </button>
        </div>

        {/* TAB 1: Queue Manager */}
        {activeTab === 'queue' && (
          <div className="space-y-6">
            {/* Active Counter Highlight */}
            {servingToken ? (
              <div className="bg-white rounded-3xl border-2 border-emerald-500 p-6 sm:p-8 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 border border-emerald-300 flex flex-col items-center justify-center text-emerald-900 font-mono font-black text-2xl">
                    <span className="text-[10px] font-sans font-bold text-emerald-700">NOW</span>
                    <span>{servingToken.token_number}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-black text-slate-900">{servingToken.token_display}</h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
                        Serving at Weighbridge
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      Farmer: <strong>{servingToken.farmer_name}</strong> • Commodity: {servingToken.estimated_quantity} Qtl {servingToken.crop_type}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openProcurementModal(servingToken)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl text-xs transition shadow-md flex items-center gap-2"
                  >
                    <Scale className="w-4 h-4" />
                    <span>{t('recordProcurement')} & Complete</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center shadow-sm space-y-2">
                <Clock className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="font-bold text-slate-700 text-base">Counter is Standby</h3>
                <p className="text-xs text-slate-500">
                  Click "Call Next Farmer" above to call the first waiting token in line.
                </p>
              </div>
            )}

            {/* Queue Advancement Rule Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-800 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-blue-600 mt-0.5" />
              <span>
                <strong>Automatic Queue Progression Engine:</strong> {t('queueAdvancementNotice')}
              </span>
            </div>

            {/* Today's Queue Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-base">
                  Today's Arrival Queue Registry ({todayTokens.length} Tokens)
                </h3>
                <span className="text-xs text-slate-500">Auto-synced via WebSockets</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-100">
                    <tr>
                      <th className="py-3.5 px-4">Token</th>
                      <th className="py-3.5 px-4">Farmer Name</th>
                      <th className="py-3.5 px-4">Crop & Qty</th>
                      <th className="py-3.5 px-4">Check-in Time</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {todayTokens.map((entry) => (
                      <tr key={entry.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-sm">
                          {entry.token_display}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800">
                          {entry.farmer_name}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {entry.estimated_quantity} Qtl {entry.crop_type}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">
                          {new Date(entry.check_in_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-3.5 px-4">
                          <QueueBadge status={entry.status} />
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-1.5">
                          {entry.status === 'waiting' && (
                            <button
                              onClick={() => handleUpdateStatus(entry.id, 'called')}
                              className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold rounded-lg border border-purple-200 transition"
                            >
                              Call
                            </button>
                          )}
                          {entry.status === 'called' && (
                            <button
                              onClick={() => handleUpdateStatus(entry.id, 'serving')}
                              className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded-lg border border-emerald-200 transition"
                            >
                              Start Serving
                            </button>
                          )}
                          {entry.status === 'serving' && (
                            <button
                              onClick={() => openProcurementModal(entry)}
                              className="px-2.5 py-1.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition shadow-sm"
                            >
                              Complete
                            </button>
                          )}
                          {entry.status !== 'completed' && entry.status !== 'cancelled' && (
                            <button
                              onClick={() => handleUpdateStatus(entry.id, 'cancelled')}
                              className="px-2 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Cancel token"
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Slot Management */}
        {activeTab === 'slots' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">
                Procurement Slot Configuration for Today
              </h3>
              <button
                onClick={() => setSlotModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Time Slot</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {slots.map((s) => (
                <div key={s.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">{s.start_time} - {s.end_time}</span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      s.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {s.is_active ? 'Active' : 'Closed'}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Booked:</span>
                      <strong>{s.booked_count} / {s.capacity}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Remaining:</span>
                      <strong className="text-emerald-700">{s.available_count} slots</strong>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                    {s.is_active && (
                      <button
                        onClick={() => handleCloseSlot(s.id)}
                        className="w-full bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-600 font-semibold py-1.5 rounded-lg text-xs transition"
                      >
                        Close Capacity
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Payments */}
        {activeTab === 'payments' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                Procurement Payouts & DBT Status Updates
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Receipt</th>
                    <th className="py-3 px-4">Farmer</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Transaction UTR</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-mono font-semibold text-slate-900">{p.receipt_number || `PMT-${p.id}`}</td>
                      <td className="py-3 px-4 font-bold text-slate-800">{p.farmer_name}</td>
                      <td className="py-3 px-4 font-black font-mono text-emerald-700">₹{p.amount.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {p.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">{p.transaction_id || 'Pending'}</td>
                      <td className="py-3 px-4 text-right">
                        {p.status !== 'paid' && (
                          <button
                            onClick={() => openPaymentModal(p)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition text-xs shadow-sm"
                          >
                            Mark Paid
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal: Record Procurement */}
        {procurementModalOpen && selectedEntryForProcurement && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5 animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {t('recordProcurement')}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Token: {selectedEntryForProcurement.token_display} • Farmer: {selectedEntryForProcurement.farmer_name}
                  </p>
                </div>
                <button
                  onClick={() => setProcurementModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleProcurementSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Crop Name *</label>
                    <input
                      type="text"
                      required
                      value={procFormData.crop_name}
                      onChange={(e) => setProcFormData({ ...procFormData, crop_name: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Variety</label>
                    <input
                      type="text"
                      value={procFormData.variety}
                      onChange={(e) => setProcFormData({ ...procFormData, variety: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Quality Grade</label>
                    <select
                      value={procFormData.grade}
                      onChange={(e) => setProcFormData({ ...procFormData, grade: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                    >
                      <option value="Grade A">Grade A (Premium)</option>
                      <option value="Fair Average Quality (FAQ)">FAQ (Standard)</option>
                      <option value="Grade B">Grade B</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Moisture % (Max 14%)</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={procFormData.moisture_percentage}
                      onChange={(e) => setProcFormData({ ...procFormData, moisture_percentage: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Quantity (Quintals) *</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={procFormData.quantity_quintals}
                      onChange={(e) => setProcFormData({ ...procFormData, quantity_quintals: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">MSP Rate (₹/Qtl) *</label>
                    <input
                      type="number"
                      step="1"
                      required
                      value={procFormData.msp_rate_per_quintal}
                      onChange={(e) => setProcFormData({ ...procFormData, msp_rate_per_quintal: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                    />
                  </div>
                </div>

                {/* Live Computed Amount */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
                  <span className="text-[11px] uppercase font-bold text-emerald-800 tracking-wider block">
                    Total Payout to Farmer
                  </span>
                  <div className="text-2xl font-black text-emerald-900 font-mono mt-0.5">
                    ₹{(procFormData.quantity_quintals * procFormData.msp_rate_per_quintal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Officer Inspection Remarks</label>
                  <textarea
                    rows={2}
                    value={procFormData.remarks}
                    onChange={(e) => setProcFormData({ ...procFormData, remarks: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setProcurementModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/30 flex items-center justify-center gap-1.5"
                  >
                    {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    <span>Confirm & Complete</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Update Payment */}
        {paymentModalOpen && selectedPayment && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95">
              <h3 className="text-lg font-black text-slate-900">Update DBT Payment</h3>
              <p className="text-xs text-slate-500">
                Disburse payment of ₹{selectedPayment.amount.toLocaleString()} to {selectedPayment.farmer_name}
              </p>

              <form onSubmit={handlePaymentSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={payFormData.status}
                    onChange={(e) => setPayFormData({ ...payFormData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  >
                    <option value="paid">Paid (Disbursed via DBT)</option>
                    <option value="processing">Processing with Bank</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bank UTR / Transaction ID *</label>
                  <input
                    type="text"
                    required
                    value={payFormData.transaction_id}
                    onChange={(e) => setPayFormData({ ...payFormData, transaction_id: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold"
                  />
                </div>

                <div className="flex gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setPaymentModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                  >
                    Save Payment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Create Slot */}
        {slotModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95">
              <h3 className="text-lg font-black text-slate-900">Add Slot for Today</h3>
              <form onSubmit={handleCreateSlot} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Start Time</label>
                    <input
                      type="text"
                      required
                      value={slotFormData.start_time}
                      onChange={(e) => setSlotFormData({ ...slotFormData, start_time: e.target.value })}
                      placeholder="e.g. 05:00 PM"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">End Time</label>
                    <input
                      type="text"
                      required
                      value={slotFormData.end_time}
                      onChange={(e) => setSlotFormData({ ...slotFormData, end_time: e.target.value })}
                      placeholder="e.g. 07:00 PM"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Capacity (Max Farmers)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="100"
                    value={slotFormData.capacity}
                    onChange={(e) => setSlotFormData({ ...slotFormData, capacity: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  />
                </div>

                <div className="flex gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setSlotModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                  >
                    Create Slot
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;
