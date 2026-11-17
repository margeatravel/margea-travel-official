import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomePayload {
  first_name: string;
  email: string;
}

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const RESEND_API_URL = "https://api.resend.com/emails";
const FROM_ADDRESS = "Margea Members <hello@margeatravel.com>";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const body = (await req.json()) as Partial<WelcomePayload>;
    const first_name = (body.first_name || "").toString().trim();
    const email = (body.email || "").toString().trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Anti-abuse: only send a welcome email if the address matches an existing member record.
    // Prevents anonymous callers from triggering Margea-branded emails to arbitrary inboxes.
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );
    const { data: memberRow, error: memberError } = await adminClient
      .from("members")
      .select("id")
      .ilike("email", email)
      .maybeSingle();

    if (memberError) {
      console.error("members lookup failed", memberError);
      return new Response(
        JSON.stringify({ error: "Lookup failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (!memberRow) {
      // Silently no-op so we don't reveal whether the address exists.
      return new Response(
        JSON.stringify({ ok: true, skipped: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const safeName = first_name || "there";

    const html = `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background-color:#f7f6f3;font-family:'Helvetica Neue',Arial,sans-serif;color:#1d2839;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f7f6f3;padding:40px 20px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(29,40,57,0.08);">
            <tr>
              <td style="background-color:#1d2839;padding:40px 32px;text-align:center;">
                <h1 style="margin:0;color:#c9a96e;font-family:'Cormorant Garamond',Georgia,serif;font-size:36px;font-weight:500;letter-spacing:1px;">Margea Members</h1>
                <p style="margin:8px 0 0;color:#f7f6f3;font-size:14px;letter-spacing:2px;text-transform:uppercase;">Your Key to the Riviera Maya</p>
              </td>
            </tr>
            <tr>
              <td style="padding:40px 32px;">
                <h2 style="margin:0 0 20px;font-family:'Cormorant Garamond',Georgia,serif;font-size:28px;font-weight:500;color:#1d2839;">Welcome to Margea Members 🌊</h2>
                <p style="font-size:16px;line-height:1.6;margin:0 0 16px;">Hi ${safeName},</p>
                <p style="font-size:16px;line-height:1.6;margin:0 0 16px;">Welcome to Margea Members — your key to the Riviera Maya.</p>
                <p style="font-size:16px;line-height:1.6;margin:0 0 24px;">Your membership is now <strong>pending activation</strong>. To unlock all your benefits, simply make your first direct booking with us.</p>

                <div style="background-color:#f7f6f3;border-left:4px solid #c9a96e;padding:20px 24px;margin:24px 0;border-radius:4px;">
                  <p style="margin:0 0 12px;font-weight:600;color:#1d2839;font-size:15px;">Your exclusive member benefits include:</p>
                  <ul style="margin:0;padding-left:20px;color:#1d2839;font-size:15px;line-height:1.8;">
                    <li>Direct booking discounts (no platform fees)</li>
                    <li>Credits on every stay</li>
                    <li>Priority access to new properties</li>
                  </ul>
                </div>

                <p style="font-size:16px;line-height:1.6;margin:24px 0 12px;font-weight:600;">Ready to plan your next trip?</p>
                <p style="font-size:16px;line-height:1.6;margin:0 0 8px;">Contact our team at <a href="mailto:admin@margeatravel.com" style="color:#c9a96e;text-decoration:none;font-weight:600;">admin@margeatravel.com</a></p>
                <p style="font-size:16px;line-height:1.6;margin:0 0 32px;">or WhatsApp us at <a href="https://wa.me/529982334867" style="color:#c9a96e;text-decoration:none;font-weight:600;">+52 998 233 4867</a></p>

                <p style="font-size:16px;line-height:1.6;margin:0;color:#1d2839;">See you in paradise,<br/><em style="font-family:'Cormorant Garamond',Georgia,serif;font-size:18px;color:#c9a96e;">The Margea Team</em></p>
              </td>
            </tr>
            <tr>
              <td style="background-color:#1d2839;padding:24px 32px;text-align:center;color:#f7f6f3;font-size:12px;line-height:1.6;">
                <p style="margin:0;">Margea Travel · Riviera Maya, Mexico</p>
                <p style="margin:6px 0 0;"><a href="https://margeatravel.com" style="color:#c9a96e;text-decoration:none;">margeatravel.com</a></p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

    const text = `Hi ${safeName},

Welcome to Margea Members — your key to the Riviera Maya.

Your membership is now pending activation. To unlock all your benefits, simply make your first direct booking with us.

Your exclusive member benefits include:
• Direct booking discounts (no platform fees)
• Credits on every stay
• Priority access to new properties

Ready to plan your next trip?
Contact our team at admin@margeatravel.com
or WhatsApp us at +52 998 233 4867

See you in paradise,
The Margea Team`;

    const response = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: [email],
        subject: "Welcome to Margea Members 🌊",
        html,
        text,
        reply_to: "admin@margeatravel.com",
      }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error("Resend send failed", response.status, data);
      return new Response(
        JSON.stringify({ error: "Failed to send welcome email", details: data }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ ok: true, id: data?.id ?? null }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("send-member-welcome error", err);
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
