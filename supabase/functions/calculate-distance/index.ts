import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

    // Direct Google Maps API key (no Lovable gateway).
    const apiKey = Deno.env.get("GOOGLE_MAPS_API_KEY");
    if (!apiKey) throw new Error("Google Maps API key is not configured");

    // Geocode both addresses via the Geocoding API
    const geocode = async (address: string) => {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
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

    // Routes API — computeRouteMatrix
    const body = {
      origins: [
        {
          waypoint: {
            location: { latLng: { latitude: origin.lat, longitude: origin.lng } },
          },
        },
      ],
      destinations: [
        {
          waypoint: {
            location: {
              latLng: { latitude: destination.lat, longitude: destination.lng },
            },
          },
        },
      ],
      travelMode: "DRIVE",
      routingPreference: "TRAFFIC_UNAWARE",
    };

    const response = await fetch(
      "https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "originIndex,destinationIndex,distanceMeters,duration,status,condition",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    console.log("Routes API status:", response.status, JSON.stringify(data).slice(0, 500));

    if (!response.ok) {
      throw new Error(`Routes API error ${response.status}: ${JSON.stringify(data)}`);
    }

    // Response may be an array of elements or a single object
    const elements = Array.isArray(data) ? data : [data];
    const element = elements[0];

    if (!element || element.condition !== "ROUTE_EXISTS" || element.distanceMeters == null) {
      throw new Error(`No route found: ${JSON.stringify(element)}`);
    }

    const distanceKm = Math.round(element.distanceMeters / 1000);
    const durationSeconds =
      typeof element.duration === "string"
        ? parseInt(element.duration.replace("s", ""), 10)
        : 0;
    const durationMinutes = Math.round(durationSeconds / 60);

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
