import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface GolfInquiryRequest {
  fullName: string;
  email: string;
  phone: string;
  preferredCourse: string;
  preferredTeeTime?: string;
  numberOfPlayers: string;
  message?: string;
  caseNumber: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: GolfInquiryRequest = await req.json();
    const { fullName, email, phone, preferredCourse, preferredTeeTime, numberOfPlayers, message, caseNumber } = body;

    console.log("Processing golf inquiry:", { fullName, email, caseNumber, preferredCourse });

    // Admin email
    await resend.emails.send({
      from: "Margea Golf <noreply@margeatravel.com>",
      to: ["admin@margeatravel.com"],
      subject: `🔴 Golf Tee Time Request – ${preferredCourse} – Case #${caseNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a365d;">⛳ Golf Tee Time Request</h1>
          <div style="background-color: #f0f9ff; border: 2px solid #1a365d; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #666;">Case Number</p>
            <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: #1a365d;">${caseNumber}</p>
          </div>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Name:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${fullName}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Email:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${email}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Phone:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${phone}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Course:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${preferredCourse}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Tee Time:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${preferredTeeTime || "Flexible"}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Players:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${numberOfPlayers}</td></tr>
            ${message ? `<tr><td style="padding: 8px 0;"><strong>Message:</strong></td><td style="padding: 8px 0;">${message.replace(/\n/g, "<br>")}</td></tr>` : ""}
          </table>
          <div style="margin-top: 20px;">
            <a href="https://wa.me/529982334867" style="display: inline-block; background: #25D366; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold;">📱 WhatsApp Follow-up</a>
          </div>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;"><em>Sent from Margea Golf Inquiry Form</em></p>
        </div>
      `,
      headers: {
        "X-Priority": "1",
        "X-MSMail-Priority": "High",
        Importance: "High",
      },
    });

    // Client confirmation
    await resend.emails.send({
      from: "Margea <noreply@margeatravel.com>",
      to: [email],
      subject: `Golf Inquiry Received – Case #${caseNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a365d;">Thank you, ${fullName}!</h1>
          <p>We received your golf tee time inquiry for <strong>${preferredCourse}</strong>. Our team will coordinate your reservation and reach out shortly.</p>
          <div style="background-color: #f0f9ff; border: 2px solid #1a365d; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; font-size: 14px; color: #666;">Your Case Number</p>
            <p style="margin: 5px 0 0 0; font-size: 28px; font-weight: bold; color: #1a365d;">${caseNumber}</p>
          </div>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p>Best regards,<br><strong>The Margea Team</strong></p>
          <p style="color: #666; font-size: 14px;">
            Email: <a href="mailto:admin@margeatravel.com" style="color: #1a365d;">admin@margeatravel.com</a><br>
            Phone: <a href="tel:+529982334867" style="color: #1a365d;">+52 998 233 4867</a><br>
            Instagram: <a href="https://www.instagram.com/margeatravel/" style="color: #1a365d;">@margeatravel</a>
          </p>
        </div>
      `,
    });

    return new Response(JSON.stringify({ success: true, caseNumber }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-golf-inquiry-email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
