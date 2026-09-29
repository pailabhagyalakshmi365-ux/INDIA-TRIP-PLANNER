import React, { useState } from 'react';
import {
  Bookmark,
  Calendar,
  CheckCircle2,
  Compass,
  Sparkles,
  ArrowRight,
  Clock,
} from 'lucide-react';
import {
  ActiveTripDraft,
  BudgetTier,
  Destination,
  GeneratedItinerary,
  Hotel,
  Language,
  TransportMode,
  TravelType,
} from '../types/travel';
import { formatINR, UI_TEXT } from '../data/translations';
import { generateDayByDayItinerary } from '../utils/itineraryGenerator';

interface TripPlannerSectionProps {
  destinations: Destination[];
  selectedDestination: Destination;
  draft: ActiveTripDraft;
  hotels: Hotel[];
  language: Language;
  onUpdateDraft: (patch: Partial<ActiveTripDraft>) => void;
  onSelectDestination: (dest: Destination) => void;
  onSaveItinerary: (itin: GeneratedItinerary) => void;
  onOpenBookingSummary: () => void;
}

const INTEREST_OPTIONS = [
  'History',
  'Nature',
  'Adventure',
  'Temples',
  'Beaches',
  'Shopping',
  'Wildlife',
];

export const TripPlannerSection: React.FC<TripPlannerSectionProps> = ({
  destinations,
  selectedDestination,
  draft,
  hotels,
  language,
  onUpdateDraft,
  onSelectDestination,
  onSaveItinerary,
  onOpenBookingSummary,
}) => {
  const t = UI_TEXT[language];

  const [transportMode, setTransportMode] = useState<TransportMode>('Train');
  const [hotelPreference, setHotelPreference] = useState<string>('4-Star Boutique');
  const [foodPreference, setFoodPreference] = useState<string>(
    'South Indian & Regional Specialties'
  );
  const [interests, setInterests] = useState<string[]>([
    'History',
    'Temples',
    'Nature',
  ]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>('');
  const [savedToast, setSavedToast] = useState<boolean>(false);

  const toggleInterest = (item: string) => {
    setInterests((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.startingCity.trim()) {
      setFormError('Please enter your starting city.');
      return;
    }
    if (draft.startDate && draft.endDate && new Date(draft.endDate) < new Date(draft.startDate)) {
      setFormError('End date cannot be earlier than start date.');
      return;
    }
    setFormError('');
    setIsGenerating(true);

    setTimeout(() => {
      const matchingHotel =
        draft.selectedHotel && draft.selectedHotel.destinationId === selectedDestination.id
          ? draft.selectedHotel
          : hotels.find((h) => h.destinationId === selectedDestination.id) || null;

      const generated = generateDayByDayItinerary({
        startingCity: draft.startingCity,
        destination: selectedDestination,
        startDate: draft.startDate,
        endDate: draft.endDate,
        adults: draft.adults,
        children: draft.children,
        travelType: draft.travelType,
        budgetTier: draft.budgetTier,
        transportMode,
        hotelPreference,
        foodPreference,
        interests,
        recommendedHotel: matchingHotel,
      });

      onUpdateDraft({ generatedItinerary: generated });
      setIsGenerating(false);
    }, 180);
  };

  const activeItinerary = draft.generatedItinerary;

  return (
    <div className="bg-white border border-stone-200/90 rounded-2xl p-6 sm:p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-5 border-b border-stone-200">
        <div>
          <p className="text-xs text-stone-500">
            Smart Day-by-Day Schedule & Daily Cost Builder
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-stone-900 mt-1">
            {t.tripPlannerTitle}
          </h2>
          <p className="text-sm text-stone-600 mt-1 max-w-2xl">{t.tripPlannerSub}</p>
        </div>

        <div className="text-xs text-stone-500 font-mono tabular-nums">
          Active Destination: <strong className="text-stone-900">{selectedDestination.name} ({selectedDestination.nameTe})</strong>
        </div>
      </div>

      {/* Trip Planning Form */}
      <form onSubmit={handleGenerate} className="space-y-6">
        {formError && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800">
            {formError}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Starting City */}
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              {t.startingCity} *
            </label>
            <input
              type="text"
              value={draft.startingCity}
              onChange={(e) => onUpdateDraft({ startingCity: e.target.value })}
              placeholder="e.g. Hyderabad, Vijayawada, Mumbai"
              className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#C2410C]"
              required
            />
          </div>

          {/* 2. Destination */}
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              {t.destination} *
            </label>
            <select
              value={selectedDestination.id}
              onChange={(e) => {
                const found = destinations.find((d) => d.id === e.target.value);
                if (found) onSelectDestination(found);
              }}
              className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#C2410C]"
            >
              {destinations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.nameTe}) — {d.recommendedDays} Days rec.
                </option>
              ))}
            </select>
          </div>

          {/* 3. Start Date */}
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              {t.startDate} *
            </label>
            <input
              type="date"
              value={draft.startDate}
              onChange={(e) => onUpdateDraft({ startDate: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl font-mono focus:outline-none focus:border-[#C2410C]"
              required
            />
          </div>

          {/* 4. End Date */}
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              {t.endDate} *
            </label>
            <input
              type="date"
              value={draft.endDate}
              onChange={(e) => onUpdateDraft({ endDate: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl font-mono focus:outline-none focus:border-[#C2410C]"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 5. Adults & Children */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                {t.adults}
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={draft.adults}
                onChange={(e) =>
                  onUpdateDraft({ adults: Math.max(1, Number(e.target.value)) })
                }
                className="w-full px-3 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                {t.children}
              </label>
              <input
                type="number"
                min={0}
                max={20}
                value={draft.children}
                onChange={(e) =>
                  onUpdateDraft({ children: Math.max(0, Number(e.target.value)) })
                }
                className="w-full px-3 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl font-mono"
              />
            </div>
          </div>

          {/* 6. Travel Type */}
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              {t.travelType}
            </label>
            <div className="grid grid-cols-4 gap-1 p-1 bg-stone-100 rounded-xl border border-stone-200/80">
              {(['Solo', 'Couple', 'Family', 'Friends'] as TravelType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => onUpdateDraft({ travelType: type })}
                  className={`py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                    draft.travelType === type
                      ? 'bg-stone-900 text-white'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* 7. Budget Tier */}
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              {t.budgetTier}
            </label>
            <div className="grid grid-cols-4 gap-1 p-1 bg-stone-100 rounded-xl border border-stone-200/80">
              {(['Budget', 'Standard', 'Premium', 'Luxury'] as BudgetTier[]).map(
                (tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => onUpdateDraft({ budgetTier: tier })}
                    className={`py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                      draft.budgetTier === tier
                        ? 'bg-[#C2410C] text-white'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {tier}
                  </button>
                )
              )}
            </div>
          </div>

          {/* 8. Transport Preference */}
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              {t.transportPref}
            </label>
            <div className="grid grid-cols-4 gap-1 p-1 bg-stone-100 rounded-xl border border-stone-200/80">
              {(['Flight', 'Train', 'Bus', 'Car'] as TransportMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setTransportMode(mode)}
                  className={`py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                    transportMode === mode
                      ? 'bg-stone-900 text-white'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          {/* 9. Hotel Preference */}
          <div className="md:col-span-3">
            <label className="block text-xs font-medium text-stone-700 mb-1">
              {t.hotelPref}
            </label>
            <select
              value={hotelPreference}
              onChange={(e) => setHotelPreference(e.target.value)}
              className="w-full px-3 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl"
            >
              <option value="Budget Inn">Budget Inn (₹1,500–₹2,200)</option>
              <option value="3-Star Comfort">3-Star Comfort (₹2,200–₹3,200)</option>
              <option value="4-Star Boutique">4-Star Boutique (₹3,200–₹4,800)</option>
              <option value="5-Star Heritage Palace">5-Star Heritage Palace (₹5,500+)</option>
            </select>
          </div>

          {/* 10. Food Preference */}
          <div className="md:col-span-3">
            <label className="block text-xs font-medium text-stone-700 mb-1">
              {t.foodPref}
            </label>
            <select
              value={foodPreference}
              onChange={(e) => setFoodPreference(e.target.value)}
              className="w-full px-3 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl"
            >
              <option value="South Indian Pure Veg">South Indian Pure Vegetarian</option>
              <option value="South Indian & Regional Specialties">South Indian & Regional Specialties</option>
              <option value="North Indian & Mughlai">North Indian & Mughlai</option>
              <option value="Street Food & Local Cafes">Street Food & Local Heritage Cafes</option>
            </select>
          </div>

          {/* 11. Interests */}
          <div className="md:col-span-6">
            <label className="block text-xs font-medium text-stone-700 mb-1">
              {t.interests} (Click to toggle)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {INTEREST_OPTIONS.map((interest) => {
                const active = interests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap ${
                      active
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-stone-50 text-stone-700 border-stone-300 hover:bg-stone-100'
                    }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-stone-500">
            Generates a customized day-by-day plan with opening hours, regional meals, and daily ₹ cost estimates.
          </p>
          <button
            type="submit"
            disabled={isGenerating}
            className="px-6 py-3 text-sm font-semibold text-white bg-[#C2410C] hover:bg-[#9A3412] rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap disabled:opacity-60"
          >
            <Compass className="w-4 h-4" />
            <span>
              {isGenerating ? 'Building Daily Schedule...' : t.generateItineraryBtn}
            </span>
          </button>
        </div>
      </form>

      {/* GENERATED DAY-BY-DAY ITINERARY DISPLAY */}
      {activeItinerary && (
        <div className="pt-8 border-t border-stone-200 space-y-6">
          <div className="bg-[#FAFAF8] border border-stone-200/90 rounded-xl p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <p className="text-xs text-stone-500 font-mono tabular-nums">
                {activeItinerary.startingCity} → {activeItinerary.destinationName} ·{' '}
                {activeItinerary.daysCount} Days · {activeItinerary.adults} Adults,{' '}
                {activeItinerary.children} Children · {activeItinerary.budgetTier} Tier
              </p>
              <h3 className="text-xl font-semibold text-stone-900 mt-0.5">
                Complete {activeItinerary.daysCount}-Day {activeItinerary.destinationName} Itinerary
              </h3>
              <p className="text-xs text-stone-600 mt-0.5">
                Transport: {activeItinerary.transportMode} · Hotel Style:{' '}
                {activeItinerary.hotelPreference} · Dining: {activeItinerary.foodPreference}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="text-right mr-2">
                <p className="text-[11px] text-stone-500">Itinerary Daily Sum</p>
                <p className="text-xl font-bold text-[#C2410C] font-mono tabular-nums">
                  {formatINR(activeItinerary.estimatedTotalCost)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  onSaveItinerary(activeItinerary);
                  setSavedToast(true);
                  setTimeout(() => setSavedToast(false), 3000);
                }}
                className="px-3.5 py-2 text-xs font-medium text-stone-800 bg-white border border-stone-300 hover:bg-stone-100 rounded-lg flex items-center gap-1.5 whitespace-nowrap"
              >
                <Bookmark className="w-3.5 h-3.5 text-[#C2410C]" />
                <span>{savedToast ? 'Saved to My Trips!' : 'Save Itinerary'}</span>
              </button>

              <button
                type="button"
                onClick={onOpenBookingSummary}
                className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg flex items-center gap-1.5 whitespace-nowrap"
              >
                <span>Proceed to Booking Summary</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Day Cards */}
          <div className="space-y-5">
            {activeItinerary.days.map((day) => (
              <div
                key={day.dayNumber}
                className="bg-white border border-stone-200/90 rounded-xl overflow-hidden"
              >
                <div className="px-5 py-3.5 bg-stone-50 border-b border-stone-200/80 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded bg-stone-900 text-white text-xs font-mono font-semibold">
                      Day {day.dayNumber}
                    </span>
                    <div>
                      <h4 className="text-sm sm:text-base font-semibold text-stone-900">
                        {day.headline}
                      </h4>
                      <p className="text-xs text-stone-500 font-mono">
                        {day.dateStr} · Stay: {day.hotelName}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-stone-500 mr-1.5">Estimated Day Cost:</span>
                    <span className="text-sm font-bold text-stone-900 font-mono tabular-nums">
                      {formatINR(day.dailyTotalCost)}
                    </span>
                  </div>
                </div>

                <div className="divide-y divide-stone-100">
                  {day.slots.map((slot, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-4 sm:px-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 text-xs text-stone-500">
                          <span className="font-semibold text-[#C2410C]">
                            {slot.timeOfDay}
                          </span>
                          {slot.timing && (
                            <>
                              <span>·</span>
                              <span className="font-mono tabular-nums">{slot.timing}</span>
                            </>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-stone-900">{slot.title}</p>
                        <p className="text-xs text-stone-600 leading-relaxed">
                          {slot.description}
                        </p>
                      </div>

                      <div className="sm:text-right shrink-0">
                        <span className="text-xs font-mono tabular-nums font-medium text-stone-700">
                          {slot.estimatedCost > 0
                            ? formatINR(slot.estimatedCost)
                            : 'Included'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
