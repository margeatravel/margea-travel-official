// Member Codes Configuration
// Maps user-facing codes to Stripe Promotion Codes
// UPDATE: Replace stripePromotionCodeId with your actual Stripe Promotion Code ID

export interface MemberCode {
  code: string; // Case-insensitive user input
  stripePromotionCodeId: string; // Stripe Promotion Code ID (starts with "promo_")
  discountType: "fixed" | "percentage"; // Type of discount
  discountAmountMxn?: number; // Fixed discount amount in MXN (for fixed type)
  discountPercent?: number; // Percentage discount (for percentage type, e.g., 95 for 95%)
  description?: string;
  active: boolean;
  expiresAt?: Date; // Optional expiration date
  maxRedemptions?: number; // Max times this code can be used (tracked in DB)
}

// ============================================================
// CONFIGURATION: Update stripePromotionCodeId with your Stripe IDs
// You can find these in Stripe Dashboard > Products > Coupons > Promotion Codes
// ============================================================
export const MEMBER_CODES: MemberCode[] = [
  {
    code: "MARGEAJOE",
    // TODO: Replace with your actual Stripe Promotion Code ID from Stripe Dashboard
    // Go to: Stripe Dashboard > Products > Coupons > Create a coupon > Add promotion code
    // The promotion code ID looks like: promo_1QxYz...
    stripePromotionCodeId: "REPLACE_WITH_STRIPE_PROMO_CODE_ID",
    discountType: "fixed",
    discountAmountMxn: 2266, // MX$2,266 off
    description: "Margea Joe - MX$2,266 discount",
    active: true,
    maxRedemptions: 1, // Only usable once
  },
  {
    code: "MARGEA95TEST",
    // ============================================================
    // PASTE YOUR STRIPE PROMOTION CODE ID HERE:
    // Go to Stripe Dashboard > Products > Coupons
    // Create a coupon with 95% off, then add a promotion code
    // Copy the promotion code ID (starts with "promo_")
    // ============================================================
    stripePromotionCodeId: "REPLACE_WITH_STRIPE_PROMO_CODE_ID_FOR_95_TEST",
    discountType: "percentage",
    discountPercent: 95, // 95% off for testing
    description: "Margea 95% Test - Testing only",
    active: true,
  },
  // Add more codes as needed:
  // {
  //   code: "SUMMER2024",
  //   stripePromotionCodeId: "promo_xxx",
  //   discountType: "fixed",
  //   discountAmountMxn: 1000,
  //   description: "Summer promotion",
  //   active: true,
  // },
];

/**
 * Validates a member code and returns the code config if valid
 */
export function validateMemberCode(inputCode: string): MemberCode | null {
  const normalizedInput = inputCode.trim().toUpperCase();
  
  const code = MEMBER_CODES.find(
    (mc) => mc.code.toUpperCase() === normalizedInput
  );
  
  if (!code) return null;
  
  // Check if code is active
  if (!code.active) return null;
  
  // Check expiration
  if (code.expiresAt && new Date() > code.expiresAt) return null;
  
  return code;
}

/**
 * Calculate discount amount based on code type (fixed or percentage)
 */
export function calculateDiscount(
  subtotal: number,
  memberCode: MemberCode
): number {
  if (memberCode.discountType === "percentage" && memberCode.discountPercent) {
    // Calculate percentage discount
    const discount = Math.round(subtotal * (memberCode.discountPercent / 100));
    return Math.min(discount, subtotal); // Don't exceed subtotal
  }
  
  // Fixed amount discount
  if (memberCode.discountAmountMxn) {
    return Math.min(memberCode.discountAmountMxn, subtotal);
  }
  
  return 0;
}
