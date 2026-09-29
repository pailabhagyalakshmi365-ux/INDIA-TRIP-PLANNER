import { DestinationCategory, Language } from '../types/travel';

export function formatINR(amount: number): string {
  const rounded = Math.round(amount || 0);
  return '₹' + rounded.toLocaleString('en-IN');
}

export const CATEGORY_TRANSLATIONS: Record<DestinationCategory, { en: string; te: string }> = {
  'Historical Places': { en: 'Historical Places', te: 'చారిత్రక ప్రదేశాలు' },
  'Temples': { en: 'Temples', te: 'దేవాలయాలు' },
  'Beaches': { en: 'Beaches', te: 'బీచ్‌లు' },
  'Hill Stations': { en: 'Hill Stations', te: 'హిల్ స్టేషన్లు' },
  'Wildlife': { en: 'Wildlife', te: 'వন্যప్రాణులు' },
  'Adventure': { en: 'Adventure', te: 'సాహస యాత్రలు' },
  'Nature': { en: 'Nature', te: 'ప్రకృతి అందాలు' },
  'Spiritual Places': { en: 'Spiritual Places', te: 'ఆధ్యాత్మిక క్షేత్రాలు' },
};

export const UI_TEXT: Record<
  Language,
  {
    brandTitle: string;
    navExplore: string;
    navPlanner: string;
    navStaysTransport: string;
    navTicketsGuides: string;
    navMyTrips: string;
    navAdmin: string;
    heroHeadline: string;
    heroSubhead: string;
    searchDestination: string;
    searchDate: string;
    searchTravelers: string;
    searchBudget: string;
    searchButton: string;
    globalSearchPlaceholder: string;
    popularDestinationsTitle: string;
    popularDestinationsSub: string;
    allCategories: string;
    viewDetails: string;
    planTripHere: string;
    perNightEst: string;
    daysRecommended: string;
    bestTime: string;
    tripPlannerTitle: string;
    tripPlannerSub: string;
    startingCity: string;
    destination: string;
    startDate: string;
    endDate: string;
    adults: string;
    children: string;
    travelType: string;
    budgetTier: string;
    transportPref: string;
    hotelPref: string;
    foodPref: string;
    interests: string;
    generateItineraryBtn: string;
    hotelsSectionTitle: string;
    hotelsDemoDisclaimer: string;
    transportSectionTitle: string;
    ticketsSectionTitle: string;
    ticketsDemoDisclaimer: string;
    guidesSectionTitle: string;
    guidesDemoDisclaimer: string;
    costCalculatorTitle: string;
    mapExplorerTitle: string;
    reviewBookingBtn: string;
    confirmDemoBooking: string;
    demoBookingSuccess: string;
    myTripsTitle: string;
    savedItemsTitle: string;
    signIn: string;
    signOut: string;
  }
> = {
  en: {
    brandTitle: 'India Trip Planner',
    navExplore: 'Destinations',
    navPlanner: 'Trip Planner',
    navStaysTransport: 'Hotels & Transit',
    navTicketsGuides: 'Tickets & Guides',
    navMyTrips: 'My Trips',
    navAdmin: 'Admin',
    heroHeadline: 'Explore India. Plan Your Perfect Trip.',
    heroSubhead:
      'Discover 21 iconic Indian destinations, generate custom day-by-day itineraries, compare stays and transit in ₹, hire verified local guides, and calculate your exact trip budget.',
    searchDestination: 'Destination or City',
    searchDate: 'Travel Date',
    searchTravelers: 'Travelers',
    searchBudget: 'Budget Tier',
    searchButton: 'Explore & Plan',
    globalSearchPlaceholder: 'Search cities, temples, beaches, hotels, guides, or monuments...',
    popularDestinationsTitle: 'Popular Destinations Across India',
    popularDestinationsSub:
      'From the royal forts of Rajasthan and sacred temples of Andhra Pradesh to the tranquil backwaters of Kerala.',
    allCategories: 'All Destinations',
    viewDetails: 'View Details',
    planTripHere: 'Plan Trip',
    perNightEst: 'Est. hotel / night',
    daysRecommended: 'days recommended',
    bestTime: 'Best time',
    tripPlannerTitle: 'Custom Day-by-Day Trip Planner',
    tripPlannerSub:
      'Configure your route, dates, travel style, and interests to build a complete daily schedule with realistic ₹ cost estimates.',
    startingCity: 'Starting City',
    destination: 'Destination',
    startDate: 'Start Date',
    endDate: 'End Date',
    adults: 'Adults (12+ yrs)',
    children: 'Children (2–11 yrs)',
    travelType: 'Travel Group',
    budgetTier: 'Budget Comfort',
    transportPref: 'Primary Transport',
    hotelPref: 'Hotel Category',
    foodPref: 'Food Preference',
    interests: 'Key Interests',
    generateItineraryBtn: 'Generate Day-by-Day Itinerary',
    hotelsSectionTitle: 'Curated Hotels & Heritage Stays',
    hotelsDemoDisclaimer: 'Estimated prices shown in ₹ (Demo Data — no live payment charged).',
    transportSectionTitle: 'Flights, Trains, Buses & Cabs',
    ticketsSectionTitle: 'Monuments, Temples & Activity Tickets',
    ticketsDemoDisclaimer: 'Demo Ticket Booking — instant itinerary & cost calculator integration.',
    guidesSectionTitle: 'Hire a Local Guide',
    guidesDemoDisclaimer: 'Demo Guide Profiles — connect with regional language and heritage specialists.',
    costCalculatorTitle: 'Interactive Trip Cost Calculator',
    mapExplorerTitle: 'Interactive Destination & Landmark Map',
    reviewBookingBtn: 'Review Booking Summary',
    confirmDemoBooking: 'Confirm Booking (Demo)',
    demoBookingSuccess: 'Demo booking successful',
    myTripsTitle: 'My Bookings, Saved Places & Itineraries',
    savedItemsTitle: 'Saved Destinations & Hotels',
    signIn: 'Account',
    signOut: 'Sign Out',
  },
  te: {
    brandTitle: 'India Trip Planner',
    navExplore: 'గమ్యస్థానాలు',
    navPlanner: 'ట్రిప్ ప్లానర్',
    navStaysTransport: 'హోటళ్లు & ప్రయాణం',
    navTicketsGuides: 'టికెట్లు & గైడ్లు',
    navMyTrips: 'నా ప్రయాణాలు',
    navAdmin: 'అడ్మిన్',
    heroHeadline: 'భారతదేశాన్ని అన్వేషించండి. మీ ఆదర్శ ప్రయాణాన్ని ప్లాన్ చేసుకోండి.',
    heroSubhead:
      'భారతదేశంలోని 21 ప్రసిద్ధ పర్యాటక ప్రదేశాలను కనుగొనండి, రోజువారీ ప్రయాణ ప్రణాళికను రూపొందించండి, హోటళ్లు మరియు ప్రయాణ ఖర్చులను ₹ లో లెక్కించండి.',
    searchDestination: 'గమ్యస్థానం లేదా నగరం',
    searchDate: 'ప్రయాణ తేదీ',
    searchTravelers: 'ప్రయాణికులు',
    searchBudget: 'బడ్జెట్ రకం',
    searchButton: 'అన్వేషించండి',
    globalSearchPlaceholder: 'నగరాలు, దేవాలయాలు, హోటళ్లు, గైడ్లు లేదా పర్యాటక ప్రదేశాలను వెతకండి...',
    popularDestinationsTitle: 'భారతదేశంలోని ప్రసిద్ధ పర్యాటక ప్రదేశాలు',
    popularDestinationsSub:
      'హైదరాబాద్, తిరుపతి, విశాఖపట్నం, శ్రీశైలం నుండి కేరళ, కాశ్మీర్ మరియు జైపూర్ వరకు ఉత్తమ ప్రదేశాలు.',
    allCategories: 'అన్ని ప్రదేశాలు',
    viewDetails: 'వివరాలు చూడండి',
    planTripHere: 'ట్రిప్ ప్లాన్ చేయండి',
    perNightEst: 'అంచనా హోటల్ / రాత్రికి',
    daysRecommended: 'రోజులు సూచించబడింది',
    bestTime: 'ఉత్తమ సమయం',
    tripPlannerTitle: 'రోజువారీ ట్రిప్ ప్లానర్ (Day-by-Day Itinerary)',
    tripPlannerSub:
      'మీ ప్రయాణ తేదీలు, బడ్జెట్ మరియు అభిరుచులను ఎంచుకొని పూర్తి రోజువారీ ప్రణాళికను పొందండి.',
    startingCity: 'ప్రారంభ నగరం',
    destination: 'గమ్యస్థానం',
    startDate: 'ప్రారంభ తేదీ',
    endDate: 'ముగింపు తేదీ',
    adults: 'పెద్దలు (12+ సం.)',
    children: 'పిల్లలు (2–11 సం.)',
    travelType: 'ప్రయాణ శైలి',
    budgetTier: 'బడ్జెట్ స్థాయి',
    transportPref: 'ప్రయాణ సాధనం',
    hotelPref: 'హోటల్ రకం',
    foodPref: 'ఆహార ప్రాధాన్యత',
    interests: 'ఆసక్తులు',
    generateItineraryBtn: 'రోజువారీ ప్రణాళికను రూపొందించండి',
    hotelsSectionTitle: 'హోటళ్లు & విడిది సౌకర్యాలు',
    hotelsDemoDisclaimer: 'అంచనా ధరలు ₹ లో చూపబడ్డాయి (డెమో సమాచారం మాత్రమే).',
    transportSectionTitle: 'విమానాలు, రైళ్లు, బస్సులు & క్యాబ్‌లు',
    ticketsSectionTitle: 'పర్యాటక ప్రదేశాలు & దర్శన టికెట్లు',
    ticketsDemoDisclaimer: 'డెమో టికెట్ బుకింగ్ — తక్షణ ఖర్చు అంచనా కోసం.',
    guidesSectionTitle: 'స్థానిక గైడ్‌ను నియమించుకోండి',
    guidesDemoDisclaimer: 'డెమో గైడ్ వివరాలు — తెలుగు, హిందీ మరియు ఇంగ్లీష్ మాట్లాడే గైడ్లు.',
    costCalculatorTitle: 'మొత్తం ప్రయాణ ఖర్చు కాలిక్యులేటర్',
    mapExplorerTitle: 'ఇంటరాక్టివ్ మ్యాప్ & సమీప ప్రదేశాలు',
    reviewBookingBtn: 'బుకింగ్ వివరాలు సమీక్షించండి',
    confirmDemoBooking: 'బుకింగ్ నిర్ధారించండి (డెమో)',
    demoBookingSuccess: 'డెమో బుకింగ్ విజయవంతమైంది (Demo booking successful)',
    myTripsTitle: 'నా బుకింగ్‌లు & దాచిన ప్రణాళికలు',
    savedItemsTitle: 'దాచిన ప్రదేశాలు & హోటళ్లు',
    signIn: 'ఖాతా',
    signOut: 'లాగ్ అవుట్',
  },
};
