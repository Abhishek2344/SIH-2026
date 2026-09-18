import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StockStatus } from '../../types';
import {
  Package,
  PlusCircle,
  CheckCircle2,
  Calendar,
  Layers,
  Building,
  TrendingUp,
  MapPin,
  X,
} from 'lucide-react';

export const FarmerStocksPage: React.FC = () => {
  const { currentFarmer, crops, stocks, addFarmerStock } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [cropId, setCropId] = useState('wheat');
  const [variety, setVariety] = useState('Sharbati HD-3086');
  const [cultivatedArea, setCultivatedArea] = useState<number>(4.5);
  const [expectedProduction, setExpectedProduction] = useState<number>(18);
  const [availableStock, setAvailableStock] = useState<number>(12);
  const [harvestDate, setHarvestDate] = useState('2026-03-15');
  const [storageLocation, setStorageLocation] = useState('Pucca Farm Godown, Bassi');
  const [expectedProcurement, setExpectedProcurement] = useState<number>(12);
  const [qualityGrade, setQualityGrade] = useState<'Grade A' | 'Grade B' | 'FAQ (Fair Average Quality)'>('Grade A');
  const [status, setStatus] = useState<StockStatus>('Available for procurement');

  const farmerStocks = stocks.filter((s) => s.farmerId === currentFarmer?.id) || stocks;

  const totalCultivated = farmerStocks.reduce((acc, s) => acc + s.cultivatedAreaAcres, 0);
  const totalProduction = farmerStocks.reduce((acc, s) => acc + s.expectedProductionQuintals, 0);
  const totalAvailable = farmerStocks.reduce((acc, s) => acc + s.availableStockQuintals, 0);

  const handleAddStock = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedCrop = crops.find((c) => c.id === cropId) || crops[0];

    addFarmerStock({
      farmerId: currentFarmer?.id || 'farmer-01',
      cropId,
      cropName: selectedCrop.name,
      variety,
      cultivatedAreaAcres: cultivatedArea,
      expectedProductionQuintals: expectedProduction,
      availableStockQuintals: availableStock,
      harvestDate,
      storageLocation,
      expectedProcurementQuintals: expectedProcurement,
      qualityGrade,
      status,
    });

    setShowAddModal(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
              CROP & STOCK INVENTORY
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            My Farm Crop & Stock Declarations
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent crop inventory feeding aggregated district supply indicators
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-sm transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Declare New Crop / Stock</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-400">Total Cultivated Land</p>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{totalCultivated} Acres</p>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">✓ Verified Khasra Record</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-400">Total Expected Yield</p>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{totalProduction} Qtl</p>
          <p className="text-[11px] text-slate-500 mt-1">~{(totalProduction / (totalCultivated || 1)).toFixed(1)} Qtl / Acre avg yield</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-400">Available For Procurement</p>
          <p className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1">{totalAvailable} Qtl</p>
          <p className="text-[11px] text-slate-500 mt-1">Ready for mandi intake slots</p>
        </div>
      </div>

      {/* Stocks Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Declared Crop Lots</h3>
          <span className="text-xs text-slate-500 font-medium">{farmerStocks.length} lots registered</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <th className="py-3 px-4">Crop & Variety</th>
                <th className="py-3 px-4">Cultivated Area</th>
                <th className="py-3 px-4">Harvest Date</th>
                <th className="py-3 px-4">Available Stock</th>
                <th className="py-3 px-4">Quality Grade</th>
                <th className="py-3 px-4">Storage Location</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {farmerStocks.map((stock) => (
                <tr key={stock.id} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900">{stock.cropName}</p>
                    <p className="text-[11px] text-slate-500">{stock.variety}</p>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    {stock.cultivatedAreaAcres} Acres
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {stock.harvestDate}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-emerald-700 text-sm">
                      {stock.availableStockQuintals} Quintals
                    </span>
                    <p className="text-[10px] text-slate-400">Total yield: {stock.expectedProductionQuintals} Qtl</p>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">
                    {stock.qualityGrade}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                    {stock.storageLocation}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        stock.status === 'Available for procurement'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : stock.status === 'Stored'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {stock.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Stock Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">
                Declare Farm Crop & Stock / फसल स्टॉक विवरण
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStock} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Crop</label>
                  <select
                    value={cropId}
                    onChange={(e) => setCropId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 text-xs"
                  >
                    {crops.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Variety</label>
                  <input
                    type="text"
                    required
                    value={variety}
                    onChange={(e) => setVariety(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 text-xs"
                    placeholder="e.g. Sharbati HD-3086"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Area (Acres)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={cultivatedArea}
                    onChange={(e) => setCultivatedArea(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Exp. Yield (Qtl)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={expectedProduction}
                    onChange={(e) => setExpectedProduction(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Avail. Stock (Qtl)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={availableStock}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setAvailableStock(val);
                      setExpectedProcurement(val);
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Harvest Date</label>
                  <input
                    type="date"
                    required
                    value={harvestDate}
                    onChange={(e) => setHarvestDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Quality Grade</label>
                  <select
                    value={qualityGrade}
                    onChange={(e) => setQualityGrade(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 text-xs"
                  >
                    <option value="Grade A">Grade A</option>
                    <option value="Grade B">Grade B</option>
                    <option value="FAQ (Fair Average Quality)">FAQ (Fair Average Quality)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Storage Location</label>
                <input
                  type="text"
                  required
                  value={storageLocation}
                  onChange={(e) => setStorageLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 text-xs"
                  placeholder="e.g. Pucca Farm Godown, Bassi"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Procurement Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as StockStatus)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 text-xs"
                >
                  <option value="Available for procurement">Available for procurement</option>
                  <option value="Stored">Stored</option>
                  <option value="Harvested">Harvested</option>
                  <option value="Cultivated">Cultivated</option>
                  <option value="Partially procured">Partially procured</option>
                  <option value="Fully procured">Fully procured</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition shadow-sm"
                >
                  Record Stock Declaration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
