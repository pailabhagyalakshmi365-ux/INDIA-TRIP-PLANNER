import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2 } from 'lucide-react';
import {
  BookingRecord,
  Destination,
  Hotel,
  LocalGuide,
  TicketListing,
  TransportOption,
  UserProfile,
} from '../types/travel';
import { formatINR } from '../data/translations';

interface AdminDashboardProps {
  destinations: Destination[];
  hotels: Hotel[];
  tickets: TicketListing[];
  guides: LocalGuide[];
  transport: TransportOption[];
  bookings: BookingRecord[];
  user: UserProfile;
  onAddDestination: (dest: Destination) => void;
  onDeleteDestination: (id: string) => void;
  onAddHotel: (hotel: Hotel) => void;
  onDeleteHotel: (id: string) => void;
  onUpdateTicketPrice: (ticketId: string, adultPrice: number, childPrice: number) => void;
  onAddGuide: (guide: LocalGuide) => void;
  onDeleteGuide: (id: string) => void;
  onAddTransport: (tr: TransportOption) => void;
  onDeleteTransport: (id: string) => void;
}

type AdminTab =
  | 'destinations'
  | 'hotels'
  | 'tickets'
  | 'guides'
  | 'transport'
  | 'bookings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  destinations,
  hotels,
  tickets,
  guides,
  transport,
  bookings,
  user,
  onAddDestination,
  onDeleteDestination,
  onAddHotel,
  onDeleteHotel,
  onUpdateTicketPrice,
  onAddGuide,
  onDeleteGuide,
  onAddTransport,
  onDeleteTransport,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('destinations');
  const [statusMsg, setStatusMsg] = useState('');

  // Quick Add Destination State
  const [newDestName, setNewDestName] = useState('');
  const [newDestNameTe, setNewDestNameTe] = useState('');
  const [newDestState, setNewDestState] = useState('Andhra Pradesh');
  const [newDestTagline, setNewDestTagline] = useState('');
  const [newDestHotelCost, setNewDestHotelCost] = useState(2500);

  // Quick Add Hotel State
  const [newHotelName, setNewHotelName] = useState('');
  const [newHotelDestId, setNewHotelDestId] = useState('hyderabad');
  const [newHotelPrice, setNewHotelPrice] = useState(2800);
  const [newHotelRoom, setNewHotelRoom] = useState('Heritage Deluxe Room');

  // Quick Add Guide State
  const [newGuideName, setNewGuideName] = useState('');
  const [newGuideDestId, setNewGuideDestId] = useState('hyderabad');
  const [newGuideHourly, setNewGuideHourly] = useState(750);
  const [newGuideLangs, setNewGuideLangs] = useState('Telugu, Hindi, English');

  // Quick Add Transport State
  const [newTrOperator, setNewTrOperator] = useState('');
  const [newTrMode, setNewTrMode] = useState<'Flight' | 'Train' | 'Bus' | 'Car'>('Train');
  const [newTrFrom, setNewTrFrom] = useState('Hyderabad');
  const [newTrTo, setNewTrTo] = useState('Tirupati');
  const [newTrFare, setNewTrFare] = useState(1450);

  const notify = (msg: string) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(''), 3500);
  };

  const handleCreateDestination = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDestName.trim()) return;
    const id = newDestName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const created: Destination = {
      id,
      name: newDestName.trim(),
      nameTe: newDestNameTe.trim() || newDestName.trim(),
      state: newDestState.trim(),
      stateTe: newDestState.trim(),
      tagline: newDestTagline.trim() || 'Scenic Heritage & Cultural Destination',
      taglineTe: newDestTagline.trim() || 'ప్రసిద్ధ పర్యాటక ప్రదేశం',
      description: `Explore the cultural landmarks, temples, and natural beauty of ${newDestName.trim()} in ${newDestState.trim()}.`,
      descriptionTe: `${newDestName.trim()} యొక్క చారిత్రక మరియు ప్రకృతి అందాలను అన్వేషించండి.`,
      categories: ['Historical Places', 'Nature'],
      rating: 4.7,
      reviewCount: 420,
      bestTimeToVisit: 'October to March',
      recommendedDays: 3,
      weather: { tempCelsius: 26, condition: 'Pleasant', humidity: '50%', seasonNote: 'Great weather for sightseeing.' },
      costs: {
        entryTicketAvg: 250,
        localTransportPerDay: 600,
        foodPerDay: 750,
        hotelPerNightAvg: Number(newDestHotelCost) || 2500,
      },
      thingsToDo: [`Explore ${newDestName.trim()} central heritage monuments`, 'Sample local regional cuisine'],
      nearbyPlaces: [{ name: 'Scenic Hill Viewpoint', distanceKm: 18, highlight: 'Panoramic valley view' }],
      attractions: [
        {
          id: `${id}-attr-1`,
          name: `${newDestName.trim()} Main Monument`,
          category: 'Monument',
          openingHours: '09:00 AM – 05:30 PM',
          adultPrice: 100,
          childPrice: 50,
          durationHours: 2,
          description: `Historic landmark in ${newDestName.trim()}.`,
          coordinates: { x: 50, y: 50 },
        },
      ],
      restaurants: [
        {
          id: `r-${id}-1`,
          name: `${newDestName.trim()} Heritage Kitchen`,
          cuisine: 'Regional Indian',
          avgCostForTwo: 650,
          rating: 4.6,
          mustTry: 'Signature Regional Thali',
          coordinates: { x: 55, y: 55 },
        },
      ],
      mapPosition: { lat: 17.5, lng: 79.0, mapX: 50, mapY: 60 },
      imageKey: 'hyderabad',
    };
    onAddDestination(created);
    setNewDestName('');
    setNewDestNameTe('');
    setNewDestTagline('');
    notify(`Added destination "${created.name}" to catalog.`);
  };

  const handleCreateHotel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHotelName.trim()) return;
    const targetDest = destinations.find((d) => d.id === newHotelDestId) || destinations[0];
    const created: Hotel = {
      id: `htl-${Date.now()}`,
      destinationId: targetDest.id,
      cityName: targetDest.name,
      name: newHotelName.trim(),
      location: `Central ${targetDest.name}`,
      rating: 4.7,
      reviews: 180,
      hotelType: '4-Star Boutique',
      roomType: newHotelRoom.trim(),
      pricePerNight: Number(newHotelPrice) || 2800,
      amenities: ['Free Wi-Fi', 'Breakfast Included', 'AC', 'Cab Desk'],
      breakfastIncluded: true,
      distanceFromAttraction: `1.5 km from ${targetDest.name} Center`,
      description: `Curated comfort stay in ${targetDest.name}.`,
      coordinates: { x: 48, y: 52 },
    };
    onAddHotel(created);
    setNewHotelName('');
    notify(`Added hotel "${created.name}" in ${targetDest.name}.`);
  };

  const handleCreateGuide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuideName.trim()) return;
    const targetDest = destinations.find((d) => d.id === newGuideDestId) || destinations[0];
    const hourly = Number(newGuideHourly) || 750;
    const created: LocalGuide = {
      id: `gd-${Date.now()}`,
      destinationId: targetDest.id,
      cityName: targetDest.name,
      name: newGuideName.trim(),
      languages: newGuideLangs.split(',').map((s) => s.trim()).filter(Boolean),
      experienceYears: 6,
      rating: 4.8,
      reviewsCount: 64,
      hourlyPrice: hourly,
      dailyPrice: hourly * 5.5,
      specialization: [`${targetDest.name} Heritage`, 'Local Culture & Temples'],
      availability: 'Available Today',
      bio: `Certified local guide in ${targetDest.name}.`,
      verifiedDemo: true,
    };
    onAddGuide(created);
    setNewGuideName('');
    notify(`Added local guide "${created.name}" in ${targetDest.name}.`);
  };

  const handleCreateTransport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrOperator.trim()) return;
    const targetDest =
      destinations.find((d) => d.name.toLowerCase() === newTrTo.toLowerCase()) || destinations[0];
    const created: TransportOption = {
      id: `tr-${Date.now()}`,
      mode: newTrMode,
      operatorName: newTrOperator.trim(),
      serviceNumber: 'EXP-2026',
      fromCity: newTrFrom.trim(),
      toCity: newTrTo.trim(),
      destinationId: targetDest.id,
      departureTime: '07:30 AM',
      arrivalTime: '12:45 PM',
      duration: '5h 15m',
      approxFarePerPerson: Number(newTrFare) || 1450,
      classType: 'AC Executive',
    };
    onAddTransport(created);
    setNewTrOperator('');
    notify(`Added ${created.mode} service "${created.operatorName}".`);
  };

  return (
    <div className="bg-white border border-stone-200/90 rounded-2xl p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-stone-200">
        <div>
          <p className="text-xs text-stone-500">Platform Management Console</p>
          <h2 className="text-2xl font-semibold text-stone-900 mt-0.5">
            Admin Dashboard
          </h2>
        </div>

        {/* Summary Counters */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600 font-mono tabular-nums">
          <span>Destinations: <strong>{destinations.length}</strong></span>
          <span>·</span>
          <span>Hotels: <strong>{hotels.length}</strong></span>
          <span>·</span>
          <span>Tickets: <strong>{tickets.length}</strong></span>
          <span>·</span>
          <span>Guides: <strong>{guides.length}</strong></span>
          <span>·</span>
          <span>Bookings: <strong>{bookings.length}</strong></span>
        </div>
      </div>

      {statusMsg && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-stone-100 rounded-xl border border-stone-200/80">
        {(
          [
            { id: 'destinations', label: `Destinations (${destinations.length})` },
            { id: 'hotels', label: `Hotels (${hotels.length})` },
            { id: 'tickets', label: `Tickets & Attractions (${tickets.length})` },
            { id: 'guides', label: `Local Guides (${guides.length})` },
            { id: 'transport', label: `Transport (${transport.length})` },
            { id: 'bookings', label: `Users & Bookings (${bookings.length})` },
          ] as { id: AdminTab; label: string }[]
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: DESTINATIONS */}
      {activeTab === 'destinations' && (
        <div className="space-y-6">
          <form
            onSubmit={handleCreateDestination}
            className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 grid grid-cols-1 sm:grid-cols-5 gap-3 items-end"
          >
            <div>
              <label className="block text-xs text-stone-600 mb-1">City Name (EN) *</label>
              <input
                type="text"
                placeholder="e.g. Warangal"
                value={newDestName}
                onChange={(e) => setNewDestName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-stone-600 mb-1">Telugu Name (తెలుగు)</label>
              <input
                type="text"
                placeholder="వరంగల్"
                value={newDestNameTe}
                onChange={(e) => setNewDestNameTe(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs text-stone-600 mb-1">State</label>
              <input
                type="text"
                value={newDestState}
                onChange={(e) => setNewDestState(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs text-stone-600 mb-1">Avg Hotel ₹/Night</label>
              <input
                type="number"
                value={newDestHotelCost}
                onChange={(e) => setNewDestHotelCost(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-[#C2410C] hover:bg-[#9A3412] rounded-lg flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Destination</span>
            </button>
          </form>

          <div className="overflow-x-auto border border-stone-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Destination</th>
                  <th className="py-3 px-4">State</th>
                  <th className="py-3 px-4">Best Season</th>
                  <th className="py-3 px-4 font-mono">Est. Hotel / Night</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200/80">
                {destinations.map((d) => (
                  <tr key={d.id} className="hover:bg-stone-50/80">
                    <td className="py-2.5 px-4 font-medium text-stone-900">
                      {d.name} ({d.nameTe})
                    </td>
                    <td className="py-2.5 px-4 text-stone-600">{d.state}</td>
                    <td className="py-2.5 px-4 text-stone-600">{d.bestTimeToVisit}</td>
                    <td className="py-2.5 px-4 font-mono tabular-nums text-stone-900">
                      {formatINR(d.costs.hotelPerNightAvg)}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          if (destinations.length > 1) {
                            onDeleteDestination(d.id);
                            notify(`Removed destination ${d.name}.`);
                          }
                        }}
                        className="text-red-700 hover:underline inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: HOTELS */}
      {activeTab === 'hotels' && (
        <div className="space-y-6">
          <form
            onSubmit={handleCreateHotel}
            className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 grid grid-cols-1 sm:grid-cols-5 gap-3 items-end"
          >
            <div>
              <label className="block text-xs text-stone-600 mb-1">Hotel Name *</label>
              <input
                type="text"
                placeholder="e.g. Grand Kakatiya Stay"
                value={newHotelName}
                onChange={(e) => setNewHotelName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-stone-600 mb-1">City</label>
              <select
                value={newHotelDestId}
                onChange={(e) => setNewHotelDestId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg"
              >
                {destinations.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-stone-600 mb-1">Room Category</label>
              <input
                type="text"
                value={newHotelRoom}
                onChange={(e) => setNewHotelRoom(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs text-stone-600 mb-1">Est. Price / Night (₹)</label>
              <input
                type="number"
                value={newHotelPrice}
                onChange={(e) => setNewHotelPrice(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-[#C2410C] hover:bg-[#9A3412] rounded-lg flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Hotel</span>
            </button>
          </form>

          <div className="overflow-x-auto border border-stone-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Hotel Name</th>
                  <th className="py-3 px-4">City</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 font-mono">Est. ₹ / Night</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200/80">
                {hotels.map((h) => (
                  <tr key={h.id} className="hover:bg-stone-50/80">
                    <td className="py-2.5 px-4 font-medium text-stone-900">{h.name}</td>
                    <td className="py-2.5 px-4 text-stone-600">{h.cityName}</td>
                    <td className="py-2.5 px-4 text-stone-600">{h.hotelType}</td>
                    <td className="py-2.5 px-4 font-mono tabular-nums text-stone-900">
                      {formatINR(h.pricePerNight)}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          onDeleteHotel(h.id);
                          notify(`Removed hotel ${h.name}.`);
                        }}
                        className="text-red-700 hover:underline inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: TICKETS & ATTRACTIONS */}
      {activeTab === 'tickets' && (
        <div className="overflow-x-auto border border-stone-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-600 border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Tourist Attraction / Event</th>
                <th className="py-3 px-4">City</th>
                <th className="py-3 px-4 font-mono">Adult Ticket (₹)</th>
                <th className="py-3 px-4 font-mono">Child Ticket (₹)</th>
                <th className="py-3 px-4 text-right">Quick Adjust (+₹50)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/80">
              {tickets.map((t) => (
                <tr key={t.id} className="hover:bg-stone-50/80">
                  <td className="py-2.5 px-4 font-medium text-stone-900">{t.attractionName}</td>
                  <td className="py-2.5 px-4 text-stone-600">{t.cityName}</td>
                  <td className="py-2.5 px-4 font-mono tabular-nums text-stone-900">
                    {formatINR(t.adultPrice)}
                  </td>
                  <td className="py-2.5 px-4 font-mono tabular-nums text-stone-900">
                    {formatINR(t.childPrice)}
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        onUpdateTicketPrice(t.id, t.adultPrice + 50, t.childPrice + 25);
                        notify(`Updated ticket tariff for ${t.attractionName}.`);
                      }}
                      className="px-2.5 py-1 text-xs font-medium bg-stone-100 hover:bg-stone-200 rounded text-stone-800"
                    >
                      +₹50 Adult / +₹25 Child
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 4: LOCAL GUIDES */}
      {activeTab === 'guides' && (
        <div className="space-y-6">
          <form
            onSubmit={handleCreateGuide}
            className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 grid grid-cols-1 sm:grid-cols-5 gap-3 items-end"
          >
            <div>
              <label className="block text-xs text-stone-600 mb-1">Guide Name *</label>
              <input
                type="text"
                placeholder="e.g. Lakshmi Narayana"
                value={newGuideName}
                onChange={(e) => setNewGuideName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-stone-600 mb-1">City</label>
              <select
                value={newGuideDestId}
                onChange={(e) => setNewGuideDestId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg"
              >
                {destinations.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-stone-600 mb-1">Languages</label>
              <input
                type="text"
                value={newGuideLangs}
                onChange={(e) => setNewGuideLangs(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs text-stone-600 mb-1">Hourly Fee (₹)</label>
              <input
                type="number"
                value={newGuideHourly}
                onChange={(e) => setNewGuideHourly(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-[#C2410C] hover:bg-[#9A3412] rounded-lg flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Guide</span>
            </button>
          </form>

          <div className="overflow-x-auto border border-stone-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Guide Name</th>
                  <th className="py-3 px-4">City</th>
                  <th className="py-3 px-4">Languages</th>
                  <th className="py-3 px-4 font-mono">Hourly / Daily Fee</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200/80">
                {guides.map((g) => (
                  <tr key={g.id} className="hover:bg-stone-50/80">
                    <td className="py-2.5 px-4 font-medium text-stone-900">{g.name}</td>
                    <td className="py-2.5 px-4 text-stone-600">{g.cityName}</td>
                    <td className="py-2.5 px-4 text-stone-600">{g.languages.join(', ')}</td>
                    <td className="py-2.5 px-4 font-mono tabular-nums text-stone-900">
                      {formatINR(g.hourlyPrice)}/hr · {formatINR(g.dailyPrice)}/day
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          onDeleteGuide(g.id);
                          notify(`Removed guide ${g.name}.`);
                        }}
                        className="text-red-700 hover:underline inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: TRANSPORT */}
      {activeTab === 'transport' && (
        <div className="space-y-6">
          <form
            onSubmit={handleCreateTransport}
            className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 grid grid-cols-1 sm:grid-cols-6 gap-3 items-end"
          >
            <div>
              <label className="block text-xs text-stone-600 mb-1">Operator *</label>
              <input
                type="text"
                placeholder="e.g. Vande Bharat"
                value={newTrOperator}
                onChange={(e) => setNewTrOperator(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-stone-600 mb-1">Mode</label>
              <select
                value={newTrMode}
                onChange={(e) => setNewTrMode(e.target.value as 'Flight' | 'Train' | 'Bus' | 'Car')}
                className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg"
              >
                <option value="Flight">Flight</option>
                <option value="Train">Train</option>
                <option value="Bus">Bus</option>
                <option value="Car">Car</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-stone-600 mb-1">From</label>
              <input
                type="text"
                value={newTrFrom}
                onChange={(e) => setNewTrFrom(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs text-stone-600 mb-1">To</label>
              <input
                type="text"
                value={newTrTo}
                onChange={(e) => setNewTrTo(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs text-stone-600 mb-1">Fare (₹)</label>
              <input
                type="number"
                value={newTrFare}
                onChange={(e) => setNewTrFare(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-[#C2410C] hover:bg-[#9A3412] rounded-lg flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Route</span>
            </button>
          </form>

          <div className="overflow-x-auto border border-stone-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Operator</th>
                  <th className="py-3 px-4">Mode</th>
                  <th className="py-3 px-4">Route</th>
                  <th className="py-3 px-4 font-mono">Fare / Person</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200/80">
                {transport.map((tr) => (
                  <tr key={tr.id} className="hover:bg-stone-50/80">
                    <td className="py-2.5 px-4 font-medium text-stone-900">{tr.operatorName}</td>
                    <td className="py-2.5 px-4 text-stone-600">{tr.mode}</td>
                    <td className="py-2.5 px-4 text-stone-600">
                      {tr.fromCity} → {tr.toCity} ({tr.duration})
                    </td>
                    <td className="py-2.5 px-4 font-mono tabular-nums text-stone-900">
                      {formatINR(tr.approxFarePerPerson)}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => onDeleteTransport(tr.id)}
                        className="text-red-700 hover:underline inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: USERS & BOOKINGS */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs text-stone-500">Active Signed-In User Account</p>
              <p className="text-sm font-semibold text-stone-900">
                {user.name} · {user.email} · {user.phone} (Home: {user.homeCity})
              </p>
            </div>
            <span className="text-xs font-mono tabular-nums text-stone-600">
              Saved Places: {user.savedDestinations.length} · Saved Hotels: {user.savedHotels.length} · Saved Itineraries: {user.savedItineraries.length}
            </span>
          </div>

          <div className="overflow-x-auto border border-stone-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Booking ID</th>
                  <th className="py-3 px-4">Traveler</th>
                  <th className="py-3 px-4">Route & Dates</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 font-mono text-right">Total Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200/80">
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-stone-500">
                      No demo bookings recorded yet. Complete a booking from the summary modal to see it here.
                    </td>
                  </tr>
                ) : (
                  bookings.map((b) => (
                    <tr key={b.bookingId} className="hover:bg-stone-50/80">
                      <td className="py-2.5 px-4 font-mono font-semibold text-stone-900">
                        {b.bookingId}
                      </td>
                      <td className="py-2.5 px-4 text-stone-700">
                        {b.travelerName} ({b.adults}A, {b.children}C)
                      </td>
                      <td className="py-2.5 px-4 text-stone-600">
                        {b.startingCity} → {b.destinationName} ({b.startDate} to {b.endDate})
                      </td>
                      <td className="py-2.5 px-4 font-medium text-emerald-800">{b.status}</td>
                      <td className="py-2.5 px-4 font-mono tabular-nums font-semibold text-right text-stone-900">
                        {formatINR(b.costBreakdown.totalCost)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
