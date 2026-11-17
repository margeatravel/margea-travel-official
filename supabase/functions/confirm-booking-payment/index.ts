import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionId } = await req.json();
    console.log("Confirming payment for session:", sessionId);

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status !== "paid") {
      throw new Error("Payment not completed");
    }

    console.log("Payment confirmed, creating booking");

    // Initialize Supabase
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Create the booking
    const { data: bookingData, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        property_id: session.metadata?.propertyId,
        guest_name: session.metadata?.guestName,
        guest_email: session.metadata?.guestEmail,
        guest_phone: session.metadata?.guestPhone || null,
        check_in: session.metadata?.checkIn,
        check_out: session.metadata?.checkOut,
        total_nights: parseInt(session.metadata?.totalNights || "0"),
        total_price: session.amount_total ? session.amount_total / 100 : 0,
        guests: parseInt(session.metadata?.guests || "0"),
        cleaning_fee: Number(session.metadata?.cleaningFee || "0"),
        status: "confirmed",
      })
      .select("booking_reference")
      .single();

    if (bookingError) throw bookingError;

    console.log("Booking created with reference:", bookingData?.booking_reference);

    // Send confirmation emails with HIGH PRIORITY
    const { error: emailError } = await supabase.functions.invoke(
      "send-property-booking-notification",
      {
        body: {
          property_title: session.metadata?.propertyTitle,
          guest_name: session.metadata?.guestName,
          guest_email: session.metadata?.guestEmail,
          guest_phone: session.metadata?.guestPhone,
          check_in: session.metadata?.checkIn,
          check_out: session.metadata?.checkOut,
          total_nights: parseInt(session.metadata?.totalNights || "0"),
          total_price: session.amount_total ? session.amount_total / 100 : 0,
          guests: parseInt(session.metadata?.guests || "0"),
          cleaning_fee: Number(session.metadata?.cleaningFee || "0"),
          booking_reference: bookingData?.booking_reference || "N/A",
        },
      }
    );

    if (emailError) {
      console.error("Email notification error:", emailError);
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        bookingReference: bookingData?.booking_reference 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in confirm-booking-payment function:", error);
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
