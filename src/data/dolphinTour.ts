// Dolphin Tour data — prices derived from toursPricing.ts (single source of truth)
import { getVariantPricing } from "./toursPricing";
import { media } from "@/lib/media";

export interface DolphinTourVariant {
  id: string;
  name: string;
  title: string;
  priceFromUsd: number;
  reviewsCount: number;
  rating: number;
  location: string;
  duration: string;
  languages: string;
  recommendedFor: string;
  transportation: string;
  included: string[];
  notIncluded: string[];
}

export interface DolphinTourData {
  slug: string;
  title: string;
  cardImage: string;
  galleryImages: string[];
  variants: DolphinTourVariant[];
}

export const dolphinTour: DolphinTourData = {
  slug: "dolphin-swim-experience",
  title: "Dolphin Swim Experience",
  cardImage: media("/tour-images/dolphin-tulum-5.jpg"),
  galleryImages: [
    media("/tour-images/dolphin-tulum-5.jpg"),
    media("/tour-images/dolphin-tulum-1.jpg"),
    media("/tour-images/dolphin-tulum-2.jpg"),
    media("/tour-images/dolphin-tulum-4.jpg"),
    media("/tour-images/dolphin-tulum-6.jpg"),
  ],
  variants: [
    {
      id: "tulum-akumal",
      name: "Tulum – Akumal",
      title: "Dolphin Swim Experience in Tulum–Akumal",
      get priceFromUsd() { return getVariantPricing("dolphin-swim-experience", "tulum-akumal")?.adultPrice ?? 100; },
      reviewsCount: 147,
      rating: 4.3,
      location: "3 Highway, Carr. Cancún – Tulum km 256, 77710 Akumal, Q.R.",
      duration: "2 hours (approx.)",
      languages: "English & Spanish",
      recommendedFor: "Families, Groups & Special Events",
      transportation: "Transportation with additional cost",
      included: [
        "Free Wi-Fi",
        "Showers",
        "Lockers",
      ],
      notIncluded: [
        "Ground transportation (available with additional cost)",
        "ISEPAAA Fee (Tax on Expenditures for Participating in Activities with Aquatic Animals): $50 MXN per person",
        "Photo package",
        "Gratuities",
        "Souvenirs",
      ],
    },
    {
      id: "playa-del-carmen-maroma",
      name: "Playa del Carmen – Maroma",
      title: "Dolphin Swim Experience Playa del Carmen – Maroma",
      get priceFromUsd() { return getVariantPricing("dolphin-swim-experience", "playa-del-carmen-maroma")?.adultPrice ?? 100; },
      reviewsCount: 354,
      rating: 4.2,
      location: "Carr. Cancún – Tulum KM 55.3, PCN Colonia Centro, 77710 Playa del Carmen, Q.R.",
      duration: "4 hours (approx.)",
      languages: "English & Spanish",
      recommendedFor: "Families, Groups & Special Events",
      transportation: "Transportation with additional cost",
      included: [
        "Beach Club",
        "Free Wi-Fi",
        "Showers",
        "Lockers",
      ],
      notIncluded: [
        "Ground transportation (available with additional cost)",
        "ISEPAAA Fee (Tax on Expenditures for Participating in Activities with Aquatic Animals): $50 MXN per person",
        "Photo package",
        "Gratuities",
        "Souvenirs",
      ],
    },
  ],
};

// Helper function to get minimum price from variants
export function getMinPrice(): number {
  return Math.min(...dolphinTour.variants.map((v) => v.priceFromUsd));
}

// Helper function to get total reviews (use the highest count for the card)
export function getTotalReviews(): number {
  return Math.max(...dolphinTour.variants.map((v) => v.reviewsCount));
}

// Helper function to get best rating for the card
export function getBestRating(): number {
  return Math.max(...dolphinTour.variants.map((v) => v.rating));
}

// Get variant by id
export function getVariantById(id: string): DolphinTourVariant | undefined {
  return dolphinTour.variants.find((v) => v.id === id);
}
