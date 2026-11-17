import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TourCheckoutRequest {
  tourId: string;
  tourTitle: string;
  variantId: string;
  variantTitle: string;
  date: string;
  time: string;
  participants: {
    adults: number;
    children: number;
  };
  currency: "USD" | "MXN";
  adultPrice: number;
  childPrice: number | null;
  returnUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: TourCheckoutRequest = await req.json();
    console.log("Creating tour checkout session:", data);

    // Validate required fields
    if (!data.tourId || !data.tourTitle || !data.variantId || !data.date || !data.time) {
      return new Response(
        JSON.stringify({ error: "Missing required booking fields" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate participants
    const totalParticipants = data.participants.adults + data.participants.children;
    if (totalParticipants <= 0) {
      return new Response(
        JSON.stringify({ error: "At least one participant is required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate pricing
    if (!data.adultPrice || data.adultPrice <= 0) {
      console.error(`[PRICING WARNING] Invalid adult price for tour: ${data.tourId}`);
      return new Response(
        JSON.stringify({ error: "Invalid pricing configuration" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Calculate total
    const adultTotal = data.participants.adults * data.adultPrice;
    const childTotal = data.participants.children * (data.childPrice || 0);
    const total = adultTotal + childTotal;

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Build line items
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    if (data.participants.adults > 0) {
      lineItems.push({
        price_data: {
          currency: data.currency.toLowerCase(),
          product_data: {
            name: `${data.tourTitle} - ${data.variantTitle}`,
            description: `Adult ticket • ${data.date} at ${data.time}`,
          },
          unit_amount: Math.round(data.adultPrice * 100), // Convert to cents
        },
        quantity: data.participants.adults,
      });
    }

    if (data.participants.children > 0 && data.childPrice) {
      lineItems.push({
        price_data: {
          currency: data.currency.toLowerCase(),
          product_data: {
            name: `${data.tourTitle} - ${data.variantTitle}`,
            description: `Child ticket (Age 4-12) • ${data.date} at ${data.time}`,
          },
          unit_amount: Math.round(data.childPrice * 100), // Convert to cents
        },
        quantity: data.participants.children,
      });
    }

    // Get origin for redirect URLs
    const origin = req.headers.get("origin") || "https://margea-direct-book.lovable.app";

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/tours/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: data.returnUrl,
      metadata: {
        tour_id: data.tourId,
        tour_title: data.tourTitle,
        variant_id: data.variantId,
        variant_title: data.variantTitle,
        date: data.date,
        time: data.time,
        adults: data.participants.adults.toString(),
        children: data.participants.children.toString(),
        total: total.toString(),
        currency: data.currency,
      },
      payment_intent_data: {
        metadata: {
          tour_id: data.tourId,
          variant_id: data.variantId,
          date: data.date,
          time: data.time,
          adults: data.participants.adults.toString(),
          children: data.participants.children.toString(),
        },
      },
    });

    console.log("Tour checkout session created:", session.id);

    return new Response(
      JSON.stringify({ url: session.url, sessionId: session.id }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in create-tour-checkout function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
