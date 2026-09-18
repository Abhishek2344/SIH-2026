import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Complaint, ComplaintStatus } from '../../types';
import {
  ShieldAlert,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  FileCheck,
  Building2,
  Scale,
  Users,
  X,
} from 'lucide-react';

export const DistrictAuthorityPage: React.FC = () => {
  const { complaints, resolveComplaint, centres, auditLogs } = useApp();

  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [resolutionStatus, setResolutionStatus] = useState<ComplaintStatus>('Resolved');
  const [resolutionNotes, setResolutionNotes] = useState<string>('');

  const districtCentres = centres.filter((c) => c.district === 'Jaipur');

  const filteredComplaints =
    filterStatus === 'All'
      ? complaints
      : complaints.filter((c) => c.status === filterStatus);

  const handleOpenResolveModal = (c: Complaint) => {
    setSelectedComplaint(c);
    setResolutionStatus(c.status === 'Resolved' ? 'Resolved' : 'Investigation');
    setResolutionNotes(c.resolutionNotes || '');
  };

  const handleSaveResolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    resolveComplaint(selectedComplaint.id, resolutionStatus, resolutionNotes);
    setSelectedComplaint(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* 1. Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
              DISTRICT COLLECTORATE / DMO DESK
            </span>
            <span className="font-mono text-xs font-semibold text-slate-500">
              DISTRICT: JAIPUR (RAJASTHAN)
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            District Marketing Officer (DMO) Oversight Console
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Regional procurement monitoring, yard enforcement, anti-intermediary investigations, and citizen grievance resolution
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            District Marketing Officer: Dr. Sunita Meena
          </span>
        </div>
      </div>

      {/* 2. District Mandi Capacity Radar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {districtCentres.map((c) => (
          <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{c.name}</h4>
                <p className="text-[11px] text-slate-500 font-mono">{c.code}</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                {c.operatingStatus}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Daily Farmer Intake Capacity:</span>
                <span className="font-bold text-slate-900">{c.dailyFarmerCapacity}</span>
              </div>
              <div className="flex justify-between">
                <span>Today's Bookings:</span>
                <span className="font-bold text-blue-700">{c.todayBookingsCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Completed Procurement:</span>
                <span className="font-bold text-emerald-700">{c.todayCompletedCount}</span>
              </div>
            </div>
          </div>
        ))}

        <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-sm text-amber-400">Anti-Intermediary Protocol</h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              District squads conduct spot checks at weighbridges. Zero tolerance for unapproved deduction slips or private cash collection.
            </p>
          </div>
          <p className="text-[10px] font-mono text-slate-400 mt-3 pt-2 border-t border-slate-800">
            Section 14 Mandi Regulatory Act Enforced
          </p>
        </div>
      </div>

      {/* 3. Grievance & Complaint Ticketing System (Section 27 Requirement) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Citizen & Farmer Grievance Investigation Desk</span>
            </h3>
            <p className="text-xs text-slate-500">
              Assigned officer investigation, evidence examination, and formal resolution tracking
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800"
            >
              <option value="All">All Grievances ({complaints.length})</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Investigation">Investigation</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <th className="py-3 px-4">Ticket ID</th>
                <th className="py-3 px-4">Farmer Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assigned Officer</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredComplaints.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {c.complaintCode}
                    {c.transactionId && (
                      <span className="block text-[10px] font-mono text-slate-400">
                        Ref: {c.transactionId}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    {c.farmerName}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      {c.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 max-w-sm truncate">
                    {c.description}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : c.status === 'Investigation'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {c.assignedOfficer || 'DMO Cell'}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleOpenResolveModal(c)}
                      className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] rounded transition shadow-sm"
                    >
                      Investigate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resolution Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 text-xs animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Resolve Grievance: {selectedComplaint.complaintCode}
                </h3>
                <p className="text-slate-500 text-[11px]">
                  Farmer: {selectedComplaint.farmerName} • Category: {selectedComplaint.category}
                </p>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
              <p className="font-bold text-slate-700 text-[11px]">Farmer's Grievance Details:</p>
              <p className="text-slate-600 leading-relaxed">{selectedComplaint.description}</p>
            </div>

            <form onSubmit={handleSaveResolution} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Investigation Status
                </label>
                <select
                  value={resolutionStatus}
                  onChange={(e) => setResolutionStatus(e.target.value as ComplaintStatus)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 text-xs font-semibold"
                >
                  <option value="Investigation">Under Investigation</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected with Reason">Rejected with Reason</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Official Resolution Findings & Action Taken
                </label>
                <textarea
                  required
                  rows={3}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Record official actions, DBT UTR confirmation, gate security reprimands, or refunds..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 text-xs"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedComplaint(null)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-sm"
                >
                  Save Formal Resolution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
