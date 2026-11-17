import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper function to format dates for iCal (YYYYMMDD)
const formatICalDate = (dateStr: string): string => {
  // dateStr is a plain date "YYYY-MM-DD" from Postgres; avoid timezone shifts
  return dateStr.slice(0, 10).replace(/-/g, "");
};

const escapeText = (value: string): string =>
  value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

// Extract the origin listing id from a feed URL, e.g.
// https://www.airbnb.mx/calendar/ical/1756034004988314568.ics?t=... -> "1756034004988314568"
const listingIdFromSourceUrl = (sourceUrl: string | null): string | null => {
  if (!sourceUrl) return null;
  const match = sourceUrl.match(/\/ical\/([^/?.]+)\.ics/i) ?? sourceUrl.match(/(\d{8,})/);
  return match ? match[1] : null;
};


const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const propertyId = url.searchParams.get("property_id");
    // Optional: avoid echoing a platform's own blocks back to itself
    const excludeSourceUrl = url.searchParams.get("exclude_source_url");
    const excludeSourceName = url.searchParams.get("exclude_source_name");
    // Per-listing export: omit events that originated from this listing id
    const excludeSource = (url.searchParams.get("exclude_source") ?? "").trim() || null;


    if (!propertyId) {
      return new Response("Missing property_id parameter", {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Service role: external_bookings is not readable by anon (RLS)
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { data: property, error: propertyError } = await supabaseClient
      .from("properties")
      .select("title, location")
      .eq("id", propertyId)
      .single();

    if (propertyError || !property) {
      return new Response("Property not found", {
        status: 404,
        headers: corsHeaders,
      });
    }

    const [bookingsRes, externalRes] = await Promise.all([
      supabaseClient
        .from("bookings")
        .select("id, check_in, check_out, guest_name, booking_reference, status")
        .eq("property_id", propertyId)
        .in("status", ["confirmed", "pending"]),
      supabaseClient
        .from("external_bookings")
        .select("id, check_in, check_out, summary, external_id, source_name, source_url")
        .eq("property_id", propertyId),
    ]);

    if (bookingsRes.error) {
      console.error("Error fetching bookings:", bookingsRes.error);
      return new Response("Error fetching bookings", { status: 500, headers: corsHeaders });
    }
    if (externalRes.error) {
      console.error("Error fetching external bookings:", externalRes.error);
      return new Response("Error fetching blocked dates", { status: 500, headers: corsHeaders });
    }

    const domain = new URL(Deno.env.get("SUPABASE_URL") ?? "https://margeatravel.com").hostname;
    const now = new Date();
    const nowFormatted = now.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    const lines: string[] = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Margea Travel//Booking Calendar//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      `X-WR-CALNAME:${escapeText(`${property.title} - ${property.location}`)}`,
      "X-WR-TIMEZONE:America/Cancun",
    ];

    const seenUids = new Set<string>();
    const pushEvent = (uid: string, checkIn: string, checkOut: string, summary: string, description: string, status: string) => {
      if (!checkIn || !checkOut || seenUids.has(uid)) return;
      seenUids.add(uid);
      lines.push(
        "BEGIN:VEVENT",
        `UID:${uid}`,
        `DTSTAMP:${nowFormatted}`,
        `DTSTART;VALUE=DATE:${formatICalDate(checkIn)}`,
        `DTEND;VALUE=DATE:${formatICalDate(checkOut)}`,
        `SUMMARY:${escapeText(summary)}`,
        `DESCRIPTION:${escapeText(description)}`,
        `STATUS:${status}`,
        "TRANSP:OPAQUE",
        "END:VEVENT"
      );
    };

    // Direct bookings on Margea Travel
    for (const b of bookingsRes.data ?? []) {
      pushEvent(
        `${b.id}@${domain}`,
        b.check_in,
        b.check_out,
        `Reserved - ${b.guest_name || "Guest"}`,
        `Booking Reference: ${b.booking_reference || b.id}\nStatus: ${b.status}`,
        b.status === "confirmed" ? "CONFIRMED" : "TENTATIVE"
      );
    }

    // Blocked dates synced from external platforms (Airbnb, VRBO, ...)
    for (const e of externalRes.data ?? []) {
      if (excludeSourceUrl && e.source_url === excludeSourceUrl) continue;
      if (excludeSourceName && e.source_name === excludeSourceName) continue;
      if (excludeSource) {
        const originListingId = listingIdFromSourceUrl(e.source_url);
        if (originListingId === excludeSource || (e.source_url ?? "").includes(excludeSource)) continue;
      }

      pushEvent(
        e.external_id ? `${e.external_id}` : `ext-${e.id}@${domain}`,
        e.check_in,
        e.check_out,
        e.summary || "Reserved",
        `Blocked via ${e.source_name || "external calendar"}`,
        "CONFIRMED"
      );
    }

    lines.push("END:VCALENDAR");
    const icalContent = lines.join("\r\n");

    console.log(
      `iCal export ${propertyId}: ${bookingsRes.data?.length ?? 0} direct + ${externalRes.data?.length ?? 0} external = ${seenUids.size} events`
    );

    return new Response(icalContent, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "text/calendar; charset=utf-8",
        "Cache-Control": "no-cache",
        "Content-Disposition": `attachment; filename="margea-${propertyId}.ics"`,
      },
    });
  } catch (error) {
    console.error("Error generating iCal:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
