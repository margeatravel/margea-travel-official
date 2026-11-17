import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingCheckoutRequest {
  propertyId: string;
  propertyTitle: string;
  checkIn: string;
  checkOut: string;
  totalNights: number;
  totalPrice: number; // Subtotal before discount
  guests: number;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  memberCode?: string; // Optional member code
  stripePromotionCodeId?: string; // Stripe Promotion Code ID
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const bookingData: BookingCheckoutRequest = await req.json();
    console.log("Creating checkout session for booking:", bookingData);

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Create or get customer
    const customers = await stripe.customers.list({ 
      email: bookingData.guestEmail, 
      limit: 1 
    });
    
    let customerId: string;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log("Found existing customer:", customerId);
    } else {
      const customer = await stripe.customers.create({
        email: bookingData.guestEmail,
        name: bookingData.guestName,
        phone: bookingData.guestPhone,
      });
      customerId = customer.id;
      console.log("Created new customer:", customerId);
    }

    // Cleaning fee is read from the property record (one-time per stay), never trusted from the client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );
    const { data: prop } = await supabaseAdmin
      .from("properties")
      .select("cleaning_fee")
      .eq("id", bookingData.propertyId)
      .maybeSingle();
    const cleaningFee = Number(prop?.cleaning_fee) || 0;

    // Convert total price to cents (MXN currency)
    const amountInCents = Math.round(bookingData.totalPrice * 100);

    // Prepare checkout session options
    const sessionOptions: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: "mxn",
            product_data: {
              name: `${bookingData.propertyTitle} - ${bookingData.totalNights} nights`,
              description: `Check-in: ${bookingData.checkIn} | Check-out: ${bookingData.checkOut} | Guests: ${bookingData.guests}`,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
        ...(cleaningFee > 0
          ? [{
              price_data: {
                currency: "mxn",
                product_data: { name: "Cleaning fee" },
                unit_amount: Math.round(cleaningFee * 100),
              },
              quantity: 1,
            }]
          : []),
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/stays/${bookingData.propertyId}`,
      metadata: {
        propertyId: bookingData.propertyId,
        propertyTitle: bookingData.propertyTitle,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        totalNights: bookingData.totalNights.toString(),
        guests: bookingData.guests.toString(),
        guestName: bookingData.guestName,
        guestEmail: bookingData.guestEmail,
        guestPhone: bookingData.guestPhone || "",
        memberCode: bookingData.memberCode || "",
        cleaningFee: cleaningFee.toString(),
      },
    };

    // Apply Stripe Promotion Code if provided
    // Check that it's a real promo code ID (starts with "promo_") and not a placeholder
    const isValidPromoId = bookingData.stripePromotionCodeId && 
      bookingData.stripePromotionCodeId.startsWith("promo_");
    
    if (isValidPromoId) {
      console.log("Applying Stripe Promotion Code:", bookingData.stripePromotionCodeId);
      
      try {
        // Verify the promotion code exists and is active
        const promoCode = await stripe.promotionCodes.retrieve(bookingData.stripePromotionCodeId);
        
        if (promoCode.active) {
          // Check if max redemptions reached
          if (promoCode.max_redemptions && promoCode.times_redeemed >= promoCode.max_redemptions) {
            console.log("Promotion code max redemptions reached");
            return new Response(
              JSON.stringify({ error: "This promotion code has already been used" }),
              {
                status: 400,
                headers: { "Content-Type": "application/json", ...corsHeaders },
              }
            );
          }

          // Check if expired
          if (promoCode.expires_at && promoCode.expires_at < Math.floor(Date.now() / 1000)) {
            console.log("Promotion code expired");
            return new Response(
              JSON.stringify({ error: "This promotion code has expired" }),
              {
                status: 400,
                headers: { "Content-Type": "application/json", ...corsHeaders },
              }
            );
          }

          // Apply the discount to the checkout session
          sessionOptions.discounts = [
            {
              promotion_code: bookingData.stripePromotionCodeId,
            },
          ];
          console.log("Promotion code validated and applied to Stripe Checkout Session");
        } else {
          console.log("Promotion code is not active");
          return new Response(
            JSON.stringify({ error: "This promotion code is no longer active" }),
            {
              status: 400,
              headers: { "Content-Type": "application/json", ...corsHeaders },
            }
          );
        }
      } catch (promoError: any) {
        console.error("Error validating promotion code:", promoError);
        // Return error if promo code doesn't exist
        return new Response(
          JSON.stringify({ error: "Invalid promotion code. Please check the code and try again." }),
          {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }
    } else if (bookingData.stripePromotionCodeId && !isValidPromoId) {
      // A code was applied but the Stripe ID is not configured (placeholder)
      console.log("Promo code has placeholder ID - discount will only show in Stripe if configured:", bookingData.stripePromotionCodeId);
      // Continue without Stripe discount - the user will see full price in Stripe
      // This is intentional so the user knows to configure the promo code ID
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create(sessionOptions);

    console.log("Checkout session created:", session.id);

    return new Response(
      JSON.stringify({ 
        url: session.url,
        sessionId: session.id 
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
    console.error("Error in create-booking-checkout function:", error);
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
