import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CarRentalCheckoutRequest {
  car_id: string;
  car_name: string;
  experience_id: string;
  experience_name: string;
  experience_duration: string;
  total_usd: number;
  pay_now_usd: number;
  balance_due_usd: number;
  payment_type: "full" | "deposit";
  driver_name: string;
  email: string;
  phone: string;
  date: string;
  preferred_time: string;
  source?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: CarRentalCheckoutRequest = await req.json();
    
    // Validate required fields
    if (!body.car_name || !body.experience_name || !body.email || !body.driver_name) {
      throw new Error("Missing required fields");
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Check if customer exists
    const customers = await stripe.customers.list({ email: body.email, limit: 1 });
    let customerId: string | undefined;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Determine payment label
    const paymentLabel = body.payment_type === "full" ? "Full Payment" : "Deposit (30%)";

    // Create Checkout Session with the specified amount
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : body.email,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Margea Exotic Car Rental — ${paymentLabel}`,
              description: `${body.car_name} | ${body.experience_name} | ${body.date}`,
            },
            unit_amount: body.pay_now_usd * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin") || "https://margeatravel.com"}/activities/exotic-cars?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin") || "https://margeatravel.com"}/activities/exotic-cars?payment=canceled`,
      metadata: {
        car_id: body.car_id,
        car_name: body.car_name,
        experience_id: body.experience_id,
        experience_name: body.experience_name,
        experience_duration: body.experience_duration,
        total_usd: body.total_usd.toString(),
        pay_now_usd: body.pay_now_usd.toString(),
        balance_due_usd: body.balance_due_usd.toString(),
        payment_type: body.payment_type,
        driver_name: body.driver_name,
        email: body.email,
        phone: body.phone,
        date: body.date,
        preferred_time: body.preferred_time,
        source: body.source || "unknown",
      },
    });

    // Send notification email to Margea (internal)
    try {
      const resendApiKey = Deno.env.get("RESEND_API_KEY");
      if (resendApiKey) {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Margea <noreply@margeatravel.com>",
            to: ["admin@margeatravel.com"],
            subject: `Exotic Car ${paymentLabel}: ${body.car_name} - ${body.driver_name}`,
            html: `
              <h2>New Exotic Car Rental — ${paymentLabel}</h2>
              
              <h3>Customer Details</h3>
              <p><strong>Name:</strong> ${body.driver_name}</p>
              <p><strong>Email:</strong> ${body.email}</p>
              <p><strong>Phone:</strong> ${body.phone}</p>
              
              <h3>Rental Details</h3>
              <p><strong>Car:</strong> ${body.car_name}</p>
              <p><strong>Experience:</strong> ${body.experience_name}</p>
              <p><strong>Duration:</strong> ${body.experience_duration}</p>
              <p><strong>Date:</strong> ${body.date}</p>
              <p><strong>Time:</strong> ${body.preferred_time}</p>
              
              <h3>Payment Summary</h3>
              <table style="border-collapse: collapse; width: 100%; max-width: 400px;">
                <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;">Total:</td><td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">$${body.total_usd} USD</td></tr>
                <tr style="background-color: #f0f9ff;"><td style="padding: 8px; border-bottom: 1px solid #ddd;">${paymentLabel}:</td><td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">$${body.pay_now_usd} USD</td></tr>
                <tr><td style="padding: 8px;">Balance Due:</td><td style="padding: 8px; text-align: right;">$${body.balance_due_usd} USD</td></tr>
              </table>
              
              <p style="margin-top: 20px; color: #999; font-size: 11px;">Operated by trusted local partners</p>
            `,
          }),
        });
      }
    } catch (emailError) {
      console.error("Error sending admin email:", emailError);
    }

    // Send confirmation email to customer
    const paidLabel = body.payment_type === "full" ? "Paid in Full" : "Deposit Paid (30%)";
    try {
      const resendApiKey = Deno.env.get("RESEND_API_KEY");
      if (resendApiKey) {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Margea <noreply@margeatravel.com>",
            to: [body.email],
            subject: `Your Exotic Car Rental: ${body.car_name}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #1a365d;">Thank you for your booking, ${body.driver_name}!</h2>
                
                <p>We've received your ${body.payment_type === "full" ? "full payment" : "deposit payment"} for an exotic car rental experience. Your booking details are below:</p>
                
                <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="margin-top: 0; color: #2d3748;">Rental Details</h3>
                  <p><strong>Car:</strong> ${body.car_name}</p>
                  <p><strong>Experience:</strong> ${body.experience_name}</p>
                  <p><strong>Duration:</strong> ${body.experience_duration}</p>
                  <p><strong>Date:</strong> ${body.date}</p>
                  <p><strong>Time:</strong> ${body.preferred_time}</p>
                </div>
                
                <div style="background-color: #edf2f7; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="margin-top: 0; color: #2d3748;">Payment Summary</h3>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr style="font-weight: bold;"><td style="padding: 6px 0;">Total:</td><td style="text-align: right;">$${body.total_usd} USD</td></tr>
                    <tr style="color: #2b6cb0; font-weight: bold;"><td style="padding: 6px 0;">${paidLabel}:</td><td style="text-align: right;">$${body.pay_now_usd} USD</td></tr>
                    <tr><td style="padding: 6px 0;">Balance Due on Day of Service:</td><td style="text-align: right;">$${body.balance_due_usd} USD</td></tr>
                  </table>
                </div>
                
                <p>Our team will confirm availability and contact you within 24 hours with final details.</p>
                
                <div style="margin-top: 25px; padding: 20px; background: #f7fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
                  <h4 style="margin-top: 0; color: #2d3748; font-size: 16px;">Questions?</h4>
                  <p style="margin: 5px 0; color: #4a5568; line-height: 1.6;">
                    <strong>Email:</strong> admin@margeatravel.com<br>
                    <strong>Phone:</strong> +52 998 233 4867<br>
                    <strong>WhatsApp:</strong> +52 998 233 4867
                  </p>
                </div>
                
                <p style="color: #a0aec0; font-size: 11px; margin-top: 30px;">
                  Operated by trusted local partners
                </p>
              </div>
            `,
          }),
        });
      }
    } catch (emailError) {
      console.error("Error sending customer email:", emailError);
    }

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
