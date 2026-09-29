import React, { useState } from 'react';
import { MapPin, Compass, Navigation, Utensils, BedDouble, Landmark, Sparkles } from 'lucide-react';
import { Destination, Hotel, Language } from '../types/travel';
import { formatINR } from '../data/translations';

interface InteractiveIndiaMapProps {
  destinations: Destination[];
  selectedDestination: Destination;
  hotels: Hotel[];
  language: Language;
  onSelectDestination: (dest: Destination) => void;
  onSelectHotelForTrip: (hotel: Hotel) => void;
  onOpenDestinationModal: (dest: Destination) => void;
}

type LayerType = 'all' | 'attractions' | 'hotels' | 'restaurants' | 'nearby';

export const InteractiveIndiaMap: React.FC<InteractiveIndiaMapProps> = ({
  destinations,
  selectedDestination,
  hotels,
  language,
  onSelectDestination,
  onSelectHotelForTrip,
  onOpenDestinationModal,
}) => {
  const [mapMode, setMapMode] = useState<'city' | 'india'>('city');
  const [activeLayer, setActiveLayer] = useState<LayerType>('all');
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);

  const cityHotels = hotels.filter((h) => h.destinationId === selectedDestination.id);

  return (
    <div className="bg-white border border-stone-200/90 rounded-2xl overflow-hidden">
      {/* Top Bar of Map */}
      <div className="p-5 sm:p-6 border-b border-stone-200/80 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <p className="text-xs text-stone-500 font-mono tabular-nums">
            {selectedDestination.mapPosition.lat.toFixed(4)}° N · {selectedDestination.mapPosition.lng.toFixed(4)}° E
          </p>
          <h3 className="text-xl sm:text-2xl font-semibold text-stone-900 mt-0.5">
            {language === 'te'
              ? `${selectedDestination.nameTe} (${selectedDestination.name}) — ఇంటరాక్టివ్ మ్యాప్`
              : `${selectedDestination.name}, ${selectedDestination.state} — Interactive Map Explorer`}
          </h3>
        </div>

        {/* Mode Switcher & Layer Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex p-1 bg-stone-100 rounded-lg border border-stone-200/70">
            <button
              type="button"
              onClick={() => setMapMode('city')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                mapMode === 'city'
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {selectedDestination.name} Landmarks
            </button>
            <button
              type="button"
              onClick={() => setMapMode('india')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                mapMode === 'india'
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All 21 India Destinations
            </button>
          </div>

          {mapMode === 'city' && (
            <div className="inline-flex flex-wrap p-1 bg-stone-100 rounded-lg border border-stone-200/70 gap-1">
              {(
                [
                  { id: 'all', label: 'All Pins' },
                  { id: 'attractions', label: 'Attractions' },
                  { id: 'hotels', label: 'Hotels' },
                  { id: 'restaurants', label: 'Restaurants' },
                  { id: 'nearby', label: 'Nearby Places' },
                ] as { id: LayerType; label: string }[]
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveLayer(tab.id)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    activeLayer === tab.id
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Map Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left/Center Interactive Canvas (8 cols) */}
        <div className="lg:col-span-8 relative bg-[#F3EFE6] min-h-[420px] sm:min-h-[480px] overflow-hidden border-b lg:border-b-0 lg:border-r border-stone-200/80">
          {mapMode === 'india' ? (
            /* ALL-INDIA INTERACTIVE MAP */
            <div className="relative w-full h-[460px] sm:h-[500px] p-4 flex items-center justify-center">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full max-w-[520px] max-h-[460px]"
                aria-label="Interactive Map of India Destinations"
              >
                {/* Subtle Coordinate Grid */}
                <g stroke="#D6CFC2" strokeWidth="0.25" strokeDasharray="1,1">
                  <line x1="0" y1="20" x2="100" y2="20" />
                  <line x1="0" y1="40" x2="100" y2="40" />
                  <line x1="0" y1="60" x2="100" y2="60" />
                  <line x1="0" y1="80" x2="100" y2="80" />
                  <line x1="25" y1="0" x2="25" y2="100" />
                  <line x1="50" y1="0" x2="50" y2="100" />
                  <line x1="75" y1="0" x2="75" y2="100" />
                </g>

                {/* Stylized Peninsula & Himalayan Contour Path */}
                <path
                  d="M34,6 L44,8 L48,16 L54,24 L68,28 L78,32 L82,42 L70,46 L62,58 L54,68 L50,82 L43,92 L37,84 L32,70 L26,56 L20,46 L26,34 L32,22 Z"
                  fill="#E7E0D0"
                  stroke="#A8A29E"
                  strokeWidth="0.6"
                />
                {/* Andaman Islands Contour */}
                <ellipse cx="84" cy="81" rx="3.5" ry="6" fill="#E7E0D0" stroke="#A8A29E" strokeWidth="0.5" />
              </svg>

              {/* Clickable City Markers Across India */}
              {destinations.map((dest) => {
                const isSelected = dest.id === selectedDestination.id;
                return (
                  <button
                    key={dest.id}
                    type="button"
                    onClick={() => onSelectDestination(dest)}
                    style={{
                      left: `${dest.mapPosition.mapX}%`,
                      top: `${dest.mapPosition.mapY}%`,
                    }}
                    className={`group absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 transition-transform duration-150 focus:outline-none ${
                      isSelected ? 'z-30 scale-110' : 'z-10 hover:z-20 hover:scale-105'
                    }`}
                    title={`${dest.name}, ${dest.state}`}
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-[#C2410C] border-white ring-4 ring-[#C2410C]/25'
                          : 'bg-stone-900 border-white group-hover:bg-[#C2410C]'
                      }`}
                    />
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-medium whitespace-nowrap shadow-xs transition-colors ${
                        isSelected
                          ? 'bg-[#C2410C] text-white font-semibold'
                          : 'bg-white/95 text-stone-800 border border-stone-300/80 group-hover:bg-stone-900 group-hover:text-white'
                      }`}
                    >
                      {language === 'te' ? dest.nameTe : dest.name}
                    </span>
                  </button>
                );
              })}

              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-stone-600 bg-white/90 backdrop-blur-xs px-3.5 py-2 rounded-lg border border-stone-200/80">
                <span>Click any of the 21 Indian destinations to inspect local landmarks, hotels, and transit.</span>
                <span className="font-mono tabular-nums font-medium text-stone-900">21 Active Cities</span>
              </div>
            </div>
          ) : (
            /* CITY LANDMARK & TOPOGRAPHIC EXPLORER MAP */
            <div className="relative w-full h-[460px] sm:h-[500px]">
              {/* Cartographic SVG Street & River Canvas */}
              <svg viewBox="0 0 800 500" preserveAspectRatio="none" className="w-full h-full block">
                <rect width="800" height="500" fill="#EFECE4" />
                {/* Green Park Zones */}
                <ellipse cx="180" cy="140" rx="95" ry="60" fill="#DCE7D6" />
                <ellipse cx="620" cy="360" rx="120" ry="75" fill="#DCE7D6" />
                {/* Water Body / River / Coastline */}
                <path
                  d="M0,390 Q240,340 420,250 T800,110 L800,175 Q560,295 390,330 T0,450 Z"
                  fill="#CBE3EE"
                />
                {/* Arterial Roads */}
                <g stroke="#DFD9CC" strokeWidth="8" fill="none">
                  <path d="M80,0 L410,250 L740,500" />
                  <path d="M0,220 L410,250 L800,260" />
                  <path d="M260,0 L390,500" />
                </g>
                <g stroke="#FFFFFF" strokeWidth="3" fill="none">
                  <path d="M80,0 L410,250 L740,500" />
                  <path d="M0,220 L410,250 L800,260" />
                  <path d="M260,0 L390,500" />
                </g>
                {/* Concentric Distance Rings */}
                <circle
                  cx="400"
                  cy="250"
                  r="95"
                  fill="none"
                  stroke="#A8A29E"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                />
                <circle
                  cx="400"
                  cy="250"
                  r="190"
                  fill="none"
                  stroke="#A8A29E"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                />
              </svg>

              {/* Center Destination Hub Marker */}
              <div
                style={{ left: '50%', top: '50%' }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none"
              >
                <div className="px-2.5 py-1 rounded-md bg-stone-900 text-white text-xs font-semibold shadow-sm whitespace-nowrap">
                  {selectedDestination.name} City Center
                </div>
                <div className="w-3 h-3 rounded-full bg-stone-900 border-2 border-white mt-1" />
              </div>

              {/* 1. Tourist Attractions Markers */}
              {(activeLayer === 'all' || activeLayer === 'attractions') &&
                selectedDestination.attractions.map((attr) => {
                  const active = selectedPinId === attr.id;
                  return (
                    <button
                      key={attr.id}
                      type="button"
                      onClick={() => setSelectedPinId(attr.id)}
                      style={{
                        left: `${attr.coordinates.x}%`,
                        top: `${attr.coordinates.y}%`,
                      }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-transform duration-150 whitespace-nowrap ${
                        active
                          ? 'z-30 scale-105 bg-[#C2410C] text-white border-[#C2410C] shadow-md'
                          : 'z-20 bg-white text-stone-900 border-stone-300 hover:border-[#C2410C] shadow-xs'
                      }`}
                    >
                      <Landmark className="w-3.5 h-3.5 shrink-0 text-[#C2410C] group-hover:text-current" />
                      <span>{attr.name}</span>
                      <span className="font-mono tabular-nums text-[11px] opacity-80">
                        {attr.adultPrice > 0 ? formatINR(attr.adultPrice) : 'Free'}
                      </span>
                    </button>
                  );
                })}

              {/* 2. Hotel Markers */}
              {(activeLayer === 'all' || activeLayer === 'hotels') &&
                cityHotels.map((hotel) => {
                  const active = selectedPinId === hotel.id;
                  return (
                    <button
                      key={hotel.id}
                      type="button"
                      onClick={() => setSelectedPinId(hotel.id)}
                      style={{
                        left: `${hotel.coordinates.x}%`,
                        top: `${hotel.coordinates.y}%`,
                      }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-transform duration-150 whitespace-nowrap ${
                        active
                          ? 'z-30 scale-105 bg-emerald-800 text-white border-emerald-800 shadow-md'
                          : 'z-20 bg-emerald-950 text-white border-emerald-800 hover:bg-emerald-800 shadow-xs'
                      }`}
                    >
                      <BedDouble className="w-3.5 h-3.5 shrink-0 text-emerald-300" />
                      <span>{hotel.name}</span>
                      <span className="font-mono tabular-nums text-emerald-200">
                        {formatINR(hotel.pricePerNight)}
                      </span>
                    </button>
                  );
                })}

              {/* 3. Restaurant Markers */}
              {(activeLayer === 'all' || activeLayer === 'restaurants') &&
                selectedDestination.restaurants.map((rest) => {
                  const active = selectedPinId === rest.id;
                  return (
                    <button
                      key={rest.id}
                      type="button"
                      onClick={() => setSelectedPinId(rest.id)}
                      style={{
                        left: `${rest.coordinates.x}%`,
                        top: `${rest.coordinates.y}%`,
                      }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-transform duration-150 whitespace-nowrap ${
                        active
                          ? 'z-30 scale-105 bg-amber-800 text-white border-amber-800 shadow-md'
                          : 'z-20 bg-amber-50 text-amber-950 border-amber-300 hover:bg-amber-100 shadow-xs'
                      }`}
                    >
                      <Utensils className="w-3.5 h-3.5 shrink-0 text-amber-700" />
                      <span>{rest.name}</span>
                    </button>
                  );
                })}

              {/* 4. Nearby Excursion Places */}
              {(activeLayer === 'all' || activeLayer === 'nearby') &&
                selectedDestination.nearbyPlaces.map((np, idx) => {
                  const pos = [
                    { x: 18, y: 20 },
                    { x: 82, y: 22 },
                    { x: 80, y: 82 },
                  ][idx % 3];
                  return (
                    <button
                      key={np.name}
                      type="button"
                      onClick={() => setSelectedPinId(np.name)}
                      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-800/90 text-stone-100 border border-stone-700 text-xs whitespace-nowrap hover:bg-stone-900"
                    >
                      <Compass className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{np.name}</span>
                      <span className="font-mono tabular-nums text-[11px] text-stone-300">
                        {np.distanceKm} km
                      </span>
                    </button>
                  );
                })}

              {/* Legend Bar */}
              <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-xs border border-stone-200/90 rounded-lg px-3.5 py-2 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-600">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C2410C]" />
                    Tourist Attractions ({selectedDestination.attractions.length})
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-800" />
                    Curated Hotels ({cityHotels.length})
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                    Regional Dining ({selectedDestination.restaurants.length})
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-stone-800" />
                    Nearby Excursions ({selectedDestination.nearbyPlaces.length})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenDestinationModal(selectedDestination)}
                  className="font-medium text-[#C2410C] hover:underline whitespace-nowrap"
                >
                  Full City Guide →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Directory Sidebar (4 cols) */}
        <div className="lg:col-span-4 p-5 sm:p-6 bg-stone-50/60 flex flex-col justify-between max-h-[500px] overflow-y-auto">
          <div className="space-y-5">
            <div>
              <p className="text-xs text-stone-500">Selected Destination</p>
              <div className="flex items-baseline justify-between mt-1">
                <h4 className="text-lg font-semibold text-stone-900">
                  {selectedDestination.name} ({selectedDestination.nameTe})
                </h4>
                <span className="text-xs font-mono tabular-nums text-stone-600">
                  {selectedDestination.weather.tempCelsius}°C · {selectedDestination.weather.condition}
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                {selectedDestination.tagline}
              </p>
            </div>

            {/* Attractions List */}
            <div className="border-t border-stone-200/80 pt-4">
              <h5 className="text-xs font-semibold text-stone-800 mb-2.5">
                Key Tourist Attractions
              </h5>
              <div className="space-y-2.5">
                {selectedDestination.attractions.map((attr) => (
                  <div
                    key={attr.id}
                    onClick={() => {
                      setMapMode('city');
                      setSelectedPinId(attr.id);
                    }}
                    className={`p-2.5 rounded-lg border cursor-pointer transition-colors ${
                      selectedPinId === attr.id
                        ? 'bg-white border-[#C2410C]'
                        : 'bg-white border-stone-200/80 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-stone-900">{attr.name}</span>
                      <span className="text-xs font-mono tabular-nums text-[#C2410C] font-medium">
                        {attr.adultPrice > 0 ? formatINR(attr.adultPrice) : 'Free Entry'}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      {attr.category} · {attr.openingHours}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hotels & Dining List */}
            <div className="border-t border-stone-200/80 pt-4">
              <h5 className="text-xs font-semibold text-stone-800 mb-2.5">
                Hotels & Nearby Places
              </h5>
              <div className="space-y-2">
                {cityHotels.map((hotel) => (
                  <div
                    key={hotel.id}
                    className="p-2.5 rounded-lg bg-white border border-stone-200/80 flex items-center justify-between gap-2"
                  >
                    <div>
                      <p className="text-xs font-semibold text-stone-900">{hotel.name}</p>
                      <p className="text-[11px] text-stone-500">{hotel.distanceFromAttraction}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onSelectHotelForTrip(hotel)}
                      className="px-2.5 py-1 text-xs font-medium text-[#C2410C] border border-[#C2410C]/30 rounded hover:bg-[#C2410C] hover:text-white transition-colors whitespace-nowrap"
                    >
                      {formatINR(hotel.pricePerNight)}
                    </button>
                  </div>
                ))}
                {selectedDestination.nearbyPlaces.map((np) => (
                  <div
                    key={np.name}
                    className="px-2.5 py-2 rounded-lg bg-stone-100/80 text-xs text-stone-700 flex items-center justify-between"
                  >
                    <span>
                      <strong className="font-medium text-stone-900">{np.name}</strong> — {np.highlight}
                    </span>
                    <span className="font-mono tabular-nums text-stone-500 shrink-0 ml-2">
                      {np.distanceKm} km
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
