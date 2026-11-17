import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionId } = await req.json();

    if (!sessionId) throw new Error("Missing session ID");

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      throw new Error("Payment not completed");
    }

    const meta = session.metadata || {};

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Check if booking already exists for this session
    const { data: existing } = await supabaseAdmin
      .from("golf_bookings")
      .select("*")
      .eq("stripe_session_id", sessionId)
      .maybeSingle();

    if (existing) {
      return new Response(
        JSON.stringify({
          confirmationNumber: existing.confirmation_number,
          courseName: existing.course_name,
          preferredDate: existing.preferred_date,
          preferredTime: existing.preferred_time,
          numberOfPlayers: existing.number_of_players,
          totalPrice: existing.total_price,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insert new booking
    const { data: newBooking, error } = await supabaseAdmin
      .from("golf_bookings")
      .insert({
        course_id: meta.course_id,
        course_name: meta.course_name,
        player_name: meta.player_name,
        player_email: meta.player_email,
        player_phone: meta.player_phone || null,
        preferred_date: meta.preferred_date,
        preferred_time: meta.preferred_time,
        number_of_players: parseInt(meta.number_of_players || "1"),
        rate_type: meta.rate_type,
        price_per_player: parseInt(meta.price_per_player || "0"),
        total_price: parseInt(meta.total_price || "0"),
        notes: meta.notes || null,
        stripe_session_id: sessionId,
        stripe_payment_intent_id: session.payment_intent as string,
        status: "paid",
      })
      .select()
      .single();

    if (error) {
      console.error("DB insert error:", error);
      throw new Error("Failed to save booking");
    }

    // Send confirmation email
    try {
      await supabaseAdmin.functions.invoke("send-golf-inquiry-email", {
        body: {
          fullName: meta.player_name,
          email: meta.player_email,
          phone: meta.player_phone || "",
          preferredCourse: meta.course_name,
          preferredTeeTime: `${meta.preferred_date} at ${meta.preferred_time}`,
          numberOfPlayers: meta.number_of_players,
          message: meta.notes || "",
          caseNumber: newBooking.confirmation_number,
          isPaid: true,
          totalPrice: meta.total_price,
          rateType: meta.rate_type,
        },
      });
    } catch (emailErr) {
      console.error("Email notification failed:", emailErr);
    }

    return new Response(
      JSON.stringify({
        confirmationNumber: newBooking.confirmation_number,
        courseName: newBooking.course_name,
        preferredDate: newBooking.preferred_date,
        preferredTime: newBooking.preferred_time,
        numberOfPlayers: newBooking.number_of_players,
        totalPrice: newBooking.total_price,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Verify golf booking error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
