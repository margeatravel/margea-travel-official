import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FlightCheckoutRequest {
  // Flight details
  route_name: string;
  aircraft: string;
  category: string;
  flight_type?: string;
  
  // Pricing (all in USD)
  subtotal_usd: number;
  iva_usd: number;
  total_usd: number;
  deposit_usd: number;
  balance_due_usd: number;
  
  // Deposit rule details
  deposit_type: 'percent' | 'fixed' | 'percent_with_min';
  deposit_percent?: number;
  deposit_fixed_usd?: number;
  deposit_min_usd?: number;
  
  // Customer info
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  
  // Booking details
  desired_date: string;
  passengers: number;
  pickup_area: string;
  notes?: string;
  
  // Tracking
  source?: string;
  page_path?: string;
}

// Format deposit type for display
function formatDepositType(
  type: string, 
  percent?: number, 
  min?: number, 
  fixed?: number
): string {
  switch (type) {
    case 'percent':
      return `${Math.round((percent || 0.25) * 100)}% of total`;
    case 'fixed':
      return `Fixed $${fixed || 0} USD`;
    case 'percent_with_min':
      return `${Math.round((percent || 0.25) * 100)}% (min $${min || 0})`;
    default:
      return '25% of total';
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: FlightCheckoutRequest = await req.json();
    
    // Validate required fields
    if (!body.route_name || !body.aircraft || !body.email || !body.first_name || !body.last_name) {
      throw new Error("Missing required fields");
    }

    // Validate deposit doesn't exceed total
    const deposit_usd = Math.min(body.deposit_usd, body.total_usd);

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

    // Calculate IVA portion of deposit (16% of deposit subtotal)
    const depositSubtotal = Math.round(deposit_usd / 1.16);
    const depositIva = deposit_usd - depositSubtotal;

    // Format deposit description
    const depositDescription = formatDepositType(
      body.deposit_type,
      body.deposit_percent,
      body.deposit_min_usd,
      body.deposit_fixed_usd
    );

    // Create Checkout Session with deposit amount
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : body.email,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Margea Flights — Deposit`,
              description: `${body.route_name} | ${body.aircraft} | ${depositDescription}`,
            },
            unit_amount: depositSubtotal * 100, // Convert to cents
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "IVA (16%)",
              description: "Mexican Value Added Tax on deposit",
            },
            unit_amount: depositIva * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/activities/flights?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/activities/flights?payment=canceled`,
      metadata: {
        // Flight details
        route_name: body.route_name,
        aircraft: body.aircraft,
        category: body.category,
        flight_type: body.flight_type || '',
        
        // Full pricing breakdown
        subtotal_usd: body.subtotal_usd.toString(),
        iva_usd: body.iva_usd.toString(),
        total_usd: body.total_usd.toString(),
        deposit_usd: deposit_usd.toString(),
        balance_due_usd: body.balance_due_usd.toString(),
        
        // Deposit rule details
        deposit_type: body.deposit_type,
        deposit_percent: body.deposit_percent?.toString() || '',
        deposit_fixed_usd: body.deposit_fixed_usd?.toString() || '',
        deposit_min_usd: body.deposit_min_usd?.toString() || '',
        
        // Customer info
        customer_name: `${body.first_name} ${body.last_name}`,
        customer_email: body.email,
        customer_phone: body.phone,
        
        // Booking details
        desired_date: body.desired_date,
        passengers: body.passengers.toString(),
        pickup_area: body.pickup_area,
        notes: body.notes || "",
        
        // Tracking
        source: body.source || 'unknown',
        page_path: body.page_path || '/activities/flights',
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
            subject: `Flight Deposit: ${body.route_name} - ${body.first_name} ${body.last_name}`,
            html: `
              <h2>New Flight Deposit Payment Initiated</h2>
              
              <h3>Customer Details</h3>
              <p><strong>Name:</strong> ${body.first_name} ${body.last_name}</p>
              <p><strong>Email:</strong> ${body.email}</p>
              <p><strong>Phone:</strong> ${body.phone}</p>
              
              <h3>Flight Details</h3>
              <p><strong>Route:</strong> ${body.route_name}</p>
              <p><strong>Aircraft:</strong> ${body.aircraft}</p>
              <p><strong>Flight Type:</strong> ${body.flight_type || body.category}</p>
              <p><strong>Date:</strong> ${body.desired_date}</p>
              <p><strong>Passengers:</strong> ${body.passengers}</p>
              <p><strong>Pickup Area:</strong> ${body.pickup_area}</p>
              ${body.notes ? `<p><strong>Notes:</strong> ${body.notes}</p>` : ''}
              
              <h3>Price Breakdown</h3>
              <table style="border-collapse: collapse; width: 100%; max-width: 400px;">
                <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;">Subtotal:</td><td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">$${body.subtotal_usd} USD</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;">IVA (16%):</td><td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">$${body.iva_usd} USD</td></tr>
                <tr style="font-weight: bold;"><td style="padding: 8px; border-bottom: 1px solid #ddd;">Total:</td><td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">$${body.total_usd} USD</td></tr>
                <tr style="background-color: #f0f9ff;"><td style="padding: 8px; border-bottom: 1px solid #ddd;">Deposit (${depositDescription}):</td><td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">$${deposit_usd} USD</td></tr>
                <tr><td style="padding: 8px;">Balance Due:</td><td style="padding: 8px; text-align: right;">$${body.balance_due_usd} USD</td></tr>
              </table>
              
              <h3>Tracking Info (Internal)</h3>
              <p><strong>Source:</strong> ${body.source || 'unknown'}</p>
              <p><strong>Page:</strong> ${body.page_path || '/activities/flights'}</p>
              <p><strong>Deposit Rule:</strong> ${body.deposit_type}${body.deposit_percent ? ` (${Math.round(body.deposit_percent * 100)}%)` : ''}${body.deposit_fixed_usd ? ` ($${body.deposit_fixed_usd})` : ''}${body.deposit_min_usd ? ` (min $${body.deposit_min_usd})` : ''}</p>
              
              <p style="margin-top: 20px; color: #999; font-size: 11px;">Operated by Vuelatour</p>
            `,
          }),
        });
      }
    } catch (emailError) {
      console.error("Error sending admin email:", emailError);
      // Don't fail the checkout if email fails
    }

    // Send confirmation email to customer
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
            subject: `Your Flight Booking: ${body.route_name}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #1a365d;">Thank you for your booking, ${body.first_name}!</h2>
                
                <p>We've received your deposit payment request. Your flight details are below:</p>
                
                <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="margin-top: 0; color: #2d3748;">Flight Details</h3>
                  <p><strong>Route:</strong> ${body.route_name}</p>
                  <p><strong>Aircraft:</strong> ${body.aircraft}</p>
                  <p><strong>Date:</strong> ${body.desired_date}</p>
                  <p><strong>Passengers:</strong> ${body.passengers}</p>
                  <p><strong>Pickup:</strong> ${body.pickup_area}</p>
                </div>
                
                <div style="background-color: #edf2f7; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="margin-top: 0; color: #2d3748;">Payment Summary</h3>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="padding: 6px 0;">Subtotal:</td><td style="text-align: right;">$${body.subtotal_usd} USD</td></tr>
                    <tr><td style="padding: 6px 0;">IVA (16%):</td><td style="text-align: right;">$${body.iva_usd} USD</td></tr>
                    <tr style="font-weight: bold; border-top: 1px solid #cbd5e0;"><td style="padding: 6px 0;">Total:</td><td style="text-align: right;">$${body.total_usd} USD</td></tr>
                    <tr style="color: #2b6cb0; font-weight: bold;"><td style="padding: 6px 0;">Deposit Paid:</td><td style="text-align: right;">$${deposit_usd} USD</td></tr>
                    <tr><td style="padding: 6px 0;">Balance Due:</td><td style="text-align: right;">$${body.balance_due_usd} USD</td></tr>
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
                  Operated by Vuelatour
                </p>
              </div>
            `,
          }),
        });
      }
    } catch (emailError) {
      console.error("Error sending customer email:", emailError);
      // Don't fail the checkout if email fails
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
