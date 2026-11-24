// YAAB Rental Car Cancún fleet — Margea Travel "Renta de Coches".
// Prices are the exact "Desde" daily rates from yaabcar.mx (24 Nov 2026).
// Total = days x price_per_day. NO duration discount is applied: YAAB's
// 3-day quoter totals do not form a consistent discount rule, so the exact
// discount rule is pending confirmation with YAAB.
// The database (rental_cars) is authoritative once the migration is applied;
// this seed is the fallback shown while the table is unavailable.

export interface YaabCar {
  id: string;
  slug: string;
  name: string;
  trim: string;
  brand: string;
  year: number;
  passengers: number;
  transmission: string;
  doors: number;
  airConditioning: boolean;
  pricePerDayMxn: number;
  depositMxn: number | null;
  minDays: number;
  unitsAvailable: number;
  imageUrl: string;
  galleryUrls: string[];
  description: string;
  descriptionEs: string;
  features: string[];
  featuresEs: string[];
  sortOrder: number;
}

export const yaabCarsSeed: YaabCar[] = [
  {
    id: "jac-sei-8",
    slug: "jac-sei-8",
    name: "JAC SEI 8",
    trim: "Limited",
    brand: "JAC",
    year: 2025,
    passengers: 7,
    transmission: "Automática",
    doors: 5,
    airConditioning: true,
    pricePerDayMxn: 1850,
    depositMxn: 5000,
    minDays: 3,
    unitsAvailable: 1,
    imageUrl: "/yaab-cars/jac_sei_8_2025_roja.png",
    galleryUrls: [],
    description:
      "Roomy 7-passenger family SUV, ideal for group trips around Cancún and the Riviera Maya.",
    descriptionEs:
      "SUV familiar de 7 pasajeros, amplia y equipada para viajes en grupo por Cancún y la Riviera Maya.",
    features: ["Insurance included", "Unlimited mileage", "24h delivery in Cancún", "A/C"],
    featuresEs: ["Seguro incluido", "Kilometraje libre", "Entrega 24h en Cancún", "A/C"],
    sortOrder: 1,
  },
  {
    id: "suzuki-ertiga",
    slug: "suzuki-ertiga",
    name: "Suzuki Ertiga",
    trim: "Boostergreen",
    brand: "Suzuki",
    year: 2025,
    passengers: 7,
    transmission: "Automática",
    doors: 5,
    airConditioning: true,
    pricePerDayMxn: 1500,
    depositMxn: null,
    minDays: 3,
    unitsAvailable: 1,
    imageUrl: "/yaab-cars/susuki_ertiga_2026_beige.png",
    galleryUrls: [],
    description:
      "Comfortable 7-passenger family minivan, practical for families and groups.",
    descriptionEs:
      "Minivan familiar de 7 pasajeros, cómoda y práctica para familias y grupos.",
    features: ["Insurance included", "Unlimited mileage", "24h delivery in Cancún", "A/C"],
    featuresEs: ["Seguro incluido", "Kilometraje libre", "Entrega 24h en Cancún", "A/C"],
    sortOrder: 2,
  },
  {
    id: "dodge-attitude",
    slug: "dodge-attitude",
    name: "Dodge Attitude",
    trim: "SE",
    brand: "Dodge",
    year: 2022,
    passengers: 5,
    transmission: "Automática",
    doors: 5,
    airConditioning: true,
    pricePerDayMxn: 650,
    depositMxn: null,
    minDays: 3,
    unitsAvailable: 1,
    imageUrl: "/yaab-cars/dodge_attitude_2022_plata.png",
    galleryUrls: [],
    description:
      "Economical automatic sedan, practical for getting around the city.",
    descriptionEs:
      "Sedán económico y automático, práctico para recorrer la ciudad.",
    features: ["Insurance included", "Unlimited mileage", "24h delivery in Cancún", "A/C"],
    featuresEs: ["Seguro incluido", "Kilometraje libre", "Entrega 24h en Cancún", "A/C"],
    sortOrder: 3,
  },
];

export const getYaabCarBySlug = (slug: string): YaabCar | undefined =>
  yaabCarsSeed.find((car) => car.slug === slug);

// Map a rental_cars DB row (snake_case) to the UI shape.
export function mapRentalCarRow(row: Record<string, unknown>): YaabCar {
  const seed = getYaabCarBySlug(String(row.slug));
  return {
    id: String(row.id),
    slug: String(row.slug),
    name: String(row.name),
    trim: String(row.trim || ""),
    brand: String(row.brand),
    year: Number(row.year),
    passengers: Number(row.passengers),
    transmission: String(row.transmission || "Automática"),
    doors: Number(row.doors || 5),
    airConditioning: Boolean(row.air_conditioning),
    pricePerDayMxn: Number(row.price_per_day_mxn),
    depositMxn: row.deposit_mxn != null ? Number(row.deposit_mxn) : null,
    minDays: Number(row.min_days || 3),
    unitsAvailable: Number(row.units_available || 1),
    imageUrl: String(row.image_url),
    galleryUrls: (row.gallery_urls as string[]) || [],
    description: String(row.description_en || seed?.description || ""),
    descriptionEs: String(row.description_es || seed?.descriptionEs || ""),
    features: seed?.features || [],
    featuresEs: (row.features as string[]) || seed?.featuresEs || [],
    sortOrder: Number(row.sort_order || 0),
  };
}

// Pickup / return locations (Cancún only, per YAAB terms)
export const pickupLocations = {
  en: [
    "Cancún International Airport",
    "Hotel in Cancún",
    "Hotel Zone",
    "YAAB office — Cancún–Tulum Highway 786",
    "Another point in Cancún (to coordinate)",
  ],
  es: [
    "Aeropuerto Internacional de Cancún",
    "Hotel en Cancún",
    "Zona Hotelera",
    "Oficina YAAB — Carretera Cancún–Tulum 786",
    "Otro punto en Cancún (a coordinar)",
  ],
};

export const pickupTimes = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
];
