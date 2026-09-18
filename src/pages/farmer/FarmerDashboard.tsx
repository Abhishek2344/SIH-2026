import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DigitalReceiptModal } from '../../components/receipt/DigitalReceiptModal';
import { ComplaintModal } from '../../components/complaint/ComplaintModal';
import { ProcurementTransaction } from '../../types';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  PlusCircle,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  MapPin,
  QrCode,
  ShieldAlert,
} from 'lucide-react';

interface FarmerDashboardProps {
  setActiveTab: (tab: string) => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({ setActiveTab }) => {
  const {
    currentUser,
    currentFarmer,
    stocks,
    tokens,
    bookings,
    transactions,
    executeRameshDemoScenario,
  } = useApp();

  const [selectedTxnForReceipt, setSelectedTxnForReceipt] = useState<ProcurementTransaction | null>(null);
  const [showComplaintModal, setShowComplaintModal] = useState(false);

  // Active token for Ramesh Kumar
  const activeToken = tokens.find((t) => t.farmerId === currentFarmer?.id && t.status !== 'COMPLETED') || tokens[tokens.length - 1];
  const completedToken = tokens.find((t) => t.farmerId === currentFarmer?.id && t.status === 'COMPLETED');
  const activeBooking = bookings.find((b) => b.farmerId === currentFarmer?.id) || bookings[0];

  // Find currently serving token at Jaipur Mandi
  const servingToken = tokens.find(
    (t) => t.status === 'CALLED' || t.status === 'WEIGHING' || t.status === 'IN_VERIFICATION'
  ) || tokens[1];

  const tokensAhead = activeToken && servingToken ? Math.max(0, activeToken.sequenceOrder - servingToken.sequenceOrder) : 0;
  const estimatedMins = tokensAhead * 4;

  // Stages for 8-step government tracking
  const getTimelineStages = () => {
    const isProcured = transactions.some((t) => t.farmerId === currentFarmer?.id);
    const isCredited = transactions.some((t) => t.farmerId === currentFarmer?.id && t.paymentStatus === 'Credited');

    return [
      { id: 1, name: 'Slot Booked', status: 'completed', time: '18 Mar, 04:00 PM', role: 'Farmer' },
      { id: 2, name: 'Farmer Arrived', status: activeToken?.status !== 'WAITING' || isProcured ? 'completed' : 'current', time: '19 Mar, 09:15 AM', role: 'Gate Security' },
      { id: 3, name: 'Quality Verification', status: activeToken?.status === 'IN_VERIFICATION' ? 'current' : isProcured ? 'completed' : 'upcoming', time: '19 Mar, 09:30 AM', role: 'Assayer' },
      { id: 4, name: 'Weight Recorded', status: activeToken?.status === 'WEIGHING' ? 'current' : isProcured ? 'completed' : 'upcoming', time: '19 Mar, 09:38 AM', role: 'Weighbridge Op.' },
      { id: 5, name: 'Procurement Done', status: isProcured ? 'completed' : 'upcoming', time: isProcured ? '19 Mar, 09:40 AM' : '--', role: 'Mandi Supervisor' },
      { id: 6, name: 'Payment Initiated', status: isProcured ? 'completed' : 'upcoming', time: isProcured ? '19 Mar, 09:42 AM' : '--', role: 'PFMS / DBT System' },
      { id: 7, name: 'Payment Processed', status: isProcured ? 'completed' : 'upcoming', time: isProcured ? '19 Mar, 09:44 AM' : '--', role: 'Reserve Bank / NPCI' },
      { id: 8, name: 'Payment Credited', status: isCredited ? 'completed' : 'upcoming', time: isCredited ? '19 Mar, 09:45 AM' : '--', role: 'Farmer Bank (SBI)' },
    ];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* 1. Welcome Profile & Verification Badges Header */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-green-100 text-green-800 border border-green-200">
              VERIFIED KISAN
            </span>
            <span className="font-mono text-xs font-semibold text-slate-500">
              {currentFarmer?.farmerId || 'FMR-RJ-2026-1024'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            नमस्ते, {currentUser.fullName}
          </h2>
          <p className="text-xs text-slate-600 mt-0.5 flex items-center space-x-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>Village {currentFarmer?.village || 'Bassi Rural'}, District Jaipur, Rajasthan</span>
          </p>

          {/* Official Verification Checklist Badges */}
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Mobile Verified</span>
            </span>
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Aadhaar Status: {currentFarmer?.aadhaarVerificationStatus || 'Verified'}</span>
            </span>
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Bank Verified ({currentFarmer?.bankAccountMask || 'XXXX-4819'})</span>
            </span>
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Land Verified ({currentFarmer?.landAreaAcres || 4.5} Acres)</span>
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto">
          <button
            onClick={() => setActiveTab('farmer-book-slot')}
            className="flex-1 md:flex-none inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs shadow-sm transition"
          >
            <Calendar className="w-4 h-4" />
            <span>Book New Slot</span>
          </button>
          <button
            onClick={() => setShowComplaintModal(true)}
            className="flex-1 md:flex-none inline-flex items-center justify-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Lodge Grievance</span>
          </button>
        </div>
      </div>

      {/* 2. Today's Procurement Queue & Live Status Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Queue Live Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-[#0b2238] to-[#133e66] rounded-2xl p-6 text-white shadow-md border border-slate-700 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700/80">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                Live Mandi Queue Monitor • Muhana Mandi
              </h3>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-amber-300 border border-slate-600">
              Jaipur Central (RJ-JPR-PC-01)
            </span>
          </div>

          {/* Main Queue Dashboard Display */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6 text-center">
            {/* Your Token */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/80 backdrop-blur-sm">
              <p className="text-slate-400 text-xs font-semibold uppercase">Your Assigned Token</p>
              <p className="text-3xl sm:text-4xl font-black text-amber-400 font-mono tracking-tight mt-1">
                {activeToken?.tokenNumber || 'A-124'}
              </p>
              <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded mt-1 inline-block">
                Status: {activeToken?.status || 'WAITING'}
              </span>
            </div>

            {/* Currently Serving */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/80 backdrop-blur-sm">
              <p className="text-slate-400 text-xs font-semibold uppercase">Currently Serving</p>
              <p className="text-3xl sm:text-4xl font-black text-emerald-300 font-mono tracking-tight mt-1">
                {servingToken?.tokenNumber || 'A-113'}
              </p>
              <span className="text-[10px] text-slate-300 mt-1 inline-block">
                Bay 2 & 3 Active Assaying
              </span>
            </div>

            {/* Farmers Ahead & Wait time */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/80 backdrop-blur-sm">
              <p className="text-slate-400 text-xs font-semibold uppercase">Queue Distance</p>
              <p className="text-2xl sm:text-3xl font-black text-white mt-1">
                {tokensAhead > 0 ? `${tokensAhead} Farmers` : 'At Counter'}
              </p>
              <p className="text-[11px] text-amber-300 mt-1 flex items-center justify-center space-x-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Est. Wait: ~{estimatedMins > 0 ? `${estimatedMins} mins` : 'Immediate'}</span>
              </p>
            </div>
          </div>

          {/* Bottom Guidance Strip */}
          <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-700/80 flex flex-col sm:flex-row items-center justify-between text-xs gap-2">
            <p className="text-slate-300 text-center sm:text-left text-[11px]">
              💡 <strong>Guidance:</strong> Please assemble in Holding Yard Area B with your moisture sample and weighment slip.
            </p>
            <button
              onClick={() => setActiveTab('farmer-queue')}
              className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center space-x-1"
            >
              <span>View Full Queue Display</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Next Slot Booking Quick Summary */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Active Slot Booking
              </h3>
              <span className="font-mono text-xs font-bold text-blue-700">
                {activeBooking.bookingReference}
              </span>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <p className="text-slate-400 text-[11px]">Commodity / Quantity</p>
                <p className="text-base font-bold text-slate-900">
                  {activeBooking.cropName} • {activeBooking.declaredQuantityQuintals} Quintals
                </p>
              </div>

              <div>
                <p className="text-slate-400 text-[11px]">Reporting Schedule</p>
                <p className="font-semibold text-slate-800">
                  Today ({activeBooking.timeWindow})
                </p>
              </div>

              <div>
                <p className="text-slate-400 text-[11px]">Allocated Procurement Hub</p>
                <p className="font-semibold text-slate-800 leading-snug">
                  {activeBooking.centreName}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <div className="p-2.5 bg-blue-50 rounded-lg text-blue-900 text-[11px] leading-relaxed">
                  MSP Rate Guaranteed: <strong>₹2,425 / Quintal</strong>
                  <br />
                  Est. Gross Value: <strong>₹{(activeBooking.declaredQuantityQuintals * 2425).toLocaleString('en-IN')}</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-2">
            <button
              onClick={() => setActiveTab('farmer-book-slot')}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg text-xs transition text-center"
            >
              Modify / Book Another Date
            </button>
          </div>
        </div>
      </div>

      {/* 3. Procurement Lifecycle Tracking (8 Stages) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Procurement & Payment Lifecycle Tracker
            </h3>
            <p className="text-xs text-slate-500">
              End-to-end audit tracking from gate intake to direct bank credit
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            PFMS / DBT Direct
          </span>
        </div>

        {/* 8-Stage Visual Timeline */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {getTimelineStages().map((stage) => {
            const isCompleted = stage.status === 'completed';
            const isCurrent = stage.status === 'current';

            return (
              <div
                key={stage.id}
                className={`p-3 rounded-xl border text-center relative flex flex-col justify-between ${
                  isCompleted
                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                    : isCurrent
                    ? 'bg-amber-50 border-amber-400 text-amber-950 shadow-sm ring-1 ring-amber-400'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <div>
                  <div
                    className={`w-6 h-6 rounded-full mx-auto flex items-center justify-center text-xs font-bold mb-1.5 ${
                      isCompleted
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-amber-500 text-white animate-bounce'
                        : 'bg-slate-300 text-slate-700'
                    }`}
                  >
                    {isCompleted ? '✓' : stage.id}
                  </div>
                  <h4 className="text-xs font-bold leading-tight">{stage.name}</h4>
                  <p className="text-[10px] opacity-75 mt-1 font-medium">{stage.role}</p>
                </div>
                <div className="text-[9px] font-mono mt-2 pt-1 border-t border-slate-200/60">
                  {stage.time}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Recent Transactions & Digital Receipts */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              My Procurement Transactions & Digital Receipts
            </h3>
            <p className="text-xs text-slate-500">
              Official digitized weighment vouchers and bank credit confirmations
            </p>
          </div>
          <button
            onClick={() => setActiveTab('farmer-transactions')}
            className="text-xs font-bold text-blue-700 hover:text-blue-600 flex items-center space-x-1"
          >
            <span>View All Records</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <th className="py-2.5 px-3">Transaction ID</th>
                <th className="py-2.5 px-3">Commodity</th>
                <th className="py-2.5 px-3">Quantity</th>
                <th className="py-2.5 px-3">Rate (MSP)</th>
                <th className="py-2.5 px-3">Net Credited</th>
                <th className="py-2.5 px-3">Authorised Charges</th>
                <th className="py-2.5 px-3">Payment Status</th>
                <th className="py-2.5 px-3 text-right">Digital Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions
                .filter((t) => t.farmerId === currentFarmer?.id || t.farmerCode === currentFarmer?.farmerId)
                .map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">{txn.transactionId}</td>
                    <td className="py-3 px-3 font-semibold text-slate-900">{txn.cropName}</td>
                    <td className="py-3 px-3">{txn.quantityQuintals} Quintals</td>
                    <td className="py-3 px-3">₹{txn.mspRate.toLocaleString('en-IN')}/Qtl</td>
                    <td className="py-3 px-3 font-bold text-emerald-700">
                      ₹{txn.netPayableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        ₹0.00 (Zero Fee)
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{txn.paymentStatus}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setSelectedTxnForReceipt(txn)}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-[11px] border border-blue-200 transition"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Voucher</span>
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Digital Receipt Modal */}
      {selectedTxnForReceipt && (
        <DigitalReceiptModal
          transaction={selectedTxnForReceipt}
          onClose={() => setSelectedTxnForReceipt(null)}
          onVerifyClick={(code) => {
            setSelectedTxnForReceipt(null);
            setActiveTab('public-verify');
          }}
        />
      )}

      {/* Grievance Modal */}
      {showComplaintModal && (
        <ComplaintModal onClose={() => setShowComplaintModal(false)} />
      )}
    </div>
  );
};
