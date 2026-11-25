import { media } from "@/lib/media";
// Margea Flights Data
// operator_price_usd is INTERNAL ONLY - never display to users
// margea_price_usd = round(operator_price_usd * 1.15) - this is the public price

// Deposit rule types
export type DepositType = 'percent' | 'fixed' | 'percent_with_min';

export interface DepositRule {
  deposit_type: DepositType;
  deposit_percent?: number;      // e.g., 0.25 for 25%
  deposit_fixed_usd?: number;    // Fixed amount in USD
  deposit_min_usd?: number;      // Minimum deposit for percent_with_min
}

// Default deposit rule: 25% of total
export const DEFAULT_DEPOSIT_RULE: DepositRule = {
  deposit_type: 'percent',
  deposit_percent: 0.25,
};

export interface FlightProduct {
  id: string;
  provider_brand: "Margea";
  operator_hint: "Operated by Vuelatour";
  category: "Flights" | "Scenic Flights";
  aircraft: "Cessna 206 (Up to 5 pax)" | "Kodiak (Up to 9 pax)" | "Piper Seneca (Up to 5 pax)";
  route_name: string;
  operator_price_usd: number; // INTERNAL - do not display
  margea_price_usd: number; // Public price with 15% markup
  notes: string;
  flight_time_minutes?: number; // Flight duration in minutes
  deposit_rule?: DepositRule; // Per-flight deposit rule (defaults to 25%)
}

// Aircraft specifications
export interface AircraftSpec {
  name: string;
  passengers: number;
  features: {
    en: string[];
    es: string[];
  };
  image: string;
  galleryImages?: string[];
  model_year?: string;
  range?: string;
  base?: string;
  additional_info?: {
    en: string;
    es: string;
  };
}

export const aircraftSpecs: Record<string, AircraftSpec> = {
  'Cessna 206': {
    name: 'Cessna 206',
    passengers: 5,
    features: {
      en: ['5 Passengers', 'Private Flight', 'Express Flight', 'Luggage Area', 'Model 2001', 'Restored 2020'],
      es: ['5 Pasajeros', 'Vuelo Privado', 'Vuelo Express', 'Área para Maletas', 'Modelo 2001', 'Restaurado 2020'],
    },
    image: media('/flight-images/cessna-exterior.jpg'),
    model_year: '2001',
    additional_info: {
      en: 'Restored in 2020 with modern avionics',
      es: 'Restaurado en 2020 con aviónica moderna',
    },
  },
  'Kodiak': {
    name: 'Kodiak 100',
    passengers: 9,
    features: {
      en: ['9 Passengers', 'Air Conditioning', 'Express Flight', 'Luggage Area', 'Model 2016'],
      es: ['9 Pasajeros', 'Aire Acondicionado', 'Vuelo Express', 'Área para Maletas', 'Modelo 2016'],
    },
    image: media('/flight-images/kodiak-interior.jpg'),
    model_year: '2016',
    additional_info: {
      en: 'Premium aircraft with spacious cabin',
      es: 'Aeronave premium con cabina espaciosa',
    },
  },
  'Piper Seneca': {
    name: 'Piper Seneca',
    passengers: 5,
    features: {
      en: ['5 Passengers', 'Twin Engine', 'Private Flight', 'Luggage Area', 'Modern Avionics'],
      es: ['5 Pasajeros', 'Bimotor', 'Vuelo Privado', 'Área para Maletas', 'Aviónica Moderna'],
    },
    image: media('/flight-images/piper-placeholder.jpg'),
    model_year: 'TBD',
    additional_info: {
      en: 'Reliable twin-engine aircraft for enhanced safety',
      es: 'Aeronave bimotor confiable para mayor seguridad',
    },
  },
  'LJ31A': {
    name: 'Learjet 31A',
    passengers: 8,
    features: {
      en: ['6–8 Passengers', 'Private Jet', 'Long Range', 'Leather Cabin', 'Base: Toluca'],
      es: ['6–8 Pasajeros', 'Jet Privado', 'Largo Alcance', 'Cabina de Piel', 'Base: Toluca'],
    },
    image: media('/flight-images/lj31a-4.jpg'),
    galleryImages: [
      media('/flight-images/lj31a-4.jpg'),
      media('/flight-images/lj31a-1.jpg'),
      media('/flight-images/lj31a-2.jpg'),
      media('/flight-images/lj31a-3.jpg'),
    ],
    range: '1,000–1,300 NM',
    base: 'Toluca',
    additional_info: {
      en: 'Premium light jet with intercontinental range and luxurious leather cabin',
      es: 'Jet ligero premium con alcance intercontinental y lujosa cabina de piel',
    },
  },
};

// Flight times by destination (in minutes)
export const flightTimes: Record<string, number> = {
  'Holbox': 20,
  'Cozumel': 20,
  'Playa del Carmen': 15,
  'Tulum': 35,
  'Chichen Itza': 50,
  'Mahahual': 75,
  'Chetumal': 90,
  'Merida': 90,
  'Campeche': 120,
  'Miami': 180,
  'Cancun / Hotel Zone / Isla Mujeres': 25,
  'Riviera Maya / Playa del Carmen / Tulum Ruins': 45,
  'Holbox / El Cuyo / Gulf of Mexico / Las Coloradas / Flamingos': 60,
};

// Helper function to calculate Margea price with 15% markup, rounded
const calcMargeaPrice = (operatorPrice: number): number => Math.round(operatorPrice * 1.15);

// FLIGHTS - Private charter flights
// Updated pricing as of Jan 2026
const flightsData: Omit<FlightProduct, 'margea_price_usd'>[] = [
  // Cessna 206 - Charter (agency prices updated)
  { id: 'cessna-cozumel', provider_brand: 'Margea', operator_hint: 'Operated by Vuelatour', category: 'Flights', aircraft: 'Cessna 206 (Up to 5 pax)', route_name: 'Cozumel', operator_price_usd: 600, notes: 'Prices in USD + TAX', flight_time_minutes: 20 },
  { id: 'cessna-holbox', provider_brand: 'Margea', operator_hint: 'Operated by Vuelatour', category: 'Flights', aircraft: 'Cessna 206 (Up to 5 pax)', route_name: 'Holbox', operator_price_usd: 650, notes: 'Prices in USD + TAX', flight_time_minutes: 20 },
  { id: 'cessna-chichen', provider_brand: 'Margea', operator_hint: 'Operated by Vuelatour', category: 'Flights', aircraft: 'Cessna 206 (Up to 5 pax)', route_name: 'Chichen Itza', operator_price_usd: 1200, notes: 'Prices in USD + TAX', flight_time_minutes: 50, deposit_rule: { deposit_type: 'percent', deposit_percent: 0.30 } },
  { id: 'cessna-playa', provider_brand: 'Margea', operator_hint: 'Operated by Vuelatour', category: 'Flights', aircraft: 'Cessna 206 (Up to 5 pax)', route_name: 'Playa del Carmen', operator_price_usd: 600, notes: 'Prices in USD + TAX', flight_time_minutes: 15 },
  { id: 'cessna-tulum', provider_brand: 'Margea', operator_hint: 'Operated by Vuelatour', category: 'Flights', aircraft: 'Cessna 206 (Up to 5 pax)', route_name: 'Tulum', operator_price_usd: 1050, notes: 'Prices in USD + TAX', flight_time_minutes: 35 },
  { id: 'cessna-merida', provider_brand: 'Margea', operator_hint: 'Operated by Vuelatour', category: 'Flights', aircraft: 'Cessna 206 (Up to 5 pax)', route_name: 'Merida', operator_price_usd: 1790, notes: 'Prices in USD + TAX', flight_time_minutes: 90, deposit_rule: { deposit_type: 'percent_with_min', deposit_percent: 0.25, deposit_min_usd: 500 } },
  { id: 'cessna-mahahual', provider_brand: 'Margea', operator_hint: 'Operated by Vuelatour', category: 'Flights', aircraft: 'Cessna 206 (Up to 5 pax)', route_name: 'Mahahual', operator_price_usd: 1755, notes: 'Prices in USD + TAX', flight_time_minutes: 75, deposit_rule: { deposit_type: 'percent_with_min', deposit_percent: 0.25, deposit_min_usd: 450 } },
  { id: 'cessna-chetumal', provider_brand: 'Margea', operator_hint: 'Operated by Vuelatour', category: 'Flights', aircraft: 'Cessna 206 (Up to 5 pax)', route_name: 'Chetumal', operator_price_usd: 1920, notes: 'Prices in USD + TAX', flight_time_minutes: 90, deposit_rule: { deposit_type: 'percent_with_min', deposit_percent: 0.25, deposit_min_usd: 500 } },
  { id: 'cessna-miami', provider_brand: 'Margea', operator_hint: 'Operated by Vuelatour', category: 'Flights', aircraft: 'Cessna 206 (Up to 5 pax)', route_name: 'Miami', operator_price_usd: 4920, notes: 'Prices in USD + TAX', flight_time_minutes: 180, deposit_rule: { deposit_type: 'fixed', deposit_fixed_usd: 1500 } },
  
  // Kodiak - Charter (agency prices updated)
  { id: 'kodiak-cozumel', provider_brand: 'Margea', operator_hint: 'Operated by Vuelatour', category: 'Flights', aircraft: 'Kodiak (Up to 9 pax)', route_name: 'Cozumel', operator_price_usd: 1280, notes: 'Prices in USD + TAX', flight_time_minutes: 20, deposit_rule: { deposit_type: 'percent', deposit_percent: 0.30 } },
  { id: 'kodiak-holbox', provider_brand: 'Margea', operator_hint: 'Operated by Vuelatour', category: 'Flights', aircraft: 'Kodiak (Up to 9 pax)', route_name: 'Holbox', operator_price_usd: 1590, notes: 'Prices in USD + TAX', flight_time_minutes: 20, deposit_rule: { deposit_type: 'percent', deposit_percent: 0.30 } },
  { id: 'kodiak-chichen', provider_brand: 'Margea', operator_hint: 'Operated by Vuelatour', category: 'Flights', aircraft: 'Kodiak (Up to 9 pax)', route_name: 'Chichen Itza', operator_price_usd: 2400, notes: 'Prices in USD + TAX', flight_time_minutes: 50, deposit_rule: { deposit_type: 'percent_with_min', deposit_percent: 0.30, deposit_min_usd: 700 } },
  { id: 'kodiak-playa', provider_brand: 'Margea', operator_hint: 'Operated by Vuelatour', category: 'Flights', aircraft: 'Kodiak (Up to 9 pax)', route_name: 'Playa del Carmen', operator_price_usd: 1280, notes: 'Prices in USD + TAX', flight_time_minutes: 15, deposit_rule: { deposit_type: 'percent', deposit_percent: 0.30 } },
  { id: 'kodiak-tulum', provider_brand: 'Margea', operator_hint: 'Operated by Vuelatour', category: 'Flights', aircraft: 'Kodiak (Up to 9 pax)', route_name: 'Tulum', operator_price_usd: 2080, notes: 'Prices in USD + TAX', flight_time_minutes: 35, deposit_rule: { deposit_type: 'percent', deposit_percent: 0.30 } },
  { id: 'kodiak-merida', provider_brand: 'Margea', operator_hint: 'Operated by Vuelatour', category: 'Flights', aircraft: 'Kodiak (Up to 9 pax)', route_name: 'Merida', operator_price_usd: 3840, notes: 'Prices in USD + TAX', flight_time_minutes: 90, deposit_rule: { deposit_type: 'fixed', deposit_fixed_usd: 1000 } },
  { id: 'kodiak-mahahual', provider_brand: 'Margea', operator_hint: 'Operated by Vuelatour', category: 'Flights', aircraft: 'Kodiak (Up to 9 pax)', route_name: 'Mahahual', operator_price_usd: 3840, notes: 'Prices in USD + TAX', flight_time_minutes: 75, deposit_rule: { deposit_type: 'fixed', deposit_fixed_usd: 1000 } },
  { id: 'kodiak-chetumal', provider_brand: 'Margea', operator_hint: 'Operated by Vuelatour', category: 'Flights', aircraft: 'Kodiak (Up to 9 pax)', route_name: 'Chetumal', operator_price_usd: 4160, notes: 'Prices in USD + TAX', flight_time_minutes: 90, deposit_rule: { deposit_type: 'fixed', deposit_fixed_usd: 1000 } },
  { id: 'kodiak-miami', provider_brand: 'Margea', operator_hint: 'Operated by Vuelatour', category: 'Flights', aircraft: 'Kodiak (Up to 9 pax)', route_name: 'Miami', operator_price_usd: 10400, notes: 'Prices in USD + TAX', flight_time_minutes: 180, deposit_rule: { deposit_type: 'fixed', deposit_fixed_usd: 3000 } },

  // Piper Seneca - Charter (NO HOLBOX)
  { id: 'piper-cozumel', provider_brand: 'Margea', operator_hint: 'Operated by Vuelatour', category: 'Flights', aircraft: 'Piper Seneca (Up to 5 pax)', route_name: 'Cozumel', operator_price_usd: 760, notes: 'Prices in USD + TAX', flight_time_minutes: 20 },
  { id: 'piper-chichen', provider_brand: 'Margea', operator_hint: 'Operated by Vuelatour', category: 'Flights', aircraft: 'Piper Seneca (Up to 5 pax)', route_name: 'Chichen Itza', operator_price_usd: 1425, notes: 'Prices in USD + TAX', flight_time_minutes: 50, deposit_rule: { deposit_type: 'percent', deposit_percent: 0.30 } },
  { id: 'piper-playa', provider_brand: 'Margea', operator_hint: 'Operated by Vuelatour', category: 'Flights', aircraft: 'Piper Seneca (Up to 5 pax)', route_name: 'Playa del Carmen', operator_price_usd: 760, notes: 'Prices in USD + TAX', flight_time_minutes: 15 },
  { id: 'piper-tulum', provider_brand: 'Margea', operator_hint: 'Operated by Vuelatour', category: 'Flights', aircraft: 'Piper Seneca (Up to 5 pax)', route_name: 'Tulum', operator_price_usd: 1290, notes: 'Prices in USD + TAX', flight_time_minutes: 35 },
  { id: 'piper-merida', provider_brand: 'Margea', operator_hint: 'Operated by Vuelatour', category: 'Flights', aircraft: 'Piper Seneca (Up to 5 pax)', route_name: 'Merida', operator_price_usd: 2280, notes: 'Prices in USD + TAX', flight_time_minutes: 90, deposit_rule: { deposit_type: 'percent_with_min', deposit_percent: 0.25, deposit_min_usd: 600 } },
  { id: 'piper-mahahual', provider_brand: 'Margea', operator_hint: 'Operated by Vuelatour', category: 'Flights', aircraft: 'Piper Seneca (Up to 5 pax)', route_name: 'Mahahual', operator_price_usd: 2185, notes: 'Prices in USD + TAX', flight_time_minutes: 75, deposit_rule: { deposit_type: 'percent_with_min', deposit_percent: 0.25, deposit_min_usd: 550 } },
  { id: 'piper-chetumal', provider_brand: 'Margea', operator_hint: 'Operated by Vuelatour', category: 'Flights', aircraft: 'Piper Seneca (Up to 5 pax)', route_name: 'Chetumal', operator_price_usd: 2470, notes: 'Prices in USD + TAX', flight_time_minutes: 90, deposit_rule: { deposit_type: 'percent_with_min', deposit_percent: 0.25, deposit_min_usd: 650 } },
  { id: 'piper-miami', provider_brand: 'Margea', operator_hint: 'Operated by Vuelatour', category: 'Flights', aircraft: 'Piper Seneca (Up to 5 pax)', route_name: 'Miami', operator_price_usd: 6175, notes: 'Prices in USD + TAX', flight_time_minutes: 180, deposit_rule: { deposit_type: 'fixed', deposit_fixed_usd: 1800 } },
];

// SCENIC FLIGHTS (updated pricing)
const scenicFlightsData: Omit<FlightProduct, 'margea_price_usd'>[] = [
  // Cessna 206 Scenic (updated)
  { id: 'scenic-cessna-cancun', provider_brand: 'Margea', operator_hint: 'Operated by Vuelatour', category: 'Scenic Flights', aircraft: 'Cessna 206 (Up to 5 pax)', route_name: 'Cancun / Hotel Zone / Isla Mujeres', operator_price_usd: 590, notes: 'Prices in USD + TAX', flight_time_minutes: 25 },
  { id: 'scenic-cessna-riviera', provider_brand: 'Margea', operator_hint: 'Operated by Vuelatour', category: 'Scenic Flights', aircraft: 'Cessna 206 (Up to 5 pax)', route_name: 'Riviera Maya / Playa del Carmen / Tulum Ruins', operator_price_usd: 990, notes: 'Prices in USD + TAX', flight_time_minutes: 45, deposit_rule: { deposit_type: 'percent', deposit_percent: 0.30 } },
  { id: 'scenic-cessna-holbox', provider_brand: 'Margea', operator_hint: 'Operated by Vuelatour', category: 'Scenic Flights', aircraft: 'Cessna 206 (Up to 5 pax)', route_name: 'Holbox / El Cuyo / Gulf of Mexico / Las Coloradas / Flamingos', operator_price_usd: 1490, notes: 'Prices in USD + TAX', flight_time_minutes: 60, deposit_rule: { deposit_type: 'percent_with_min', deposit_percent: 0.25, deposit_min_usd: 400 } },
  
  // Kodiak Scenic (updated)
  { id: 'scenic-kodiak-cancun', provider_brand: 'Margea', operator_hint: 'Operated by Vuelatour', category: 'Scenic Flights', aircraft: 'Kodiak (Up to 9 pax)', route_name: 'Cancun / Hotel Zone / Isla Mujeres', operator_price_usd: 1590, notes: 'Prices in USD + TAX', flight_time_minutes: 25, deposit_rule: { deposit_type: 'percent', deposit_percent: 0.30 } },
  { id: 'scenic-kodiak-riviera', provider_brand: 'Margea', operator_hint: 'Operated by Vuelatour', category: 'Scenic Flights', aircraft: 'Kodiak (Up to 9 pax)', route_name: 'Riviera Maya / Playa del Carmen / Tulum Ruins', operator_price_usd: 2400, notes: 'Prices in USD + TAX', flight_time_minutes: 45, deposit_rule: { deposit_type: 'percent_with_min', deposit_percent: 0.30, deposit_min_usd: 700 } },
  { id: 'scenic-kodiak-holbox', provider_brand: 'Margea', operator_hint: 'Operated by Vuelatour', category: 'Scenic Flights', aircraft: 'Kodiak (Up to 9 pax)', route_name: 'Holbox / El Cuyo / Gulf of Mexico / Las Coloradas / Flamingos', operator_price_usd: 3520, notes: 'Prices in USD + TAX', flight_time_minutes: 60, deposit_rule: { deposit_type: 'fixed', deposit_fixed_usd: 1000 } },

  // Piper Seneca Scenic
  { id: 'scenic-piper-cancun', provider_brand: 'Margea', operator_hint: 'Operated by Vuelatour', category: 'Scenic Flights', aircraft: 'Piper Seneca (Up to 5 pax)', route_name: 'Cancun / Hotel Zone / Isla Mujeres', operator_price_usd: 950, notes: 'Prices in USD + TAX', flight_time_minutes: 25 },
  { id: 'scenic-piper-riviera', provider_brand: 'Margea', operator_hint: 'Operated by Vuelatour', category: 'Scenic Flights', aircraft: 'Piper Seneca (Up to 5 pax)', route_name: 'Riviera Maya / Playa del Carmen / Tulum Ruins', operator_price_usd: 1425, notes: 'Prices in USD + TAX', flight_time_minutes: 45, deposit_rule: { deposit_type: 'percent', deposit_percent: 0.30 } },
  { id: 'scenic-piper-holbox', provider_brand: 'Margea', operator_hint: 'Operated by Vuelatour', category: 'Scenic Flights', aircraft: 'Piper Seneca (Up to 5 pax)', route_name: 'Holbox / El Cuyo / Gulf of Mexico / Las Coloradas / Flamingos', operator_price_usd: 2090, notes: 'Prices in USD + TAX', flight_time_minutes: 60, deposit_rule: { deposit_type: 'percent_with_min', deposit_percent: 0.25, deposit_min_usd: 550 } },
];

// Add Margea price calculation
export const flights: FlightProduct[] = flightsData.map(f => ({
  ...f,
  margea_price_usd: calcMargeaPrice(f.operator_price_usd),
}));

export const scenicFlights: FlightProduct[] = scenicFlightsData.map(f => ({
  ...f,
  margea_price_usd: calcMargeaPrice(f.operator_price_usd),
}));

// Helper to get all products
export const getAllFlightProducts = (): FlightProduct[] => [...flights, ...scenicFlights];

// Helper to get products by category
export const getFlightsByCategory = (category: 'Flights' | 'Scenic Flights'): FlightProduct[] => {
  return category === 'Flights' ? flights : scenicFlights;
};

// Get unique route names for dropdown
export const getRouteNames = (): string[] => {
  const allProducts = getAllFlightProducts();
  return [...new Set(allProducts.map(p => p.route_name))].sort();
};

// Get deposit rule for a flight, with fallback to default
export const getDepositRule = (flight: FlightProduct): DepositRule => {
  return flight.deposit_rule || DEFAULT_DEPOSIT_RULE;
};
