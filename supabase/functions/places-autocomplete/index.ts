import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Direct Google Maps API — no Lovable Connector Gateway.
// Server API key is read from the environment at runtime (never hardcoded).
//
// IMPORTANT: use the LEGACY Places endpoints on maps.googleapis.com.
// The Places API (New) hosts (places.googleapis.com) return Google's HTML
// 404 page when called from the Supabase edge runtime, even though the
// same requests work from elsewhere. The legacy endpoints work fine here.
const MAPS_BASE_URL = "https://maps.googleapis.com";

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

      console.log("Places autocomplete (legacy) request:", { input });

      const autocompleteUrl = new URL(`${MAPS_BASE_URL}/maps/api/place/autocomplete/json`);
      autocompleteUrl.searchParams.set("input", input);
      autocompleteUrl.searchParams.set("key", apiKey);
      autocompleteUrl.searchParams.set("components", "country:mx|country:us|country:ca");
      if (sessionToken) autocompleteUrl.searchParams.set("sessiontoken", sessionToken);

      const response = await fetch(autocompleteUrl.toString());
      // Read as text first: Google returns an HTML error page (not JSON)
      // for wrong hosts/keys, and response.json() on HTML hides the cause.
      const rawText = await response.text();
      console.log("Autocomplete (legacy) status:", response.status, "body:", rawText.slice(0, 300));

      if (!response.ok) {
        throw new Error(`Places API error ${response.status}: ${rawText.slice(0, 500)}`);
      }

      const data = JSON.parse(rawText);
      if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
        throw new Error(`Places API error: ${data.status} ${data.error_message || ""}`);
      }

      const predictions = (data.predictions || []).map((p: any) => ({
        placeId: p.place_id,
        description: p.description || "",
        mainText: p.structured_formatting?.main_text || p.description || "",
        secondaryText: p.structured_formatting?.secondary_text || "",
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

      console.log("Place details (legacy) request:", { placeId });

      const detailsUrl = new URL(`${MAPS_BASE_URL}/maps/api/place/details/json`);
      detailsUrl.searchParams.set("place_id", placeId);
      detailsUrl.searchParams.set("key", apiKey);
      detailsUrl.searchParams.set("fields", "place_id,formatted_address,name,geometry");
      if (sessionToken) detailsUrl.searchParams.set("sessiontoken", sessionToken);

      const response = await fetch(detailsUrl.toString());
      const rawText = await response.text();
      console.log("Details (legacy) status:", response.status, "body:", rawText.slice(0, 300));

      if (!response.ok) {
        throw new Error(`Place Details error ${response.status}: ${rawText.slice(0, 500)}`);
      }

      const data = JSON.parse(rawText);
      if (data.status !== "OK" || !data.result) {
        throw new Error(`Place Details error: ${data.status} ${data.error_message || ""}`);
      }

      const result = data.result;
      return new Response(
        JSON.stringify({
          placeId: result.place_id,
          formattedAddress: result.formatted_address,
          name: result.name || result.formatted_address,
          lat: result.geometry?.location?.lat,
          lng: result.geometry?.location?.lng,
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
