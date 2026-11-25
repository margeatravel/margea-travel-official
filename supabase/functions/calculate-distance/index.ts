import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Direct Google Maps API — no Lovable Connector Gateway.
// Server API key is read from the environment at runtime (never hardcoded).
//
// IMPORTANT: use the LEGACY endpoints on maps.googleapis.com.
// The Routes API host (routes.googleapis.com) returns Google's HTML 404
// page when called from the Supabase edge runtime, even though the same
// requests work from elsewhere. Geocoding + legacy Distance Matrix work
// fine here.
const MAPS_BASE_URL = "https://maps.googleapis.com";

interface DistanceRequest {
  pickup: string;
  dropoff: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pickup, dropoff }: DistanceRequest = await req.json();
    console.log("Calculating distance:", { pickup, dropoff });

    const apiKey =
      Deno.env.get("GOOGLE_MAPS_API_KEY_1") ?? Deno.env.get("GOOGLE_MAPS_API_KEY");
    if (!apiKey) throw new Error("Google Maps API key is not configured");

    // Geocode both addresses (legacy Geocoding API, key as query param)
    const geocode = async (address: string) => {
      const url = `${MAPS_BASE_URL}/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
      const r = await fetch(url);
      const data = await r.json();
      if (data.status !== "OK" || !data.results?.[0]) {
        throw new Error(
          `Geocoding failed for "${address}": ${data.status} ${data.error_message || ""}`
        );
      }
      const top = data.results[0];
      return {
        lat: top.geometry.location.lat,
        lng: top.geometry.location.lng,
        formattedAddress: top.formatted_address as string,
      };
    };

    const [origin, destination] = await Promise.all([
      geocode(pickup),
      geocode(dropoff),
    ]);

    // Legacy Distance Matrix API (same host as Geocoding)
    const matrixUrl = new URL(`${MAPS_BASE_URL}/maps/api/distancematrix/json`);
    matrixUrl.searchParams.set("origins", `${origin.lat},${origin.lng}`);
    matrixUrl.searchParams.set("destinations", `${destination.lat},${destination.lng}`);
    matrixUrl.searchParams.set("mode", "driving");
    matrixUrl.searchParams.set("key", apiKey);

    const response = await fetch(matrixUrl.toString());
    // Read as text first: Google returns an HTML error page (not JSON)
    // for wrong hosts/keys, and response.json() on HTML hides the cause.
    const rawText = await response.text();
    console.log("Distance Matrix status:", response.status, "body:", rawText.slice(0, 300));

    if (!response.ok) {
      throw new Error(`Distance Matrix error ${response.status}: ${rawText.slice(0, 500)}`);
    }

    const data = JSON.parse(rawText);
    const element = data.rows?.[0]?.elements?.[0];
    if (!element || element.status !== "OK" || element.distance?.value == null) {
      throw new Error(`No route found: ${JSON.stringify(element)}`);
    }

    const distanceKm = Math.round(element.distance.value / 1000);
    const durationMinutes = Math.round((element.duration?.value || 0) / 60);

    return new Response(
      JSON.stringify({
        distance_km: distanceKm,
        duration_minutes: durationMinutes,
        pickup_address: origin.formattedAddress,
        dropoff_address: destination.formattedAddress,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: unknown) {
    console.error("Error calculating distance:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
