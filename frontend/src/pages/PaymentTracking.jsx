import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ShieldCheck, 
  Building2, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const PaymentTracking = () => {
  const { t } = useLanguage();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/payments/my')
      .then((res) => setPayments(res.data))
      .catch((err) => {
        console.error(err);
        setError("Unable to load payment records");
      })
      .finally(() => setLoading(false));
  }, []);

  const totalReceived = payments
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = payments
    .filter((p) => p.status !== 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t('payments')} (DBT)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Direct Benefit Transfer payouts credited to your Aadhaar-seeded primary bank account
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-emerald-600 rounded-3xl p-6 text-white shadow-md shadow-emerald-600/20">
            <span className="text-xs uppercase font-bold text-emerald-100 tracking-wider block mb-1">
              Total Disbursed into Bank
            </span>
            <div className="text-3xl sm:text-4xl font-black font-mono">
              ₹{totalReceived.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-emerald-100 mt-1">Directly credited via PFMS / DBT portal</p>
          </div>

          <div className="bg-amber-600 rounded-3xl p-6 text-white shadow-md shadow-amber-600/20">
            <span className="text-xs uppercase font-bold text-amber-100 tracking-wider block mb-1">
              Pending / Under Processing
            </span>
            <div className="text-3xl sm:text-4xl font-black font-mono">
              ₹{totalPending.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-amber-100 mt-1">Awaiting bank settlement cycle (usually 24-48 hrs)</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-2xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Payments List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((n) => (
              <div key={n} className="h-36 bg-slate-200 animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : payments.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm space-y-3">
            <CreditCard className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">No payment records found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Payments are created automatically when your crop weight is recorded at the centre.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((p) => {
              const isPaid = p.status === 'paid';
              return (
                <div
                  key={p.id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg text-slate-900 font-mono">
                          ₹{p.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          isPaid
                            ? 'bg-green-100 text-green-800 border border-green-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}>
                          {isPaid ? t('paymentPaid') : t('paymentProcessing')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {p.crop_name ? `${p.quantity_quintals} Qtl ${p.crop_name}` : 'Procurement Batch'} • Receipt: {p.receipt_number || 'N/A'}
                      </p>
                    </div>

                    <div className="text-xs text-slate-500">
                      <span>Method: <strong>{p.payment_method}</strong></span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div>
                      <span className="text-slate-400 block mb-1">UTR / Ref Number:</span>
                      <strong className="font-mono text-slate-800 text-xs">
                        {p.transaction_id || "Generating with Bank..."}
                      </strong>
                    </div>

                    <div>
                      <span className="text-slate-400 block mb-1">Beneficiary Bank:</span>
                      <strong className="text-slate-800">
                        {p.bank_name || "State Bank of India"} (•••• {p.account_last4 || "9012"})
                      </strong>
                    </div>

                    <div>
                      <span className="text-slate-400 block mb-1">Disbursement Date:</span>
                      <strong className="text-slate-800">
                        {p.payment_date ? new Date(p.payment_date).toLocaleString() : "Processing Cycle"}
                      </strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentTracking;
