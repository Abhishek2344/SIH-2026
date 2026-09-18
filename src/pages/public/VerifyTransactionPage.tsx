import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ProcurementTransaction } from '../../types';
import {
  Search,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  Building,
  Calendar,
  Scale,
  Lock,
} from 'lucide-react';

export const VerifyTransactionPage: React.FC = () => {
  const { transactions } = useApp();

  const [inputCode, setInputCode] = useState<string>('AS-VFY-2026-99128'); // Default to Ramesh Kumar's benchmark receipt
  const [searchedRecord, setSearchedRecord] = useState<ProcurementTransaction | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(true);

  useEffect(() => {
    // Automatically verify benchmark code on mount
    const found = transactions.find(
      (t) =>
        t.verificationCode.toLowerCase() === inputCode.trim().toLowerCase() ||
        t.transactionId.toLowerCase() === inputCode.trim().toLowerCase()
    );
    setSearchedRecord(found || null);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const found = transactions.find(
      (t) =>
        t.verificationCode.toLowerCase() === inputCode.trim().toLowerCase() ||
        t.transactionId.toLowerCase() === inputCode.trim().toLowerCase()
    );
    setSearchedRecord(found || null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Public Digital Verification Portal</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Verify Procurement Voucher
        </h1>
        <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
          Authenticate official procurement receipts issued at electronic weighbridges across all state procurement hubs.
        </p>
      </div>

      {/* Verification Code Search Box */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              required
              placeholder="Enter Verification Code (e.g., AS-VFY-2026-99128 or TXN-2026-00124)"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-mono text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 uppercase"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center space-x-1.5"
          >
            <Search className="w-4 h-4" />
            <span>Verify Voucher</span>
          </button>
        </form>

        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
          <span>Sample Valid Code: <strong>AS-VFY-2026-99128</strong> (Ramesh Kumar Benchmark)</span>
          <button
            type="button"
            onClick={() => {
              setInputCode('AS-VFY-2026-99128');
              const found = transactions.find((t) => t.verificationCode === 'AS-VFY-2026-99128');
              setSearchedRecord(found || null);
            }}
            className="text-blue-600 hover:underline font-medium"
          >
            Fill Sample Code
          </button>
        </div>
      </div>

      {/* Verification Result Card */}
      {hasSearched && (
        <div>
          {searchedRecord ? (
            <div className="bg-white rounded-3xl border-2 border-emerald-300 shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              {/* Green Verified Header */}
              <div className="bg-emerald-600 text-white px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                  <div>
                    <h3 className="font-extrabold text-sm tracking-wide">
                      AUTHENTIC GOVERNMENT PROCUREMENT RECORD
                    </h3>
                    <p className="text-[11px] text-emerald-100">
                      Digitally Verified on Government Central Ledger
                    </p>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold bg-emerald-700 px-3 py-1 rounded-md border border-emerald-500">
                  {searchedRecord.verificationCode}
                </span>
              </div>

              {/* Verified Details (Strictly Public-Safe Fields - Section 42) */}
              <div className="p-6 sm:p-8 space-y-6 text-xs text-slate-800">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <p className="text-slate-400 text-[11px]">Transaction ID</p>
                    <p className="font-mono font-bold text-slate-900 text-sm mt-0.5">
                      {searchedRecord.transactionId}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[11px]">Procurement Date</p>
                    <p className="font-semibold text-slate-800 mt-0.5">
                      {new Date(searchedRecord.timestamp).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[11px]">Settlement Status</p>
                    <p className="font-bold text-emerald-700 mt-0.5 flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{searchedRecord.paymentStatus}</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-slate-200 space-y-1">
                    <p className="text-slate-400 text-[11px] font-bold uppercase">Procured Commodity</p>
                    <p className="text-base font-bold text-slate-900">{searchedRecord.cropName}</p>
                    <p className="text-slate-600">
                      Grade: <strong>{searchedRecord.qualityGrade}</strong> • Moisture: {searchedRecord.moisturePercentage}%
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 space-y-1">
                    <p className="text-slate-400 text-[11px] font-bold uppercase">Intake Mandi Centre</p>
                    <p className="text-base font-bold text-slate-900">{searchedRecord.centreName}</p>
                    <p className="text-slate-600">
                      Procured Quantity: <strong>{searchedRecord.quantityQuintals} Quintals</strong>
                    </p>
                  </div>
                </div>

                {/* Privacy Shield Notice (Section 42 Strict Adherence) */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-start space-x-3 text-slate-600">
                  <Lock className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                  <div className="text-[11px] leading-relaxed">
                    <strong>Citizen Privacy Shield Active:</strong> Personal identifying data (Farmer full name, private bank account credentials, mobile number, and land title numbers) are withheld in compliance with Section 42 public verification protocols.
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-rose-50 border border-rose-200 p-8 rounded-3xl text-center space-y-3">
              <AlertTriangle className="w-10 h-10 text-rose-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">Record Not Found</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                No procurement record matches the verification code entered. Please check for typographical errors or verify with the Mandi Supervisor.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
