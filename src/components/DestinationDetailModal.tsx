import React from 'react';
import { X, Bookmark, Calendar, CloudSun, MapPin, Compass, ArrowRight } from 'lucide-react';
import { Destination, Language } from '../types/travel';
import { formatINR } from '../data/translations';
import { DestinationArtwork } from './DestinationArtwork';

interface DestinationDetailModalProps {
  destination: Destination | null;
  language: Language;
  isSaved: boolean;
  onClose: () => void;
  onToggleSave: (destinationId: string) => void;
  onPlanTripHere: (destination: Destination) => void;
  onJumpToSection: (destination: Destination, sectionId: string) => void;
}

export const DestinationDetailModal: React.FC<DestinationDetailModalProps> = ({
  destination,
  language,
  isSaved,
  onClose,
  onToggleSave,
  onPlanTripHere,
  onJumpToSection,
}) => {
  if (!destination) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-[#FAFAF8] border border-stone-200 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero Media Header */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-stone-900">
          <DestinationArtwork
            imageKey={destination.imageKey}
            customImageUrl={destination.customImageUrl}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

          {/* Top Action Controls */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleSave(destination.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                isSaved
                  ? 'bg-[#C2410C] text-white'
                  : 'bg-white/95 text-stone-900 hover:bg-white'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" fill={isSaved ? 'currentColor' : 'none'} />
              <span>{isSaved ? 'Saved' : 'Save Place'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close destination details"
              className="p-2 rounded-lg bg-white/95 text-stone-900 hover:bg-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Bottom Title Lockup */}
          <div className="absolute bottom-5 left-6 right-6 text-white">
            <p className="text-xs text-stone-200">
              {destination.state} ({destination.stateTe}) · {destination.categories.join(' · ')} · ★ {destination.rating} ({destination.reviewCount.toLocaleString('en-IN')} reviews)
            </p>
            <h2 className="text-2xl sm:text-4xl font-semibold mt-1">
              {destination.name}{' '}
              <span className="text-stone-300 font-normal text-xl sm:text-2xl">
                ({destination.nameTe})
              </span>
            </h2>
            <p className="text-sm text-stone-200 mt-1 max-w-2xl">
              {language === 'te' ? destination.taglineTe : destination.tagline}
            </p>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Quick Daily Cost & Planning Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pb-6 border-b border-stone-200/80">
            <div>
              <p className="text-xs text-stone-500">Best Time to Visit</p>
              <p className="text-sm font-semibold text-stone-900 mt-0.5">
                {destination.bestTimeToVisit}
              </p>
            </div>
            <div>
              <p className="text-xs text-stone-500">Recommended Stay</p>
              <p className="text-sm font-semibold text-stone-900 font-mono tabular-nums mt-0.5">
                {destination.recommendedDays} Days / {Math.max(1, destination.recommendedDays - 1)} Nights
              </p>
            </div>
            <div>
              <p className="text-xs text-stone-500">Est. Hotel / Night</p>
              <p className="text-sm font-semibold text-stone-900 font-mono tabular-nums mt-0.5">
                {formatINR(destination.costs.hotelPerNightAvg)}
              </p>
            </div>
            <div>
              <p className="text-xs text-stone-500">Est. Food / Day</p>
              <p className="text-sm font-semibold text-stone-900 font-mono tabular-nums mt-0.5">
                {formatINR(destination.costs.foodPerDay)}
              </p>
            </div>
            <div>
              <p className="text-xs text-stone-500">Local Transit / Day</p>
              <p className="text-sm font-semibold text-stone-900 font-mono tabular-nums mt-0.5">
                {formatINR(destination.costs.localTransportPerDay)}
              </p>
            </div>
            <div>
              <p className="text-xs text-stone-500">Avg. Entry Tickets</p>
              <p className="text-sm font-semibold text-stone-900 font-mono tabular-nums mt-0.5">
                {formatINR(destination.costs.entryTicketAvg)}
              </p>
            </div>
          </div>

          {/* Overview & Weather */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-3">
              <h3 className="text-lg font-semibold text-stone-900">About {destination.name}</h3>
              <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
                {language === 'te' ? destination.descriptionTe : destination.description}
              </p>
              {language === 'en' && (
                <p className="text-xs text-stone-500 leading-relaxed">
                  తెలుగు వివరణ: {destination.descriptionTe}
                </p>
              )}
            </div>

            <div className="lg:col-span-4 bg-white border border-stone-200/90 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-900">Weather & Season Guide</span>
                <CloudSun className="w-4 h-4 text-[#C2410C]" />
              </div>
              <p className="text-2xl font-semibold text-stone-900 font-mono tabular-nums">
                {destination.weather.tempCelsius}°C · {destination.weather.condition}
              </p>
              <p className="text-xs text-stone-500">
                Humidity: <span className="font-mono tabular-nums">{destination.weather.humidity}</span> · Coordinates: <span className="font-mono tabular-nums">{destination.mapPosition.lat.toFixed(2)}°N, {destination.mapPosition.lng.toFixed(2)}°E</span>
              </p>
              <p className="text-xs text-stone-600 pt-1 border-t border-stone-100">
                {destination.weather.seasonNote}
              </p>
            </div>
          </div>

          {/* Famous Attractions with Opening/Closing Times & Ticket Prices */}
          <div>
            <h3 className="text-lg font-semibold text-stone-900 mb-3">
              Famous Attractions, Timings & Entry Ticket Prices
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {destination.attractions.map((attr) => (
                <div
                  key={attr.id}
                  className="bg-white border border-stone-200/90 rounded-xl p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-baseline justify-between gap-2">
                      <h4 className="text-sm font-semibold text-stone-900">
                        {attr.name} {attr.nameTe ? `(${attr.nameTe})` : ''}
                      </h4>
                      <span className="text-xs text-stone-500 shrink-0">{attr.category}</span>
                    </div>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      {attr.description}
                    </p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-600">
                    <span>Hours: {attr.openingHours}</span>
                    <span className="font-mono tabular-nums font-semibold text-stone-900">
                      Adult: {attr.adultPrice > 0 ? formatINR(attr.adultPrice) : 'Free'} · Child:{' '}
                      {attr.childPrice > 0 ? formatINR(attr.childPrice) : 'Free'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Things To Do & Nearby Tourist Places */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-stone-200/80">
            <div>
              <h3 className="text-base font-semibold text-stone-900 mb-3">
                Top Things to Do in {destination.name}
              </h3>
              <ul className="space-y-2 text-sm text-stone-700">
                {destination.thingsToDo.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="font-mono tabular-nums text-xs text-[#C2410C] font-semibold mt-0.5">
                      0{idx + 1}.
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-base font-semibold text-stone-900 mb-3">
                Nearby Tourist Places & Day Excursions
              </h3>
              <div className="space-y-2.5">
                {destination.nearbyPlaces.map((np) => (
                  <div
                    key={np.name}
                    className="bg-white border border-stone-200/80 rounded-lg p-3 flex items-center justify-between gap-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-stone-900">{np.name}</p>
                      <p className="text-xs text-stone-600">{np.highlight}</p>
                    </div>
                    <span className="text-xs font-mono tabular-nums text-stone-700 font-medium shrink-0">
                      {np.distanceKm} km
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onJumpToSection(destination, 'stays-transport')}
                className="px-3.5 py-2 text-xs font-medium text-stone-800 bg-white border border-stone-300 rounded-lg hover:bg-stone-100 transition-colors whitespace-nowrap"
              >
                Hotels in {destination.name}
              </button>
              <button
                type="button"
                onClick={() => onJumpToSection(destination, 'tickets-guides')}
                className="px-3.5 py-2 text-xs font-medium text-stone-800 bg-white border border-stone-300 rounded-lg hover:bg-stone-100 transition-colors whitespace-nowrap"
              >
                Tickets & Local Guides
              </button>
              <button
                type="button"
                onClick={() => onJumpToSection(destination, 'map-section')}
                className="px-3.5 py-2 text-xs font-medium text-stone-800 bg-white border border-stone-300 rounded-lg hover:bg-stone-100 transition-colors whitespace-nowrap"
              >
                Open on Interactive Map
              </button>
            </div>

            <button
              type="button"
              onClick={() => onPlanTripHere(destination)}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-[#C2410C] hover:bg-[#9A3412] rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <span>Generate {destination.name} Itinerary</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
