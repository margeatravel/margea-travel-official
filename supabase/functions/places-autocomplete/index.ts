import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Direct Google Maps API — no Lovable Connector Gateway.
// Server API key is read from the environment at runtime (never hardcoded).
// Places API (New) lives on places.googleapis.com — NOT maps.googleapis.com
// (the old host returns Google's HTML 404 page for /places/v1/...).
const PLACES_BASE_URL = "https://places.googleapis.com";

interface AutocompleteRequest {
  input: string;
  sessionToken?: string;
}

interface PlaceDetailsRequest {
  placeId: string;
  sessionToken?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey =
      Deno.env.get("GOOGLE_MAPS_API_KEY_1") ?? Deno.env.get("GOOGLE_MAPS_API_KEY");
    if (!apiKey) throw new Error("Google Maps API key is not configured");

    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    if (action === "autocomplete") {
      const { input, sessionToken }: AutocompleteRequest = await req.json();

      if (!input || input.length < 3) {
        return new Response(
          JSON.stringify({ predictions: [] }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log("Places autocomplete (New) request:", { input });

      const body: Record<string, unknown> = {
        input,
        includedRegionCodes: ["mx", "us", "ca"],
      };
      if (sessionToken) body.sessionToken = sessionToken;

      const response = await fetch(`${PLACES_BASE_URL}/places/v1/places:autocomplete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
        },
        body: JSON.stringify(body),
      });

      // Read as text first: Google returns an HTML error page (not JSON)
      // for wrong hosts/keys, and response.json() on HTML hides the cause.
      const rawText = await response.text();
      console.log("Autocomplete (New) status:", response.status, "url:", response.url, "body:", rawText.slice(0, 300));

      if (!response.ok) {
        throw new Error(
          `Places API (New) error ${response.status}: ${rawText.slice(0, 500)}`
        );
      }

      const data = JSON.parse(rawText);

      const predictions = (data.suggestions || [])
        .map((s: any) => s.placePrediction)
        .filter(Boolean)
        .map((p: any) => ({
          placeId: p.placeId,
          description: p.text?.text || "",
          mainText: p.structuredFormat?.mainText?.text || p.text?.text || "",
          secondaryText: p.structuredFormat?.secondaryText?.text || "",
        }));

      return new Response(
        JSON.stringify({ predictions }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else if (action === "details") {
      const { placeId, sessionToken }: PlaceDetailsRequest = await req.json();

      if (!placeId) {
        throw new Error("placeId is required");
      }

      console.log("Place details (New) request:", { placeId });

      const detailsUrl = new URL(`${PLACES_BASE_URL}/places/v1/places/${placeId}`);
      if (sessionToken) detailsUrl.searchParams.set("sessionToken", sessionToken);

      const response = await fetch(detailsUrl.toString(), {
        method: "GET",
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "id,displayName,formattedAddress,location",
        },
      });

      const rawText = await response.text();
      console.log("Details (New) status:", response.status, "url:", response.url, "body:", rawText.slice(0, 300));

      if (!response.ok) {
        throw new Error(
          `Place Details (New) error ${response.status}: ${rawText.slice(0, 500)}`
        );
      }

      const data = JSON.parse(rawText);

      return new Response(
        JSON.stringify({
          placeId: data.id,
          formattedAddress: data.formattedAddress,
          name: data.displayName?.text || data.formattedAddress,
          lat: data.location?.latitude,
          lng: data.location?.longitude,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      throw new Error("Invalid action. Use ?action=autocomplete or ?action=details");
    }
  } catch (error: unknown) {
    console.error("Places API error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
