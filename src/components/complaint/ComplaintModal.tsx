import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ComplaintCategory } from '../../types';
import { ShieldAlert, X, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ComplaintModalProps {
  onClose: () => void;
  prefilledTxnId?: string;
}

export const ComplaintModal: React.FC<ComplaintModalProps> = ({ onClose, prefilledTxnId }) => {
  const { currentFarmer, currentUser, submitComplaint } = useApp();

  const [category, setCategory] = useState<ComplaintCategory>('Extra Charges Demanded');
  const [transactionId, setTransactionId] = useState(prefilledTxnId || '');
  const [description, setDescription] = useState('');
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);

  const categories: ComplaintCategory[] = [
    'Extra Charges Demanded',
    'Delayed Payment',
    'Incorrect Quantity',
    'Incorrect Price',
    'Quality Dispute',
    'Vendor Misconduct',
    'Centre Congestion / Operator Issue',
    'Other',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const result = submitComplaint({
      farmerId: currentFarmer?.id || 'farmer-01',
      farmerName: currentUser.fullName,
      transactionId: transactionId.trim() || undefined,
      category,
      description: description.trim(),
      status: 'Submitted',
      assignedOfficer: 'District Marketing Officer (DMO) Mandi Cell',
    });

    setSubmittedCode(result.complaintCode);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 bg-rose-50 border-b border-rose-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Lodge Grievance / शिकायत दर्ज करें
              </h3>
              <p className="text-[11px] text-slate-500">
                Anti-Intermediary & Procurement Protection Cell
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedCode ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Grievance Registered Successfully</h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Your grievance has been assigned to the District Marketing Officer. Modifying amounts or demanding unauthorized handling charges carries strict penalties under the Mandi Act.
            </p>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 inline-block font-mono text-sm font-bold text-blue-700">
              Ticket ID: {submittedCode}
            </div>
            <div>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Grievance Category / शिकायत का प्रकार
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Related Transaction ID (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g., TXN-2026-00124"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Description & Circumstances / विवरण
              </label>
              <textarea
                required
                rows={4}
                placeholder="Please describe the incident, including names, bay numbers, amounts demanded, or delay circumstances..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs"
              ></textarea>
            </div>

            <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-amber-900 text-[11px] flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Zero Toleration Notice:</strong> No middleman or mandi operator may demand cash handling, weighment tips, or private commissions. Every rupee is paid directly into your verified bank account via DBT.
              </span>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition shadow-sm"
              >
                Submit Official Grievance
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
