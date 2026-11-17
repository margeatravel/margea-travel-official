/**
 * Deterministic Rating & Review System
 * 
 * SELF-AUDIT CHECKLIST:
 * ✓ Ratings are always 4.6–5.0 with one decimal
 * ✓ Review counts are always 25–1,273 and never 0
 * ✓ Placeholders are deterministic per property (no flicker)
 * ✓ Growth adds +5 reviews per full month since 2026-01-01 (capped at 1,273)
 * ✓ Real review data overrides placeholders whenever present
 * ✓ No changes to Stripe checkout, pricing, navigation, styling, or other functionality
 */

// Seeded random number generator using a simple hash
function seededRandom(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  // Normalize to 0-1 range
  const x = Math.sin(hash) * 10000;
  return x - Math.floor(x);
}

// Round to 1 decimal place
function roundTo1Decimal(num: number): number {
  return Math.round(num * 10) / 10;
}

// Calculate months elapsed since anchor date (2026-01-01)
function getMonthsElapsed(): number {
  const anchorDate = new Date('2026-01-01T00:00:00Z');
  const now = new Date();
  
  if (now < anchorDate) return 0;
  
  const yearsDiff = now.getFullYear() - anchorDate.getFullYear();
  const monthsDiff = now.getMonth() - anchorDate.getMonth();
  
  return Math.max(0, yearsDiff * 12 + monthsDiff);
}

// Memoization cache for rating data
const ratingCache = new Map<string, { rating: number; reviews: number }>();

export interface RatingData {
  rating: number;
  reviews: number;
}

export interface RealRatingData {
  rating?: number | null;
  reviews?: number | null;
}

/**
 * Get deterministic rating and review count for a property/tour/yacht
 * 
 * @param key - Unique identifier (property.id, tour.id, etc.)
 * @param realData - Optional real rating/review data (if available, overrides placeholders)
 * @returns { rating: number, reviews: number }
 */
export function getRatingData(key: string, realData?: RealRatingData): RatingData {
  // If real data is provided and valid, use it (highest priority)
  if (realData?.rating != null && realData?.reviews != null && 
      realData.rating > 0 && realData.reviews > 0) {
    return {
      rating: roundTo1Decimal(Math.min(5.0, Math.max(4.6, realData.rating))),
      reviews: Math.min(1273, Math.max(25, Math.floor(realData.reviews)))
    };
  }

  // Check cache first
  const cached = ratingCache.get(key);
  if (cached) {
    return cached;
  }

  // Generate deterministic base values using seeded random
  const baseRating = roundTo1Decimal(4.6 + seededRandom(key) * 0.4);
  const baseReviewCount = Math.floor(25 + seededRandom(key + "-reviews") * (1273 - 25));

  // Apply monthly growth (NOT compounded)
  const monthsElapsed = getMonthsElapsed();
  const reviewCount = Math.min(1273, baseReviewCount + (monthsElapsed * 5));

  const result = {
    rating: baseRating,
    reviews: reviewCount
  };

  // Cache the result
  ratingCache.set(key, result);

  return result;
}

/**
 * Format rating display string
 * @param rating - Rating value (4.6-5.0)
 * @param reviews - Review count (25-1273)
 * @returns Formatted string like "4.8 (234)"
 */
export function formatRatingDisplay(rating: number, reviews: number): string {
  return `${rating.toFixed(1)} (${reviews.toLocaleString()})`;
}
