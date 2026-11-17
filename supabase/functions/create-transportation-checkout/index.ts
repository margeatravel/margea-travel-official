import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TransportationCheckoutRequest {
  full_name: string;
  whatsapp_e164: string;
  email?: string;
  passengers: number;
  from_location: string;
  from_label: string;
  to_location: string;
  to_label: string;
  date: string;
  time: string;
  airline: string;
  flight_number: string;
  trip_type: "one_way" | "round_trip";
  return_date?: string;
  return_time?: string;
  return_flight_number?: string;
  notes?: string;
  total_price_mxn: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: TransportationCheckoutRequest = await req.json();
    console.log("Received transportation checkout request:", JSON.stringify(data));

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Build line item name
    const lineName = data.trip_type === "round_trip"
      ? `Private Transfer (Round Trip): ${data.from_label} → ${data.to_label}`
      : `Private Transfer: ${data.from_label} → ${data.to_label}`;

    // Build description
    const description = `Passengers: ${data.passengers} | Date: ${data.date} ${data.time} | Airline: ${data.airline} | Flight: ${data.flight_number}${data.trip_type === "round_trip" ? ` | Return: ${data.return_date} ${data.return_time}` : ""}`;

    // Build metadata (max 500 chars per value, 50 keys max)
    const metadata: Record<string, string> = {
      full_name: data.full_name.substring(0, 500),
      whatsapp_e164: data.whatsapp_e164.substring(0, 500),
      email: (data.email || "").substring(0, 500),
      passengers: String(data.passengers),
      from: data.from_location,
      to: data.to_location,
      date: data.date,
      time: data.time,
      airline: data.airline.substring(0, 500),
      flight_number: data.flight_number.substring(0, 500),
      trip_type: data.trip_type,
      total_price_mxn: String(data.total_price_mxn),
    };

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
    console.error("Error creating transportation checkout:", error);
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
