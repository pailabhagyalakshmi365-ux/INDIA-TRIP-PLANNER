import React, { useState } from 'react';
import { Check, Info, Ticket, UserCheck, Trash2 } from 'lucide-react';
import {
  Destination,
  Language,
  LocalGuide,
  SelectedGuideBooking,
  SelectedTicketOrder,
  TicketListing,
} from '../types/travel';
import { formatINR, UI_TEXT } from '../data/translations';

interface TicketsAndGuidesSectionProps {
  destinations: Destination[];
  selectedDestination: Destination;
  tickets: TicketListing[];
  guides: LocalGuide[];
  selectedTickets: SelectedTicketOrder[];
  selectedGuide: SelectedGuideBooking | null;
  defaultDate: string;
  defaultAdults: number;
  defaultChildren: number;
  language: Language;
  onAddTicketOrder: (order: SelectedTicketOrder) => void;
  onRemoveTicketOrder: (ticketId: string) => void;
  onSelectGuideBooking: (booking: SelectedGuideBooking | null) => void;
}

export const TicketsAndGuidesSection: React.FC<TicketsAndGuidesSectionProps> = ({
  destinations,
  selectedDestination,
  tickets,
  guides,
  selectedTickets,
  selectedGuide,
  defaultDate,
  defaultAdults,
  defaultChildren,
  language,
  onAddTicketOrder,
  onRemoveTicketOrder,
  onSelectGuideBooking,
}) => {
  const t = UI_TEXT[language];

  // Ticket Filter State
  const [ticketCityFilter, setTicketCityFilter] = useState<string>('all');
  const [ticketTypeFilter, setTicketTypeFilter] = useState<string>('all');

  // Per-card Ticket Selection Draft State
  const [ticketFormState, setTicketFormState] = useState<
    Record<string, { date: string; adults: number; children: number }>
  >({});

  // Guide Filter & Draft State
  const [guideCityFilter, setGuideCityFilter] = useState<string>('all');
  const [guideLanguageFilter, setGuideLanguageFilter] = useState<string>('all');
  const [guideDraftState, setGuideDraftState] = useState<
    Record<string, { bookingType: 'hourly' | 'daily'; units: number; date: string }>
  >({});

  const getTicketConfig = (ticketId: string) => {
    return (
      ticketFormState[ticketId] || {
        date: defaultDate || '2026-10-15',
        adults: defaultAdults || 2,
        children: defaultChildren || 0,
      }
    );
  };

  const updateTicketConfig = (
    ticketId: string,
    patch: Partial<{ date: string; adults: number; children: number }>
  ) => {
    const current = getTicketConfig(ticketId);
    setTicketFormState((prev) => ({
      ...prev,
      [ticketId]: { ...current, ...patch },
    }));
  };

  const getGuideConfig = (guideId: string) => {
    return (
      guideDraftState[guideId] || {
        bookingType: 'hourly' as const,
        units: 4,
        date: defaultDate || '2026-10-15',
      }
    );
  };

  const updateGuideConfig = (
    guideId: string,
    patch: Partial<{ bookingType: 'hourly' | 'daily'; units: number; date: string }>
  ) => {
    const current = getGuideConfig(guideId);
    setGuideDraftState((prev) => ({
      ...prev,
      [guideId]: { ...current, ...patch },
    }));
  };

  const filteredTickets = tickets.filter((tk) => {
    if (ticketCityFilter !== 'all' && tk.destinationId !== ticketCityFilter) return false;
    if (ticketTypeFilter !== 'all' && tk.ticketType !== ticketTypeFilter) return false;
    return true;
  });

  const filteredGuides = guides.filter((g) => {
    if (guideCityFilter !== 'all' && g.destinationId !== guideCityFilter) return false;
    if (
      guideLanguageFilter !== 'all' &&
      !g.languages.some((l) => l.toLowerCase() === guideLanguageFilter.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-14">
      {/* 1. ATTRACTION & ACTIVITY TICKET BOOKING */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-xs text-stone-500 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#C2410C]" />
              <span>{t.ticketsDemoDisclaimer}</span>
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-stone-900 mt-1">
              {t.ticketsSectionTitle}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={ticketCityFilter}
              onChange={(e) => setTicketCityFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg text-stone-900"
            >
              <option value="all">All Cities ({tickets.length})</option>
              {destinations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>

            <select
              value={ticketTypeFilter}
              onChange={(e) => setTicketTypeFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg text-stone-900"
            >
              <option value="all">All Ticket Types</option>
              <option value="Monument">Monuments</option>
              <option value="Tourist Attraction">Tourist Attractions</option>
              <option value="Museum">Museums</option>
              <option value="Park">Parks</option>
              <option value="Adventure Activity">Adventure Activities</option>
              <option value="Cultural Event">Events & Cruises</option>
            </select>

            <button
              type="button"
              onClick={() => setTicketCityFilter(selectedDestination.id)}
              className="px-3 py-2 text-xs font-medium bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg whitespace-nowrap"
            >
              Filter: {selectedDestination.name}
            </button>
          </div>
        </div>

        {/* Active Selected Tickets Banner */}
        {selectedTickets.length > 0 && (
          <div className="bg-emerald-50/90 border border-emerald-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-semibold text-emerald-950">
                Demo Tickets Added to Trip ({selectedTickets.length}):
              </span>
              {selectedTickets.map((item) => (
                <span
                  key={item.ticket.id}
                  className="inline-flex items-center gap-2 bg-white border border-emerald-200 px-2.5 py-1 rounded text-xs text-stone-800"
                >
                  <span>
                    {item.ticket.attractionName} ({item.adults}A, {item.children}C ·{' '}
                    <strong className="font-mono">{formatINR(item.totalPrice)}</strong>)
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemoveTicketOrder(item.ticket.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Remove ticket"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
            <span className="text-xs font-mono font-bold text-emerald-950">
              Tickets Subtotal:{' '}
              {formatINR(selectedTickets.reduce((sum, tk) => sum + tk.totalPrice, 0))}
            </span>
          </div>
        )}

        {/* Ticket Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTickets.map((tk) => {
            const cfg = getTicketConfig(tk.id);
            const computedTotal =
              tk.adultPrice * Math.max(0, cfg.adults) +
              tk.childPrice * Math.max(0, cfg.children);
            const alreadyBooked = selectedTickets.some((s) => s.ticket.id === tk.id);

            return (
              <div
                key={tk.id}
                className={`bg-white border rounded-xl p-5 flex flex-col justify-between transition-all ${
                  alreadyBooked
                    ? 'border-emerald-700 ring-2 ring-emerald-700/15'
                    : 'border-stone-200/90 hover:border-stone-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span>
                      {tk.cityName} · {tk.ticketType}
                    </span>
                    <span className="font-mono tabular-nums">{tk.duration}</span>
                  </div>

                  <h3 className="text-base font-semibold text-stone-900 mt-1.5">
                    {tk.attractionName}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">{tk.highlights}</p>
                  <p className="text-[11px] text-stone-500 mt-2">
                    Timings: {tk.openingHours} · Adult: <strong className="font-mono text-stone-800">{formatINR(tk.adultPrice)}</strong> · Child: <strong className="font-mono text-stone-800">{tk.childPrice > 0 ? formatINR(tk.childPrice) : 'Free'}</strong>
                  </p>

                  {/* Interactive Ticket Selector Controls */}
                  <div className="mt-4 pt-3 border-t border-stone-100 grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] text-stone-500 mb-1">Visit Date</label>
                      <input
                        type="date"
                        value={cfg.date}
                        onChange={(e) => updateTicketConfig(tk.id, { date: e.target.value })}
                        className="w-full px-2 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-stone-500 mb-1">Adults</label>
                      <input
                        type="number"
                        min={1}
                        max={20}
                        value={cfg.adults}
                        onChange={(e) =>
                          updateTicketConfig(tk.id, { adults: Math.max(1, Number(e.target.value)) })
                        }
                        className="w-full px-2 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-stone-500 mb-1">Children</label>
                      <input
                        type="number"
                        min={0}
                        max={20}
                        value={cfg.children}
                        onChange={(e) =>
                          updateTicketConfig(tk.id, {
                            children: Math.max(0, Number(e.target.value)),
                          })
                        }
                        className="w-full px-2 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-200/80 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-[11px] text-stone-500">Total Ticket Price</p>
                    <p className="text-lg font-bold text-stone-900 font-mono tabular-nums">
                      {formatINR(computedTotal)}
                    </p>
                  </div>

                  {alreadyBooked ? (
                    <button
                      type="button"
                      onClick={() => onRemoveTicketOrder(tk.id)}
                      className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Added (Click to Remove)</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        onAddTicketOrder({
                          ticket: tk,
                          date: cfg.date,
                          adults: cfg.adults,
                          children: cfg.children,
                          totalPrice: computedTotal,
                        })
                      }
                      className="px-3.5 py-2 text-xs font-semibold text-white bg-[#C2410C] hover:bg-[#9A3412] rounded-lg flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      <span>Book Ticket (Demo)</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. HIRE A LOCAL GUIDE SECTION */}
      <div className="space-y-6 pt-8 border-t border-stone-200">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-xs text-stone-500 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#C2410C]" />
              <span>{t.guidesDemoDisclaimer}</span>
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-stone-900 mt-1">
              {t.guidesSectionTitle}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={guideCityFilter}
              onChange={(e) => setGuideCityFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg text-stone-900"
            >
              <option value="all">All Cities ({guides.length} Guides)</option>
              {destinations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>

            <select
              value={guideLanguageFilter}
              onChange={(e) => setGuideLanguageFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg text-stone-900"
            >
              <option value="all">All Languages</option>
              <option value="Telugu">Telugu (తెలుగు)</option>
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Tamil">Tamil</option>
              <option value="Kannada">Kannada</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map((guide) => {
            const cfg = getGuideConfig(guide.id);
            const computedFee =
              cfg.bookingType === 'hourly'
                ? guide.hourlyPrice * cfg.units
                : guide.dailyPrice * cfg.units;
            const isGuideSelected = selectedGuide?.guide.id === guide.id;

            return (
              <div
                key={guide.id}
                className={`bg-white border rounded-xl p-5 flex flex-col justify-between transition-all ${
                  isGuideSelected
                    ? 'border-[#C2410C] ring-2 ring-[#C2410C]/15'
                    : 'border-stone-200/90 hover:border-stone-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span>
                      {guide.cityName} · {guide.experienceYears} yrs exp · ★ {guide.rating}/5 ({guide.reviewsCount})
                    </span>
                    <span className="text-emerald-800 font-medium">{guide.availability}</span>
                  </div>

                  <div className="flex items-baseline justify-between mt-1.5">
                    <h3 className="text-lg font-semibold text-stone-900">{guide.name}</h3>
                    <span className="text-[11px] text-stone-400">Demo Guide Profile</span>
                  </div>

                  <p className="text-xs text-stone-600 mt-1">
                    Languages: <strong className="font-medium text-stone-900">{guide.languages.join(', ')}</strong>
                  </p>
                  <p className="text-xs text-stone-500 mt-1">
                    Specialization: {guide.specialization.join(' · ')}
                  </p>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">{guide.bio}</p>

                  {/* Pricing & Booking Duration Selector */}
                  <div className="mt-4 pt-3 border-t border-stone-100 space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-stone-700 font-mono tabular-nums">
                      <span>Hourly: <strong>{formatINR(guide.hourlyPrice)}/hour</strong></span>
                      <span>Full Day: <strong>{formatINR(guide.dailyPrice)}/day</strong></span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-stone-500 mb-1">Plan Type</label>
                        <select
                          value={cfg.bookingType}
                          onChange={(e) =>
                            updateGuideConfig(guide.id, {
                              bookingType: e.target.value as 'hourly' | 'daily',
                              units: e.target.value === 'hourly' ? 4 : 1,
                            })
                          }
                          className="w-full px-2 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded"
                        >
                          <option value="hourly">Per-Hour Booking</option>
                          <option value="daily">Full-Day Booking</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] text-stone-500 mb-1">
                          {cfg.bookingType === 'hourly' ? 'Hours' : 'Days'}
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={14}
                          value={cfg.units}
                          onChange={(e) =>
                            updateGuideConfig(guide.id, {
                              units: Math.max(1, Number(e.target.value)),
                            })
                          }
                          className="w-full px-2 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-200/80 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-[11px] text-stone-500">
                      Est. Guide Fee ({cfg.units} {cfg.bookingType === 'hourly' ? 'hrs' : 'days'})
                    </p>
                    <p className="text-lg font-bold text-stone-900 font-mono tabular-nums">
                      {formatINR(computedFee)}
                    </p>
                  </div>

                  {isGuideSelected ? (
                    <button
                      type="button"
                      onClick={() => onSelectGuideBooking(null)}
                      className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Guide Hired (Remove)</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        onSelectGuideBooking({
                          guide,
                          bookingType: cfg.bookingType,
                          units: cfg.units,
                          date: cfg.date,
                          totalPrice: computedFee,
                        })
                      }
                      className="px-3.5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Book Guide (Demo)</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
