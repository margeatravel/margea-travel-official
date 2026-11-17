import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface CartItem {
  tourId: string;
  tourTitle: string;
  variantId: string;
  variantTitle: string;
  date: string;
  time: string;
  adults: number;
  children: number;
  adultPrice: number;
  childPrice: number | null;
  currency: "USD" | "MXN";
}

// ---- Cart promo codes (server-side source of truth) ----
interface ServerPromo {
  code: string;
  couponId: string;
  amountOffUsd: number;
  name: string;
  qualifies: (items: CartItem[]) => boolean;
  requirement: string;
}

function countParticipantsForTour(items: CartItem[], tourId: string): number {
  return items
    .filter((i) => i.tourId === tourId)
    .reduce((sum, i) => sum + (i.adults || 0) + (i.children || 0), 0);
}

const CART_PROMOS: ServerPromo[] = [
  {
    code: "WHALE40",
    couponId: "margea-whale40-40usd-once",
    amountOffUsd: 40,
    name: "WHALE40 - Whale Shark group discount",
    qualifies: (items) => countParticipantsForTour(items, "whale-shark-snorkeling") >= 3,
    requirement: "This code requires 3 or more Whale Shark Snorkeling spots in your cart.",
  },
];

/**
 * Fetch the Stripe coupon by its fixed id, creating it on first use.
 * Returns null when the Stripe key lacks coupon permissions — the caller then
 * falls back to discounting a line item directly.
 */
async function ensureCoupon(stripe: Stripe, promo: ServerPromo): Promise<string | null> {
  try {
    const existing = await stripe.coupons.retrieve(promo.couponId);
    if (existing && !existing.deleted) return existing.id;
  } catch (_e) {
    // Not found or not readable — try to create below
  }

  try {
    const created = await stripe.coupons.create({
      id: promo.couponId,
      name: promo.name,
      amount_off: Math.round(promo.amountOffUsd * 100),
      currency: "usd",
      duration: "once",
    });
    return created.id;
  } catch (e) {
    console.warn("Could not create Stripe coupon, falling back to line-item discount:", (e as Error).message);
    return null;
  }
}

/**
 * Fallback discount: split one unit off the most expensive line item and
 * re-add it at a reduced price, so the cart total drops by exactly amountOff.
 */
function applyLineItemDiscount(
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
  promo: ServerPromo
): boolean {
  const amountOffCents = Math.round(promo.amountOffUsd * 100);

  let targetIndex = -1;
  let highest = 0;
  lineItems.forEach((li, idx) => {
    const unit = li.price_data?.unit_amount ?? 0;
    if (unit > amountOffCents && unit > highest) {
      highest = unit;
      targetIndex = idx;
    }
  });

  if (targetIndex === -1) return false;

  const target = lineItems[targetIndex];
  const unit = target.price_data!.unit_amount!;
  const quantity = target.quantity ?? 1;

  if (quantity > 1) {
    target.quantity = quantity - 1;
  } else {
    lineItems.splice(targetIndex, 1);
  }

  lineItems.push({
    price_data: {
      currency: target.price_data!.currency,
      product_data: {
        name: target.price_data!.product_data!.name,
        description: `${promo.code} applied — $${promo.amountOffUsd} USD off`,
      },
      unit_amount: unit - amountOffCents,
    },
    quantity: 1,
  });

  return true;
}


serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { items, customerEmail, promoCode, metadata: extraMeta } = await req.json() as {
      items: CartItem[];
      customerEmail?: string;
      promoCode?: string | null;
      metadata?: Record<string, string>;
    };

    if (!items || items.length === 0) {
      return new Response(
        JSON.stringify({ error: "Cart is empty" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (items.length > 20) {
      return new Response(
        JSON.stringify({ error: "Too many items in cart" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Re-validate the promo code against the actual cart (never trust the client)
    let appliedPromo: ServerPromo | null = null;
    if (typeof promoCode === "string" && promoCode.trim()) {
      const normalized = promoCode.trim().toUpperCase();
      const promo = CART_PROMOS.find((p) => p.code === normalized);

      if (!promo) {
        return new Response(
          JSON.stringify({ error: "Invalid promo code" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      if (!promo.qualifies(items)) {
        return new Response(
          JSON.stringify({ error: promo.requirement }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      appliedPromo = promo;
    }


    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const item of items) {
      if (!item.tourId || !item.tourTitle || !item.adultPrice || item.adultPrice <= 0) {
        return new Response(
          JSON.stringify({ error: `Invalid item: ${item.tourTitle || "unknown"}` }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      const totalPax = (item.adults || 0) + (item.children || 0);
      if (totalPax <= 0) {
        return new Response(
          JSON.stringify({ error: `No participants for: ${item.tourTitle}` }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      if (item.adults > 0) {
        lineItems.push({
          price_data: {
            currency: (item.currency || "USD").toLowerCase(),
            product_data: {
              name: `${item.tourTitle} - ${item.variantTitle}`,
              description: `Adult ticket • ${item.date} at ${item.time}`,
            },
            unit_amount: Math.round(item.adultPrice * 100),
          },
          quantity: item.adults,
        });
      }

      if (item.children > 0 && item.childPrice) {
        lineItems.push({
          price_data: {
            currency: (item.currency || "USD").toLowerCase(),
            product_data: {
              name: `${item.tourTitle} - ${item.variantTitle}`,
              description: `Child ticket (Age 4-12) • ${item.date} at ${item.time}`,
            },
            unit_amount: Math.round(item.childPrice * 100),
          },
          quantity: item.children,
        });
      }
    }

    const origin = req.headers.get("origin") || "https://margea-direct-book.lovable.app";

    const itemsSummary = items.map(i => `${i.tourTitle} (${i.date})`).join("; ").slice(0, 490);

    // Merge extra metadata from checkout summary page
    const sessionMetadata: Record<string, string> = {
      cart_checkout: "true",
      items_count: items.length.toString(),
      items_summary: itemsSummary,
    };

    if (extraMeta) {
      for (const [key, value] of Object.entries(extraMeta)) {
        if (typeof value === "string" && value.length <= 500) {
          sessionMetadata[key] = value;
        }
      }
    }

    if (appliedPromo) {
      sessionMetadata.promo_code = appliedPromo.code;
      sessionMetadata.promo_discount_usd = appliedPromo.amountOffUsd.toString();
    }

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/tours/booking-success?session_id={CHECKOUT_SESSION_ID}&cart=true`,
      cancel_url: `${origin}/checkout-summary`,
      metadata: sessionMetadata,
    };

    if (appliedPromo) {
      const couponId = await ensureCoupon(stripe, appliedPromo);
      if (couponId) {
        sessionParams.discounts = [{ coupon: couponId }];
      } else if (!applyLineItemDiscount(lineItems, appliedPromo)) {
        return new Response(
          JSON.stringify({ error: "This promo code could not be applied to your cart." }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
    }


    if (customerEmail) {
      sessionParams.customer_email = customerEmail;
    }


    const session = await stripe.checkout.sessions.create(sessionParams);

    console.log("Cart checkout session created:", session.id, "items:", items.length);

    return new Response(
      JSON.stringify({ url: session.url, sessionId: session.id }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in create-cart-checkout:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
