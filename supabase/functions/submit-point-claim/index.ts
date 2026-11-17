import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const RESEND_API_URL = "https://api.resend.com/emails";
const FROM_ADDRESS = "Margea Members <hello@margeatravel.com>";
const ADMIN_EMAIL = "admin@margeatravel.com";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace("Bearer ", "").trim();
    if (!token) return json({ error: "Unauthorized" }, 401);

    const admin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const { data: userData, error: userError } = await admin.auth.getUser(token);
    const user = userData?.user;
    if (userError || !user) return json({ error: "Unauthorized" }, 401);

    const body = await req.json();
    const claimType = String(body?.claim_type ?? "").toLowerCase();
    const itemName = String(body?.item_name ?? "").trim();
    const platform = body?.platform ? String(body.platform).trim() : null;
    const bookingDate = String(body?.booking_date ?? "").trim();
    const amount = Number(body?.amount_usd);

    if (!["stay", "tour", "transport"].includes(claimType)) {
      return json({ error: "Invalid claim type" }, 400);
    }
    if (!itemName || itemName.length > 200) return json({ error: "Invalid item name" }, 400);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(bookingDate)) return json({ error: "Invalid date" }, 400);
    if (!Number.isFinite(amount) || amount <= 0 || amount > 1_000_000) {
      return json({ error: "Invalid amount" }, 400);
    }

    const points = Math.floor(amount * 0.1);
    const email = (user.email ?? "").toLowerCase();

    const { data: memberRow } = await admin
      .from("members")
      .select("id, first_name, last_name, credits_balance")
      .ilike("email", email)
      .maybeSingle();

    const memberName = memberRow
      ? `${memberRow.first_name ?? ""} ${memberRow.last_name ?? ""}`.trim()
      : null;

    const { error: insertError } = await admin.from("point_claims").insert({
      user_id: user.id,
      member_email: email,
      member_name: memberName,
      claim_type: claimType,
      item_name: itemName,
      platform: claimType === "stay" ? platform : null,
      booking_date: bookingDate,
      amount_usd: amount,
      points,
      status: "pending",
      admin_notes: "Points credited automatically on submission",
    });

    if (insertError) {
      console.error("claim insert failed", insertError);
      return json({ error: "Could not save claim" }, 500);
    }

    let newBalance: number | null = null;
    if (memberRow) {
      newBalance = (memberRow.credits_balance ?? 0) + points;
      const { error: updateError } = await admin
        .from("members")
        .update({ credits_balance: newBalance })
        .eq("id", memberRow.id);
      if (updateError) {
        console.error("balance update failed", updateError);
        newBalance = memberRow.credits_balance ?? 0;
      }
    }

    if (RESEND_API_KEY) {
      const rows: [string, string][] = [
        ["Member", memberName || "—"],
        ["Email", email],
        ["Claim type", claimType],
        [claimType === "stay" ? "Property" : claimType === "tour" ? "Tour" : "Transport route", itemName],
        ["Booking platform", claimType === "stay" ? platform || "—" : "—"],
        ["Date", bookingDate],
        ["Amount paid", `$${amount.toFixed(2)} USD`],
        ["Points credited", String(points)],
        ["New balance", newBalance !== null ? String(newBalance) : "—"],
      ];

      const html = `
        <div style="font-family:Arial,Helvetica,sans-serif;color:#1d2839;">
          <h2 style="font-weight:normal;">New Margea Points claim submitted</h2>
          <p style="font-size:14px;">Points were credited automatically. Please verify this booking.</p>
          <table style="border-collapse:collapse;font-size:14px;">
            ${rows
              .map(
                ([k, v]) =>
                  `<tr><td style="padding:6px 14px 6px 0;color:#1d2839;opacity:.7;">${k}</td><td style="padding:6px 0;"><strong>${v}</strong></td></tr>`,
              )
              .join("")}
          </table>
        </div>`;

      const res = await fetch(RESEND_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: FROM_ADDRESS,
          to: [ADMIN_EMAIL],
          reply_to: email,
          subject: `Points claim — ${memberName || email} (${points} pts)`,
          html,
        }),
      });
      if (!res.ok) {
        console.error("admin notification failed", res.status, await res.text());
      }
    }

    return json({ success: true, points, credits_balance: newBalance });
  } catch (err) {
    console.error("submit-point-claim error", err);
    return json({ error: "Unexpected error" }, 500);
  }
});
