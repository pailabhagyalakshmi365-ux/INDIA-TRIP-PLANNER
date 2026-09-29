import {
  ActiveTripDraft,
  BudgetTier,
  Destination,
  GeneratedItinerary,
  Hotel,
  ItineraryDayPlan,
  TravelType,
  TransportMode,
} from '../types/travel';

export const BUDGET_MULTIPLIERS: Record<BudgetTier, number> = {
  Budget: 0.72,
  Standard: 1.0,
  Premium: 1.55,
  Luxury: 2.4,
};

export function calculateDaysBetween(startDate: string, endDate: string, fallback = 3): number {
  if (!startDate || !endDate) return fallback;
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return fallback;
  const diffDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(1, Math.min(14, diffDays));
}

export function generateDayByDayItinerary(params: {
  startingCity: string;
  destination: Destination;
  startDate: string;
  endDate: string;
  adults: number;
  children: number;
  travelType: TravelType;
  budgetTier: BudgetTier;
  transportMode: TransportMode;
  hotelPreference: string;
  foodPreference: string;
  interests: string[];
  recommendedHotel?: Hotel | null;
}): GeneratedItinerary {
  const {
    startingCity,
    destination,
    startDate,
    endDate,
    adults,
    children,
    travelType,
    budgetTier,
    transportMode,
    hotelPreference,
    foodPreference,
    interests,
    recommendedHotel,
  } = params;

  const daysCount = calculateDaysBetween(startDate, endDate, destination.recommendedDays);
  const totalTravelers = Math.max(1, adults + children * 0.65);
  const mult = BUDGET_MULTIPLIERS[budgetTier];

  const hotelName =
    recommendedHotel?.name ||
    `${destination.name} ${hotelPreference || 'Heritage Courtyard Stay'}`;

  const hotelNightlyCost =
    recommendedHotel?.pricePerNight ||
    Math.round(destination.costs.hotelPerNightAvg * mult * Math.ceil((adults + children) / 2));

  const dailyFoodPerGroup = Math.round(destination.costs.foodPerDay * mult * totalTravelers);
  const dailyLocalTransit = Math.round(destination.costs.localTransportPerDay * mult);

  const attractionsPool =
    destination.attractions.length > 0
      ? destination.attractions
      : [
          {
            id: 'default-1',
            name: `${destination.name} Heritage Citadel`,
            category: 'Monument' as const,
            openingHours: '09:00 AM – 05:30 PM',
            adultPrice: 100,
            childPrice: 50,
            durationHours: 2.5,
            description: `Explore the iconic architectural centerpiece of ${destination.name}.`,
            coordinates: { x: 50, y: 50 },
          },
        ];

  const thingsPool = destination.thingsToDo;
  const restaurantName =
    destination.restaurants[0]?.name || `${destination.name} Regional Kitchen`;
  const signatureDish =
    destination.restaurants[0]?.mustTry || `Traditional ${destination.state} Thali`;

  const startObj = startDate ? new Date(startDate) : new Date();
  const days: ItineraryDayPlan[] = [];
  let totalCumulative = 0;

  for (let i = 0; i < daysCount; i++) {
    const dayDate = new Date(startObj);
    dayDate.setDate(startObj.getDate() + i);
    const dateStr = dayDate.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    const primaryAttr = attractionsPool[i % attractionsPool.length];
    const secondaryAttr = attractionsPool[(i + 1) % attractionsPool.length];
    const extraActivity = thingsPool[i % thingsPool.length] || `Explore ${destination.name} bazaars`;
    const nearbyExcursion =
      destination.nearbyPlaces[i % Math.max(1, destination.nearbyPlaces.length)];

    const ticketCostDay =
      primaryAttr.adultPrice * adults +
      primaryAttr.childPrice * children +
      (i > 0 ? secondaryAttr.adultPrice * adults + secondaryAttr.childPrice * children : 0);

    if (i === 0) {
      // Day 1 format requested in prompt
      const slots = [
        {
          timeOfDay: 'Arrival & Check-in' as const,
          title: `Arrival in ${destination.name} from ${startingCity || 'Home City'} (${transportMode}) & Check-in`,
          description: `Arrive at ${destination.name} terminal, transfer via local ${transportMode === 'Car' ? 'chauffeur cab' : 'AC transfer'} and check in at ${hotelName}. Refresh with welcome drinks.`,
          timing: '09:30 AM – 11:30 AM',
          estimatedCost: Math.round(dailyLocalTransit * 0.5) + hotelNightlyCost,
        },
        {
          timeOfDay: 'Morning' as const,
          title: `Nearby Sightseeing: ${primaryAttr.name}`,
          description: `${primaryAttr.description} (Open: ${primaryAttr.openingHours}). Tailored for ${travelType.toLowerCase()} travelers.`,
          timing: '11:30 AM – 01:30 PM',
          estimatedCost: primaryAttr.adultPrice * adults + primaryAttr.childPrice * children,
        },
        {
          timeOfDay: 'Lunch' as const,
          title: `Regional Lunch (${foodPreference}) at ${restaurantName}`,
          description: `Enjoy authentic ${foodPreference} specialties including ${signatureDish}.`,
          timing: '01:30 PM – 02:45 PM',
          estimatedCost: Math.round(dailyFoodPerGroup * 0.45),
        },
        {
          timeOfDay: 'Evening' as const,
          title: `Evening Activity: ${extraActivity}`,
          description: `Golden hour stroll, local photography, and cultural bazaar walk aligned with your interest in ${interests.slice(0, 2).join(' & ') || 'local heritage'}.`,
          timing: '04:30 PM – 07:00 PM',
          estimatedCost: Math.round(dailyLocalTransit * 0.5),
        },
        {
          timeOfDay: 'Dinner' as const,
          title: `Welcome Dinner & Overnight at ${hotelName}`,
          description: `Relaxed regional dinner followed by overnight stay at ${hotelName}.`,
          timing: '08:00 PM – 09:30 PM',
          estimatedCost: Math.round(dailyFoodPerGroup * 0.55),
        },
      ];
      const dailyTotalCost = slots.reduce((acc, s) => acc + s.estimatedCost, 0);
      totalCumulative += dailyTotalCost;
      days.push({
        dayNumber: 1,
        dateStr,
        headline: `Arrival in ${destination.name}, ${primaryAttr.name} & Evening Heritage Walk`,
        hotelName,
        slots,
        dailyTotalCost,
      });
    } else {
      // Day 2..N format requested in prompt
      const isLastDay = i === daysCount - 1;
      const slots = [
        {
          timeOfDay: 'Morning' as const,
          title: `Morning Attraction: ${primaryAttr.name}`,
          description: `Early morning visit to ${primaryAttr.name} (${primaryAttr.openingHours}) to beat the crowds and enjoy cool ${destination.weather.tempCelsius}°C weather.`,
          timing: '08:30 AM – 12:00 PM',
          estimatedCost:
            primaryAttr.adultPrice * adults +
            primaryAttr.childPrice * children +
            Math.round(dailyLocalTransit * 0.45),
        },
        {
          timeOfDay: 'Lunch' as const,
          title: `Midday Lunch (${foodPreference})`,
          description: `Freshly prepared ${foodPreference} meal featuring seasonal ${destination.state} flavors.`,
          timing: '12:30 PM – 01:45 PM',
          estimatedCost: Math.round(dailyFoodPerGroup * 0.45),
        },
        {
          timeOfDay: 'Afternoon' as const,
          title: nearbyExcursion
            ? `Afternoon Excursion: ${secondaryAttr.name} & ${nearbyExcursion.name}`
            : `Afternoon Attraction: ${secondaryAttr.name}`,
          description: nearbyExcursion
            ? `${secondaryAttr.description} Followed by a scenic drive towards ${nearbyExcursion.name} (${nearbyExcursion.distanceKm} km — ${nearbyExcursion.highlight}).`
            : secondaryAttr.description,
          timing: '02:15 PM – 05:15 PM',
          estimatedCost:
            secondaryAttr.adultPrice * adults +
            secondaryAttr.childPrice * children +
            Math.round(dailyLocalTransit * 0.55),
        },
        {
          timeOfDay: 'Evening' as const,
          title: isLastDay
            ? `Souvenir Shopping, Sunset View & Departure Prep`
            : `Evening Activity: ${extraActivity}`,
          description: isLastDay
            ? `Pick up local handicrafts and sweets in ${destination.name} before evening transfer.`
            : `Unwind with cultural performances and return to ${hotelName}.`,
          timing: '05:30 PM – 07:30 PM',
          estimatedCost: isLastDay ? 0 : hotelNightlyCost,
        },
        {
          timeOfDay: 'Dinner' as const,
          title: isLastDay
            ? `Farewell Dinner in ${destination.name}`
            : `Dinner & Stay at ${hotelName}`,
          description: `Curated ${foodPreference} dinner experience.`,
          timing: '08:00 PM – 09:30 PM',
          estimatedCost: Math.round(dailyFoodPerGroup * 0.55),
        },
      ];
      const dailyTotalCost = slots.reduce((acc, s) => acc + s.estimatedCost, 0);
      totalCumulative += dailyTotalCost;
      days.push({
        dayNumber: i + 1,
        dateStr,
        headline: nearbyExcursion
          ? `${primaryAttr.name}, ${secondaryAttr.name} & ${nearbyExcursion.name}`
          : `${primaryAttr.name} & Cultural Exploration`,
        hotelName,
        slots,
        dailyTotalCost,
      });
    }
  }

  return {
    id: `itin-${Date.now()}`,
    createdAt: new Date().toISOString(),
    startingCity: startingCity || 'Hyderabad',
    destinationId: destination.id,
    destinationName: destination.name,
    startDate,
    endDate,
    daysCount,
    adults,
    children,
    travelType,
    budgetTier,
    transportMode,
    hotelPreference,
    foodPreference,
    interests,
    days,
    estimatedTotalCost: totalCumulative,
  };
}

export function calculateComprehensiveTripCost(
  draft: ActiveTripDraft,
  destination: Destination
) {
  const days = calculateDaysBetween(
    draft.startDate,
    draft.endDate,
    destination.recommendedDays
  );
  const nights = Math.max(1, days - 1);
  const totalHeadcount = Math.max(1, draft.adults + draft.children);
  const weightedTravelers = Math.max(1, draft.adults + draft.children * 0.65);
  const tierMult = BUDGET_MULTIPLIERS[draft.budgetTier];
  const roomsNeeded = Math.max(1, Math.ceil((draft.adults + draft.children * 0.5) / 2));

  // 1. Intercity Transportation (Round-trip estimate if selected, else tier estimate)
  const transportation = draft.selectedTransport
    ? Math.round(draft.selectedTransport.approxFarePerPerson * weightedTravelers * 2)
    : Math.round(1650 * tierMult * weightedTravelers * 2);

  // 2. Hotel Cost
  const hotel = draft.selectedHotel
    ? draft.selectedHotel.pricePerNight * nights * roomsNeeded
    : Math.round(destination.costs.hotelPerNightAvg * tierMult * nights * roomsNeeded);

  // 3. Food Estimate
  const food = Math.round(destination.costs.foodPerDay * tierMult * weightedTravelers * days);

  // 4. Attraction Tickets
  const attractionTickets =
    draft.selectedTickets.length > 0
      ? draft.selectedTickets.reduce((sum, item) => sum + item.totalPrice, 0)
      : Math.round(destination.costs.entryTicketAvg * weightedTravelers * Math.min(days, 3));

  // 5. Local Guide
  const guide = draft.selectedGuide ? draft.selectedGuide.totalPrice : 0;

  // 6. Local Transportation
  const localTransportation = Math.round(
    destination.costs.localTransportPerDay * tierMult * days * roomsNeeded
  );

  // 7. Other Expenses
  const otherExpenses = draft.customOtherExpenses || Math.round(400 * tierMult * days);

  const totalCost =
    transportation +
    hotel +
    food +
    attractionTickets +
    guide +
    localTransportation +
    otherExpenses;

  const costPerPerson = Math.round(totalCost / totalHeadcount);
  const dailyAverage = Math.round(totalCost / days);

  return {
    days,
    nights,
    roomsNeeded,
    totalHeadcount,
    transportation,
    hotel,
    food,
    attractionTickets,
    guide,
    localTransportation,
    otherExpenses,
    totalCost,
    costPerPerson,
    dailyAverage,
  };
}
