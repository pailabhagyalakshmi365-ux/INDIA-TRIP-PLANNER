import React, { useState } from 'react';
import { Search, X, ArrowRight, MapPin, BedDouble, Ticket, UserCheck } from 'lucide-react';
import {
  Destination,
  Hotel,
  Language,
  LocalGuide,
  TicketListing,
} from '../types/travel';
import { formatINR, UI_TEXT } from '../data/translations';

interface GlobalSearchModalProps {
  isOpen: boolean;
  initialQuery?: string;
  destinations: Destination[];
  hotels: Hotel[];
  tickets: TicketListing[];
  guides: LocalGuide[];
  language: Language;
  onClose: () => void;
  onSelectDestination: (dest: Destination) => void;
  onSelectHotel: (hotel: Hotel) => void;
  onJumpToTickets: (destId: string) => void;
  onJumpToGuides: (destId: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  initialQuery = '',
  destinations,
  hotels,
  tickets,
  guides,
  language,
  onClose,
  onSelectDestination,
  onSelectHotel,
  onJumpToTickets,
  onJumpToGuides,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const t = UI_TEXT[language];

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const matchedDestinations = q
    ? destinations.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.nameTe.includes(q) ||
          d.state.toLowerCase().includes(q) ||
          d.tagline.toLowerCase().includes(q) ||
          d.categories.some((c) => c.toLowerCase().includes(q)) ||
          d.thingsToDo.some((td) => td.toLowerCase().includes(q))
      )
    : destinations.slice(0, 6);

  const matchedHotels = q
    ? hotels.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.cityName.toLowerCase().includes(q) ||
          h.location.toLowerCase().includes(q) ||
          h.hotelType.toLowerCase().includes(q)
      )
    : hotels.slice(0, 4);

  const matchedTickets = q
    ? tickets.filter(
        (tk) =>
          tk.attractionName.toLowerCase().includes(q) ||
          tk.cityName.toLowerCase().includes(q) ||
          tk.ticketType.toLowerCase().includes(q) ||
          tk.highlights.toLowerCase().includes(q)
      )
    : tickets.slice(0, 4);

  const matchedGuides = q
    ? guides.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.cityName.toLowerCase().includes(q) ||
          g.languages.some((l) => l.toLowerCase().includes(q)) ||
          g.specialization.some((s) => s.toLowerCase().includes(q))
      )
    : guides.slice(0, 4);

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-start justify-center p-3 sm:p-8 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white border border-stone-200 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl mt-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#C2410C] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.globalSearchPlaceholder}
            className="w-full text-sm sm:text-base text-stone-900 placeholder:text-stone-400 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-xs text-stone-500 hover:text-stone-900 px-2 py-1"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {/* 1. Cities & Destinations */}
          <div>
            <h3 className="text-xs font-semibold text-stone-500 mb-2.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C2410C]" />
              <span>Destinations & Tourist Places ({matchedDestinations.length})</span>
            </h3>
            {matchedDestinations.length === 0 ? (
              <p className="text-xs text-stone-500">No matching cities found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {matchedDestinations.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => {
                      onSelectDestination(d);
                      onClose();
                    }}
                    className="p-3 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200/80 text-left transition-colors flex items-center justify-between gap-2"
                  >
                    <div>
                      <p className="text-sm font-semibold text-stone-900">
                        {d.name} ({d.nameTe})
                      </p>
                      <p className="text-[11px] text-stone-500">
                        {d.state} · {formatINR(d.costs.hotelPerNightAvg)}/night
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-400 shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Hotels */}
          <div>
            <h3 className="text-xs font-semibold text-stone-500 mb-2.5 flex items-center gap-1.5">
              <BedDouble className="w-3.5 h-3.5 text-[#C2410C]" />
              <span>Hotels & Heritage Stays ({matchedHotels.length})</span>
            </h3>
            {matchedHotels.length === 0 ? (
              <p className="text-xs text-stone-500">No matching hotels found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {matchedHotels.map((h) => (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => {
                      onSelectHotel(h);
                      onClose();
                    }}
                    className="p-3 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200/80 text-left flex items-center justify-between gap-2"
                  >
                    <div>
                      <p className="text-xs font-semibold text-stone-900">{h.name}</p>
                      <p className="text-[11px] text-stone-500">
                        {h.cityName} · {h.roomType}
                      </p>
                    </div>
                    <span className="font-mono text-xs font-semibold text-[#C2410C] shrink-0">
                      {formatINR(h.pricePerNight)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 3. Attractions & Tickets */}
          <div>
            <h3 className="text-xs font-semibold text-stone-500 mb-2.5 flex items-center gap-1.5">
              <Ticket className="w-3.5 h-3.5 text-[#C2410C]" />
              <span>Attractions, Monuments & Activities ({matchedTickets.length})</span>
            </h3>
            {matchedTickets.length === 0 ? (
              <p className="text-xs text-stone-500">No matching attractions found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {matchedTickets.map((tk) => (
                  <button
                    key={tk.id}
                    type="button"
                    onClick={() => {
                      onJumpToTickets(tk.destinationId);
                      onClose();
                    }}
                    className="p-3 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200/80 text-left flex items-center justify-between gap-2"
                  >
                    <div>
                      <p className="text-xs font-semibold text-stone-900">
                        {tk.attractionName}
                      </p>
                      <p className="text-[11px] text-stone-500">
                        {tk.cityName} · {tk.ticketType}
                      </p>
                    </div>
                    <span className="font-mono text-xs font-semibold text-stone-900 shrink-0">
                      {formatINR(tk.adultPrice)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 4. Local Guides */}
          <div>
            <h3 className="text-xs font-semibold text-stone-500 mb-2.5 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-[#C2410C]" />
              <span>Verified Demo Local Guides ({matchedGuides.length})</span>
            </h3>
            {matchedGuides.length === 0 ? (
              <p className="text-xs text-stone-500">No matching guides found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {matchedGuides.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => {
                      onJumpToGuides(g.destinationId);
                      onClose();
                    }}
                    className="p-3 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200/80 text-left flex items-center justify-between gap-2"
                  >
                    <div>
                      <p className="text-xs font-semibold text-stone-900">
                        {g.name} ({g.cityName})
                      </p>
                      <p className="text-[11px] text-stone-500">
                        {g.languages.join(', ')} · ★ {g.rating}/5
                      </p>
                    </div>
                    <span className="font-mono text-xs font-semibold text-stone-900 shrink-0">
                      {formatINR(g.hourlyPrice)}/hr
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
