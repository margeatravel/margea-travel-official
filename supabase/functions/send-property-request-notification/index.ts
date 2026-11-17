import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PropertyRequestNotification {
  caseNumber: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string | null;
  propertyTitle: string;
  propertyDescription: string;
  location: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  pricePerNight: number;
  amenities: string[];
  additionalInfo: string | null;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: PropertyRequestNotification = await req.json();
    console.log("Received property request notification:", data);

    const {
      caseNumber,
      contactName,
      contactEmail,
      contactPhone,
      propertyTitle,
      propertyDescription,
      location,
      propertyType,
      bedrooms,
      bathrooms,
      maxGuests,
      pricePerNight,
      amenities,
      additionalInfo,
    } = data;

    // Send email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "Margea Property Requests <onboarding@resend.dev>",
      to: ["admin@margeatravel.com"],
      subject: `New Property Submission - Case #${caseNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0ea5a9;">New Property Submission</h1>
          <p style="font-size: 18px; font-weight: bold;">Case Number: ${caseNumber}</p>
          
          <h2 style="color: #333; border-bottom: 2px solid #0ea5a9; padding-bottom: 8px;">Contact Information</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; font-weight: bold;">Name:</td><td>${contactName}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Email:</td><td><a href="mailto:${contactEmail}">${contactEmail}</a></td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Phone:</td><td>${contactPhone || "Not provided"}</td></tr>
          </table>
          
          <h2 style="color: #333; border-bottom: 2px solid #0ea5a9; padding-bottom: 8px; margin-top: 24px;">Property Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; font-weight: bold;">Title:</td><td>${propertyTitle}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Type:</td><td>${propertyType}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Location:</td><td>${location}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Bedrooms:</td><td>${bedrooms}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Bathrooms:</td><td>${bathrooms}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Max Guests:</td><td>${maxGuests}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Price/Night:</td><td>$${pricePerNight} USD</td></tr>
          </table>
          
          <h3 style="color: #333; margin-top: 24px;">Description</h3>
          <p style="background: #f5f5f5; padding: 16px; border-radius: 8px;">${propertyDescription}</p>
          
          ${amenities.length > 0 ? `
          <h3 style="color: #333;">Amenities</h3>
          <p>${amenities.join(", ")}</p>
          ` : ""}
          
          ${additionalInfo ? `
          <h3 style="color: #333;">Additional Information</h3>
          <p style="background: #f5f5f5; padding: 16px; border-radius: 8px;">${additionalInfo}</p>
          ` : ""}
          
          <hr style="margin: 32px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px;">This email was sent from the Margea property submission form.</p>
        </div>
      `,
    });

    console.log("Admin email sent:", adminEmailResponse);

    // Send confirmation email to client
    const clientEmailResponse = await resend.emails.send({
      from: "Margea <onboarding@resend.dev>",
      to: [contactEmail],
      subject: `Property Submission Received - Case #${caseNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0ea5a9;">Thank You for Your Submission!</h1>
          
          <p>Dear ${contactName},</p>
          
          <p>We have received your property submission and our team will review it shortly.</p>
          
          <div style="background: #f0fdfa; border: 2px solid #0ea5a9; border-radius: 8px; padding: 20px; margin: 24px 0; text-align: center;">
            <p style="margin: 0; color: #666; font-size: 14px;">Your Case Number</p>
            <p style="margin: 8px 0 0 0; font-size: 28px; font-weight: bold; color: #0ea5a9;">${caseNumber}</p>
          </div>
          
          <p>Please save this case number for your records. You can reference it in any future communication with us.</p>
          
          <h3 style="color: #333;">Property Submitted</h3>
          <table style="width: 100%; border-collapse: collapse; background: #f9f9f9; border-radius: 8px;">
            <tr><td style="padding: 12px; font-weight: bold;">Title:</td><td style="padding: 12px;">${propertyTitle}</td></tr>
            <tr><td style="padding: 12px; font-weight: bold;">Location:</td><td style="padding: 12px;">${location}</td></tr>
            <tr><td style="padding: 12px; font-weight: bold;">Type:</td><td style="padding: 12px;">${propertyType}</td></tr>
          </table>
          
          <h3 style="color: #333;">What Happens Next?</h3>
          <ol style="color: #666; line-height: 1.8;">
            <li>Our team will review your property details within 24-48 hours</li>
            <li>We may reach out for additional information or photos</li>
            <li>Once approved, we'll discuss the next steps to list your property</li>
          </ol>
          
          <p>If you have any questions, feel free to contact us:</p>
          <ul style="list-style: none; padding: 0; color: #666;">
            <li>📧 Email: <a href="mailto:admin@margeatravel.com">admin@margeatravel.com</a></li>
            <li>📞 Phone: <a href="tel:+529982334867">+52 998 233 4867</a></li>
            <li>📷 Instagram: <a href="https://www.instagram.com/margeatravel/">@margeatravel</a></li>
          </ul>
          
          <hr style="margin: 32px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px;">
            © ${new Date().getFullYear()} Margea. Cancún, Quintana Roo<br>
            This email was sent because you submitted a property on our website.
          </p>
        </div>
      `,
    });

    console.log("Client email sent:", clientEmailResponse);

    return new Response(
      JSON.stringify({
        success: true,
        adminEmailId: adminEmailResponse.data?.id,
        clientEmailId: clientEmailResponse.data?.id,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-property-request-notification:", error);
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
