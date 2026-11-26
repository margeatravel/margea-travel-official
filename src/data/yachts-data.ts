import { media } from "@/lib/media";

// Real Cancún Charter fleet for Margea Travel (public rates, MXN, valid from 1 Dec 2026).
// Prices are the PUBLIC rates; they exclude 16% IVA. Pier tax ($150 MXN/person),
// extra passengers ($1,000 MXN each) and the special-date surcharge (+$2,000 MXN
// on 24 Dec, 31 Dec and 1 Jan) are shown as notes on the listing/detail pages.
// Photos live in Supabase Storage bucket "site-images" under yachts/<slug>/.
// Aria has no photo yet (placeholder image) and no short description from the
// provider — update it once Cancún Charter sends the photo.

export interface YachtPricing {
  hours: number;
  price: string; // formatted public price, e.g. "14,000"
  note?: { en: string; es: string };
}

export interface YachtContent {
  name: string;
  description: string;
  features?: string[];
}

export interface Yacht {
  id: string;
  name: string;
  model: string;
  marina: string;
  size: string;
  capacity: number; // passengers included in the rate
  maxCapacity: number; // absolute maximum (extra passengers at $1,000 MXN each)
  image: string;
  images?: string[];
  description: string;
  pricing: YachtPricing[];
  currency: "MXN" | "USD";
  features?: string[];
}

// Routes per duration, from the Cancún Charter B2B proposal (p. 9).
const routeNotes: Record<number, { en: string; es: string }> = {
  4: {
    en: "Cruise to Isla Mujeres with time at Playa Norte.",
    es: "Navegación hacia Isla Mujeres con tiempo en Playa Norte.",
  },
  6: {
    en: "Snorkel at the sunken ship, Playa Norte and Punta Sur tour.",
    es: "Snorkel en el barco hundido, Playa Norte y recorrido por Punta Sur.",
  },
  8: {
    en: "Full experience around Isla Mujeres, Punta Sur, Playa Norte and restaurant option.",
    es: "Experiencia completa alrededor de Isla Mujeres, Punta Sur, Playa Norte y opción de restaurante.",
  },
};

// On-board courtesies, from the Cancún Charter B2B proposal (p. 9).
const includedFeatures = {
  en: [
    "Water, soft drinks and ice included",
    "Professional crew",
    "Bring your own food and drinks (no red wine)",
  ],
  es: [
    "Agua, refrescos y hielo incluidos",
    "Tripulación profesional",
    "Puedes llevar alimentos y bebidas (sin vino tinto)",
  ],
};

export const yachtContent: Record<string, { en: YachtContent; es: YachtContent }> = {
  agavero: {
    en: {
      name: "Agavero",
      description:
        "46 ft Sunseeker with excellent value for the experience. Rate for up to 15 passengers, maximum 17.",
      features: includedFeatures.en,
    },
    es: {
      name: "Agavero",
      description:
        "Sunseeker de 46 pies con excelente relación valor-experiencia. Tarifa para hasta 15 pasajeros, con máximo de 17.",
      features: includedFeatures.es,
    },
  },
  jackie: {
    en: {
      name: "Jackie",
      description:
        "48 ft Sea Ray Flybridge with a spacious flybridge and large capacity. Rate for up to 15 passengers, maximum 20.",
      features: includedFeatures.en,
    },
    es: {
      name: "Jackie",
      description:
        "Sea Ray Flybridge de 48 pies con flybridge amplio y gran capacidad. Tarifa para hasta 15 pasajeros, con máximo de 20.",
      features: includedFeatures.es,
    },
  },
  nash: {
    en: {
      name: "Nash",
      description:
        "52 ft Fairline with a sporty style and open spaces. Rate for up to 15 passengers, maximum 20.",
      features: includedFeatures.en,
    },
    es: {
      name: "Nash",
      description:
        "Fairline de 52 pies, estilo deportivo y espacios abiertos. Tarifa para hasta 15 pasajeros, con máximo de 20.",
      features: includedFeatures.es,
    },
  },
  aria: {
    en: {
      name: "Aria",
      description:
        "50 ft Trojan in Cancún. Rate for up to 15 passengers, maximum 20.",
      features: includedFeatures.en,
    },
    es: {
      name: "Aria",
      description:
        "Trojan de 50 pies en Cancún. Tarifa para hasta 15 pasajeros, con máximo de 20.",
      features: includedFeatures.es,
    },
  },
  "sin-nombre": {
    en: {
      name: "Sin Nombre",
      description:
        "55 ft Sea Ray, ideal for groups and celebrations. Rate for up to 18 passengers, maximum 23.",
      features: includedFeatures.en,
    },
    es: {
      name: "Sin Nombre",
      description:
        "Sea Ray de 55 pies, ideal para grupos y celebraciones. Tarifa para hasta 18 pasajeros, con máximo de 23.",
      features: includedFeatures.es,
    },
  },
  diva: {
    en: {
      name: "Diva",
      description:
        "60 ft Cranchi, our premium, largest option. Rate for up to 18 passengers, maximum 23.",
      features: includedFeatures.en,
    },
    es: {
      name: "Diva",
      description:
        "Cranchi de 60 pies, nuestra opción premium de mayor tamaño. Tarifa para hasta 18 pasajeros, con máximo de 23.",
      features: includedFeatures.es,
    },
  },
};

export const getYachtContent = (yachtId: string, language: "en" | "es"): YachtContent => {
  return yachtContent[yachtId]?.[language] || yachtContent[yachtId]?.es;
};

export const yachts: Yacht[] = [
  {
    id: "agavero",
    name: "Agavero",
    model: "Sunseeker",
    marina: "Cancún",
    size: "46 ft",
    capacity: 15,
    maxCapacity: 17,
    image: media("/yachts/agavero/agavero-principal.jpg"),
    images: [media("/yachts/agavero/agavero-principal.jpg")],
    description:
      "Sunseeker de 46 pies con excelente relación valor-experiencia. Tarifa para hasta 15 pasajeros, con máximo de 17.",
    pricing: [
      { hours: 4, price: "14,000", note: routeNotes[4] },
      { hours: 6, price: "16,000", note: routeNotes[6] },
      { hours: 8, price: "17,000", note: routeNotes[8] },
    ],
    currency: "MXN",
    features: includedFeatures.es,
  },
  {
    id: "jackie",
    name: "Jackie",
    model: "Sea Ray Flybridge",
    marina: "Cancún",
    size: "48 ft",
    capacity: 15,
    maxCapacity: 20,
    image: media("/yachts/jackie/jackie-principal.jpg"),
    images: [media("/yachts/jackie/jackie-principal.jpg")],
    description:
      "Sea Ray Flybridge de 48 pies con flybridge amplio y gran capacidad. Tarifa para hasta 15 pasajeros, con máximo de 20.",
    pricing: [
      { hours: 4, price: "14,500", note: routeNotes[4] },
      { hours: 6, price: "16,500", note: routeNotes[6] },
      { hours: 8, price: "17,500", note: routeNotes[8] },
    ],
    currency: "MXN",
    features: includedFeatures.es,
  },
  {
    id: "nash",
    name: "Nash",
    model: "Fairline",
    marina: "Cancún",
    size: "52 ft",
    capacity: 15,
    maxCapacity: 20,
    image: media("/yachts/nash/nash-principal.jpg"),
    images: [media("/yachts/nash/nash-principal.jpg")],
    description:
      "Fairline de 52 pies, estilo deportivo y espacios abiertos. Tarifa para hasta 15 pasajeros, con máximo de 20.",
    pricing: [
      { hours: 4, price: "14,000", note: routeNotes[4] },
      { hours: 6, price: "16,000", note: routeNotes[6] },
      { hours: 8, price: "17,000", note: routeNotes[8] },
    ],
    currency: "MXN",
    features: includedFeatures.es,
  },
  {
    id: "aria",
    name: "Aria",
    model: "Trojan",
    marina: "Cancún",
    size: "50 ft",
    capacity: 15,
    maxCapacity: 20,
    // TODO: replace with the real Aria photo once Cancún Charter sends it.
    image: media("/yacht-images/yacht-hero.jpg"),
    images: [media("/yacht-images/yacht-hero.jpg")],
    description:
      "Trojan de 50 pies en Cancún. Tarifa para hasta 15 pasajeros, con máximo de 20.",
    pricing: [
      { hours: 4, price: "14,000", note: routeNotes[4] },
      { hours: 6, price: "16,000", note: routeNotes[6] },
      { hours: 8, price: "17,000", note: routeNotes[8] },
    ],
    currency: "MXN",
    features: includedFeatures.es,
  },
  {
    id: "sin-nombre",
    name: "Sin Nombre",
    model: "Sea Ray",
    marina: "Cancún",
    size: "55 ft",
    capacity: 18,
    maxCapacity: 23,
    image: media("/yachts/sin-nombre/sin-nombre-principal.jpg"),
    images: [media("/yachts/sin-nombre/sin-nombre-principal.jpg")],
    description:
      "Sea Ray de 55 pies, ideal para grupos y celebraciones. Tarifa para hasta 18 pasajeros, con máximo de 23.",
    pricing: [
      { hours: 4, price: "16,000", note: routeNotes[4] },
      { hours: 6, price: "18,000", note: routeNotes[6] },
      { hours: 8, price: "19,000", note: routeNotes[8] },
    ],
    currency: "MXN",
    features: includedFeatures.es,
  },
  {
    id: "diva",
    name: "Diva",
    model: "Cranchi",
    marina: "Cancún",
    size: "60 ft",
    capacity: 18,
    maxCapacity: 23,
    image: media("/yachts/diva/diva-principal.jpg"),
    images: [media("/yachts/diva/diva-principal.jpg")],
    description:
      "Cranchi de 60 pies, nuestra opción premium de mayor tamaño. Tarifa para hasta 18 pasajeros, con máximo de 23.",
    pricing: [
      { hours: 4, price: "16,900", note: routeNotes[4] },
      { hours: 6, price: "18,900", note: routeNotes[6] },
      { hours: 8, price: "19,900", note: routeNotes[8] },
    ],
    currency: "MXN",
    features: includedFeatures.es,
  },
];
