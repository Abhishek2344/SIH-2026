import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DigitalReceiptModal } from '../../components/receipt/DigitalReceiptModal';
import { ComplaintModal } from '../../components/complaint/ComplaintModal';
import { ProcurementTransaction } from '../../types';
import {
  FileText,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ShieldAlert,
  ArrowDownRight,
  Printer,
  ExternalLink,
} from 'lucide-react';

interface FarmerTransactionsPageProps {
  setActiveTab: (tab: string) => void;
}

export const FarmerTransactionsPage: React.FC<FarmerTransactionsPageProps> = ({ setActiveTab }) => {
  const { currentFarmer, transactions } = useApp();

  const [selectedTxn, setSelectedTxn] = useState<ProcurementTransaction | null>(null);
  const [complaintTxnId, setComplaintTxnId] = useState<string | null>(null);

  const farmerTransactions = transactions.filter(
    (t) => t.farmerId === currentFarmer?.id || t.farmerCode === currentFarmer?.farmerId
  );

  const totalProcuredQuintals = farmerTransactions.reduce((acc, t) => acc + t.quantityQuintals, 0);
  const totalCreditedAmount = farmerTransactions
    .filter((t) => t.paymentStatus === 'Credited')
    .reduce((acc, t) => acc + t.netPayableAmount, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              PAYMENT & VOUCHER LEDGER
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Procurement Receipts & Direct Benefit Transfers
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent breakdown of government procurement MSP rates and direct bank disbursements
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Zero Brokerage Intermediary Policy</span>
          </span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-400">Total Procured Quantity</p>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {totalProcuredQuintals} Quintals
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Weighed on electronic mandi bridges</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-400">Total Disbursed (Credited)</p>
          <p className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1">
            ₹{totalCreditedAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">
            ✓ 100% PFMS / DBT Direct Settlement
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-400">Unauthorised Deductions</p>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">₹0.00</p>
          <p className="text-[11px] text-slate-500 mt-1">Protected by statutory mandi safeguards</p>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Procurement Ledger Records</h3>
          <span className="text-xs text-slate-500 font-medium">
            {farmerTransactions.length} vouchers generated
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <th className="py-3 px-4">Transaction Ref</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Commodity / Hub</th>
                <th className="py-3 px-4">Net Quantity</th>
                <th className="py-3 px-4">MSP Rate</th>
                <th className="py-3 px-4">Gross Amount</th>
                <th className="py-3 px-4">Deductions</th>
                <th className="py-3 px-4">Net Credited</th>
                <th className="py-3 px-4">Payment Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {farmerTransactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {txn.transactionId}
                    <span className="block text-[10px] font-mono text-blue-600 font-normal">
                      {txn.verificationCode}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {new Date(txn.timestamp).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                    <span className="block text-[10px] text-slate-400">
                      {new Date(txn.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-800">{txn.cropName}</p>
                    <p className="text-[11px] text-slate-500">{txn.centreName}</p>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    {txn.quantityQuintals} Qtl
                    <span className="block text-[10px] text-slate-400">
                      Grade: {txn.qualityGrade} (M: {txn.moisturePercentage}%)
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    ₹{txn.mspRate.toLocaleString('en-IN')}/Qtl
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    ₹{txn.grossAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      ₹0.00
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-emerald-700 text-sm">
                    ₹{txn.netPayableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    <span className="block text-[10px] font-normal text-slate-500">
                      A/C: {txn.bankAccountMask}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        txn.paymentStatus === 'Credited'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{txn.paymentStatus}</span>
                    </span>
                    {txn.dbtReferenceUtr && (
                      <span className="block text-[9px] font-mono text-slate-400 mt-0.5">
                        UTR: {txn.dbtReferenceUtr.substring(0, 14)}...
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1.5">
                    <button
                      onClick={() => setSelectedTxn(txn)}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-[11px] border border-blue-200 transition"
                      title="View Digital Voucher"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Receipt</span>
                    </button>
                    <button
                      onClick={() => setComplaintTxnId(txn.transactionId)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition"
                      title="Report discrepancy / issue"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Digital Receipt Modal */}
      {selectedTxn && (
        <DigitalReceiptModal
          transaction={selectedTxn}
          onClose={() => setSelectedTxn(null)}
          onVerifyClick={(code) => {
            setSelectedTxn(null);
            setActiveTab('public-verify');
          }}
        />
      )}

      {/* Complaint Modal */}
      {complaintTxnId && (
        <ComplaintModal
          onClose={() => setComplaintTxnId(null)}
          prefilledTxnId={complaintTxnId}
        />
      )}
    </div>
  );
};
