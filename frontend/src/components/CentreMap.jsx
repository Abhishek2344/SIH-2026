import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Fix default leaflet marker icon issue in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const CentreMap = ({ centres, selectedCentreId, onSelectCentre }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const navigate = useNavigate();

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Default to Northern India center
      const initialLat = 28.6139;
      const initialLng = 77.2090;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 6,
        scrollWheelZoom: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear previous markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    const bounds = [];

    centres.forEach((centre) => {
      if (centre.latitude && centre.longitude) {
        bounds.push([centre.latitude, centre.longitude]);

        const marker = L.marker([centre.latitude, centre.longitude]).addTo(map);
        markersRef.current[centre.id] = marker;

        const popupContent = document.createElement('div');
        popupContent.className = "p-1 min-w-[200px]";
        popupContent.innerHTML = `
          <div class="font-bold text-slate-900 text-sm mb-1">${centre.name}</div>
          <div class="text-xs text-slate-600 mb-2">${centre.address}</div>
          <div class="flex items-center justify-between text-xs mb-2">
            <span class="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
              Queue: ${centre.current_queue_size || 0} waiting
            </span>
            <span class="text-slate-500 font-medium">
              ${centre.opening_time} - ${centre.closing_time}
            </span>
          </div>
          <div class="flex gap-2 mt-2">
            <button id="book-btn-${centre.id}" class="flex-1 bg-green-700 hover:bg-green-800 text-white font-medium py-1.5 px-2 rounded text-xs transition">
              Book Slot
            </button>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${centre.latitude},${centre.longitude}" target="_blank" rel="noopener noreferrer" class="bg-slate-100 hover:bg-slate-200 text-slate-700 py-1.5 px-2 rounded text-xs transition flex items-center justify-center">
              Navigate
            </a>
          </div>
        `;

        marker.bindPopup(popupContent);

        marker.on('popupopen', () => {
          const btn = document.getElementById(`book-btn-${centre.id}`);
          if (btn) {
            btn.onclick = () => {
              if (onSelectCentre) {
                onSelectCentre(centre.id);
              } else {
                navigate(`/book-slot?centre_id=${centre.id}`);
              }
            };
          }
        });
      }
    });

    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40] });
    }

    return () => {
      // Map cleanup on unmount
    };
  }, [centres]);

  // Center on selected centre if changed
  useEffect(() => {
    if (selectedCentreId && markersRef.current[selectedCentreId] && mapInstanceRef.current) {
      const marker = markersRef.current[selectedCentreId];
      mapInstanceRef.current.setView(marker.getLatLng(), 11);
      marker.openPopup();
    }
  }, [selectedCentreId]);

  return (
    <div className="w-full h-80 md:h-96 rounded-2xl overflow-hidden border border-slate-200 shadow-inner relative z-0">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};

export default CentreMap;
