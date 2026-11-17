// Chichen Itza Tour data — prices derived from toursPricing.ts (single source of truth)
import { getVariantPricing } from "./toursPricing";

export interface ChichenItzaVariant {
  id: string;
  name: string;
  priceFromUsd: number;
  reviewsCount: number;
  included: string[];
  notIncluded: string[];
}

export interface ChichenItzaTourData {
  slug: string;
  title: string;
  rating: number;
  duration: string;
  languages: string;
  transportation: string;
  minAge: string;
  schedules: string[];
  variants: ChichenItzaVariant[];
}

export const chichenItzaTour: ChichenItzaTourData = {
  slug: "chichen-itza",
  title: "Chichen Itza Tour",
  rating: 4.5,
  duration: "12 hours (approx.)",
  languages: "English & Spanish",
  transportation: "Round trip transportation shared",
  minAge: "5+",
  schedules: ["06:00", "07:00"],
  variants: [
    {
      id: "classic",
      name: "Chichen Itza Tour Classic",
      get priceFromUsd() { return getVariantPricing("chichen-itza", "classic")?.adultPrice ?? 80; },
      reviewsCount: 1079,
      included: [
        "Shared transportation pickup from your hotel",
        "Round-trip journey aboard panoramic luxury buses with air conditioning",
        "Certified guides specialized in archaeology and Mayan culture",
        "Guided (bilingual) access to Chichen Itza and free time to explore",
      ],
      notIncluded: [
        "Life jacket and locker rental (extra cost approx. 2 USD each)",
        "Drinks at the restaurant",
        "Drinks on board the vehicle",
        "Fee for using a GoPro/video/professional camera (charged by the park at Chichen Itza)",
        "Box lunch",
      ],
    },
    {
      id: "mexico-plus",
      name: "Chichen Itza Mexico Plus",
      get priceFromUsd() { return getVariantPricing("chichen-itza", "mexico-plus")?.adultPrice ?? 90; },
      reviewsCount: 4876,
      included: [
        "Shared transportation pickup from your hotel",
        "Round-trip journey aboard panoramic luxury buses with air conditioning",
        "Drinks on board the bus (bottled purified water, bottled Peñafiel flavored sodas)",
        "Certified guides specialized in archaeology and Mayan culture",
        "One bottle of purified water upon entering the archaeological site",
        "Guided (bilingual) access to Chichen Itza and free time to explore",
        "Visit to the \"Saamal\" Cenote — swimming is allowed (life jacket rental fee charged by the location, approx. 2 USD)",
        "Brief visit to Valladolid, Yucatán",
      ],
      notIncluded: [
        "Life jacket and locker rental (extra cost approx. 2 USD each)",
        "Fee for using a GoPro/video/professional camera (charged by the park at Chichen Itza)",
        "Drinks at the restaurant",
        "Box lunch",
      ],
    },
    {
      id: "deluxe",
      name: "Chichen Itza Deluxe Tour with Cenote & Valladolid",
      get priceFromUsd() { return getVariantPricing("chichen-itza", "deluxe")?.adultPrice ?? 110; },
      reviewsCount: 4028,
      included: [
        "Shared transportation pickup from your hotel",
        "Round-trip journey aboard panoramic luxury buses with air conditioning",
        "Morning box lunch served on board the bus",
        "Drinks on board the bus (bottled purified water, bottled Peñafiel flavored sodas, bottled beer)",
        "Certified guides specialized in archaeology and Mayan culture",
        "2 alcoholic beverages included with a delicious buffet featuring a wide variety of traditional regional dishes",
        "One bottle of purified water upon entering the archaeological site",
        "Guided (bilingual) access to Chichen Itza and free time to explore",
        "Visit to the \"Saamal\" Cenote — swimming is allowed (life jacket rental fee charged by the location, approx. 2 USD)",
        "Brief visit to Valladolid, Yucatán",
      ],
      notIncluded: [
        "Life jacket and locker rental (extra cost approx. 2 USD each)",
        "Fee for using a GoPro/video/professional camera (charged by the park at Chichen Itza)",
      ],
    },
  ],
};

// Helper function to get minimum price from variants
export function getMinPrice(): number {
  return Math.min(...chichenItzaTour.variants.map((v) => v.priceFromUsd));
}

// Helper function to get total reviews (use the highest count for the card)
export function getTotalReviews(): number {
  return Math.max(...chichenItzaTour.variants.map((v) => v.reviewsCount));
}

// Get variant by id
export function getVariantById(id: string): ChichenItzaVariant | undefined {
  return chichenItzaTour.variants.find((v) => v.id === id);
}
