import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ConciergeNotification {
  caseNumber: string;
  serviceType: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string | null;
  preferredDate: string | null;
  endDate: string | null;
  guests: number | null;
  specialRequests: string | null;
}

// Format date from "2026-07-05" to "05 Jul 2026"
function formatDate(dateString: string | null): string {
  if (!dateString) return "Not specified";
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = date.getDate().toString().padStart(2, "0");
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
  } catch {
    return dateString;
  }
}

// Inline SVG icons (teal color, works in light/dark mode)
const carIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0ea5a9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 8px;"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>`;

const airplaneIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0ea5a9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 8px;"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>`;

const vanIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0ea5a9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 8px;"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/></svg>`;

const conciergeBellIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0ea5a9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 8px;"><path d="M10 5a2 2 0 1 1 4 0"/><path d="M12 7v1"/><path d="M18 16v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-2"/><path d="M4 16h16"/><path d="M6 16a6 6 0 1 1 12 0"/></svg>`;

// Get service icon based on service type
function getServiceIcon(serviceType: string): string {
  const type = serviceType.toLowerCase();
  
  // Car Rental
  if (type.includes("car") || type.includes("exotic")) {
    return carIcon;
  }
  
  // Flights / Charter / Scenic Flights
  if (type.includes("flight") || type.includes("charter") || type.includes("scenic")) {
    return airplaneIcon;
  }
  
  // Transportation / Transfer
  if (type.includes("transport") || type.includes("transfer")) {
    return vanIcon;
  }
  
  // Default: concierge bell
  return conciergeBellIcon;
}

// Get subject emoji based on service type
function getSubjectEmoji(serviceType: string): string {
  const type = serviceType.toLowerCase();
  
  if (type.includes("car") || type.includes("exotic")) {
    return "🚗";
  }
  if (type.includes("flight") || type.includes("charter") || type.includes("scenic")) {
    return "✈️";
  }
  if (type.includes("transport") || type.includes("transfer")) {
    return "🚐";
  }
  return "🛎️";
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: ConciergeNotification = await req.json();
    console.log("Received concierge notification:", data);

    const {
      caseNumber,
      serviceType,
      contactName,
      contactEmail,
      contactPhone,
      preferredDate,
      endDate,
      guests,
      specialRequests,
    } = data;

    // Format the preferred date and end date with month letters
    const formattedDate = formatDate(preferredDate);
    const formattedEndDate = endDate ? formatDate(endDate) : null;

    // Get dynamic icon and emoji based on service type
    const serviceIcon = getServiceIcon(serviceType);
    const subjectEmoji = getSubjectEmoji(serviceType);

    // Send email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "Margea Concierge <noreply@margeatravel.com>",
      to: ["admin@margeatravel.com"],
      subject: `${subjectEmoji} Concierge Request — ${serviceType} — Case #${caseNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0ea5a9; display: flex; align-items: center;">
            ${serviceIcon}
            <span style="display: inline-block; vertical-align: middle;">New Concierge Service Request</span>
          </h1>
          <p style="font-size: 18px; font-weight: bold;">Case Number: ${caseNumber}</p>
          
          <h2 style="color: #333; border-bottom: 2px solid #0ea5a9; padding-bottom: 8px;">Service Requested</h2>
          <p style="font-size: 20px; font-weight: bold; color: #0ea5a9;">${serviceType}</p>
          
          <h2 style="color: #333; border-bottom: 2px solid #0ea5a9; padding-bottom: 8px;">Contact Information</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; font-weight: bold;">Name:</td><td>${contactName}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Email:</td><td><a href="mailto:${contactEmail}">${contactEmail}</a></td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Phone:</td><td>${contactPhone || "Not provided"}</td></tr>
          </table>
          
          <h2 style="color: #333; border-bottom: 2px solid #0ea5a9; padding-bottom: 8px; margin-top: 24px;">Request Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; font-weight: bold;">Preferred Date:</td><td>${formattedDate}</td></tr>
            ${formattedEndDate ? `<tr><td style="padding: 8px 0; font-weight: bold;">End Date:</td><td>${formattedEndDate}</td></tr>` : `<tr><td style="padding: 8px 0; font-weight: bold;">End Date:</td><td>Same-day rental</td></tr>`}
            <tr><td style="padding: 8px 0; font-weight: bold;">Number of Guests:</td><td>${guests || "Not specified"}</td></tr>
          </table>
          
          ${specialRequests ? `
          <h3 style="color: #333; margin-top: 24px;">Special Requests</h3>
          <p style="background: #f5f5f5; padding: 16px; border-radius: 8px;">${specialRequests}</p>
          ` : ""}
          
          <hr style="margin: 32px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px;">This email was sent from the Margea concierge service form.</p>
        </div>
      `,
    });

    console.log("Admin email sent:", adminEmailResponse);

    // Format date for client email as well
    const clientFormattedDate = formatDate(preferredDate);
    const clientFormattedEndDate = endDate ? formatDate(endDate) : null;

    // Send confirmation email to client
    const clientEmailResponse = await resend.emails.send({
      from: "Margea <noreply@margeatravel.com>",
      to: [contactEmail],
      subject: `Concierge Request Received - Case #${caseNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0ea5a9;">Thank You for Your Request!</h1>
          
          <p>Dear ${contactName},</p>
          
          <p>We have received your concierge service request for <strong>${serviceType}</strong>. Our team will review it and get back to you shortly.</p>
          
          <div style="background: #f0fdfa; border: 2px solid #0ea5a9; border-radius: 8px; padding: 20px; margin: 24px 0; text-align: center;">
            <p style="margin: 0; color: #666; font-size: 14px;">Your Case Number</p>
            <p style="margin: 8px 0 0 0; font-size: 28px; font-weight: bold; color: #0ea5a9;">${caseNumber}</p>
          </div>
          
          <p>Please save this case number for your records. You can reference it in any future communication with us.</p>
          
          <h3 style="color: #333;">Request Summary</h3>
          <table style="width: 100%; border-collapse: collapse; background: #f9f9f9; border-radius: 8px;">
            <tr><td style="padding: 12px; font-weight: bold;">Service:</td><td style="padding: 12px;">${serviceType}</td></tr>
            ${preferredDate ? `<tr><td style="padding: 12px; font-weight: bold;">Preferred Date:</td><td style="padding: 12px;">${clientFormattedDate}</td></tr>` : ""}
            ${clientFormattedEndDate ? `<tr><td style="padding: 12px; font-weight: bold;">End Date:</td><td style="padding: 12px;">${clientFormattedEndDate}</td></tr>` : (preferredDate ? `<tr><td style="padding: 12px; font-weight: bold;">End Date:</td><td style="padding: 12px;">Same-day rental</td></tr>` : "")}
            ${guests ? `<tr><td style="padding: 12px; font-weight: bold;">Guests:</td><td style="padding: 12px;">${guests}</td></tr>` : ""}
          </table>
          
          <h3 style="color: #333;">What Happens Next?</h3>
          <ol style="color: #666; line-height: 1.8;">
            <li>Our concierge team will review your request within 24 hours</li>
            <li>We'll reach out to confirm availability and details</li>
            <li>Once confirmed, we'll send you all the information you need</li>
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
            This email was sent because you submitted a concierge service request on our website.
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
    console.error("Error in send-concierge-notification:", error);
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
