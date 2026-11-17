// Akumal Tour data — prices derived from toursPricing.ts (single source of truth)
import { getFromPrice } from "./toursPricing";

export interface AkumalTourData {
  slug: string;
  title: string;
  rating: number;
  reviewsCount: number;
  duration: string;
  languages: string;
  transportation: string;
  location: string;
  recommendedFor: string[];
  priceFromUsd: number;
  included: string[];
  notIncluded: string[];
}

export const akumalTour: AkumalTourData = {
  slug: "akumal-sea-turtle",
  title: "Akumal Reef, Sea Turtle Sanctuary Swim",
  rating: 4.3,
  reviewsCount: 2026,
  duration: "4 hours (approx.)",
  languages: "English & Spanish",
  transportation: "Transportation Included (Cancun & Puerto Morelos)",
  location: "Tulum, Quintana Roo",
  recommendedFor: ["Families", "Groups & Special Events", "Adventurers"],
  get priceFromUsd() { return getFromPrice("akumal-sea-turtle"); },
  included: [
    "Use of Snorkelling equipment",
    "Round trip transportation from most hotels in Cancun and Puerto Morelos",
    "2 water bottles per person",
  ],
  notIncluded: [
    "Eco-tax 20 USD per person (payment in cash only)",
    "Drinks during the meal",
  ],
};

// Helper to get price (for consistency with other tour data files)
export function getAkumalPrice(): number {
  return akumalTour.priceFromUsd;
}
