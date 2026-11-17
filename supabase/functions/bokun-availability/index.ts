import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const BOKUN_API_BASE = "https://api.bokun.io";

/**
 * Generate Bokun HMAC-SHA1 signature.
 * Signature base = date + accessKey + httpMethod + path
 */
async function generateBokunSignature(
  secretKey: string,
  accessKey: string,
  method: string,
  path: string,
  date: string
): Promise<string> {
  const signatureBase = date + accessKey + method + path;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secretKey),
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(signatureBase));
  return base64Encode(signature);
}

function formatBokunDate(d: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const BOKUN_ACCESS_KEY = Deno.env.get("BOKUN_ACCESS_KEY");
    const BOKUN_SECRET_KEY = Deno.env.get("BOKUN_SECRET_KEY");

    if (!BOKUN_ACCESS_KEY) {
      throw new Error("BOKUN_ACCESS_KEY is not configured");
    }
    if (!BOKUN_SECRET_KEY) {
      throw new Error("BOKUN_SECRET_KEY is not configured");
    }

    const { experienceId, startDate, endDate, currency } = await req.json();

    if (!experienceId || !startDate) {
      return new Response(
        JSON.stringify({ error: "experienceId and startDate are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Default endDate to startDate if not provided (single day query)
    const end = endDate || startDate;
    const curr = currency || "USD";

    const path = `/activity.json/${experienceId}/availabilities?start=${startDate}&end=${end}&currency=${curr}`;
    const method = "GET";
    const now = new Date();
    const bokunDate = formatBokunDate(now);

    const signature = await generateBokunSignature(
      BOKUN_SECRET_KEY,
      BOKUN_ACCESS_KEY,
      method,
      path,
      bokunDate
    );

    const response = await fetch(`${BOKUN_API_BASE}${path}`, {
      method,
      headers: {
        "X-Bokun-Date": bokunDate,
        "X-Bokun-AccessKey": BOKUN_ACCESS_KEY,
        "X-Bokun-Signature": signature,
        "Content-Type": "application/json;charset=UTF-8",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Bokun API error [${response.status}]: ${errorText}`);
      return new Response(
        JSON.stringify({ error: `Bokun API error: ${response.status}`, details: errorText }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();

    // Transform Bokun response into a simpler format for frontend
    const availabilities = Array.isArray(data)
      ? data.map((slot: any) => ({
          id: slot.id,
          date: slot.date,
          localizedDate: slot.localizedDate,
          startTime: slot.startTime,
          startTimeId: slot.startTimeId,
          availabilityCount: slot.availabilityCount,
          unlimited: slot.unlimited,
          soldOut: slot.soldOut,
          prices: slot.pricesByRate || slot.prices || [],
        }))
      : [];

    return new Response(JSON.stringify({ availabilities }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Bokun availability error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
