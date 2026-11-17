import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { session_id } = await req.json();
    console.log("Confirming transportation payment for session:", session_id);

    if (!session_id) {
      throw new Error("session_id is required");
    }

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Retrieve the session
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["payment_intent"],
    });

    console.log("Session status:", session.status, "Payment status:", session.payment_status);

    if (session.payment_status !== "paid") {
      throw new Error("Payment not completed");
    }

    const metadata = session.metadata || {};

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Check if already saved
    const { data: existingRequest } = await supabaseClient
      .from("transportation_requests")
      .select("id")
      .eq("stripe_session_id", session_id)
      .single();

    if (existingRequest) {
      console.log("Transportation request already exists:", existingRequest.id);
      return new Response(
        JSON.stringify({
          success: true,
          already_exists: true,
          booking: {
            full_name: metadata.full_name,
            from: metadata.from,
            to: metadata.to,
            date: metadata.date,
            time: metadata.time,
            passengers: metadata.passengers,
            airline: metadata.airline,
            flight_number: metadata.flight_number,
            trip_type: metadata.trip_type,
            return_date: metadata.return_date,
            return_time: metadata.return_time,
            total_price_mxn: metadata.total_price_mxn,
          },
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Insert into database
    const paymentIntent = session.payment_intent as Stripe.PaymentIntent | null;
    
    const { error: insertError } = await supabaseClient
      .from("transportation_requests")
      .insert({
        stripe_session_id: session_id,
        stripe_payment_intent_id: paymentIntent?.id || null,
        status: "paid",
        full_name: metadata.full_name || "",
        whatsapp: metadata.whatsapp_e164 || metadata.whatsapp || "",
        email: metadata.email || null,
        passengers: parseInt(metadata.passengers || "1"),
        from_location: metadata.from || "",
        to_location: metadata.to || "",
        date: metadata.date || new Date().toISOString().split("T")[0],
        time: metadata.time || "",
        airline: metadata.airline || "",
        flight_number: metadata.flight_number || "",
        trip_type: metadata.trip_type || "one_way",
        return_date: metadata.return_date || null,
        return_time: metadata.return_time || null,
        return_flight_number: metadata.return_flight_number || null,
        notes: metadata.notes || null,
        total_price_mxn: parseInt(metadata.total_price_mxn || "0"),
      });

    if (insertError) {
      console.error("Error inserting transportation request:", insertError);
      throw insertError;
    }

    console.log("Transportation request saved successfully");

    return new Response(
      JSON.stringify({
        success: true,
        booking: {
          full_name: metadata.full_name,
          from: metadata.from,
          to: metadata.to,
          date: metadata.date,
          time: metadata.time,
          passengers: metadata.passengers,
          airline: metadata.airline,
          flight_number: metadata.flight_number,
          trip_type: metadata.trip_type,
          return_date: metadata.return_date,
          return_time: metadata.return_time,
          total_price_mxn: metadata.total_price_mxn,
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: unknown) {
    console.error("Error confirming transportation payment:", error);
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
