import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

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
    const {
      courseId,
      courseName,
      playerName,
      playerEmail,
      playerPhone,
      preferredDate,
      preferredTime,
      numberOfPlayers,
      rateType,
      pricePerPlayer,
      totalPrice,
      notes,
    } = await req.json();

    if (!courseId || !courseName || !playerName || !playerEmail || !preferredDate || !preferredTime || !numberOfPlayers || !pricePerPlayer) {
      throw new Error("Missing required booking fields");
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const origin = req.headers.get("origin") || "https://margea-direct-book.lovable.app";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: playerEmail,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${courseName} – ${rateType} Tee Time`,
              description: `${preferredDate} at ${preferredTime} · ${numberOfPlayers} player${numberOfPlayers > 1 ? "s" : ""}`,
            },
            unit_amount: pricePerPlayer * 100,
          },
          quantity: numberOfPlayers,
        },
      ],
      mode: "payment",
      success_url: `${origin}/activities/golf/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/activities/golf/${courseId}`,
      metadata: {
        type: "golf_tee_time",
        course_id: courseId,
        course_name: courseName,
        player_name: playerName,
        player_email: playerEmail,
        player_phone: playerPhone || "",
        preferred_date: preferredDate,
        preferred_time: preferredTime,
        number_of_players: String(numberOfPlayers),
        rate_type: rateType,
        price_per_player: String(pricePerPlayer),
        total_price: String(totalPrice),
        notes: notes || "",
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Golf checkout error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
