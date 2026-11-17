// Centralized tours pricing configuration for Stripe checkout
// Used by the create-tour-checkout edge function

export interface TourVariantPricing {
  id: string;
  title: string;
  adultPrice: number;
  childPrice: number | null; // null if no child pricing available
}

export interface TourPricing {
  id: string;
  title: string;
  currency: "USD" | "MXN";
  variants: TourVariantPricing[];
  timeSlots: string[];
  bokunExperienceId?: string; // Bokun experience ID for real-time availability
  /** Months (1-12) in which this tour operates. Omit for year-round tours. */
  seasonMonths?: number[];
  /** Message shown when a date outside the season is picked */
  seasonNote?: string;
}

// Standardized time slots for all tours
export const STANDARD_TIME_SLOTS = ["10:00 AM", "1:00 PM"];

// Master pricing config - single source of truth for checkout
export const toursPricing: TourPricing[] = [
  {
    id: "chichen-itza",
    title: "Chichen Itza Tour",
    currency: "USD",
    variants: [
      { id: "classic", title: "Classic", adultPrice: 102, childPrice: 62.93 },
      { id: "mexico-plus", title: "Mexico Plus", adultPrice: 117, childPrice: 80.19 },
      { id: "deluxe", title: "Deluxe with Cenote & Valladolid", adultPrice: 133, childPrice: 91.35 },
    ],
    timeSlots: STANDARD_TIME_SLOTS,
  },
  {
    id: "akumal-sea-turtle",
    title: "Akumal Reef, Sea Turtle Sanctuary Swim",
    currency: "USD",
    variants: [
      { id: "standard", title: "Standard", adultPrice: 99, childPrice: 79 },
    ],
    timeSlots: STANDARD_TIME_SLOTS,
  },
  {
    id: "dolphin-swim-experience",
    title: "Dolphin Swim Experience",
    currency: "USD",
    variants: [
      { id: "tulum-akumal", title: "Tulum – Akumal", adultPrice: 100, childPrice: 80 },
      { id: "playa-del-carmen-maroma", title: "Playa del Carmen – Maroma", adultPrice: 100, childPrice: 80 },
    ],
    timeSlots: STANDARD_TIME_SLOTS,
  },
  {
    id: "isla-mujeres",
    title: "Isla Mujeres Day Tour, Catamaran, Snorkeling & Beach Club",
    currency: "USD",
    variants: [
      { id: "standard", title: "Standard", adultPrice: 89, childPrice: 69 },
      { id: "premium", title: "Premium Ride (Dock fee included)", adultPrice: 109, childPrice: 85 },
    ],
    timeSlots: STANDARD_TIME_SLOTS,
  },
  {
    id: "extreme-adventuring",
    title: "Extreme Adventuring",
    currency: "USD",
    variants: [
      { id: "shared", title: "Shared ATV", adultPrice: 90, childPrice: 70 },
      { id: "individual", title: "Individual ATV", adultPrice: 110, childPrice: null },
    ],
    timeSlots: STANDARD_TIME_SLOTS,
  },
  {
    id: "extreme-horseback-riding",
    title: "Extreme Horseback Riding",
    currency: "USD",
    variants: [
      { id: "shared", title: "Shared ATV", adultPrice: 130, childPrice: 100 },
      { id: "individual", title: "Individual ATV", adultPrice: 151, childPrice: null },
    ],
    timeSlots: STANDARD_TIME_SLOTS,
  },
  {
    id: "cenote-adventuring",
    title: "Cenote Adventuring",
    currency: "USD",
    variants: [
      { id: "standard", title: "Standard", adultPrice: 80, childPrice: 60 },
    ],
    timeSlots: STANDARD_TIME_SLOTS,
  },
  {
    id: "snorkeling-adventure",
    title: "Snorkeling Adventure",
    currency: "USD",
    variants: [
      { id: "standard", title: "Standard", adultPrice: 70, childPrice: 55 },
    ],
    timeSlots: STANDARD_TIME_SLOTS,
  },
  {
    id: "private-snorkeling",
    title: "Private Snorkeling",
    currency: "USD",
    variants: [
      { id: "standard", title: "Standard (Min 6 people)", adultPrice: 116, childPrice: 90 },
    ],
    timeSlots: STANDARD_TIME_SLOTS,
  },
  {
    id: "city-taco-tour",
    title: "Beach Taco Tour",
    currency: "USD",
    variants: [
      { id: "standard", title: "Standard", adultPrice: 36, childPrice: 28 },
    ],
    timeSlots: STANDARD_TIME_SLOTS,
  },
  {
    id: "wave-runner",
    title: "Puerto Maya Wave Runner",
    currency: "USD",
    variants: [
      { id: "double-30min", title: "Double – 30 min", adultPrice: 83, childPrice: null },
      { id: "double-1hour", title: "Double – 1 hour", adultPrice: 130, childPrice: null },
    ],
    timeSlots: ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"],
  },
  {
    id: "mayan-jungle-tour",
    title: "Mayan Jungle Tour",
    currency: "USD",
    variants: [
      { id: "standard", title: "Standard", adultPrice: 69, childPrice: 49 },
    ],
    timeSlots: ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM"],
  },
  {
    id: "whale-shark-snorkeling",
    title: "Whale Shark Snorkeling Adventure",
    currency: "USD",
    variants: [
      { id: "standard", title: "Standard", adultPrice: 201, childPrice: 201 },
    ],
    timeSlots: ["7:00 AM"],
    seasonMonths: [5, 6, 7, 8, 9],
    seasonNote: "Seasonal tour — available May through September only.",
  },
  // Packages
  {
    id: "extreme-snorkeling-package",
    title: "Extreme Adventuring + Snorkeling Adventure Package",
    currency: "USD",
    variants: [
      { id: "shared", title: "Shared ATV", adultPrice: 136, childPrice: 100 },
      { id: "individual", title: "Individual ATV", adultPrice: 156, childPrice: null },
    ],
    timeSlots: STANDARD_TIME_SLOTS,
  },
  {
    id: "full-experience-two-days",
    title: "Full Experience Adventure Two Days ATV Package",
    currency: "USD",
    variants: [
      { id: "shared", title: "Shared ATV", adultPrice: 196, childPrice: 150 },
      { id: "individual", title: "Individual ATV", adultPrice: 226, childPrice: null },
    ],
    timeSlots: STANDARD_TIME_SLOTS,
  },
  {
    id: "snorkeling-cenote-package",
    title: "Snorkeling Adventure with Cenote Adventure Package",
    currency: "USD",
    variants: [
      { id: "standard", title: "Standard", adultPrice: 120, childPrice: 90 },
    ],
    timeSlots: STANDARD_TIME_SLOTS,
  },
];

// Helper to find tour pricing by ID
export function getTourPricing(tourId: string): TourPricing | undefined {
  return toursPricing.find((t) => t.id === tourId);
}

// Helper to find variant pricing
export function getVariantPricing(tourId: string, variantId: string): TourVariantPricing | undefined {
  const tour = getTourPricing(tourId);
  return tour?.variants.find((v) => v.id === variantId);
}

// Get the lowest adult price for a tour (used by listing cards "From $X")
export function getFromPrice(tourId: string): number {
  const tour = getTourPricing(tourId);
  if (!tour || tour.variants.length === 0) return 0;
  return Math.min(...tour.variants.map((v) => v.adultPrice));
}

// Get shared/individual pricing structure for cards with dual pricing
export function getCardPricing(tourId: string): {
  shared?: { currentPrice: number };
  individual?: { currentPrice: number };
  currentPrice?: number;
} {
  const tour = getTourPricing(tourId);
  if (!tour) return { currentPrice: 0 };
  
  if (tour.variants.length === 2) {
    const sorted = [...tour.variants].sort((a, b) => a.adultPrice - b.adultPrice);
    // Check if variants represent shared/individual pattern
    const lowerId = sorted[0].id.toLowerCase();
    const upperId = sorted[1].id.toLowerCase();
    if (
      (lowerId.includes("shared") && upperId.includes("individual")) ||
      (lowerId.includes("double") && upperId.includes("single"))
    ) {
      return {
        shared: { currentPrice: sorted[0].adultPrice },
        individual: { currentPrice: sorted[1].adultPrice },
      };
    }
  }
  
  return { currentPrice: getFromPrice(tourId) };
}

// Calculate total price
export function calculateTotalPrice(
  tourId: string,
  variantId: string,
  adults: number,
  children: number
): { total: number; currency: string } | null {
  const tour = getTourPricing(tourId);
  const variant = getVariantPricing(tourId, variantId);
  
  if (!tour || !variant) {
    console.warn(`[PRICING WARNING] Missing pricing for tour: ${tourId}, variant: ${variantId}`);
    return null;
  }
  
  const adultTotal = adults * variant.adultPrice;
  const childTotal = children * (variant.childPrice || 0);
  
  return {
    total: adultTotal + childTotal,
    currency: tour.currency,
  };
}
