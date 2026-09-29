import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Bookmark,
  Calendar,
  Users,
  IndianRupee,
  ArrowRight,
  Globe,
  ShoppingBag,
  Compass,
  MapPin,
} from 'lucide-react';
import {
  ActiveTripDraft,
  BookingRecord,
  BudgetTier,
  Destination,
  DestinationCategory,
  GeneratedItinerary,
  Hotel,
  Language,
  LocalGuide,
  SelectedGuideBooking,
  SelectedTicketOrder,
  TicketListing,
  TransportOption,
  UserProfile,
} from './types/travel';
import {
  GENERATED_IMAGES,
  INITIAL_DESTINATIONS,
} from './data/destinationsData';
import {
  INITIAL_GUIDES,
  INITIAL_HOTELS,
  INITIAL_TICKETS,
  INITIAL_TRANSPORT,
} from './data/servicesData';
import {
  CATEGORY_TRANSLATIONS,
  formatINR,
  UI_TEXT,
} from './data/translations';
import {
  calculateComprehensiveTripCost,
  generateDayByDayItinerary,
} from './utils/itineraryGenerator';
import { DestinationArtwork } from './components/DestinationArtwork';
import { DestinationDetailModal } from './components/DestinationDetailModal';
import { TripPlannerSection } from './components/TripPlannerSection';
import { StaysAndTransportSection } from './components/StaysAndTransportSection';
import { TicketsAndGuidesSection } from './components/TicketsAndGuidesSection';
import { TripCostCalculatorSection } from './components/TripCostCalculatorSection';
import { InteractiveIndiaMap } from './components/InteractiveIndiaMap';
import { BookingSummaryModal } from './components/BookingSummaryModal';
import { MyTripsAndProfileSection } from './components/MyTripsAndProfileSection';
import { AdminDashboard } from './components/AdminDashboard';
import { GlobalSearchModal } from './components/GlobalSearchModal';

const ALL_CATEGORIES: DestinationCategory[] = [
  'Historical Places',
  'Temples',
  'Beaches',
  'Hill Stations',
  'Wildlife',
  'Adventure',
  'Nature',
  'Spiritual Places',
];

export default function App() {
  // Language State ('en' | 'te')
  const [language, setLanguage] = useState<Language>('en');
  const t = UI_TEXT[language];

  // Core Data Catalogs (persisted in localStorage for full-session admin & user state)
  const [destinations, setDestinations] = useState<Destination[]>(() => {
    try {
      const saved = localStorage.getItem('itp_destinations_v1');
      return saved ? JSON.parse(saved) : INITIAL_DESTINATIONS;
    } catch {
      return INITIAL_DESTINATIONS;
    }
  });

  const [hotels, setHotels] = useState<Hotel[]>(() => {
    try {
      const saved = localStorage.getItem('itp_hotels_v1');
      return saved ? JSON.parse(saved) : INITIAL_HOTELS;
    } catch {
      return INITIAL_HOTELS;
    }
  });

  const [tickets, setTickets] = useState<TicketListing[]>(() => {
    try {
      const saved = localStorage.getItem('itp_tickets_v1');
      return saved ? JSON.parse(saved) : INITIAL_TICKETS;
    } catch {
      return INITIAL_TICKETS;
    }
  });

  const [transportOptions, setTransportOptions] = useState<TransportOption[]>(() => {
    try {
      const saved = localStorage.getItem('itp_transport_v1');
      return saved ? JSON.parse(saved) : INITIAL_TRANSPORT;
    } catch {
      return INITIAL_TRANSPORT;
    }
  });

  const [guides, setGuides] = useState<LocalGuide[]>(() => {
    try {
      const saved = localStorage.getItem('itp_guides_v1');
      return saved ? JSON.parse(saved) : INITIAL_GUIDES;
    } catch {
      return INITIAL_GUIDES;
    }
  });

  const [bookings, setBookings] = useState<BookingRecord[]>(() => {
    try {
      const saved = localStorage.getItem('itp_bookings_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('itp_user_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      id: 'usr-101',
      name: 'Bhagya Lakshmi',
      email: 'traveler@indiatripplanner.in',
      phone: '+91 98480 32100',
      homeCity: 'Hyderabad',
      preferredLanguage: 'en',
      role: 'traveler',
      savedDestinations: ['hyderabad', 'tirupati', 'kerala'],
      savedHotels: ['htl-hyd-1', 'htl-ker-1'],
      savedItineraries: [],
    };
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('itp_destinations_v1', JSON.stringify(destinations));
      localStorage.setItem('itp_hotels_v1', JSON.stringify(hotels));
      localStorage.setItem('itp_tickets_v1', JSON.stringify(tickets));
      localStorage.setItem('itp_transport_v1', JSON.stringify(transportOptions));
      localStorage.setItem('itp_guides_v1', JSON.stringify(guides));
      localStorage.setItem('itp_bookings_v1', JSON.stringify(bookings));
      localStorage.setItem('itp_user_v1', JSON.stringify(user));
    } catch {
      // ignore storage quota errors
    }
  }, [destinations, hotels, tickets, transportOptions, guides, bookings, user]);

  // Selected Destination & Filter State
  const [selectedDestinationId, setSelectedDestinationId] = useState<string>('hyderabad');
  const selectedDestination = useMemo(
    () =>
      destinations.find((d) => d.id === selectedDestinationId) || destinations[0],
    [destinations, selectedDestinationId]
  );

  const [activeCategory, setActiveCategory] = useState<DestinationCategory | 'All'>('All');
  const [heroSearchQuery, setHeroSearchQuery] = useState<string>('');

  // Active Trip Draft State
  const [draft, setDraft] = useState<ActiveTripDraft>(() => {
    const initialDest = INITIAL_DESTINATIONS[0];
    const defaultHotel = INITIAL_HOTELS.find((h) => h.destinationId === initialDest.id) || null;
    const defaultGuide = INITIAL_GUIDES.find((g) => g.destinationId === initialDest.id) || null;
    const sampleItinerary = generateDayByDayItinerary({
      startingCity: 'Vijayawada',
      destination: initialDest,
      startDate: '2026-10-15',
      endDate: '2026-10-17',
      adults: 2,
      children: 0,
      travelType: 'Family',
      budgetTier: 'Standard',
      transportMode: 'Train',
      hotelPreference: '4-Star Boutique',
      foodPreference: 'South Indian & Regional Specialties',
      interests: ['History', 'Temples', 'Nature'],
      recommendedHotel: defaultHotel,
    });

    return {
      startingCity: 'Vijayawada',
      destinationId: initialDest.id,
      startDate: '2026-10-15',
      endDate: '2026-10-17',
      adults: 2,
      children: 0,
      travelType: 'Family',
      budgetTier: 'Standard',
      selectedHotel: defaultHotel,
      selectedTransport: INITIAL_TRANSPORT[6] || null,
      selectedTickets: [],
      selectedGuide: defaultGuide
        ? {
            guide: defaultGuide,
            bookingType: 'hourly',
            units: 4,
            date: '2026-10-15',
            totalPrice: defaultGuide.hourlyPrice * 4,
          }
        : null,
      generatedItinerary: sampleItinerary,
      customOtherExpenses: 1500,
    };
  });

  // Modals & Active View Mode
  const [detailModalDest, setDetailModalDest] = useState<Destination | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState<boolean>(false);
  const [showAdminSection, setShowAdminSection] = useState<boolean>(false);

  const updateDraft = (patch: Partial<ActiveTripDraft>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  };

  const handleSelectDestination = (dest: Destination) => {
    setSelectedDestinationId(dest.id);
    const cityHotel = hotels.find((h) => h.destinationId === dest.id) || null;
    const cityTransport =
      transportOptions.find((tr) => tr.destinationId === dest.id) || draft.selectedTransport;
    const cityGuide = guides.find((g) => g.destinationId === dest.id) || null;

    const updatedItin = generateDayByDayItinerary({
      startingCity: draft.startingCity,
      destination: dest,
      startDate: draft.startDate,
      endDate: draft.endDate,
      adults: draft.adults,
      children: draft.children,
      travelType: draft.travelType,
      budgetTier: draft.budgetTier,
      transportMode: 'Train',
      hotelPreference: '4-Star Boutique',
      foodPreference: 'South Indian & Regional Specialties',
      interests: ['History', 'Temples', 'Nature'],
      recommendedHotel: cityHotel,
    });

    setDraft((prev) => ({
      ...prev,
      destinationId: dest.id,
      selectedHotel: cityHotel,
      selectedTransport: cityTransport,
      selectedGuide: cityGuide
        ? {
            guide: cityGuide,
            bookingType: 'hourly',
            units: 4,
            date: prev.startDate,
            totalPrice: cityGuide.hourlyPrice * 4,
          }
        : null,
      generatedItinerary: updatedItin,
    }));
  };

  const toggleSaveDestination = (destId: string) => {
    setUser((prev) => {
      const exists = prev.savedDestinations.includes(destId);
      return {
        ...prev,
        savedDestinations: exists
          ? prev.savedDestinations.filter((id) => id !== destId)
          : [...prev.savedDestinations, destId],
      };
    });
  };

  const toggleSaveHotel = (hotelId: string) => {
    setUser((prev) => {
      const exists = prev.savedHotels.includes(hotelId);
      return {
        ...prev,
        savedHotels: exists
          ? prev.savedHotels.filter((id) => id !== hotelId)
          : [...prev.savedHotels, hotelId],
      };
    });
  };

  const handleAddTicketOrder = (order: SelectedTicketOrder) => {
    setDraft((prev) => ({
      ...prev,
      selectedTickets: [
        ...prev.selectedTickets.filter((t) => t.ticket.id !== order.ticket.id),
        order,
      ],
    }));
  };

  const handleRemoveTicketOrder = (ticketId: string) => {
    setDraft((prev) => ({
      ...prev,
      selectedTickets: prev.selectedTickets.filter((t) => t.ticket.id !== ticketId),
    }));
  };

  const handleSelectGuideBooking = (booking: SelectedGuideBooking | null) => {
    setDraft((prev) => ({ ...prev, selectedGuide: booking }));
  };

  const handleSaveItinerary = (itin: GeneratedItinerary) => {
    setUser((prev) => ({
      ...prev,
      savedItineraries: [
        itin,
        ...prev.savedItineraries.filter((i) => i.id !== itin.id),
      ],
    }));
  };

  const handleConfirmBooking = (record: BookingRecord) => {
    setBookings((prev) => [record, ...prev]);
    // Also post to Express API if available
    fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    }).catch(() => {});
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.bookingId === bookingId ? { ...b, status: 'Cancelled' } : b
      )
    );
  };

  // Filtered Destinations for Popular Destinations Grid
  const filteredDestinations = useMemo(() => {
    return destinations.filter((d) => {
      if (activeCategory !== 'All' && !d.categories.includes(activeCategory)) {
        return false;
      }
      if (heroSearchQuery.trim()) {
        const q = heroSearchQuery.trim().toLowerCase();
        const match =
          d.name.toLowerCase().includes(q) ||
          d.nameTe.includes(q) ||
          d.state.toLowerCase().includes(q) ||
          d.tagline.toLowerCase().includes(q) ||
          d.categories.some((c) => c.toLowerCase().includes(q));
        if (!match) return false;
      }
      return true;
    });
  }, [destinations, activeCategory, heroSearchQuery]);

  const liveCostSummary = useMemo(
    () => calculateComprehensiveTripCost(draft, selectedDestination),
    [draft, selectedDestination]
  );

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearchQuery.trim()) {
      const q = heroSearchQuery.trim().toLowerCase();
      const matched = destinations.find(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.nameTe.includes(q) ||
          d.state.toLowerCase().includes(q)
      );
      if (matched) {
        handleSelectDestination(matched);
      }
    }
    const el = document.getElementById('destinations-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#141413] flex flex-col">
      {/* STRICT 3-ZONE TOP BAR CONTRACT */}
      <header className="sticky top-0 z-40 bg-[#FAFAF8]/95 backdrop-blur-md border-b border-stone-200/90 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Zone 1: Single Text Element Wordmark */}
        <a
          href="#top"
          className="text-lg sm:text-xl font-bold tracking-tight text-stone-900 font-serif-display whitespace-nowrap shrink-0"
        >
          {t.brandTitle}
        </a>

        {/* Zone 2: 5 Clean Single-Line Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-600">
          <a
            href="#destinations-section"
            className="hover:text-stone-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            {t.navExplore}
          </a>
          <a
            href="#trip-planner-section"
            className="hover:text-stone-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            {t.navPlanner}
          </a>
          <a
            href="#stays-transport"
            className="hover:text-stone-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            {t.navStaysTransport}
          </a>
          <a
            href="#tickets-guides"
            className="hover:text-stone-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            {t.navTicketsGuides}
          </a>
          <a
            href="#my-trips-section"
            className="hover:text-stone-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            {t.navMyTrips} {bookings.length > 0 ? `(${bookings.length})` : ''}
          </a>
        </nav>

        {/* Zone 3: Primary Actions (Global Search / Language Toggle + Primary Booking CTA) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsGlobalSearchOpen(true)}
            aria-label="Global Search"
            className="px-3 py-2 text-xs font-medium text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-100 transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <Search className="w-3.5 h-3.5 text-[#C2410C]" />
            <span className="hidden sm:inline">Search India</span>
          </button>

          <button
            type="button"
            onClick={() => setLanguage((prev) => (prev === 'en' ? 'te' : 'en'))}
            className="px-3 py-2 text-xs font-medium text-stone-800 bg-white border border-stone-300 rounded-lg hover:bg-stone-100 transition-colors whitespace-nowrap"
            title="Switch Language: English / తెలుగు"
          >
            {language === 'en' ? 'EN · తెలుగు' : 'తెలుగు · EN'}
          </button>

          <button
            type="button"
            onClick={() => setIsBookingModalOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-[#C2410C] hover:bg-[#9A3412] rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>
              {selectedDestination.name} · <span className="font-mono tabular-nums">{formatINR(liveCostSummary.totalCost)}</span>
            </span>
          </button>
        </div>
      </header>

      {/* 1. HERO SECTION */}
      <section id="top" className="relative overflow-hidden border-b border-stone-200">
        <div className="relative min-h-[520px] lg:min-h-[560px] flex items-center">
          {/* Background High-Res Generated Palace Sunrise Image */}
          <div className="absolute inset-0">
            <img
              src={GENERATED_IMAGES.hero}
              alt="Royal sandstone palace architecture in India at golden hour sunrise"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/55 to-stone-950/35" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-8 py-14 sm:py-20">
            <div className="max-w-3xl space-y-4">
              <p className="text-xs sm:text-sm text-amber-200 font-medium tracking-wide">
                All-in-One India Travel Discovery, Itinerary & Budget Platform · ₹ INR Pricing
              </p>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold text-white leading-[1.1] tracking-tight">
                {t.heroHeadline}
              </h1>
              <p className="text-sm sm:text-base text-stone-200 leading-relaxed max-w-2xl">
                {t.heroSubhead}
              </p>
            </div>

            {/* Hero Search Bar (Destination, Travel Date, Travelers, Budget, Search Button) */}
            <form
              onSubmit={handleHeroSearchSubmit}
              className="mt-8 bg-white/95 backdrop-blur-md border border-stone-200 rounded-2xl p-3 sm:p-4 shadow-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end"
            >
              {/* Destination */}
              <div className="lg:col-span-4">
                <label className="block text-[11px] font-medium text-stone-500 mb-1">
                  {t.searchDestination}
                </label>
                <div className="flex items-center gap-2 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl">
                  <MapPin className="w-4 h-4 text-[#C2410C] shrink-0" />
                  <select
                    value={selectedDestination.id}
                    onChange={(e) => {
                      const found = destinations.find((d) => d.id === e.target.value);
                      if (found) handleSelectDestination(found);
                    }}
                    className="w-full text-sm font-medium text-stone-900 bg-transparent focus:outline-none"
                  >
                    {destinations.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.nameTe}) — {d.state}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Travel Date */}
              <div className="lg:col-span-2">
                <label className="block text-[11px] font-medium text-stone-500 mb-1">
                  {t.searchDate}
                </label>
                <input
                  type="date"
                  value={draft.startDate}
                  onChange={(e) => updateDraft({ startDate: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl font-mono text-stone-900 focus:outline-none"
                />
              </div>

              {/* Number of Travelers */}
              <div className="lg:col-span-2">
                <label className="block text-[11px] font-medium text-stone-500 mb-1">
                  {t.searchTravelers}
                </label>
                <select
                  value={draft.adults}
                  onChange={(e) =>
                    updateDraft({ adults: Math.max(1, Number(e.target.value)) })
                  }
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl font-mono text-stone-900 focus:outline-none"
                >
                  {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Traveler' : 'Travelers'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Budget Tier */}
              <div className="lg:col-span-2">
                <label className="block text-[11px] font-medium text-stone-500 mb-1">
                  {t.searchBudget}
                </label>
                <select
                  value={draft.budgetTier}
                  onChange={(e) =>
                    updateDraft({ budgetTier: e.target.value as BudgetTier })
                  }
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none"
                >
                  <option value="Budget">Budget (₹ Economy)</option>
                  <option value="Standard">Standard (₹₹ Comfort)</option>
                  <option value="Premium">Premium (₹₹₹ Boutique)</option>
                  <option value="Luxury">Luxury (₹₹₹₹ Royal)</option>
                </select>
              </div>

              {/* Search Button */}
              <div className="lg:col-span-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-[#C2410C] hover:bg-[#9A3412] rounded-xl transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <Search className="w-4 h-4" />
                  <span>{t.searchButton}</span>
                </button>
              </div>
            </form>

            {/* Quick City Filter Bar beneath Hero Search */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-stone-200">
              <span className="text-stone-300">Quick Jump:</span>
              {['hyderabad', 'tirupati', 'visakhapatnam', 'srisailam', 'goa', 'kerala', 'kashmir', 'jaipur', 'varanasi'].map(
                (cid) => {
                  const d = destinations.find((x) => x.id === cid);
                  if (!d) return null;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => {
                        handleSelectDestination(d);
                        setDetailModalDest(d);
                      }}
                      className="px-2.5 py-1 rounded-md bg-white/15 hover:bg-white/25 text-white backdrop-blur-xs transition-colors whitespace-nowrap"
                    >
                      {language === 'te' ? d.nameTe : d.name}
                    </button>
                  );
                }
              )}
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT CONTAINER */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-12 sm:py-16 space-y-20">
        {/* 2. CATEGORIES & 21 POPULAR DESTINATIONS SECTION */}
        <section id="destinations-section" className="space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <p className="text-xs text-stone-500">
                21 Iconic Indian Destinations · Curated Guides, Weather & ₹ Estimates
              </p>
              <h2 className="text-2xl sm:text-4xl font-semibold text-stone-900 mt-1">
                {t.popularDestinationsTitle}
              </h2>
              <p className="text-sm text-stone-600 mt-1 max-w-2xl">
                {t.popularDestinationsSub}
              </p>
            </div>

            {/* Instant Filter Search Input */}
            <div className="flex items-center gap-2 bg-white border border-stone-300 rounded-xl px-3.5 py-2 w-full lg:w-72">
              <Search className="w-4 h-4 text-stone-400 shrink-0" />
              <input
                type="text"
                value={heroSearchQuery}
                onChange={(e) => setHeroSearchQuery(e.target.value)}
                placeholder="Filter 21 destinations..."
                className="w-full text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none"
              />
            </div>
          </div>

          {/* 8 Interactive Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-stone-200/60 rounded-xl border border-stone-200/80">
            <button
              type="button"
              onClick={() => setActiveCategory('All')}
              className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeCategory === 'All'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              {t.allCategories} ({destinations.length})
            </button>
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-700 hover:text-stone-900'
                }`}
              >
                {CATEGORY_TRANSLATIONS[cat][language]}
              </button>
            ))}
          </div>

          {/* Destinations 3-Column Grid */}
          {filteredDestinations.length === 0 ? (
            <div className="bg-white border border-stone-200 rounded-2xl p-10 text-center space-y-3">
              <p className="text-base font-medium text-stone-800">
                No destinations match "{heroSearchQuery}" in {activeCategory}.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('All');
                  setHeroSearchQuery('');
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#C2410C] rounded-lg"
              >
                Show All 21 Destinations
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {filteredDestinations.map((dest) => {
                const isSelected = dest.id === selectedDestination.id;
                const isSaved = user.savedDestinations.includes(dest.id);

                return (
                  <article
                    key={dest.id}
                    className={`group bg-white border rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-150 hover:-translate-y-0.5 ${
                      isSelected
                        ? 'border-[#C2410C] ring-2 ring-[#C2410C]/15'
                        : 'border-stone-200/90 hover:border-stone-300'
                    }`}
                  >
                    <div>
                      {/* Card Image Slot (4:3 aspect) */}
                      <div
                        onClick={() => setDetailModalDest(dest)}
                        className="relative aspect-[4/3] w-full overflow-hidden bg-stone-900 cursor-pointer"
                      >
                        <DestinationArtwork
                          imageKey={dest.imageKey}
                          customImageUrl={dest.customImageUrl}
                          alt={`${dest.name}, ${dest.state}`}
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSaveDestination(dest.id);
                          }}
                          aria-label={`Save ${dest.name}`}
                          className={`absolute top-3 right-3 p-2 rounded-lg backdrop-blur-xs transition-colors ${
                            isSaved
                              ? 'bg-[#C2410C] text-white'
                              : 'bg-white/90 text-stone-800 hover:bg-white'
                          }`}
                        >
                          <Bookmark
                            className="w-4 h-4"
                            fill={isSaved ? 'currentColor' : 'none'}
                          />
                        </button>

                        <div className="absolute bottom-3 left-4 right-4 flex items-baseline justify-between text-white">
                          <span className="text-xs font-medium text-stone-200">
                            {language === 'te' ? dest.stateTe : dest.state}
                          </span>
                          <span className="text-xs font-mono tabular-nums font-semibold">
                            ★ {dest.rating} ({dest.reviewCount.toLocaleString('en-IN')})
                          </span>
                        </div>
                      </div>

                      {/* Card Body — Zero-Pill Unboxed Metadata Discipline */}
                      <div className="p-5">
                        <div className="flex items-center gap-1.5 text-xs text-stone-500">
                          <span>{dest.categories.slice(0, 2).join(' · ')}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums">
                            {dest.recommendedDays} {t.daysRecommended}
                          </span>
                        </div>

                        <h3
                          onClick={() => setDetailModalDest(dest)}
                          className="text-xl font-semibold text-stone-900 mt-1 cursor-pointer hover:text-[#C2410C] transition-colors"
                        >
                          {language === 'te'
                            ? `${dest.nameTe} (${dest.name})`
                            : `${dest.name}`}{' '}
                          {language === 'en' && (
                            <span className="text-sm font-normal text-stone-500">
                              {dest.nameTe}
                            </span>
                          )}
                        </h3>

                        <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                          {language === 'te' ? dest.descriptionTe : dest.description}
                        </p>

                        <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                          <span>
                            {t.bestTime}: <strong className="text-stone-800 font-medium">{dest.bestTimeToVisit}</strong>
                          </span>
                          <span className="font-mono tabular-nums">
                            {dest.weather.tempCelsius}°C
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer with Price Baseline & Dual Actions */}
                    <div className="px-5 py-4 bg-stone-50/70 border-t border-stone-200/80 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[11px] text-stone-500">{t.perNightEst}</p>
                        <p className="text-lg font-bold text-stone-900 font-mono tabular-nums">
                          {formatINR(dest.costs.hotelPerNightAvg)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setDetailModalDest(dest)}
                          className="px-3 py-2 text-xs font-medium text-stone-800 bg-white border border-stone-300 rounded-lg hover:bg-stone-100 transition-colors whitespace-nowrap"
                        >
                          {t.viewDetails}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            handleSelectDestination(dest);
                            const el = document.getElementById('trip-planner-section');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                            isSelected
                              ? 'bg-stone-900 text-white'
                              : 'bg-[#C2410C] hover:bg-[#9A3412] text-white'
                          }`}
                        >
                          {isSelected ? 'Planning Here' : t.planTripHere}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* 3. TRIP PLANNER & DAY-BY-DAY ITINERARY GENERATOR */}
        <section id="trip-planner-section">
          <TripPlannerSection
            destinations={destinations}
            selectedDestination={selectedDestination}
            draft={draft}
            hotels={hotels}
            language={language}
            onUpdateDraft={updateDraft}
            onSelectDestination={handleSelectDestination}
            onSaveItinerary={handleSaveItinerary}
            onOpenBookingSummary={() => setIsBookingModalOpen(true)}
          />
        </section>

        {/* 4. HOTELS & TRAVEL TRANSPORT */}
        <section id="stays-transport">
          <StaysAndTransportSection
            destinations={destinations}
            selectedDestination={selectedDestination}
            hotels={hotels}
            transportOptions={transportOptions}
            selectedHotel={draft.selectedHotel}
            selectedTransport={draft.selectedTransport}
            savedHotels={user.savedHotels}
            language={language}
            onSelectHotel={(hotel) => updateDraft({ selectedHotel: hotel })}
            onToggleSaveHotel={toggleSaveHotel}
            onSelectTransport={(tr) => updateDraft({ selectedTransport: tr })}
          />
        </section>

        {/* 5. TICKET BOOKING & HIRE A LOCAL GUIDE */}
        <section id="tickets-guides">
          <TicketsAndGuidesSection
            destinations={destinations}
            selectedDestination={selectedDestination}
            tickets={tickets}
            guides={guides}
            selectedTickets={draft.selectedTickets}
            selectedGuide={draft.selectedGuide}
            defaultDate={draft.startDate}
            defaultAdults={draft.adults}
            defaultChildren={draft.children}
            language={language}
            onAddTicketOrder={handleAddTicketOrder}
            onRemoveTicketOrder={handleRemoveTicketOrder}
            onSelectGuideBooking={handleSelectGuideBooking}
          />
        </section>

        {/* 6. INTERACTIVE TRIP COST CALCULATOR */}
        <section id="cost-calculator-section">
          <TripCostCalculatorSection
            draft={draft}
            destination={selectedDestination}
            destinations={destinations}
            language={language}
            onUpdateDraft={updateDraft}
            onSelectDestination={handleSelectDestination}
            onOpenBookingSummary={() => setIsBookingModalOpen(true)}
          />
        </section>

        {/* 7. INTERACTIVE MAP EXPLORER */}
        <section id="map-section">
          <InteractiveIndiaMap
            destinations={destinations}
            selectedDestination={selectedDestination}
            hotels={hotels}
            language={language}
            onSelectDestination={handleSelectDestination}
            onSelectHotelForTrip={(hotel) => updateDraft({ selectedHotel: hotel })}
            onOpenDestinationModal={(dest) => setDetailModalDest(dest)}
          />
        </section>

        {/* 8. USER ACCOUNT, SAVED PLACES & MY BOOKINGS */}
        <section id="my-trips-section">
          <MyTripsAndProfileSection
            user={user}
            destinations={destinations}
            hotels={hotels}
            bookings={bookings}
            language={language}
            onUpdateUser={(patch) => setUser((prev) => ({ ...prev, ...patch }))}
            onOpenDestination={(dest) => setDetailModalDest(dest)}
            onSelectHotelForTrip={(hotel) => {
              updateDraft({ selectedHotel: hotel });
              const el = document.getElementById('cost-calculator-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onLoadItinerary={(itin) => {
              const found = destinations.find((d) => d.id === itin.destinationId);
              if (found) setSelectedDestinationId(found.id);
              updateDraft({ generatedItinerary: itin });
              const el = document.getElementById('trip-planner-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onCancelBooking={handleCancelBooking}
          />
        </section>

        {/* 9. ADMIN DASHBOARD (TOGGLEABLE OR DIRECT ACCESS) */}
        <section id="admin-section" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-stone-500">
                Manage Destinations, Hotels, Guides, Tickets, Transport & Demo Bookings
              </p>
              <h3 className="text-lg font-semibold text-stone-900">
                Platform Administration
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setShowAdminSection((prev) => !prev)}
              className="px-4 py-2 text-xs font-semibold text-stone-800 bg-white border border-stone-300 hover:bg-stone-100 rounded-lg transition-colors"
            >
              {showAdminSection ? 'Collapse Admin Console' : 'Open Admin Dashboard'}
            </button>
          </div>

          {showAdminSection && (
            <AdminDashboard
              destinations={destinations}
              hotels={hotels}
              tickets={tickets}
              guides={guides}
              transport={transportOptions}
              bookings={bookings}
              user={user}
              onAddDestination={(dest) => setDestinations((prev) => [dest, ...prev])}
              onDeleteDestination={(id) =>
                setDestinations((prev) => prev.filter((d) => d.id !== id))
              }
              onAddHotel={(hotel) => setHotels((prev) => [hotel, ...prev])}
              onDeleteHotel={(id) => setHotels((prev) => prev.filter((h) => h.id !== id))}
              onUpdateTicketPrice={(tid, adultPrice, childPrice) =>
                setTickets((prev) =>
                  prev.map((t) =>
                    t.id === tid ? { ...t, adultPrice, childPrice } : t
                  )
                )
              }
              onAddGuide={(guide) => setGuides((prev) => [guide, ...prev])}
              onDeleteGuide={(id) => setGuides((prev) => prev.filter((g) => g.id !== id))}
              onAddTransport={(tr) => setTransportOptions((prev) => [tr, ...prev])}
              onDeleteTransport={(id) =>
                setTransportOptions((prev) => prev.filter((tr) => tr.id !== id))
              }
            />
          )}
        </section>
      </main>

      {/* QUIET EDITORIAL FOOTER */}
      <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <p className="text-lg font-semibold text-white font-serif-display">
              India Trip Planner
            </p>
            <p className="text-xs text-stone-400 max-w-md">
              All-in-one India travel discovery, day-by-day itinerary builder, and ₹ INR trip cost calculator. All hotel, ticket, transport, and guide listings operate in transparent Demo Mode.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-stone-400">
            <a href="#destinations-section" className="hover:text-white">
              21 Destinations
            </a>
            <a href="#trip-planner-section" className="hover:text-white">
              Itinerary Planner
            </a>
            <a href="#stays-transport" className="hover:text-white">
              Hotels & Transit
            </a>
            <a href="#tickets-guides" className="hover:text-white">
              Tickets & Local Guides
            </a>
            <a href="#cost-calculator-section" className="hover:text-white">
              ₹ Cost Calculator
            </a>
            <button
              type="button"
              onClick={() => {
                setShowAdminSection(true);
                const el = document.getElementById('admin-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-white"
            >
              Admin Console
            </button>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <DestinationDetailModal
        destination={detailModalDest}
        language={language}
        isSaved={
          detailModalDest
            ? user.savedDestinations.includes(detailModalDest.id)
            : false
        }
        onClose={() => setDetailModalDest(null)}
        onToggleSave={toggleSaveDestination}
        onPlanTripHere={(dest) => {
          handleSelectDestination(dest);
          setDetailModalDest(null);
          const el = document.getElementById('trip-planner-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onJumpToSection={(dest, sectionId) => {
          handleSelectDestination(dest);
          setDetailModalDest(null);
          const el = document.getElementById(sectionId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <BookingSummaryModal
        isOpen={isBookingModalOpen}
        draft={draft}
        destination={selectedDestination}
        user={user}
        language={language}
        onClose={() => setIsBookingModalOpen(false)}
        onConfirmBooking={handleConfirmBooking}
        onViewMyTrips={() => {
          const el = document.getElementById('my-trips-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <GlobalSearchModal
        isOpen={isGlobalSearchOpen}
        destinations={destinations}
        hotels={hotels}
        tickets={tickets}
        guides={guides}
        language={language}
        onClose={() => setIsGlobalSearchOpen(false)}
        onSelectDestination={(dest) => {
          handleSelectDestination(dest);
          setDetailModalDest(dest);
        }}
        onSelectHotel={(hotel) => {
          updateDraft({ selectedHotel: hotel });
          const el = document.getElementById('stays-transport');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onJumpToTickets={(destId) => {
          const found = destinations.find((d) => d.id === destId);
          if (found) handleSelectDestination(found);
          const el = document.getElementById('tickets-guides');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onJumpToGuides={(destId) => {
          const found = destinations.find((d) => d.id === destId);
          if (found) handleSelectDestination(found);
          const el = document.getElementById('tickets-guides');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />
    </div>
  );
}
