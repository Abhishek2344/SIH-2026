import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Clock, 
  Calendar, 
  Search, 
  Filter, 
  Navigation, 
  Users, 
  Layers, 
  Map as MapIcon, 
  Grid, 
  ExternalLink,
  Phone
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import CentreMap from '../components/CentreMap';
import api from '../services/api';

const Centres = () => {
  const { t } = useLanguage();
  const [centres, setCentres] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'
  const [selectedCentreId, setSelectedCentreId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/centres?active_only=true')
      .then((res) => setCentres(res.data))
      .catch((err) => console.error("Error loading centres", err))
      .finally(() => setLoading(false));
  }, []);

  const states = ['All', ...new Set(centres.map((c) => c.state))];

  const filteredCentres = centres.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.district.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase());
    const matchesState = selectedState === 'All' || c.state === selectedState;
    return matchesSearch && matchesState;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {t('centres')}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Select an authorized government procurement mandi to check slot availability and book your arrival.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                viewMode === 'grid'
                  ? 'bg-farmer-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span>Cards</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                viewMode === 'map'
                  ? 'bg-farmer-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <MapIcon className="w-4 h-4" />
              <span>{t('viewMap')}</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by centre name, district, or code (e.g. Khanna, Karnal)..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-farmer-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full sm:w-44 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-farmer-500 font-medium"
            >
              {states.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Interactive Map View */}
        {viewMode === 'map' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Interactive Mandi Location Map
                </span>
                <span className="text-xs text-slate-500">Click on any marker pin to inspect centre details</span>
              </div>
              <CentreMap
                centres={filteredCentres}
                selectedCentreId={selectedCentreId}
                onSelectCentre={(id) => setSelectedCentreId(id)}
              />
            </div>
          </div>
        )}

        {/* Centres Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 bg-slate-200 animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : filteredCentres.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 shadow-sm">
            <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">No centres found</h3>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your search query or state filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCentres.map((centre) => (
              <div
                key={centre.id}
                className={`bg-white rounded-3xl border transition-all p-6 shadow-sm hover:shadow-md flex flex-col justify-between ${
                  selectedCentreId === centre.id ? 'ring-2 ring-farmer-500 border-farmer-500' : 'border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {centre.code}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {centre.current_queue_size} in queue today
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base mb-1.5 line-clamp-1">
                    {centre.name}
                  </h3>

                  <p className="text-xs text-slate-600 flex items-start gap-1.5 mb-4">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>{centre.address}</span>
                  </p>

                  <div className="bg-slate-50 rounded-2xl p-3.5 space-y-2 text-xs mb-5 border border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Timing:
                      </span>
                      <span className="font-semibold text-slate-800">{centre.opening_time} - {centre.closing_time}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Commodities:</span>
                      <span className="font-semibold text-slate-800 truncate max-w-[150px]">{centre.commodities}</span>
                    </div>

                    {centre.contact_phone && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5" /> Helpline:
                        </span>
                        <span className="font-mono text-slate-800">{centre.contact_phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <Link
                    to={`/book-slot?centre_id=${centre.id}`}
                    className="flex-1 bg-farmer-600 hover:bg-farmer-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs text-center transition flex items-center justify-center gap-1.5 shadow-sm shadow-farmer-600/20"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Slot Here</span>
                  </Link>

                  {centre.latitude && centre.longitude && (
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${centre.latitude},${centre.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition flex items-center justify-center"
                      title={t('getDirections')}
                    >
                      <Navigation className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Centres;
