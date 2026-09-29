import React from 'react';
import { Calculator, ArrowRight, RotateCcw } from 'lucide-react';
import {
  ActiveTripDraft,
  BudgetTier,
  Destination,
  Language,
} from '../types/travel';
import { formatINR, UI_TEXT } from '../data/translations';
import { calculateComprehensiveTripCost } from '../utils/itineraryGenerator';

interface TripCostCalculatorSectionProps {
  draft: ActiveTripDraft;
  destination: Destination;
  destinations: Destination[];
  language: Language;
  onUpdateDraft: (patch: Partial<ActiveTripDraft>) => void;
  onSelectDestination: (dest: Destination) => void;
  onOpenBookingSummary: () => void;
}

export const TripCostCalculatorSection: React.FC<TripCostCalculatorSectionProps> = ({
  draft,
  destination,
  destinations,
  language,
  onUpdateDraft,
  onSelectDestination,
  onOpenBookingSummary,
}) => {
  const t = UI_TEXT[language];
  const cost = calculateComprehensiveTripCost(draft, destination);

  const lineItems = [
    {
      label: '1. Intercity Transportation',
      note: draft.selectedTransport
        ? `${draft.selectedTransport.operatorName} (${draft.selectedTransport.mode} Round-Trip)`
        : `Estimated ${draft.budgetTier} Round-Trip Transit`,
      amount: cost.transportation,
    },
    {
      label: `2. Hotel Stay (${cost.nights} Nights · ${cost.roomsNeeded} Room${cost.roomsNeeded > 1 ? 's' : ''})`,
      note: draft.selectedHotel
        ? `${draft.selectedHotel.name} (${formatINR(draft.selectedHotel.pricePerNight)}/night)`
        : `${destination.name} ${draft.budgetTier} Tier Avg`,
      amount: cost.hotel,
    },
    {
      label: `3. Regional Food & Dining (${cost.days} Days)`,
      note: `Breakfast, lunch, dinner & chai/snacks for ${draft.adults}A + ${draft.children}C`,
      amount: cost.food,
    },
    {
      label: '4. Attraction & Activity Tickets',
      note:
        draft.selectedTickets.length > 0
          ? `${draft.selectedTickets.length} ticket package(s) selected`
          : `Estimated sightseeing entry fees in ${destination.name}`,
      amount: cost.attractionTickets,
    },
    {
      label: '5. Local Guide Fee',
      note: draft.selectedGuide
        ? `${draft.selectedGuide.guide.name} (${draft.selectedGuide.units} ${draft.selectedGuide.bookingType})`
        : 'Optional — hire a local guide above to include',
      amount: cost.guide,
    },
    {
      label: `6. Local Transportation (${cost.days} Days)`,
      note: 'Local autos, metro, cab transfers & sightseeing hops',
      amount: cost.localTransportation,
    },
    {
      label: '7. Other / Souvenir Expenses',
      note: 'Handicrafts, temple prasadam, tips & contingency',
      amount: cost.otherExpenses,
    },
  ];

  return (
    <div className="bg-white border border-stone-200/90 rounded-2xl p-6 sm:p-8">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <p className="text-xs text-stone-500">
            Real-Time Indian Rupee (₹) Trip Budget Estimator
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-stone-900 mt-1 flex items-center gap-2.5">
            <Calculator className="w-6 h-6 text-[#C2410C]" />
            <span>{t.costCalculatorTitle}</span>
          </h2>
        </div>

        {/* Instant Budget Tier Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-stone-500 mr-1">Recalculate by Budget Tier:</span>
          <div className="inline-flex p-1 bg-stone-100 rounded-xl border border-stone-200/80 gap-1">
            {(['Budget', 'Standard', 'Premium', 'Luxury'] as BudgetTier[]).map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => onUpdateDraft({ budgetTier: tier })}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  draft.budgetTier === tier
                    ? 'bg-[#C2410C] text-white'
                    : 'text-stone-700 hover:text-stone-900'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        {/* Left: Interactive Parameters (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1.5">
              Destination City
            </label>
            <select
              value={destination.id}
              onChange={(e) => {
                const found = destinations.find((d) => d.id === e.target.value);
                if (found) onSelectDestination(found);
              }}
              className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900"
            >
              {destinations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.nameTe}) — {d.state}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={draft.startDate}
                onChange={(e) => onUpdateDraft({ startDate: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={draft.endDate}
                onChange={(e) => onUpdateDraft({ endDate: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Adults (12+ yrs)
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={draft.adults}
                onChange={(e) =>
                  onUpdateDraft({ adults: Math.max(1, Number(e.target.value)) })
                }
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Children (2–11 yrs)
              </label>
              <input
                type="number"
                min={0}
                max={20}
                value={draft.children}
                onChange={(e) =>
                  onUpdateDraft({ children: Math.max(0, Number(e.target.value)) })
                }
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Other / Shopping & Buffer Expenses:{' '}
              <strong className="font-mono text-stone-900">
                {formatINR(cost.otherExpenses)}
              </strong>
            </label>
            <input
              type="range"
              min={0}
              max={25000}
              step={500}
              value={draft.customOtherExpenses}
              onChange={(e) =>
                onUpdateDraft({ customOtherExpenses: Number(e.target.value) })
              }
              className="w-full accent-[#C2410C]"
            />
          </div>

          <button
            type="button"
            onClick={() =>
              onUpdateDraft({
                selectedHotel: null,
                selectedTransport: null,
                selectedTickets: [],
                selectedGuide: null,
                customOtherExpenses: 1500,
              })
            }
            className="px-3.5 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Custom Selections to City Averages</span>
          </button>
        </div>

        {/* Right: Itemized Formula Breakdown & Totals (7 cols) */}
        <div className="lg:col-span-7 bg-[#FAFAF8] border border-stone-200/90 rounded-xl p-5 sm:p-6 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-stone-500 pb-2 border-b border-stone-200">
              <span>Expense Component</span>
              <span className="font-mono">Estimated Amount (₹)</span>
            </div>

            {lineItems.map((item) => (
              <div
                key={item.label}
                className="flex items-start justify-between gap-4 py-1.5 border-b border-stone-200/60 last:border-b-0"
              >
                <div>
                  <p className="text-xs sm:text-sm font-medium text-stone-900">{item.label}</p>
                  <p className="text-[11px] text-stone-500">{item.note}</p>
                </div>
                <span className="font-mono tabular-nums text-sm font-semibold text-stone-900 shrink-0">
                  + {formatINR(item.amount)}
                </span>
              </div>
            ))}
          </div>

          {/* Highlighted 3-Metric Summary Bar */}
          <div className="mt-6 pt-5 border-t-2 border-stone-900 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-stone-200/90 rounded-xl p-3.5">
              <p className="text-xs text-stone-500">Cost Per Person</p>
              <p className="text-xl font-bold text-stone-900 font-mono tabular-nums mt-0.5">
                {formatINR(cost.costPerPerson)}
              </p>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Across {cost.totalHeadcount} traveler{cost.totalHeadcount > 1 ? 's' : ''}
              </p>
            </div>

            <div className="bg-white border border-stone-200/90 rounded-xl p-3.5">
              <p className="text-xs text-stone-500">Daily Average Cost</p>
              <p className="text-xl font-bold text-stone-900 font-mono tabular-nums mt-0.5">
                {formatINR(cost.dailyAverage)}
              </p>
              <p className="text-[11px] text-stone-500 mt-0.5">
                For {cost.days} days / {cost.nights} nights
              </p>
            </div>

            <div className="bg-stone-900 text-white rounded-xl p-3.5">
              <p className="text-xs text-stone-300">Total Estimated Cost</p>
              <p className="text-2xl font-bold text-amber-400 font-mono tabular-nums mt-0.5">
                {formatINR(cost.totalCost)}
              </p>
              <p className="text-[11px] text-stone-300 mt-0.5">
                All-inclusive ₹ estimate
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-stone-500">
              Ready to lock in your demo trip plan and generate a booking reference?
            </p>
            <button
              type="button"
              onClick={onOpenBookingSummary}
              className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#C2410C] hover:bg-[#9A3412] rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <span>{t.reviewBookingBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
