import type { CartItem } from "@/contexts/CartContext";

/**
 * Cart-level promo codes.
 * Each code declares a fixed USD discount plus an eligibility rule evaluated
 * against the current cart. The server (create-cart-checkout) re-validates the
 * same rules, so the client value here is display-only.
 */
export interface CartPromoCode {
  code: string;
  discountUsd: number;
  /** Short label shown next to the discount line in the totals block. */
  label: { en: string; es: string };
  /** Reason shown when the cart does not qualify. */
  requirement: { en: string; es: string };
  qualifies: (items: CartItem[]) => boolean;
  active: boolean;
}

export const WHALE_SHARK_TOUR_ID = "whale-shark-snorkeling";

/** Total participants (adults + children) booked for a given tour id. */
export function countParticipantsForTour(items: CartItem[], tourId: string): number {
  return items
    .filter((i) => i.tourId === tourId)
    .reduce((sum, i) => sum + (i.adults || 0) + (i.children || 0), 0);
}

export const CART_PROMO_CODES: CartPromoCode[] = [
  {
    code: "WHALE40",
    discountUsd: 40,
    label: {
      en: "Whale Shark group discount",
      es: "Descuento de grupo Whale Shark",
    },
    requirement: {
      en: "This code requires 3 or more Whale Shark Snorkeling spots in your cart.",
      es: "Este código requiere 3 o más lugares de Whale Shark Snorkeling en tu carrito.",
    },
    qualifies: (items) => countParticipantsForTour(items, WHALE_SHARK_TOUR_ID) >= 3,
    active: true,
  },
];

export type CartPromoResult =
  | { status: "valid"; promo: CartPromoCode; discountUsd: number }
  | { status: "unknown" }
  | { status: "not-eligible"; promo: CartPromoCode };

export function validateCartPromo(
  inputCode: string,
  items: CartItem[]
): CartPromoResult {
  const normalized = inputCode.trim().toUpperCase();
  const promo = CART_PROMO_CODES.find(
    (p) => p.active && p.code.toUpperCase() === normalized
  );

  if (!promo) return { status: "unknown" };
  if (!promo.qualifies(items)) return { status: "not-eligible", promo };

  const subtotal = items.reduce(
    (sum, i) => sum + i.adults * i.adultPrice + i.children * (i.childPrice || 0),
    0
  );

  return {
    status: "valid",
    promo,
    discountUsd: Math.min(promo.discountUsd, subtotal),
  };
}
