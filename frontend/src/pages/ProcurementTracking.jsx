import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Scale, 
  Calendar, 
  MapPin, 
  Printer, 
  ShieldCheck, 
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const ProcurementTracking = () => {
  const { t } = useLanguage();
  const [procurements, setProcurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/procurement')
      .then((res) => setProcurements(res.data))
      .catch((err) => {
        console.error(err);
        setError("Could not fetch procurement records");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t('procurementRecords')}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Official government inspection receipts, certified grain weights, and approved MSP rates
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-2xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((n) => (
              <div key={n} className="h-44 bg-slate-200 animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : procurements.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm space-y-3">
            <FileText className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">No procurement receipts yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Once your crop is weighed and inspected at the mandi counter, your computerized receipt will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {procurements.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm hover:shadow-md transition space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {p.receipt_number}
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {p.grade}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mt-0.5">{p.crop_name}</h3>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-500 block">Total Certified Payout:</span>
                    <span className="text-2xl font-black text-emerald-700 font-mono">
                      ₹{p.total_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <span className="text-slate-400 block mb-1">Weight Procured:</span>
                    <strong className="text-slate-900 text-sm">{p.quantity_quintals} Quintals</strong>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <span className="text-slate-400 block mb-1">Govt MSP Rate:</span>
                    <strong className="text-slate-900 text-sm">₹{p.msp_rate_per_quintal} / Qtl</strong>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <span className="text-slate-400 block mb-1">Moisture Checked:</span>
                    <strong className="text-slate-900 text-sm">{p.moisture_percentage}%</strong>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <span className="text-slate-400 block mb-1">Date Certified:</span>
                    <strong className="text-slate-900 text-sm">
                      {new Date(p.procurement_date).toLocaleDateString()}
                    </strong>
                  </div>
                </div>

                {p.remarks && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 italic">
                    Inspector Remarks: "{p.remarks}"
                  </p>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => window.print()}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Formal Receipt</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcurementTracking;
