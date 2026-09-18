import React from 'react';
import { ProcurementTransaction } from '../../types';
import {
  CheckCircle2,
  Printer,
  ShieldCheck,
  X,
  ExternalLink,
  QrCode,
  Building,
  Scale,
  Calendar,
} from 'lucide-react';

interface DigitalReceiptModalProps {
  transaction: ProcurementTransaction;
  onClose: () => void;
  onVerifyClick?: (code: string) => void;
}

export const DigitalReceiptModal: React.FC<DigitalReceiptModalProps> = ({
  transaction,
  onClose,
  onVerifyClick,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-150">
        {/* Top Government Green / Saffron Stripe */}
        <div className="h-2 bg-gradient-to-r from-amber-500 via-white to-green-600"></div>

        {/* Modal Action Header */}
        <div className="flex items-center justify-between px-6 py-3 bg-slate-50 border-b border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Digital Procurement Receipt • डिजिटल खरीद रसीद</span>
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1 px-3 py-1 rounded bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-300 transition shadow-sm"
              title="Print Receipt"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-800" id="printable-receipt">
          {/* Header */}
          <div className="text-center border-b border-slate-200 pb-5">
            <div className="inline-block w-12 h-12 rounded-xl bg-[#0b2238] text-white flex items-center justify-center font-bold text-lg mb-2 shadow">
              अ•से
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              ANNADATA SETU
            </h2>
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mt-0.5">
              Ministry of Consumer Affairs, Food & Public Distribution
            </p>
            <p className="text-[11px] text-slate-500">Government of India • भारत सरकार</p>
            <div className="mt-2 inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              Official E-Procurement Voucher
            </div>
          </div>

          {/* Reference Numbers Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <p className="text-slate-400 text-[11px] font-medium">Transaction ID</p>
              <p className="font-mono font-bold text-slate-900">{transaction.transactionId}</p>
            </div>
            <div>
              <p className="text-slate-400 text-[11px] font-medium">Farmer ID</p>
              <p className="font-mono font-bold text-slate-900">{transaction.farmerCode}</p>
            </div>
            <div>
              <p className="text-slate-400 text-[11px] font-medium">Verification Code</p>
              <p className="font-mono font-bold text-blue-700">{transaction.verificationCode}</p>
            </div>
          </div>

          {/* Farmer & Centre Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-200 space-y-1 bg-white">
              <p className="text-[11px] font-bold uppercase text-slate-400 flex items-center space-x-1">
                <Building className="w-3.5 h-3.5 text-slate-500" />
                <span>Procurement Centre</span>
              </p>
              <p className="font-bold text-slate-800 text-sm">{transaction.centreName}</p>
              <p className="text-slate-500 text-[11px] flex items-center space-x-1 mt-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>Date: {new Date(transaction.timestamp).toLocaleString('en-IN')}</span>
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 space-y-1 bg-white">
              <p className="text-[11px] font-bold uppercase text-slate-400 flex items-center space-x-1">
                <Scale className="w-3.5 h-3.5 text-slate-500" />
                <span>Weighment & Quality</span>
              </p>
              <p className="font-bold text-slate-800 text-sm">
                {transaction.quantityQuintals} Quintals ({transaction.netWeightKg || transaction.quantityQuintals * 100} kg)
              </p>
              <p className="text-slate-600 text-[11px]">
                Grade: <strong className="text-emerald-700">{transaction.qualityGrade}</strong> • Moisture:{' '}
                {transaction.moisturePercentage}% • Foreign Matter: {transaction.foreignMatterPercentage}%
              </p>
            </div>
          </div>

          {/* Transparent Ledger Breakdown (Anti-Intermediary Guarantee) */}
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <div className="bg-slate-100/70 px-4 py-2 font-bold text-slate-700 uppercase tracking-wider text-[11px] border-b border-slate-200">
              Procurement Valuation & Payment Settlement
            </div>
            <div className="p-4 space-y-2 bg-white">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Commodity / Variety</span>
                <span className="font-semibold text-slate-900">{transaction.cropName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Total Procured Quantity</span>
                <span className="font-semibold text-slate-900">{transaction.quantityQuintals} Quintals</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Government Procurement Rate (MSP)</span>
                <span className="font-semibold text-slate-900">₹{transaction.mspRate.toLocaleString('en-IN')} / Quintal</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600 font-medium">Gross Payable Amount</span>
                <span className="font-bold text-slate-900">₹{transaction.grossAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>

              {/* Anti-Intermediary Guarantees */}
              <div className="flex justify-between py-1 text-emerald-700 font-medium">
                <span>Authorised Administrative Deductions</span>
                <span>₹{transaction.authorisedCharges.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 text-slate-500 font-medium text-[11px] italic bg-slate-50 px-2 rounded">
                <span>Unauthorised Brokerage / Intermediary Charges</span>
                <span className="font-bold text-emerald-700">₹0.00 (Strict Zero Intermediary Rule)</span>
              </div>

              {/* Net Payable Highlight */}
              <div className="flex justify-between pt-3 pb-1 border-t-2 border-slate-900 text-sm font-black text-slate-900">
                <span>Net Credited Amount (Direct Benefit Transfer)</span>
                <span className="text-emerald-700 text-base">
                  ₹{transaction.netPayableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Status & PFMS / DBT Ref */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
            <div>
              <p className="text-emerald-800 font-bold text-sm flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Payment Status: {transaction.paymentStatus}</span>
              </p>
              <p className="text-emerald-700 text-[11px] mt-0.5">
                Direct Benefit Transfer (DBT) to Bank A/C: <strong>{transaction.bankAccountMask}</strong>
              </p>
              {transaction.dbtReferenceUtr && (
                <p className="text-slate-500 text-[10px] font-mono mt-0.5">
                  PFMS / NPCI UTR: {transaction.dbtReferenceUtr}
                </p>
              )}
            </div>

            {/* Simulated Dynamic SVG QR Code */}
            <div className="text-center">
              <div className="w-16 h-16 bg-white p-1 rounded-lg border border-emerald-300 shadow-sm mx-auto flex items-center justify-center">
                {/* SVG QR Placeholder */}
                <svg className="w-full h-full text-slate-800" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm8-2h2v2h-2v-2zm2 2h2v2h-2v-2zm-2 2h2v2h-2v-2zm4-4h2v2h-2v-2zm2 2h2v2h-2v-2zm-2 2h2v2h-2v-2zm2 2h2v2h-2v-2zm-4-6h2v2h-2v-2z" />
                </svg>
              </div>
              <span className="text-[9px] font-mono font-bold text-slate-500 mt-1 block">SCAN TO VERIFY</span>
            </div>
          </div>

          {/* Action to Verify Online */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              onClick={() => {
                if (onVerifyClick) onVerifyClick(transaction.verificationCode);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-600 text-white font-semibold text-xs transition shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Verify Transaction Online (Public Portal)</span>
            </button>

            <p className="text-[10px] text-slate-400 text-center sm:text-right">
              Digital signature hash: <span className="font-mono">{transaction.digitalReceiptHash.substring(0, 20)}...</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
