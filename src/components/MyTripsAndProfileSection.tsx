import React, { useState } from 'react';
import {
  Bookmark,
  Calendar,
  CheckCircle2,
  FileText,
  Trash2,
  User,
  LogIn,
  ArrowRight,
} from 'lucide-react';
import {
  BookingRecord,
  Destination,
  GeneratedItinerary,
  Hotel,
  Language,
  UserProfile,
} from '../types/travel';
import { formatINR, UI_TEXT } from '../data/translations';

interface MyTripsAndProfileSectionProps {
  user: UserProfile;
  destinations: Destination[];
  hotels: Hotel[];
  bookings: BookingRecord[];
  language: Language;
  onUpdateUser: (patch: Partial<UserProfile>) => void;
  onOpenDestination: (dest: Destination) => void;
  onSelectHotelForTrip: (hotel: Hotel) => void;
  onLoadItinerary: (itin: GeneratedItinerary) => void;
  onCancelBooking: (bookingId: string) => void;
}

export const MyTripsAndProfileSection: React.FC<MyTripsAndProfileSectionProps> = ({
  user,
  destinations,
  hotels,
  bookings,
  language,
  onUpdateUser,
  onOpenDestination,
  onSelectHotelForTrip,
  onLoadItinerary,
  onCancelBooking,
}) => {
  const t = UI_TEXT[language];
  const [authMode, setAuthMode] = useState<'profile' | 'login' | 'signup'>('profile');
  const [nameInput, setNameInput] = useState(user.name);
  const [emailInput, setEmailInput] = useState(user.email);
  const [phoneInput, setPhoneInput] = useState(user.phone);
  const [homeCityInput, setHomeCityInput] = useState(user.homeCity);
  const [savedNotice, setSavedNotice] = useState('');

  const savedDestObjects = destinations.filter((d) =>
    user.savedDestinations.includes(d.id)
  );
  const savedHotelObjects = hotels.filter((h) => user.savedHotels.includes(h.id));

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      name: nameInput.trim() || 'Traveler',
      email: emailInput.trim() || 'traveler@example.com',
      phone: phoneInput.trim() || '+91 98480 24680',
      homeCity: homeCityInput.trim() || 'Hyderabad',
    });
    setAuthMode('profile');
    setSavedNotice('Account profile updated.');
    setTimeout(() => setSavedNotice(''), 3000);
  };

  return (
    <div className="space-y-10">
      {/* 1. USER PROFILE & AUTH CARD */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-stone-200">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-stone-900 text-white flex items-center justify-center font-semibold text-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs text-stone-500">
                Traveler Account · Home City: {user.homeCity}
              </p>
              <h2 className="text-xl sm:text-2xl font-semibold text-stone-900">
                {user.name}
              </h2>
              <p className="text-xs text-stone-600 font-mono">
                {user.email} · {user.phone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAuthMode(authMode === 'login' ? 'profile' : 'login')}
              className="px-3.5 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg flex items-center gap-1.5 whitespace-nowrap"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{authMode === 'profile' ? 'Edit Profile / Sign Up' : 'Back to Profile'}</span>
            </button>
          </div>
        </div>

        {savedNotice && (
          <div className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>{savedNotice}</span>
          </div>
        )}

        {authMode !== 'profile' && (
          <form
            onSubmit={handleSaveProfile}
            className="mt-5 p-4 rounded-xl bg-stone-50 border border-stone-200/80 grid grid-cols-1 sm:grid-cols-5 gap-3 items-end"
          >
            <div>
              <label className="block text-xs text-stone-600 mb-1">Full Name *</label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-stone-600 mb-1">Email Address *</label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-stone-600 mb-1">Mobile (+91)</label>
              <input
                type="tel"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-stone-600 mb-1">Home City</label>
              <input
                type="text"
                value={homeCityInput}
                onChange={(e) => setHomeCityInput(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-[#C2410C] hover:bg-[#9A3412] rounded-lg whitespace-nowrap"
            >
              Save Account
            </button>
          </form>
        )}

        {/* 2. MY BOOKINGS & TRIP HISTORY */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-stone-900 mb-3">
            My Bookings & Trip History ({bookings.length})
          </h3>

          {bookings.length === 0 ? (
            <div className="p-6 rounded-xl bg-stone-50 border border-stone-200/80 text-center">
              <p className="text-sm text-stone-600">
                You have no completed demo bookings yet. Select a destination, hotel, transport, or tickets and click "Review Booking Summary" to create your first booking!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((bk) => (
                <div
                  key={bk.bookingId}
                  className="p-5 rounded-xl bg-[#FAFAF8] border border-stone-200/90 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 font-mono tabular-nums">
                      <span className="font-bold text-stone-900">{bk.bookingId}</span>
                      <span>·</span>
                      <span
                        className={
                          bk.status === 'Cancelled'
                            ? 'text-red-700 font-semibold'
                            : 'text-emerald-800 font-semibold'
                        }
                      >
                        {bk.status}
                      </span>
                      <span>·</span>
                      <span>
                        {bk.startDate} to {bk.endDate} ({bk.daysCount} Days)
                      </span>
                    </div>

                    <h4 className="text-lg font-semibold text-stone-900">
                      {bk.startingCity} → {bk.destinationName} ({bk.adults} Adults, {bk.children} Children)
                    </h4>

                    <p className="text-xs text-stone-600">
                      Hotel: <strong>{bk.hotel?.name}</strong> · Transport:{' '}
                      <strong>{bk.transport?.operatorName} ({bk.transport?.mode})</strong>
                      {bk.guide ? ` · Guide: ${bk.guide.name}` : ''}
                    </p>
                    {bk.tickets.length > 0 && (
                      <p className="text-xs text-stone-500">
                        Tickets: {bk.tickets.map((tk) => tk.attractionName).join(', ')}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <div className="text-right">
                      <p className="text-[11px] text-stone-500">Total Estimated Cost</p>
                      <p className="text-xl font-bold text-[#C2410C] font-mono tabular-nums">
                        {formatINR(bk.costBreakdown.totalCost)}
                      </p>
                    </div>

                    {bk.status !== 'Cancelled' && (
                      <button
                        type="button"
                        onClick={() => onCancelBooking(bk.bookingId)}
                        className="px-3 py-2 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors whitespace-nowrap"
                      >
                        Cancel Demo Booking
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. SAVED DESTINATIONS, HOTELS & ITINERARIES */}
        <div className="mt-8 pt-6 border-t border-stone-200 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Saved Destinations */}
          <div>
            <h4 className="text-sm font-semibold text-stone-900 mb-3">
              Saved Destinations ({savedDestObjects.length})
            </h4>
            {savedDestObjects.length === 0 ? (
              <p className="text-xs text-stone-500">
                Click the bookmark icon on any destination card to save it here.
              </p>
            ) : (
              <div className="space-y-2">
                {savedDestObjects.map((d) => (
                  <div
                    key={d.id}
                    className="p-3 rounded-lg bg-stone-50 border border-stone-200/80 flex items-center justify-between gap-2"
                  >
                    <div>
                      <p className="text-xs font-semibold text-stone-900">
                        {d.name} ({d.nameTe})
                      </p>
                      <p className="text-[11px] text-stone-500">
                        {d.state} · {formatINR(d.costs.hotelPerNightAvg)}/night
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenDestination(d)}
                      className="text-xs font-medium text-[#C2410C] hover:underline whitespace-nowrap"
                    >
                      View →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Saved Hotels */}
          <div>
            <h4 className="text-sm font-semibold text-stone-900 mb-3">
              Saved Hotels ({savedHotelObjects.length})
            </h4>
            {savedHotelObjects.length === 0 ? (
              <p className="text-xs text-stone-500">
                Bookmark hotels in the Stays section to compare them here.
              </p>
            ) : (
              <div className="space-y-2">
                {savedHotelObjects.map((h) => (
                  <div
                    key={h.id}
                    className="p-3 rounded-lg bg-stone-50 border border-stone-200/80 flex items-center justify-between gap-2"
                  >
                    <div>
                      <p className="text-xs font-semibold text-stone-900">{h.name}</p>
                      <p className="text-[11px] text-stone-500 font-mono">
                        {h.cityName} · {formatINR(h.pricePerNight)}/night
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onSelectHotelForTrip(h)}
                      className="text-xs font-medium text-[#C2410C] hover:underline whitespace-nowrap"
                    >
                      Select
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Saved Itineraries */}
          <div>
            <h4 className="text-sm font-semibold text-stone-900 mb-3">
              Saved Itineraries ({user.savedItineraries.length})
            </h4>
            {user.savedItineraries.length === 0 ? (
              <p className="text-xs text-stone-500">
                Generate a day-by-day itinerary in the Trip Planner and click "Save Itinerary".
              </p>
            ) : (
              <div className="space-y-2">
                {user.savedItineraries.map((itin) => (
                  <div
                    key={itin.id}
                    className="p-3 rounded-lg bg-stone-50 border border-stone-200/80 flex items-center justify-between gap-2"
                  >
                    <div>
                      <p className="text-xs font-semibold text-stone-900">
                        {itin.destinationName} ({itin.daysCount} Days)
                      </p>
                      <p className="text-[11px] text-stone-500 font-mono">
                        {itin.travelType} · Est. {formatINR(itin.estimatedTotalCost)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onLoadItinerary(itin)}
                      className="text-xs font-medium text-[#C2410C] hover:underline whitespace-nowrap"
                    >
                      Open →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
