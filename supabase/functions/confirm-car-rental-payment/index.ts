import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const randomRef = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  const arr = new Uint8Array(6);
  crypto.getRandomValues(arr);
  for (const b of arr) out += chars[b % chars.length];
  return `YAAB-${out}`;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionId } = await req.json();
    if (!sessionId) throw new Error("Missing sessionId");
    console.log("Confirming YAAB car rental payment for session:", sessionId);

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      throw new Error("Payment not completed");
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // IDEMPOTENCY: the success page can be reloaded/revisited. If this
    // session was already recorded, return the existing booking instead
    // of inserting a duplicate (the defect confirm-booking-payment has).
    const { data: existing } = await supabase
      .from("car_bookings")
      .select("confirmation_number, car_id, pickup_date, return_date, total_days, total_mxn, deposit_paid_mxn, balance_due_mxn, status")
      .eq("stripe_session_id", sessionId)
      .maybeSingle();

    if (existing) {
      console.log("Session already recorded, returning existing booking:", existing.confirmation_number);
      return new Response(
        JSON.stringify({
          success: true,
          alreadyRecorded: true,
          confirmationNumber: existing.confirmation_number,
          carName: session.metadata?.carName || "",
          pickupDate: existing.pickup_date,
          returnDate: existing.return_date,
          totalDays: existing.total_days,
          totalMxn: Number(existing.total_mxn),
          depositPaidMxn: Number(existing.deposit_paid_mxn),
          balanceDueMxn: Number(existing.balance_due_mxn),
          status: existing.status,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    const md = session.metadata || {};
    const carId = md.carId || null;
    if (!carId) throw new Error("Missing car in session metadata");

    // Unique confirmation number (retry on collision)
    let confirmationNumber = "";
    for (let attempt = 0; attempt < 5; attempt++) {
      const candidate = randomRef();
      const { data: clash } = await supabase
        .from("car_bookings")
        .select("id")
        .eq("confirmation_number", candidate)
        .maybeSingle();
      if (!clash) {
        confirmationNumber = candidate;
        break;
      }
    }
    if (!confirmationNumber) throw new Error("Could not generate a confirmation number");

    const totalDays = parseInt(md.totalDays || "0");
    const pricePerDay = Number(md.pricePerDay || "0");
    const totalMxn = Number(md.totalMxn || "0");
    const depositMxn = session.amount_total ? session.amount_total / 100 : Number(md.depositMxn || "0");
    const balanceDueMxn = Number(md.balanceDueMxn || "0");

    // Status is "pending": YAAB confirms availability manually (<24h).
    // If no car is available, the deposit is refunded via Stripe.
    const { data: booking, error: bookingError } = await supabase
      .from("car_bookings")
      .insert({
        car_id: carId,
        confirmation_number: confirmationNumber,
        driver_name: md.driverName,
        driver_email: md.driverEmail,
        driver_phone: md.driverPhone || null,
        pickup_date: md.pickupDate,
        return_date: md.returnDate,
        pickup_time: md.pickupTime || null,
        return_time: md.returnTime || null,
        pickup_location: md.pickupLocation || null,
        return_location: md.returnLocation || null,
        total_days: totalDays,
        price_per_day_mxn: pricePerDay,
        total_mxn: totalMxn,
        deposit_paid_mxn: depositMxn,
        balance_due_mxn: balanceDueMxn,
        security_deposit_mxn: md.securityDepositMxn ? Number(md.securityDepositMxn) : null,
        stripe_session_id: sessionId,
        stripe_payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : null,
        payment_status: "deposit_paid",
        status: "pending",
        additional_driver: md.additionalDriver === "true",
        notes: md.notes || null,
      })
      .select("confirmation_number")
      .single();

    if (bookingError) throw bookingError;
    console.log("Car booking created:", booking?.confirmation_number, "status pending (awaiting YAAB confirmation)");

    // Notify admin + driver (email errors must not fail the confirmation)
    const { error: emailError } = await supabase.functions.invoke(
      "send-car-rental-notification",
      {
        body: {
          car_name: md.carName,
          driver_name: md.driverName,
          driver_email: md.driverEmail,
          driver_phone: md.driverPhone || "",
          pickup_date: md.pickupDate,
          return_date: md.returnDate,
          pickup_time: md.pickupTime || "",
          return_time: md.returnTime || "",
          pickup_location: md.pickupLocation || "",
          return_location: md.returnLocation || "",
          total_days: totalDays,
          total_mxn: totalMxn,
          deposit_paid_mxn: depositMxn,
          balance_due_mxn: balanceDueMxn,
          security_deposit_mxn: md.securityDepositMxn ? Number(md.securityDepositMxn) : null,
          additional_driver: md.additionalDriver === "true",
          confirmation_number: confirmationNumber,
        },
      }
    );
    if (emailError) console.error("Car rental email notification error:", emailError);

    return new Response(
      JSON.stringify({
        success: true,
        confirmationNumber,
        carName: md.carName,
        pickupDate: md.pickupDate,
        returnDate: md.returnDate,
        totalDays,
        totalMxn,
        depositPaidMxn: depositMxn,
        balanceDueMxn,
        status: "pending",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Error in confirm-car-rental-payment:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
