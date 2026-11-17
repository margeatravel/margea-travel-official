import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ICalEvent {
  uid: string;
  start: Date;
  end: Date;
  summary: string;
}

// Simple iCal parser
const parseICalFeed = (icalContent: string): ICalEvent[] => {
  const events: ICalEvent[] = [];
  const lines = icalContent.split(/\r?\n/);
  
  let currentEvent: Partial<ICalEvent> | null = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line === 'BEGIN:VEVENT') {
      currentEvent = {};
    } else if (line === 'END:VEVENT' && currentEvent) {
      if (currentEvent.uid && currentEvent.start && currentEvent.end) {
        events.push(currentEvent as ICalEvent);
      }
      currentEvent = null;
    } else if (currentEvent) {
      if (line.startsWith('UID:')) {
        currentEvent.uid = line.substring(4);
      } else if (line.startsWith('DTSTART')) {
        const dateStr = line.split(':')[1];
        currentEvent.start = parseiCalDate(dateStr);
      } else if (line.startsWith('DTEND')) {
        const dateStr = line.split(':')[1];
        currentEvent.end = parseiCalDate(dateStr);
      } else if (line.startsWith('SUMMARY:')) {
        currentEvent.summary = line.substring(8);
      }
    }
  }
  
  return events;
};

// Parse iCal date format (YYYYMMDD or YYYYMMDDTHHmmssZ)
const parseiCalDate = (dateStr: string): Date => {
  const year = parseInt(dateStr.substring(0, 4));
  const month = parseInt(dateStr.substring(4, 6)) - 1;
  const day = parseInt(dateStr.substring(6, 8));
  return new Date(year, month, day);
};

// Format a local Date as YYYY-MM-DD (no timezone shift)
const formatDate = (d: Date): string => {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[ICAL-SYNC] ${step}${detailsStr}`);
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Starting iCal sync");

    // Require an authenticated admin caller (or the service role) to trigger this destructive sync.
    const authHeader = req.headers.get("Authorization") || "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const token = authHeader.replace(/^Bearer\s+/i, "");

    const syncSecret = Deno.env.get("ICAL_SYNC_SECRET") ?? "";
    const providedSyncSecret = req.headers.get("x-sync-secret") ?? "";

    const isServiceRole = token && token === serviceRoleKey;
    const isScheduledCaller = syncSecret.length > 0 && providedSyncSecret === syncSecret;

    if (!isServiceRole && !isScheduledCaller) {
      if (!token) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const authedClient = createClient(supabaseUrl, anonKey, {
        global: { headers: { Authorization: `Bearer ${token}` } },
      });
      const { data: userData, error: userError } = await authedClient.auth.getUser(token);
      if (userError || !userData?.user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { data: isAdmin } = await authedClient.rpc("has_role", {
        _user_id: userData.user.id,
        _role: "admin",
      });
      if (!isAdmin) {
        return new Response(JSON.stringify({ error: "Forbidden" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Initialize Supabase client with service role for database operations
    const supabaseClient = createClient(supabaseUrl, serviceRoleKey);

    // Fetch all properties with external iCal URLs
    const { data: properties, error: propertiesError } = await supabaseClient
      .from("properties")
      .select("id, title, external_ical_urls")
      .not("external_ical_urls", "is", null);

    if (propertiesError) {
      logStep("Error fetching properties", propertiesError);
      throw propertiesError;
    }

    logStep(`Found ${properties?.length || 0} properties with external calendars`);

    let totalSynced = 0;
    const syncResults: any[] = [];

    for (const property of properties || []) {
      if (!property.external_ical_urls || property.external_ical_urls.length === 0) {
        continue;
      }

      logStep(`Syncing property: ${property.title}`, { id: property.id });

      // Purge rows whose source_url is no longer an active feed for this property
      const activeUrls: string[] = property.external_ical_urls;
      const { error: staleError } = await supabaseClient
        .from("external_bookings")
        .delete()
        .eq("property_id", property.id)
        .not("source_url", "in", `(${activeUrls.map((u) => `"${u}"`).join(",")})`);
      if (staleError) logStep("Error purging stale feeds", staleError);

      for (const icalUrl of property.external_ical_urls) {
        try {
          logStep(`Fetching iCal from: ${icalUrl}`);
          
          // Fetch the iCal feed
          const response = await fetch(icalUrl);
          if (!response.ok) {
            logStep(`Failed to fetch iCal`, { url: icalUrl, status: response.status });
            continue;
          }

          const icalContent = await response.text();
          const events = parseICalFeed(icalContent);
          
          logStep(`Parsed ${events.length} events from iCal feed`);

          // Determine source name from URL (covers airbnb.com, airbnb.mx, ...)
          const lowerUrl = icalUrl.toLowerCase();
          let sourceName = 'External';
          if (lowerUrl.includes('airbnb')) sourceName = 'Airbnb';
          else if (lowerUrl.includes('vrbo') || lowerUrl.includes('homeaway')) sourceName = 'VRBO';
          else if (lowerUrl.includes('booking.com')) sourceName = 'Booking.com';

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const rows = events
            .filter((event) => event.end >= today)
            .map((event) => ({
              property_id: property.id,
              source_name: sourceName,
              source_url: icalUrl,
              external_id: event.uid,
              check_in: formatDate(event.start),
              check_out: formatDate(event.end),
              summary: event.summary || 'Reserved',
            }));

          let writeOk = true;
          if (rows.length > 0) {
            // UID (external_id) is the unique key — upsert never duplicates
            const { error: upsertError } = await supabaseClient
              .from("external_bookings")
              .upsert(rows, { onConflict: "property_id,source_url,external_id" });

            if (upsertError) {
              writeOk = false;
              logStep("Error upserting external bookings", upsertError);
            } else {
              totalSynced += rows.length;
            }
          }

          // Remove rows for this feed whose UID is no longer present (cancellations).
          // Only prune when the write above succeeded, so a failure never wipes good data.
          if (writeOk) {
            const keepUids = rows.map((r) => r.external_id);
            let removeQuery = supabaseClient
              .from("external_bookings")
              .delete()
              .eq("property_id", property.id)
              .eq("source_url", icalUrl);
            if (keepUids.length > 0) {
              removeQuery = removeQuery.not(
                "external_id",
                "in",
                `(${keepUids.map((u) => `"${u}"`).join(",")})`
              );
            }
            await removeQuery;
          }

          syncResults.push({
            property_id: property.id,
            property_title: property.title,
            source: sourceName,
            events_synced: events.length
          });

        } catch (error) {
          logStep(`Error syncing calendar from ${icalUrl}`, error);
          syncResults.push({
            property_id: property.id,
            property_title: property.title,
            url: icalUrl,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }
    }

    logStep(`Sync completed. Total bookings synced: ${totalSynced}`);

    return new Response(
      JSON.stringify({
        success: true,
        total_synced: totalSynced,
        properties_processed: properties?.length || 0,
        results: syncResults
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    logStep("ERROR in iCal sync", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
