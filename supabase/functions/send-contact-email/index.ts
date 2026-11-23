import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  phone?: string;
  message: string;
  caseNumber: string;
  turnstileToken?: string | null;
  honeypot?: string;
}

/**
 * Verify a Cloudflare Turnstile token against Cloudflare's siteverify API.
 * Returns true only when Cloudflare confirms the token (data.success).
 */
async function verifyTurnstileToken(
  token: string | null | undefined,
  secret: string,
): Promise<boolean> {
  if (!token) return false;
  try {
    const body = new URLSearchParams();
    body.append("secret", secret);
    body.append("response", token);
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body },
    );
    const data = await res.json();
    return data?.success === true;
  } catch (err) {
    console.error("Turnstile siteverify request failed:", err);
    return false;
  }
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, message, caseNumber, turnstileToken, honeypot }: ContactEmailRequest = await req.json();

    console.log("Processing contact form submission:", { name, email, caseNumber });

    // --- Anti-bot verification (Cloudflare Turnstile + honeypot) ---
    // A filled honeypot field means a bot: reject without sending email.
    if (typeof honeypot === "string" && honeypot.trim() !== "") {
      console.warn("Rejected contact submission: honeypot field was filled (bot).");
      return new Response(
        JSON.stringify({ error: "Verification failed" }),
        { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }
    // TRANSITION BEHAVIOR: Turnstile verification is enforced ONLY when
    // TURNSTILE_SECRET_KEY is configured. Until the free Turnstile site is
    // created in Cloudflare and the secret is set on this project, submissions
    // are allowed through (with a warning logged) so real users are never
    // blocked. Once the secret exists, a missing/invalid token is rejected.
    const turnstileSecret = Deno.env.get("TURNSTILE_SECRET_KEY");
    if (turnstileSecret) {
      const verified = await verifyTurnstileToken(turnstileToken, turnstileSecret);
      if (!verified) {
        console.warn("Rejected contact submission: Turnstile verification failed.");
        return new Response(
          JSON.stringify({ error: "Verification failed" }),
          { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } },
        );
      }
    } else {
      console.warn("TURNSTILE_SECRET_KEY is not configured — Turnstile verification skipped (transition mode).");
    }

    // Send HIGH PRIORITY email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "Margea Contact <noreply@margeatravel.com>",
      to: ["admin@margeatravel.com"],
      subject: `🔴 NUEVO CONTACTO - ${name} - Case #${caseNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0ea5e9;">New Contact Form Submission</h1>
          <div style="background-color: #f0f9ff; border: 2px solid #0ea5e9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #666;">Case Number</p>
            <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: #0ea5e9;">${caseNumber}</p>
          </div>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          <p><strong>Message:</strong></p>
          <p style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">${message.replace(/\n/g, '<br>')}</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;"><em>Sent from Margea contact form</em></p>
        </div>
      `,
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'High'
      }
    });

    console.log("Admin email sent successfully:", adminEmailResponse);

    // Send confirmation email to user
    const userEmailResponse = await resend.emails.send({
      from: "Margea <noreply@margeatravel.com>",
      to: [email],
      subject: `We received your message - Case #${caseNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0ea5e9;">Thank you for contacting Margea, ${name}!</h1>
          <p>We have received your message and will get back to you as soon as possible.</p>
          
          <div style="background-color: #f0f9ff; border: 2px solid #0ea5e9; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; font-size: 14px; color: #666;">Your Case Number</p>
            <p style="margin: 5px 0 0 0; font-size: 28px; font-weight: bold; color: #0ea5e9;">${caseNumber}</p>
          </div>
          
          <p><strong>Your message:</strong></p>
          <p style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">${message.replace(/\n/g, '<br>')}</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          
          <p>Best regards,<br><strong>The Margea Team</strong></p>
          <p style="color: #666; font-size: 14px;">
            Email: <a href="mailto:admin@margeatravel.com" style="color: #0ea5e9;">admin@margeatravel.com</a><br>
            Phone: <a href="tel:+14696208199" style="color: #0ea5e9;">+1 (469) 620 8199</a><br>
            Instagram: <a href="https://www.instagram.com/margeatravel/" style="color: #0ea5e9;">@margeatravel</a>
          </p>
        </div>
      `,
    });

    console.log("User confirmation email sent successfully:", userEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true,
        caseNumber,
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
    console.error("Error in send-contact-email function:", error);
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
