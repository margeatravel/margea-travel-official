import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PromoSignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  checkIn: string;
  timestamp: string;
  tag: string;
  utm_source: string;
  utm_campaign: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: PromoSignupRequest = await req.json();

    console.log("Processing promo signup:", { email: data.email, tag: data.tag });

    // Send notification email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "Margea Promo <onboarding@resend.dev>",
      to: ["admin@margeatravel.com"],
      subject: `🎉 NEW PROMO SIGNUP - ${data.firstName} ${data.lastName} - Airport Transfer 20%`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #001F3F;">New Promo Popup Signup</h1>
          
          <div style="background-color: #001F3F; color: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; opacity: 0.8;">Campaign</p>
            <p style="margin: 5px 0 0 0; font-size: 20px; font-weight: bold;">${data.tag}</p>
          </div>
          
          <h2 style="color: #333; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">Contact Information</h2>
          <p><strong>First Name:</strong> ${data.firstName}</p>
          <p><strong>Last Name:</strong> ${data.lastName}</p>
          <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
          <p><strong>Phone:</strong> <a href="tel:${data.phone}">${data.phone}</a></p>
          
          <h2 style="color: #333; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">Travel Details</h2>
          <p><strong>Check-In Date:</strong> ${data.checkIn || 'Not specified'}</p>
          
          <h2 style="color: #333; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">Tracking</h2>
          <p><strong>UTM Source:</strong> ${data.utm_source}</p>
          <p><strong>UTM Campaign:</strong> ${data.utm_campaign}</p>
          <p><strong>Submitted:</strong> ${new Date(data.timestamp).toLocaleString('en-US', { timeZone: 'America/Cancun' })}</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;"><em>This lead came from the website promo popup</em></p>
        </div>
      `,
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'High'
      }
    });

    console.log("Admin email sent successfully:", adminEmailResponse);

    // Send confirmation email to user with promo code
    const userEmailResponse = await resend.emails.send({
      from: "Margea <onboarding@resend.dev>",
      to: [data.email],
      subject: "Your Exclusive 20% Airport Transfer Discount",
      html: `
        <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="text-align: center; padding: 30px 0; border-bottom: 2px solid #D4AF37;">
            <h1 style="color: #001F3F; margin: 0; font-size: 28px; font-weight: normal;">Welcome to Margea, ${data.firstName}!</h1>
          </div>
          
          <div style="padding: 30px 20px;">
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
              Thank you for signing up. We are delighted to offer you an exclusive discount on airport transportation for your upcoming trip to the Riviera Maya.
            </p>
            
            <div style="background-color: #001F3F; color: white; padding: 35px; border-radius: 8px; margin: 25px 0; text-align: center;">
              <p style="margin: 0; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; opacity: 0.8;">Your Exclusive Promo Code</p>
              <p style="margin: 15px 0; font-size: 36px; font-weight: bold; color: #D4AF37; letter-spacing: 3px;">TRANSFER20</p>
              <p style="margin: 0; font-size: 16px; opacity: 0.9;">Save 20% on Airport Transportation</p>
            </div>
            
            <h3 style="color: #001F3F; font-size: 18px; margin-top: 30px; margin-bottom: 15px;">How to Redeem Your Discount</h3>
            <ol style="font-size: 15px; line-height: 1.8; padding-left: 20px; margin-bottom: 25px;">
              <li style="margin-bottom: 8px;">Book your stay with Margea</li>
              <li style="margin-bottom: 8px;">Request airport transportation when confirming your reservation</li>
              <li style="margin-bottom: 8px;">Mention code <strong style="color: #001F3F;">TRANSFER20</strong> to receive your discount</li>
            </ol>
            
            <p style="font-size: 15px; line-height: 1.6; margin-bottom: 25px;">
              We look forward to making your travel experience exceptional. If you have any questions, please do not hesitate to reach out.
            </p>
          </div>
          
          <div style="border-top: 1px solid #eee; padding: 25px 20px; text-align: center;">
            <p style="margin: 0 0 15px 0; font-size: 16px;"><strong>The Margea Team</strong></p>
            <p style="color: #666; font-size: 14px; margin: 0; line-height: 1.8;">
              <a href="mailto:admin@margeatravel.com" style="color: #001F3F; text-decoration: none;">admin@margeatravel.com</a><br>
              <a href="tel:+14696208199" style="color: #001F3F; text-decoration: none;">+1 (469) 620-8199</a><br>
              <a href="https://www.instagram.com/margeatravel/" style="color: #001F3F; text-decoration: none;">@margeatravel</a>
            </p>
          </div>
        </div>
      `,
    });

    console.log("User confirmation email sent successfully:", userEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true,
        adminEmailId: adminEmailResponse.data?.id,
        userEmailId: userEmailResponse.data?.id 
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
    console.error("Error in send-promo-signup function:", error);
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
