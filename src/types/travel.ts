export type Language = 'en' | 'te';

export type DestinationCategory =
  | 'Historical Places'
  | 'Temples'
  | 'Beaches'
  | 'Hill Stations'
  | 'Wildlife'
  | 'Adventure'
  | 'Nature'
  | 'Spiritual Places';

export type BudgetTier = 'Budget' | 'Standard' | 'Premium' | 'Luxury';
export type TravelType = 'Solo' | 'Couple' | 'Family' | 'Friends';
export type TransportMode = 'Flight' | 'Train' | 'Bus' | 'Car' | 'Local Taxi';

export interface AttractionItem {
  id: string;
  name: string;
  nameTe?: string;
  category: 'Monument' | 'Temple' | 'Museum' | 'Park' | 'Adventure' | 'Beach' | 'Nature' | 'Event';
  openingHours: string;
  adultPrice: number;
  childPrice: number;
  durationHours: number;
  description: string;
  coordinates: { x: number; y: number }; // relative percentage on city map (10-90)
}

export interface NearbyRestaurant {
  id: string;
  name: string;
  cuisine: string;
  avgCostForTwo: number;
  rating: number;
  mustTry: string;
  coordinates: { x: number; y: number };
}

export interface Destination {
  id: string;
  name: string;
  nameTe: string;
  state: string;
  stateTe: string;
  tagline: string;
  taglineTe: string;
  description: string;
  descriptionTe: string;
  categories: DestinationCategory[];
  rating: number;
  reviewCount: number;
  bestTimeToVisit: string;
  recommendedDays: number;
  weather: {
    tempCelsius: number;
    condition: string;
    humidity: string;
    seasonNote: string;
  };
  costs: {
    entryTicketAvg: number;
    localTransportPerDay: number;
    foodPerDay: number;
    hotelPerNightAvg: number;
  };
  thingsToDo: string[];
  nearbyPlaces: { name: string; distanceKm: number; highlight: string }[];
  attractions: AttractionItem[];
  restaurants: NearbyRestaurant[];
  mapPosition: { lat: number; lng: number; mapX: number; mapY: number }; // India map SVG coordinates
  imageKey: string;
  customImageUrl?: string;
}

export interface Hotel {
  id: string;
  destinationId: string;
  cityName: string;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  hotelType: 'Budget Inn' | '3-Star Comfort' | '4-Star Boutique' | '5-Star Heritage Palace' | 'Eco Resort';
  roomType: string;
  pricePerNight: number;
  amenities: string[];
  breakfastIncluded: boolean;
  distanceFromAttraction: string;
  description: string;
  coordinates: { x: number; y: number };
}

export interface TicketListing {
  id: string;
  destinationId: string;
  cityName: string;
  attractionName: string;
  ticketType: 'Tourist Attraction' | 'Museum' | 'Monument' | 'Park' | 'Adventure Activity' | 'Cultural Event';
  openingHours: string;
  adultPrice: number;
  childPrice: number;
  duration: string;
  highlights: string;
}

export interface SelectedTicketOrder {
  ticket: TicketListing;
  date: string;
  adults: number;
  children: number;
  totalPrice: number;
}

export interface TransportOption {
  id: string;
  mode: TransportMode;
  operatorName: string;
  serviceNumber: string;
  fromCity: string;
  toCity: string;
  destinationId: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  approxFarePerPerson: number;
  classType: string;
}

export interface LocalGuide {
  id: string;
  destinationId: string;
  cityName: string;
  name: string;
  languages: string[];
  experienceYears: number;
  rating: number;
  reviewsCount: number;
  hourlyPrice: number;
  dailyPrice: number;
  specialization: string[];
  availability: 'Available Today' | 'Available Next Week' | 'Limited Slots';
  bio: string;
  verifiedDemo: boolean;
}

export interface SelectedGuideBooking {
  guide: LocalGuide;
  bookingType: 'hourly' | 'daily';
  units: number; // hours or days
  date: string;
  totalPrice: number;
}

export interface DayActivitySlot {
  timeOfDay: 'Arrival & Check-in' | 'Morning' | 'Lunch' | 'Afternoon' | 'Evening' | 'Dinner';
  title: string;
  description: string;
  timing?: string;
  estimatedCost: number;
}

export interface ItineraryDayPlan {
  dayNumber: number;
  dateStr: string;
  headline: string;
  hotelName: string;
  slots: DayActivitySlot[];
  dailyTotalCost: number;
}

export interface GeneratedItinerary {
  id: string;
  createdAt: string;
  startingCity: string;
  destinationId: string;
  destinationName: string;
  startDate: string;
  endDate: string;
  daysCount: number;
  adults: number;
  children: number;
  travelType: TravelType;
  budgetTier: BudgetTier;
  transportMode: TransportMode;
  hotelPreference: string;
  foodPreference: string;
  interests: string[];
  days: ItineraryDayPlan[];
  estimatedTotalCost: number;
}

export interface ActiveTripDraft {
  startingCity: string;
  destinationId: string;
  startDate: string;
  endDate: string;
  adults: number;
  children: number;
  travelType: TravelType;
  budgetTier: BudgetTier;
  selectedHotel: Hotel | null;
  selectedTransport: TransportOption | null;
  selectedTickets: SelectedTicketOrder[];
  selectedGuide: SelectedGuideBooking | null;
  generatedItinerary: GeneratedItinerary | null;
  customOtherExpenses: number;
}

export interface BookingRecord {
  bookingId: string;
  createdAt: string;
  status: 'Confirmed (Demo)' | 'Completed' | 'Cancelled';
  travelerName: string;
  travelerEmail: string;
  travelerPhone: string;
  destinationName: string;
  destinationId: string;
  startingCity: string;
  startDate: string;
  endDate: string;
  daysCount: number;
  adults: number;
  children: number;
  hotel?: {
    name: string;
    roomType: string;
    nights: number;
    totalHotelCost: number;
  };
  transport?: {
    operatorName: string;
    mode: TransportMode;
    from: string;
    to: string;
    totalTransportCost: number;
  };
  tickets: {
    attractionName: string;
    date: string;
    adults: number;
    children: number;
    totalPrice: number;
  }[];
  guide?: {
    name: string;
    bookingType: 'hourly' | 'daily';
    units: number;
    totalGuideCost: number;
  };
  costBreakdown: {
    transportation: number;
    hotel: number;
    food: number;
    attractionTickets: number;
    guide: number;
    localTransportation: number;
    otherExpenses: number;
    totalCost: number;
    costPerPerson: number;
  };
  itinerary?: GeneratedItinerary;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  homeCity: string;
  preferredLanguage: Language;
  role: 'traveler' | 'admin';
  savedDestinations: string[];
  savedHotels: string[];
  savedItineraries: GeneratedItinerary[];
}
