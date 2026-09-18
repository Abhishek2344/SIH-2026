import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Package,
  TrendingUp,
  FileCheck,
  Send,
  ShieldCheck,
  Lock,
  ChevronRight,
  Search,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const VendorDashboard: React.FC = () => {
  const {
    currentUser,
    currentVendor,
    aggregatedStocks,
    stocks,
    crops,
    prices,
    vendorRequests,
    sendVendorInterest,
  } = useApp();

  const [selectedCropFilter, setSelectedCropFilter] = useState<string>('All');
  const [selectedDistrictFilter, setSelectedDistrictFilter] = useState<string>('All');
  const [interestSuccessMsg, setInterestSuccessMsg] = useState<string | null>(null);

  // Anonymized farmer listings
  const anonymizedListings = stocks.map((s, idx) => ({
    listingId: `LST-2026-${1000 + idx}`,
    farmerCode: `FMR-${1000 + (idx * 24)}`, // Anonymized Farmer ID
    cropName: s.cropName,
    district: s.storageLocation.includes('Jaipur') || s.storageLocation.includes('Bassi') ? 'Jaipur' : 'Kota',
    availableQuintals: s.availableStockQuintals,
    qualityGrade: s.qualityGrade,
    harvestDate: s.harvestDate,
    status: s.status,
  }));

  const filteredAggregated = aggregatedStocks.filter((a) => {
    const cropMatch = selectedCropFilter === 'All' || a.cropName.toLowerCase().includes(selectedCropFilter.toLowerCase());
    const distMatch = selectedDistrictFilter === 'All' || a.district.toLowerCase() === selectedDistrictFilter.toLowerCase();
    return cropMatch && distMatch;
  });

  const filteredListings = anonymizedListings.filter((l) => {
    const cropMatch = selectedCropFilter === 'All' || l.cropName.toLowerCase().includes(selectedCropFilter.toLowerCase());
    const distMatch = selectedDistrictFilter === 'All' || l.district.toLowerCase() === selectedDistrictFilter.toLowerCase();
    return cropMatch && distMatch;
  });

  const handleSendInterest = (cropName: string, district: string, quantity: number) => {
    sendVendorInterest({
      vendorId: currentVendor?.id || 'vendor-01',
      vendorName: currentVendor?.businessName || currentUser.fullName,
      cropId: cropName.toLowerCase(),
      cropName,
      district,
      targetQuantityQuintals: quantity,
      offeredRateQuintal: cropName.toLowerCase().includes('wheat') ? 2510 : 5800,
    });

    setInterestSuccessMsg(
      `Procurement Interest of ${quantity} Qtl (${cropName} - ${district}) submitted to District Mandi Board.`
    );
    setTimeout(() => setInterestSuccessMsg(null), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* 1. Header & Verification Status */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>LICENSED COMMERCIAL VENDOR</span>
            </span>
            <span className="font-mono text-xs font-semibold text-slate-500">
              {currentVendor?.vendorCode || 'VND-2026-081'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            {currentVendor?.businessName || 'AgriCorp Agro Flour & Milling Ltd.'}
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Owner: {currentVendor?.ownerName || 'Rajeev Singhania'} • GST: {currentVendor?.gstNumberMask || '08XXXXX4312Z1'} • {currentVendor?.district}, {currentVendor?.state}
          </p>

          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium text-[11px]">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Status: {currentVendor?.verificationStatus || 'Verified'}</span>
            </span>
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-medium text-[11px]">
              <span>Storage Cap: {currentVendor?.storageCapacityMt || 1200} MT</span>
            </span>
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-medium text-[11px]">
              <span>Permitted Commodities: {currentVendor?.commoditiesHandled.join(', ') || 'Wheat, Mustard'}</span>
            </span>
          </div>
        </div>

        {/* Privacy Guard Notice */}
        <div className="bg-amber-50/80 p-3.5 rounded-xl border border-amber-200 max-w-sm text-xs text-amber-900">
          <div className="flex items-center space-x-1.5 font-bold mb-1">
            <Lock className="w-3.5 h-3.5 text-amber-700" />
            <span>Kisan Privacy Enforcement</span>
          </div>
          <p className="text-[11px] text-amber-800 leading-relaxed">
            Private phone numbers, Aadhaar placeholders, bank accounts, and home addresses of farmers are cryptographically hidden. Official procurement is routed exclusively through Mandi Board contracts.
          </p>
        </div>
      </div>

      {/* Success Notification Alert */}
      {interestSuccessMsg && (
        <div className="bg-emerald-50 text-emerald-900 p-4 rounded-xl border border-emerald-300 shadow-sm flex items-center justify-between text-xs animate-in fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="font-semibold">{interestSuccessMsg}</span>
          </div>
          <span className="font-mono text-[11px] text-emerald-700 font-bold">Mandi Board Notified</span>
        </div>
      )}

      {/* 2. Public / Verified Aggregated District Stock Model (Section 6 Requirement) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Aggregated District Farm Stock (Macro Market View)
            </h3>
            <p className="text-xs text-slate-500">
              Aggregated supply figures calculated across registered verified farmers
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-2 text-xs">
            <select
              value={selectedCropFilter}
              onChange={(e) => setSelectedCropFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800"
            >
              <option value="All">All Commodities</option>
              <option value="Wheat">Wheat</option>
              <option value="Mustard">Mustard</option>
              <option value="Rice">Rice (Paddy)</option>
              <option value="Chana">Chana</option>
            </select>

            <select
              value={selectedDistrictFilter}
              onChange={(e) => setSelectedDistrictFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800"
            >
              <option value="All">All Districts</option>
              <option value="Jaipur">Jaipur</option>
              <option value="Kota">Kota</option>
              <option value="Ludhiana">Ludhiana</option>
              <option value="Indore">Indore</option>
            </select>
          </div>
        </div>

        {/* Aggregated Stock Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAggregated.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/70 shadow-sm hover:border-slate-300 transition space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {item.district}, {item.state}
                  </span>
                  <h4 className="text-base font-black text-slate-900 leading-snug">
                    {item.cropName}
                  </h4>
                </div>
                <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                  ₹{item.marketRatePerQuintal}/Qtl
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Aggregated Available Stock:</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {item.totalAggregatedQuintals.toLocaleString('en-IN')} Quintals
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Participating Farmers:</span>
                  <span className="font-semibold text-slate-800">{item.participatingFarmersCount} farmers</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Average Available Qty:</span>
                  <span className="font-semibold text-slate-800">
                    {item.avgQuantityPerFarmer} quintals / farmer
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-100">
                  <span>Govt MSP Floor:</span>
                  <span className="font-bold text-emerald-700">₹{item.averageMspRate}/Qtl</span>
                </div>
              </div>

              <button
                onClick={() => handleSendInterest(item.cropName, item.district, 250)}
                className="w-full mt-2 py-2 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-sm transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Procurement Interest</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Verified Vendor Anonymized Farmer Listings (Section 6 Permitted View) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Eligible Farmer Listings (Privacy-Shielded)
            </h3>
            <p className="text-xs text-slate-500">
              Identified by System Farmer ID • Zero private contact exposure • Mandi-brokered contracts
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
            {filteredListings.length} eligible farm lots
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <th className="py-3 px-4">Listing Ref</th>
                <th className="py-3 px-4">Farmer ID</th>
                <th className="py-3 px-4">Commodity</th>
                <th className="py-3 px-4">Available Quantity</th>
                <th className="py-3 px-4">District</th>
                <th className="py-3 px-4">Quality Grade</th>
                <th className="py-3 px-4">Availability</th>
                <th className="py-3 px-4 text-right">Official Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredListings.map((listing) => (
                <tr key={listing.listingId} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                    {listing.listingId}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                    {listing.farmerCode}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {listing.cropName}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    {listing.availableQuintals} Quintals
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {listing.district}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-700">
                    {listing.qualityGrade}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {listing.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() =>
                        handleSendInterest(listing.cropName, listing.district, listing.availableQuintals)
                      }
                      className="inline-flex items-center space-x-1 px-3 py-1 rounded bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[11px] transition shadow-sm"
                    >
                      <Send className="w-3 h-3" />
                      <span>Send Interest</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Active Procurement Interests Dispatched */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Dispatched Procurement Interests & Contracts
            </h3>
            <p className="text-xs text-slate-500">
              Track government facilitation of commercial buyer requests
            </p>
          </div>
          <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded">
            {vendorRequests.length} active requests
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {vendorRequests.map((req) => (
            <div
              key={req.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{req.cropName}</h4>
                  <p className="text-slate-500 text-[11px]">District: {req.district}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  {req.status}
                </span>
              </div>

              <div className="flex justify-between text-slate-700 pt-2 border-t border-slate-200">
                <span>Target Quantity:</span>
                <span className="font-bold">{req.targetQuantityQuintals} Quintals</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Offered Rate:</span>
                <span className="font-bold text-emerald-700">₹{req.offeredRateQuintal}/Quintal</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Total Contract Commitment:</span>
                <span className="font-bold text-slate-900">
                  ₹{(req.targetQuantityQuintals * req.offeredRateQuintal).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
