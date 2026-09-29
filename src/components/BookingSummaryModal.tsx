import React, { useState } from 'react';
import { X, CheckCircle2, FileText, ArrowRight, AlertCircle } from 'lucide-react';
import {
  ActiveTripDraft,
  BookingRecord,
  Destination,
  Language,
  UserProfile,
} from '../types/travel';
import { formatINR } from '../data/translations';
import { calculateComprehensiveTripCost } from '../utils/itineraryGenerator';

interface BookingSummaryModalProps {
  isOpen: boolean;
  draft: ActiveTripDraft;
  destination: Destination;
  user: UserProfile;
  language: Language;
  onClose: () => void;
  onConfirmBooking: (record: BookingRecord) => void;
  onViewMyTrips: () => void;
}

export const BookingSummaryModal: React.FC<BookingSummaryModalProps> = ({
  isOpen,
  draft,
  destination,
  user,
  language,
  onClose,
  onConfirmBooking,
  onViewMyTrips,
}) => {
  const [travelerName, setTravelerName] = useState(user.name || 'Arjun Reddy');
  const [travelerEmail, setTravelerEmail] = useState(user.email || 'arjun.traveler@example.com');
  const [travelerPhone, setTravelerPhone] = useState(user.phone || '+91 98480 24680');
  const [formError, setFormError] = useState('');
  const [confirmedRecord, setConfirmedRecord] = useState<BookingRecord | null>(null);

  if (!isOpen) return null;

  const cost = calculateComprehensiveTripCost(draft, destination);

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!travelerName.trim()) {
      setFormError('Please enter the primary traveler name.');
      return;
    }
    if (!travelerEmail.includes('@')) {
      setFormError('Please enter a valid email address for the booking voucher.');
      return;
    }
    if (travelerPhone.replace(/\D/g, '').length < 10) {
      setFormError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    setFormError('');
    const randomCode = Math.floor(10000 + Math.random() * 90000);
    const bookingId = `ITP-2026-${randomCode}`;

    const newRecord: BookingRecord = {
      bookingId,
      createdAt: new Date().toISOString(),
      status: 'Confirmed (Demo)',
      travelerName: travelerName.trim(),
      travelerEmail: travelerEmail.trim(),
      travelerPhone: travelerPhone.trim(),
      destinationName: destination.name,
      destinationId: destination.id,
      startingCity: draft.startingCity || 'Hyderabad',
      startDate: draft.startDate,
      endDate: draft.endDate,
      daysCount: cost.days,
      adults: draft.adults,
      children: draft.children,
      hotel: draft.selectedHotel
        ? {
            name: draft.selectedHotel.name,
            roomType: draft.selectedHotel.roomType,
            nights: cost.nights,
            totalHotelCost: cost.hotel,
          }
        : {
            name: `${destination.name} (${draft.budgetTier} Tier Estimate)`,
            roomType: 'Standard Double Occupancy',
            nights: cost.nights,
            totalHotelCost: cost.hotel,
          },
      transport: draft.selectedTransport
        ? {
            operatorName: draft.selectedTransport.operatorName,
            mode: draft.selectedTransport.mode,
            from: draft.selectedTransport.fromCity,
            to: draft.selectedTransport.toCity,
            totalTransportCost: cost.transportation,
          }
        : {
            operatorName: `Intercity Round-Trip (${draft.budgetTier} Estimate)`,
            mode: 'Train',
            from: draft.startingCity || 'Hyderabad',
            to: destination.name,
            totalTransportCost: cost.transportation,
          },
      tickets: draft.selectedTickets.map((t) => ({
        attractionName: t.ticket.attractionName,
        date: t.date,
        adults: t.adults,
        children: t.children,
        totalPrice: t.totalPrice,
      })),
      guide: draft.selectedGuide
        ? {
            name: draft.selectedGuide.guide.name,
            bookingType: draft.selectedGuide.bookingType,
            units: draft.selectedGuide.units,
            totalGuideCost: draft.selectedGuide.totalPrice,
          }
        : undefined,
      costBreakdown: {
        transportation: cost.transportation,
        hotel: cost.hotel,
        food: cost.food,
        attractionTickets: cost.attractionTickets,
        guide: cost.guide,
        localTransportation: cost.localTransportation,
        otherExpenses: cost.otherExpenses,
        totalCost: cost.totalCost,
        costPerPerson: cost.costPerPerson,
      },
      itinerary: draft.generatedItinerary || undefined,
    };

    setConfirmedRecord(newRecord);
    onConfirmBooking(newRecord);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-950/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-[#FAFAF8] border border-stone-200 rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between bg-white">
          <div>
            <p className="text-xs text-stone-500">
              Demo Booking Mode · No Real Payment Charged
            </p>
            <h2 className="text-xl sm:text-2xl font-semibold text-stone-900 mt-0.5">
              {confirmedRecord ? 'Demo Booking Confirmed' : 'Trip Booking Summary & Review'}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setConfirmedRecord(null);
              onClose();
            }}
            className="p-2 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmedRecord ? (
          /* SUCCESS STATE */
          <div className="p-6 sm:p-8 space-y-6">
            <div className="bg-emerald-50/90 border border-emerald-300 rounded-xl p-5 flex items-start gap-4">
              <CheckCircle2 className="w-7 h-7 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-emerald-950">
                  Demo booking successful
                </h3>
                <p className="text-xs text-emerald-800 mt-0.5">
                  {language === 'te'
                    ? 'డెమో బుకింగ్ విజయవంతమైంది! మీ ప్రయాణ వివరాలు "నా ప్రయాణాలు (My Trips)" విభాగంలో భద్రపరచబడ్డాయి.'
                    : 'Your demo itinerary, hotel, transport, tickets, and guide reservations have been saved to "My Trips". No real financial transaction was processed.'}
                </p>
                <div className="mt-3 inline-flex items-center gap-3 bg-white border border-emerald-200 px-3.5 py-2 rounded-lg">
                  <span className="text-xs text-stone-500">Booking Reference ID:</span>
                  <span className="font-mono tabular-nums text-sm font-bold text-stone-900">
                    {confirmedRecord.bookingId}
                  </span>
                </div>
              </div>
            </div>

            {/* Summary Receipt Card */}
            <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-100">
                <div>
                  <p className="text-xs text-stone-500">Destination & Dates</p>
                  <p className="text-base font-semibold text-stone-900">
                    {confirmedRecord.startingCity} → {confirmedRecord.destinationName} ({confirmedRecord.daysCount} Days)
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-stone-500">Travelers</p>
                  <p className="text-sm font-medium text-stone-900 font-mono tabular-nums">
                    {confirmedRecord.adults} Adults · {confirmedRecord.children} Children
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-stone-700">
                <div>
                  <p className="text-stone-500">Primary Traveler</p>
                  <p className="font-semibold text-stone-900 mt-0.5">
                    {confirmedRecord.travelerName} ({confirmedRecord.travelerPhone})
                  </p>
                </div>
                <div>
                  <p className="text-stone-500">Hotel Selection</p>
                  <p className="font-semibold text-stone-900 mt-0.5">
                    {confirmedRecord.hotel?.name} ({confirmedRecord.hotel?.nights} Nights)
                  </p>
                </div>
                <div>
                  <p className="text-stone-500">Transport</p>
                  <p className="font-semibold text-stone-900 mt-0.5">
                    {confirmedRecord.transport?.operatorName} ({confirmedRecord.transport?.mode})
                  </p>
                </div>
                <div>
                  <p className="text-stone-500">Local Guide</p>
                  <p className="font-semibold text-stone-900 mt-0.5">
                    {confirmedRecord.guide
                      ? `${confirmedRecord.guide.name} (${confirmedRecord.guide.units} ${confirmedRecord.guide.bookingType})`
                      : 'Self-Guided Exploration'}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
                <span className="text-sm font-semibold text-stone-900">
                  Total Estimated Trip Cost (Demo)
                </span>
                <span className="text-xl font-bold text-[#C2410C] font-mono tabular-nums">
                  {formatINR(confirmedRecord.costBreakdown.totalCost)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setConfirmedRecord(null);
                  onClose();
                }}
                className="px-4 py-2 text-xs font-medium text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-100"
              >
                Close Window
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmedRecord(null);
                  onClose();
                  onViewMyTrips();
                }}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>View in My Trips</span>
              </button>
            </div>
          </div>
        ) : (
          /* PRE-CONFIRMATION REVIEW FORM */
          <form onSubmit={handleConfirm} className="p-6 sm:p-8 space-y-6">
            {/* Core Trip Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white border border-stone-200/90 rounded-xl p-4">
              <div>
                <p className="text-xs text-stone-500">Destination</p>
                <p className="text-sm font-semibold text-stone-900 mt-0.5">
                  {destination.name} ({destination.nameTe})
                </p>
              </div>
              <div>
                <p className="text-xs text-stone-500">Travel Dates</p>
                <p className="text-xs font-semibold text-stone-900 font-mono tabular-nums mt-0.5">
                  {draft.startDate} → {draft.endDate} ({cost.days}D/{cost.nights}N)
                </p>
              </div>
              <div>
                <p className="text-xs text-stone-500">Travelers</p>
                <p className="text-sm font-semibold text-stone-900 font-mono tabular-nums mt-0.5">
                  {draft.adults} Adults, {draft.children} Children
                </p>
              </div>
              <div>
                <p className="text-xs text-stone-500">Budget Tier</p>
                <p className="text-sm font-semibold text-stone-900 mt-0.5">
                  {draft.budgetTier} ({draft.travelType})
                </p>
              </div>
            </div>

            {/* Selected Components Breakdown */}
            <div className="bg-white border border-stone-200/90 rounded-xl divide-y divide-stone-200/80">
              <div className="p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-stone-500">1. Hotel Stay ({cost.nights} Nights · {cost.roomsNeeded} Room{cost.roomsNeeded > 1 ? 's' : ''})</p>
                  <p className="text-sm font-semibold text-stone-900">
                    {draft.selectedHotel
                      ? `${draft.selectedHotel.name} — ${draft.selectedHotel.roomType}`
                      : `${destination.name} ${draft.budgetTier} Stay (Estimated)`}
                  </p>
                </div>
                <span className="font-mono tabular-nums text-sm font-semibold text-stone-900">
                  {formatINR(cost.hotel)}
                </span>
              </div>

              <div className="p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-stone-500">2. Intercity Transport (Round-Trip Estimate)</p>
                  <p className="text-sm font-semibold text-stone-900">
                    {draft.selectedTransport
                      ? `${draft.selectedTransport.operatorName} (${draft.selectedTransport.mode}: ${draft.selectedTransport.fromCity} → ${draft.selectedTransport.toCity})`
                      : `${draft.startingCity} ↔ ${destination.name} (${draft.budgetTier} Transit Estimate)`}
                  </p>
                </div>
                <span className="font-mono tabular-nums text-sm font-semibold text-stone-900">
                  {formatINR(cost.transportation)}
                </span>
              </div>

              <div className="p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-stone-500">3. Attraction & Activity Tickets</p>
                  <p className="text-sm font-semibold text-stone-900">
                    {draft.selectedTickets.length > 0
                      ? draft.selectedTickets.map((t) => t.ticket.attractionName).join(', ')
                      : `Standard Sightseeing Entry Estimate (${destination.name})`}
                  </p>
                </div>
                <span className="font-mono tabular-nums text-sm font-semibold text-stone-900">
                  {formatINR(cost.attractionTickets)}
                </span>
              </div>

              <div className="p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-stone-500">4. Local Guide Service</p>
                  <p className="text-sm font-semibold text-stone-900">
                    {draft.selectedGuide
                      ? `${draft.selectedGuide.guide.name} (${draft.selectedGuide.units} ${draft.selectedGuide.bookingType === 'hourly' ? 'Hours' : 'Days'} · ${draft.selectedGuide.guide.languages.join(', ')})`
                      : 'No Guide Selected (Optional)'}
                  </p>
                </div>
                <span className="font-mono tabular-nums text-sm font-semibold text-stone-900">
                  {formatINR(cost.guide)}
                </span>
              </div>

              <div className="p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-stone-500">5. Food, Local Transfers & Miscellaneous</p>
                  <p className="text-xs text-stone-600">
                    Food: {formatINR(cost.food)} · Local Transit: {formatINR(cost.localTransportation)} · Other: {formatINR(cost.otherExpenses)}
                  </p>
                </div>
                <span className="font-mono tabular-nums text-sm font-semibold text-stone-900">
                  {formatINR(cost.food + cost.localTransportation + cost.otherExpenses)}
                </span>
              </div>

              <div className="p-4 bg-stone-50 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-stone-900">
                    Estimated Total Trip Cost
                  </p>
                  <p className="text-xs text-stone-500 font-mono tabular-nums">
                    Cost per person: {formatINR(cost.costPerPerson)} · Daily avg: {formatINR(cost.dailyAverage)}
                  </p>
                </div>
                <span className="text-2xl font-bold text-[#C2410C] font-mono tabular-nums">
                  {formatINR(cost.totalCost)}
                </span>
              </div>
            </div>

            {/* Traveler Contact Details */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-stone-900">
                Traveler Contact Details (For Demo Voucher)
              </h3>
              {formError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-stone-600 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={travelerName}
                    onChange={(e) => setTravelerName(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-[#C2410C]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-600 mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={travelerEmail}
                    onChange={(e) => setTravelerEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-[#C2410C]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-600 mb-1">Mobile Number (+91) *</label>
                  <input
                    type="tel"
                    value={travelerPhone}
                    onChange={(e) => setTravelerPhone(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-[#C2410C] font-mono"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-4">
              <p className="text-xs text-stone-500">
                Demo Mode: Clicking Confirm generates a demo booking ID without charging any card.
              </p>
              <button
                type="submit"
                className="px-6 py-3 text-sm font-semibold text-white bg-[#C2410C] hover:bg-[#9A3412] rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                <span>Confirm Booking</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
