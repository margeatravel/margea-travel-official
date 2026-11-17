import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CustomRouteCheckoutRequest {
  full_name: string;
  whatsapp_e164: string;
  email?: string;
  passengers: number;
  pickup_address: string;
  dropoff_address: string;
  distance_km: number;
  date: string;
  time: string;
  is_round_trip: boolean;
  extra_stops: number;
  airline?: string;
  flight_number?: string;
  return_date?: string;
  return_time?: string;
  return_flight_number?: string;
  notes?: string;
  total_price_mxn: number;
  price_breakdown: {
    base_fee: number;
    distance_fee: number;
    stops_fee: number;
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: CustomRouteCheckoutRequest = await req.json();
    console.log("Received custom route checkout request:", JSON.stringify(data));

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Build line item name
    const tripType = data.is_round_trip ? "Round Trip" : "One-Way";
    const lineName = `Custom Private Transfer (${tripType}): ${data.pickup_address.substring(0, 50)} → ${data.dropoff_address.substring(0, 50)}`;

    // Build description with breakdown
    const description = `${data.distance_km} km | ${data.passengers} passengers | ${data.date} ${data.time}${data.extra_stops > 0 ? ` | +${data.extra_stops} stop(s)` : ""}`;

    // Build metadata
    const metadata: Record<string, string> = {
      route_type: "custom",
      full_name: data.full_name.substring(0, 500),
      whatsapp_e164: data.whatsapp_e164.substring(0, 500),
      email: (data.email || "").substring(0, 500),
      passengers: String(data.passengers),
      pickup_address: data.pickup_address.substring(0, 500),
      dropoff_address: data.dropoff_address.substring(0, 500),
      distance_km: String(data.distance_km),
      date: data.date,
      time: data.time,
      is_round_trip: String(data.is_round_trip),
      extra_stops: String(data.extra_stops),
      total_price_mxn: String(data.total_price_mxn),
      base_fee: String(data.price_breakdown.base_fee),
      distance_fee: String(data.price_breakdown.distance_fee),
      stops_fee: String(data.price_breakdown.stops_fee),
    };

    if (data.airline) metadata.airline = data.airline.substring(0, 500);
    if (data.flight_number) metadata.flight_number = data.flight_number.substring(0, 500);
    if (data.return_date) metadata.return_date = data.return_date;
    if (data.return_time) metadata.return_time = data.return_time;
    if (data.return_flight_number) metadata.return_flight_number = data.return_flight_number.substring(0, 500);
    if (data.notes) metadata.notes = data.notes.substring(0, 500);

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "mxn",
            product_data: {
              name: lineName,
              description: description,
            },
            unit_amount: data.total_price_mxn * 100, // Stripe expects cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/activities/transportation/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/activities/transportation/cancel`,
      customer_email: data.email || undefined,
      metadata: metadata,
    });

    console.log("Stripe session created:", session.id);

    return new Response(
      JSON.stringify({ url: session.url, sessionId: session.id }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: unknown) {
    console.error("Error creating custom route checkout:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
