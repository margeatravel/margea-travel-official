import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data = await req.json();
    console.log("Received owner contact form:", data);

    const { fullName, email, phone, location, propertyType, bedrooms, renting, notes } = data;

    const rentingLabel = renting === "yes" ? "Yes" : "No";

    const adminEmailResponse = await resend.emails.send({
      from: "Margea Properties <noreply@margeatravel.com>",
      to: ["admin@margeatravel.com"],
      subject: `🟢 Nueva consulta de propietario — ${fullName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #c9a96e; margin-bottom: 24px;">New Property Owner Lead</h1>
          
          <h2 style="color: #1d2839; border-bottom: 2px solid #c9a96e; padding-bottom: 8px;">Contact Information</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Name:</td><td style="color: #374151;">${fullName}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Email:</td><td><a href="mailto:${email}" style="color: #1d2839;">${email}</a></td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Phone:</td><td style="color: #374151;">${phone}</td></tr>
          </table>
          
          <h2 style="color: #1d2839; border-bottom: 2px solid #c9a96e; padding-bottom: 8px; margin-top: 24px;">Property Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Location:</td><td style="color: #374151;">${location}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Property Type:</td><td style="color: #374151;">${propertyType}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Bedrooms:</td><td style="color: #374151;">${bedrooms}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Currently Renting:</td><td style="color: #374151;">${rentingLabel}</td></tr>
          </table>
          
          ${notes ? `
          <h3 style="color: #1d2839; margin-top: 24px;">Additional Notes</h3>
          <p style="background: #f9fafb; padding: 16px; border-radius: 8px; color: #374151; border-left: 3px solid #c9a96e;">${notes}</p>
          ` : ""}
          
          <hr style="margin: 32px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px;">This lead was submitted from the Margea Properties landing page (/contact-owners).</p>
        </div>
      `,
    });

    console.log("Admin email sent:", adminEmailResponse);

    return new Response(
      JSON.stringify({ success: true, emailId: adminEmailResponse.data?.id }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error sending owner contact notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
