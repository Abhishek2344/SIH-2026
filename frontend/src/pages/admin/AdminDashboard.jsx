import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  TrendingUp, 
  CreditCard, 
  Clock, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Loader2, 
  RefreshCw,
  FileSpreadsheet,
  ShieldAlert,
  UserPlus
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../services/api';

const AdminDashboard = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState(null);
  const [centres, setCentres] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'users', 'centres', 'reports'

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // New staff modal state
  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [staffForm, setStaffForm] = useState({
    name: '',
    mobile: '',
    email: '',
    password: 'Staff@123',
    role: 'staff',
    designation: 'Procurement Officer',
    centre_id: '',
    staff_code: '',
  });

  // New centre modal state
  const [centreModalOpen, setCentreModalOpen] = useState(false);
  const [centreForm, setCentreForm] = useState({
    code: '',
    name: '',
    state: 'Punjab',
    district: 'Ludhiana',
    address: '',
    latitude: 30.7073,
    longitude: 76.2166,
    opening_time: '08:00 AM',
    closing_time: '05:00 PM',
    commodities: 'Wheat, Paddy, Mustard',
    daily_capacity: 50,
  });

  const loadAllAdminData = async () => {
    try {
      setError('');
      const [statsRes, usersRes, reportsRes, centresRes] = await Promise.all([
        api.get('/api/admin/stats'),
        api.get('/api/admin/users'),
        api.get('/api/admin/reports'),
        api.get('/api/centres'),
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data);
      setReports(reportsRes.data);
      setCentres(centresRes.data);

      if (centresRes.data.length > 0 && !staffForm.centre_id) {
        setStaffForm((prev) => ({ ...prev, centre_id: centresRes.data[0].id.toString() }));
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load administrator data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const handleToggleUserStatus = async (userId) => {
    try {
      const res = await api.put(`/api/admin/users/${userId}/toggle-status`);
      setMessage(res.data.message);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, is_active: res.data.is_active } : u))
      );
    } catch (err) {
      setError(err.response?.data?.detail || "Could not toggle user status");
    }
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/admin/users', {
        ...staffForm,
        centre_id: staffForm.centre_id ? parseInt(staffForm.centre_id) : null,
      });
      setMessage(`Staff account created for ${staffForm.name}!`);
      setStaffModalOpen(false);
      loadAllAdminData();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create staff member");
    }
  };

  const handleCreateCentre = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/centres', {
        ...centreForm,
        latitude: parseFloat(centreForm.latitude),
        longitude: parseFloat(centreForm.longitude),
        daily_capacity: parseInt(centreForm.daily_capacity),
      });
      setMessage(`Procurement Centre '${centreForm.name}' established successfully!`);
      setCentreModalOpen(false);
      loadAllAdminData();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create centre");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-purple-900 text-purple-200 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-purple-700">
                Super Admin Console
              </span>
              <span className="text-xs text-slate-400">National Monitoring & Allocation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {t('adminDashboardTitle')}
            </h1>
            <p className="text-xs text-slate-400">
              Procurement quotas, queue bottlenecks, user provisioning, and DBT disbursements
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => { setRefreshing(true); loadAllAdminData(); }}
              disabled={refreshing}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition border border-white/20"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh Stats</span>
            </button>

            <button
              onClick={() => setCentreModalOpen(true)}
              className="bg-farmer-600 hover:bg-farmer-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{t('createCentre')}</span>
            </button>

            <button
              onClick={() => setStaffModalOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm"
            >
              <UserPlus className="w-4 h-4" />
              <span>{t('createStaff')}</span>
            </button>
          </div>
        </div>

        {/* Notices */}
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-800 text-xs p-3.5 rounded-2xl flex items-center gap-2 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
            <span className="font-semibold">{message}</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 text-xs p-3.5 rounded-2xl flex items-center gap-2 shadow-sm">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {/* KPI Counter Cards */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                {t('totalFarmers')}
              </span>
              <span className="text-3xl font-black text-slate-900 font-mono">
                {stats.total_farmers}
              </span>
              <span className="text-[11px] text-slate-400 block mt-1">Verified Aadhaar accounts</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                {t('activeCentres')}
              </span>
              <span className="text-3xl font-black text-slate-900 font-mono">
                {stats.total_centres}
              </span>
              <span className="text-[11px] text-slate-400 block mt-1">State procurement mandis</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Today's Bookings
              </span>
              <span className="text-3xl font-black text-blue-600 font-mono">
                {stats.today_bookings}
              </span>
              <span className="text-[11px] text-slate-400 block mt-1">
                {stats.waiting_farmers} currently in queue
              </span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                {t('totalDisbursed')}
              </span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono">
                ₹{stats.total_disbursed_inr.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-amber-600 font-medium block mt-1">
                ₹{stats.total_pending_payment_inr.toLocaleString('en-IN')} pending
              </span>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm w-fit">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'overview' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Mandi Operations
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'users' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('userManagement')} ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'reports' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('reportsTitle')}
          </button>
        </div>

        {/* TAB 1: Centre Operations */}
        {activeTab === 'overview' && stats && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">
                {t('centreWisePerformance')}
              </h3>
              <span className="text-xs text-slate-500">Live Queue & Volume Metrics</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-100">
                  <tr>
                    <th className="py-3.5 px-4">Centre Name</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Today's Bookings</th>
                    <th className="py-3.5 px-4">Waiting in Queue</th>
                    <th className="py-3.5 px-4">Procured Volume</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats.centre_wise_statistics.map((c) => (
                    <tr key={c.centre_id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{c.centre_name}</td>
                      <td className="py-3.5 px-4 text-slate-600">{c.district}, {c.state}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800">{c.today_bookings}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 font-bold border border-amber-200">
                          {c.waiting_count} waiting
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                        {c.procured_quintals} Quintals
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: User Management */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">
                Platform Users (Farmers, Counter Staff, Admins)
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-100">
                  <tr>
                    <th className="py-3.5 px-4">User ID / Mobile</th>
                    <th className="py-3.5 px-4">Name / Designation</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => {
                    const name = u.farmer_profile?.full_name || u.staff_profile?.full_name || u.email || "System User";
                    return (
                      <tr key={u.id} className="hover:bg-slate-50 transition">
                        <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">
                          {u.mobile}
                          {u.farmer_profile?.farmer_id && (
                            <span className="block text-[10px] text-slate-400 font-mono">
                              {u.farmer_profile.farmer_id}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">{name}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            u.role === 'admin'
                              ? 'bg-purple-100 text-purple-800'
                              : u.role === 'staff'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            u.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {u.is_active ? 'Active' : 'Deactivated'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleToggleUserStatus(u.id)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                              u.is_active
                                ? 'bg-red-50 hover:bg-red-100 text-red-700'
                                : 'bg-green-50 hover:bg-green-100 text-green-700'
                            }`}
                          >
                            {u.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Reports */}
        {activeTab === 'reports' && reports && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-base">Commodity Procurement Breakdown</h3>
                <span className="text-xs text-slate-400">Audit Date: {reports.generated_date}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {reports.crop_summary.map((crop) => (
                  <div key={crop.crop} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      {crop.crop}
                    </span>
                    <div className="text-2xl font-black text-slate-900 font-mono">
                      {crop.total_quintals} Qtl
                    </div>
                    <div className="text-xs text-emerald-700 font-bold">
                      Payout: ₹{crop.total_payout_inr.toLocaleString('en-IN')}
                    </div>
                    <span className="text-[10px] text-slate-400 block">
                      {crop.transactions_count} completed weighbridge transactions
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Modal: Add Staff User */}
        {staffModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95">
              <h3 className="text-lg font-black text-slate-900">Add Staff Account</h3>
              <form onSubmit={handleCreateStaff} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={staffForm.name}
                    onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile *</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={staffForm.mobile}
                    onChange={(e) => setStaffForm({ ...staffForm, mobile: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={staffForm.email}
                    onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assign Mandi Centre *</label>
                  <select
                    value={staffForm.centre_id}
                    onChange={(e) => setStaffForm({ ...staffForm, centre_id: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                  >
                    {centres.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    value={staffForm.designation}
                    onChange={(e) => setStaffForm({ ...staffForm, designation: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div className="flex gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setStaffModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold"
                  >
                    Provision Staff
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Add Centre */}
        {centreModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95">
              <h3 className="text-lg font-black text-slate-900">Add Procurement Centre</h3>
              <form onSubmit={handleCreateCentre} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Centre Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. CTR-PB-05"
                      value={centreForm.code}
                      onChange={(e) => setCentreForm({ ...centreForm, code: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Centre Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Moga Grain Mandi"
                      value={centreForm.name}
                      onChange={(e) => setCentreForm({ ...centreForm, name: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">State *</label>
                    <input
                      type="text"
                      required
                      value={centreForm.state}
                      onChange={(e) => setCentreForm({ ...centreForm, state: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">District *</label>
                    <input
                      type="text"
                      required
                      value={centreForm.district}
                      onChange={(e) => setCentreForm({ ...centreForm, district: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Address *</label>
                  <input
                    type="text"
                    required
                    value={centreForm.address}
                    onChange={(e) => setCentreForm({ ...centreForm, address: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={centreForm.latitude}
                      onChange={(e) => setCentreForm({ ...centreForm, latitude: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      value={centreForm.longitude}
                      onChange={(e) => setCentreForm({ ...centreForm, longitude: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setCentreModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-farmer-600 hover:bg-farmer-700 text-white font-bold"
                  >
                    Save Centre
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

export default AdminDashboard;
