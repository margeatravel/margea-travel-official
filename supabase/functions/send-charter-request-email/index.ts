import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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
      fullName, email, phone, aircraft, origin, destination,
      departureDate, returnDate, passengers, flightType, notes, caseNumber,
      requiresRepositioning, aircraftBase
    } = await req.json();

    const repoFlag = requiresRepositioning;

    // Admin email
    await resend.emails.send({
      from: "Margea Aviation <noreply@margeatravel.com>",
      to: ["admin@margeatravel.com"],
      subject: `🔴 Private Charter Request – ${aircraft} – Case #${caseNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a365d;">✈️ Private Charter Request</h1>
          <div style="background-color: #f0f9ff; border: 2px solid #1a365d; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #666;">Case Number</p>
            <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: #1a365d;">${caseNumber}</p>
          </div>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Aircraft:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${aircraft}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Name:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${fullName}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Email:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${email}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Phone:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${phone || "N/A"}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Origin:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${origin}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Destination:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${destination}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Departure:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${departureDate}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Return:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${returnDate || "One-way"}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Passengers:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${passengers}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Flight Type:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${flightType}</td></tr>
            ${notes ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Notes:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${notes.replace(/\n/g, "<br>")}</td></tr>` : ""}
          </table>
          ${repoFlag ? `
          <div style="background-color: #fffbeb; border: 1px solid #f59e0b; padding: 12px; border-radius: 8px; margin: 16px 0;">
            <p style="margin: 0; font-size: 14px; color: #92400e; font-weight: bold;">⚠️ Repositioning Required</p>
            <p style="margin: 4px 0 0 0; font-size: 13px; color: #78350f;">Aircraft base: ${aircraftBase || "Toluca (TLC)"}. Repositioning leg needed: ${aircraftBase || "TLC"} → ${origin}</p>
          </div>` : ""}
          <div style="margin-top: 20px;">
            <a href="https://wa.me/529982334867" style="display: inline-block; background: #25D366; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold;">📱 WhatsApp Follow-up</a>
          </div>
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
      from: "Margea Aviation <noreply@margeatravel.com>",
      to: [email],
      subject: `Private Charter Request Received – Case #${caseNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a365d;">Thank you, ${fullName}!</h1>
          <p>We received your private charter request for the <strong>${aircraft}</strong>.</p>
          <p>Our aviation team will contact you shortly with a tailored quote for your flight from <strong>${origin}</strong> to <strong>${destination}</strong>.</p>
          <div style="background-color: #f0f9ff; border: 2px solid #1a365d; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; font-size: 14px; color: #666;">Your Case Number</p>
            <p style="margin: 5px 0 0 0; font-size: 28px; font-weight: bold; color: #1a365d;">${caseNumber}</p>
          </div>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p>Best regards,<br><strong>The Margea Aviation Team</strong></p>
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
    console.error("Error in send-charter-request-email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
