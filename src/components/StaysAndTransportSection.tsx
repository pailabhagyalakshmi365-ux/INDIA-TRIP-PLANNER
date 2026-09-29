import React, { useState } from 'react';
import { Bookmark, Check, Info, Plane, Train, Bus, Car, Navigation } from 'lucide-react';
import {
  Destination,
  Hotel,
  Language,
  TransportMode,
  TransportOption,
} from '../types/travel';
import { formatINR, UI_TEXT } from '../data/translations';

interface StaysAndTransportSectionProps {
  destinations: Destination[];
  selectedDestination: Destination;
  hotels: Hotel[];
  transportOptions: TransportOption[];
  selectedHotel: Hotel | null;
  selectedTransport: TransportOption | null;
  savedHotels: string[];
  language: Language;
  onSelectHotel: (hotel: Hotel) => void;
  onToggleSaveHotel: (hotelId: string) => void;
  onSelectTransport: (transport: TransportOption) => void;
}

export const StaysAndTransportSection: React.FC<StaysAndTransportSectionProps> = ({
  destinations,
  selectedDestination,
  hotels,
  transportOptions,
  selectedHotel,
  selectedTransport,
  savedHotels,
  language,
  onSelectHotel,
  onToggleSaveHotel,
  onSelectTransport,
}) => {
  const t = UI_TEXT[language];

  // Hotel Filters
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(10000);
  const [minRatingFilter, setMinRatingFilter] = useState<number>(0);
  const [hotelTypeFilter, setHotelTypeFilter] = useState<string>('all');
  const [amenityFilter, setAmenityFilter] = useState<string>('all');
  const [expandedHotelId, setExpandedHotelId] = useState<string | null>(null);

  // Transport Filters
  const [transportModeFilter, setTransportModeFilter] = useState<TransportMode | 'All'>('All');

  const filteredHotels = hotels.filter((h) => {
    if (cityFilter !== 'all' && h.destinationId !== cityFilter) return false;
    if (h.pricePerNight > maxPriceFilter) return false;
    if (h.rating < minRatingFilter) return false;
    if (hotelTypeFilter !== 'all' && h.hotelType !== hotelTypeFilter) return false;
    if (amenityFilter !== 'all' && !h.amenities.some((a) => a.toLowerCase().includes(amenityFilter.toLowerCase()))) {
      return false;
    }
    return true;
  });

  const filteredTransport = transportOptions.filter((tr) => {
    if (transportModeFilter !== 'All' && tr.mode !== transportModeFilter) return false;
    return true;
  });

  return (
    <div className="space-y-14">
      {/* 1. HOTELS & STAYS */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-xs text-stone-500 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#C2410C]" />
              <span>{t.hotelsDemoDisclaimer}</span>
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-stone-900 mt-1">
              {t.hotelsSectionTitle}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCityFilter(selectedDestination.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap ${
                cityFilter === selectedDestination.id
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
              }`}
            >
              Only {selectedDestination.name} Hotels
            </button>
            <button
              type="button"
              onClick={() => {
                setCityFilter('all');
                setMaxPriceFilter(10000);
                setMinRatingFilter(0);
                setHotelTypeFilter('all');
                setAmenityFilter('all');
              }}
              className="px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 whitespace-nowrap"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Hotel Filter Bar */}
        <div className="bg-white border border-stone-200/90 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs text-stone-500 mb-1">Destination City</label>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
            >
              <option value="all">All 21 Destinations ({hotels.length})</option>
              {destinations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.nameTe})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-stone-500 mb-1">
              Max Price / Night: <strong className="font-mono text-stone-900">{formatINR(maxPriceFilter)}</strong>
            </label>
            <input
              type="range"
              min={1500}
              max={10000}
              step={250}
              value={maxPriceFilter}
              onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
              className="w-full accent-[#C2410C] mt-1.5"
            />
          </div>

          <div>
            <label className="block text-xs text-stone-500 mb-1">Minimum Rating</label>
            <select
              value={minRatingFilter}
              onChange={(e) => setMinRatingFilter(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
            >
              <option value={0}>Any Rating</option>
              <option value={4.5}>4.5+ Stars</option>
              <option value={4.7}>4.7+ Stars</option>
              <option value={4.8}>4.8+ Exceptional</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-stone-500 mb-1">Hotel Category</label>
            <select
              value={hotelTypeFilter}
              onChange={(e) => setHotelTypeFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
            >
              <option value="all">All Categories</option>
              <option value="Budget Inn">Budget Inn</option>
              <option value="3-Star Comfort">3-Star Comfort</option>
              <option value="4-Star Boutique">4-Star Boutique</option>
              <option value="5-Star Heritage Palace">5-Star Heritage Palace</option>
              <option value="Eco Resort">Eco Resort</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-stone-500 mb-1">Amenity Filter</label>
            <select
              value={amenityFilter}
              onChange={(e) => setAmenityFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
            >
              <option value="all">Any Amenity</option>
              <option value="Wi-Fi">Free Wi-Fi</option>
              <option value="Pool">Swimming Pool</option>
              <option value="Spa">Spa / Wellness</option>
              <option value="View">Sea / Mountain / Lake View</option>
            </select>
          </div>
        </div>

        {/* Hotels Grid */}
        {filteredHotels.length === 0 ? (
          <div className="bg-white border border-stone-200 rounded-xl p-8 text-center">
            <p className="text-sm text-stone-600">
              No hotels match the current filter combination. Try increasing the max nightly price or selecting "All Destinations".
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHotels.map((hotel) => {
              const isSelected = selectedHotel?.id === hotel.id;
              const isSaved = savedHotels.includes(hotel.id);
              const isExpanded = expandedHotelId === hotel.id;

              return (
                <div
                  key={hotel.id}
                  className={`bg-white border rounded-xl p-5 flex flex-col justify-between transition-all duration-150 ${
                    isSelected
                      ? 'border-[#C2410C] ring-2 ring-[#C2410C]/15'
                      : 'border-stone-200/90 hover:border-stone-300'
                  }`}
                >
                  <div>
                    {/* Quiet Unboxed Metadata Header (Zero-Pill Discipline) */}
                    <div className="flex items-center justify-between gap-2 text-xs text-stone-500">
                      <span>
                        {hotel.cityName} · {hotel.hotelType} · ★ {hotel.rating} ({hotel.reviews})
                      </span>
                      <button
                        type="button"
                        onClick={() => onToggleSaveHotel(hotel.id)}
                        aria-label={`Save ${hotel.name}`}
                        className={`p-1 rounded hover:bg-stone-100 ${
                          isSaved ? 'text-[#C2410C]' : 'text-stone-400 hover:text-stone-700'
                        }`}
                      >
                        <Bookmark className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} />
                      </button>
                    </div>

                    <h3 className="text-lg font-semibold text-stone-900 mt-1.5">
                      {hotel.name}
                    </h3>
                    <p className="text-xs text-stone-600 mt-0.5">{hotel.location}</p>

                    <div className="mt-3 pt-3 border-t border-stone-100 space-y-1.5 text-xs text-stone-700">
                      <p>
                        <span className="text-stone-500">Room:</span>{' '}
                        <strong className="font-medium text-stone-900">{hotel.roomType}</strong>
                      </p>
                      <p>
                        <span className="text-stone-500">Breakfast:</span>{' '}
                        {hotel.breakfastIncluded ? 'Complimentary Regional Breakfast Included' : 'Available on request'}
                      </p>
                      <p className="text-stone-500">{hotel.distanceFromAttraction}</p>
                      <p className="text-stone-500">
                        Amenities: {hotel.amenities.join(' · ')}
                      </p>
                    </div>

                    {isExpanded && (
                      <div className="mt-3 p-3 rounded-lg bg-stone-50 border border-stone-200/70 text-xs text-stone-700 space-y-1">
                        <p className="font-medium text-stone-900">Property Overview (Demo Data)</p>
                        <p>{hotel.description}</p>
                        <p className="text-stone-500 pt-1">
                          Check-in: 12:00 PM · Check-out: 11:00 AM · Free Demo Cancellation
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 pt-4 border-t border-stone-200/80 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-[11px] text-stone-500">Estimated price / night</p>
                      <p className="text-xl font-bold text-stone-900 font-mono tabular-nums">
                        {formatINR(hotel.pricePerNight)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setExpandedHotelId(isExpanded ? null : hotel.id)}
                        className="px-3 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors whitespace-nowrap"
                      >
                        {isExpanded ? 'Hide Details' : 'View Details'}
                      </button>
                      <button
                        type="button"
                        onClick={() => onSelectHotel(hotel)}
                        className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                          isSelected
                            ? 'bg-emerald-800 text-white'
                            : 'bg-[#C2410C] hover:bg-[#9A3412] text-white'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Selected</span>
                          </>
                        ) : (
                          <span>Book Now (Demo)</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. TRAVEL TRANSPORT SECTION */}
      <div className="space-y-6 pt-8 border-t border-stone-200">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-xs text-stone-500">
              Intercity & Local Transit · Estimated Demo Fares in ₹
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-stone-900 mt-1">
              {t.transportSectionTitle}
            </h2>
          </div>

          {/* Mode Segmented Filter */}
          <div className="inline-flex flex-wrap p-1 bg-stone-100 rounded-xl border border-stone-200/80 gap-1">
            {(['All', 'Flight', 'Train', 'Bus', 'Car', 'Local Taxi'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setTransportModeFilter(mode)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  transportModeFilter === mode
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {mode === 'All' ? 'All Modes' : `${mode}s`}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTransport.map((tr) => {
            const isSelected = selectedTransport?.id === tr.id;
            const ModeIcon =
              tr.mode === 'Flight'
                ? Plane
                : tr.mode === 'Train'
                ? Train
                : tr.mode === 'Bus'
                ? Bus
                : tr.mode === 'Car'
                ? Car
                : Navigation;

            return (
              <div
                key={tr.id}
                className={`bg-white border rounded-xl p-5 flex flex-col justify-between transition-all ${
                  isSelected
                    ? 'border-[#C2410C] ring-2 ring-[#C2410C]/15'
                    : 'border-stone-200/90 hover:border-stone-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-stone-500">
                    <span className="inline-flex items-center gap-1.5 font-medium text-stone-700">
                      <ModeIcon className="w-3.5 h-3.5 text-[#C2410C]" />
                      {tr.mode} · {tr.serviceNumber}
                    </span>
                    <span>{tr.classType}</span>
                  </div>

                  <h3 className="text-base font-semibold text-stone-900 mt-1.5">
                    {tr.operatorName}
                  </h3>

                  <div className="mt-3 p-3 rounded-lg bg-stone-50 border border-stone-200/70 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-stone-900">{tr.fromCity}</p>
                      <p className="font-mono tabular-nums text-stone-500 mt-0.5">
                        {tr.departureTime}
                      </p>
                    </div>
                    <div className="text-center px-2">
                      <p className="font-mono tabular-nums text-[11px] text-stone-500">
                        {tr.duration}
                      </p>
                      <div className="w-16 h-px bg-stone-300 my-1" />
                      <p className="text-[10px] text-stone-400">Direct</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-stone-900">{tr.toCity}</p>
                      <p className="font-mono tabular-nums text-stone-500 mt-0.5">
                        {tr.arrivalTime}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-[11px] text-stone-500">Approx. fare / person</p>
                    <p className="text-lg font-bold text-stone-900 font-mono tabular-nums">
                      {formatINR(tr.approxFarePerPerson)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectTransport(tr)}
                    className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                      isSelected
                        ? 'bg-emerald-800 text-white'
                        : 'bg-stone-900 hover:bg-stone-800 text-white'
                    }`}
                  >
                    {isSelected ? 'Selected for Trip' : 'Book Transport (Demo)'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
