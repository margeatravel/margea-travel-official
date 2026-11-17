import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export interface SelectedPlace {
  placeId: string;
  formattedAddress: string;
  name: string;
  lat: number;
  lng: number;
}

interface Prediction {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
}

interface AddressAutocompleteProps {
  label: string;
  placeholder: string;
  value: SelectedPlace | null;
  onChange: (place: SelectedPlace | null) => void;
  error?: string;
  required?: boolean;
}

const FUNCTION_URL = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/places-autocomplete`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

const newSessionToken = () =>
  (crypto as any).randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);

export const AddressAutocomplete = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  required = false,
}: AddressAutocompleteProps) => {
  const [inputValue, setInputValue] = useState(value?.formattedAddress || "");
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const sessionTokenRef = useRef<string>(newSessionToken());
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<boolean>(!!value);

  useEffect(() => {
    if (value?.formattedAddress) {
      setInputValue(value.formattedAddress);
      selectedRef.current = true;
    } else if (!value) {
      selectedRef.current = false;
    }
  }, [value]);

  // Close dropdown on outside click
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const fetchPredictions = useCallback(async (input: string) => {
    setLoading(true);
    setApiError(null);
    try {
      const res = await fetch(`${FUNCTION_URL}?action=autocomplete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: ANON_KEY,
          Authorization: `Bearer ${ANON_KEY}`,
        },
        body: JSON.stringify({
          input,
          sessionToken: sessionTokenRef.current,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || `Request failed (${res.status})`);
      }
      setPredictions(data.predictions || []);
      setOpen(true);
    } catch (e) {
      console.error("Autocomplete error:", e);
      setApiError("Address lookup is temporarily unavailable. Please type your full address.");
      setPredictions([]);
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setInputValue(text);
    selectedRef.current = false;
    onChange(null);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (text.trim().length < 3) {
      setPredictions([]);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      fetchPredictions(text.trim());
    }, 300);
  };

  const handleSelect = async (p: Prediction) => {
    setOpen(false);
    setLoading(true);
    setApiError(null);
    try {
      const res = await fetch(`${FUNCTION_URL}?action=details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: ANON_KEY,
          Authorization: `Bearer ${ANON_KEY}`,
        },
        body: JSON.stringify({
          placeId: p.placeId,
          sessionToken: sessionTokenRef.current,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || `Request failed (${res.status})`);
      }
      const place: SelectedPlace = {
        placeId: data.placeId,
        formattedAddress: data.formattedAddress,
        name: data.name,
        lat: data.lat,
        lng: data.lng,
      };
      setInputValue(place.formattedAddress);
      selectedRef.current = true;
      onChange(place);
      // Start a new session token after a successful selection
      sessionTokenRef.current = newSessionToken();
    } catch (e) {
      console.error("Details error:", e);
      setApiError("Could not load that address. Please try another.");
    } finally {
      setLoading(false);
    }
  };

  const hasValue = !!value && !!inputValue.trim();

  return (
    <div className="space-y-2" ref={containerRef}>
      <Label className="text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
        </div>
        <Input
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleChange}
          onFocus={() => {
            if (predictions.length > 0) setOpen(true);
          }}
          className={`pl-10 pr-9 bg-background border-border ${
            error ? "border-destructive" : hasValue ? "border-green-500" : ""
          }`}
          autoComplete="off"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : hasValue ? (
            <div className="h-2 w-2 rounded-full bg-green-500" />
          ) : null}
        </div>

        {open && predictions.length > 0 && (
          <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover shadow-lg max-h-72 overflow-auto">
            {predictions.map((p) => (
              <button
                key={p.placeId}
                type="button"
                onClick={() => handleSelect(p)}
                className="w-full text-left px-3 py-2 hover:bg-accent flex items-start gap-2 border-b border-border last:border-b-0"
              >
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <div className="text-sm text-foreground truncate">{p.mainText}</div>
                  {p.secondaryText && (
                    <div className="text-xs text-muted-foreground truncate">
                      {p.secondaryText}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {apiError && !error && (
        <div className="flex items-center gap-1.5 text-amber-600 text-sm">
          <AlertCircle className="h-3.5 w-3.5" />
          <span>{apiError}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 text-destructive text-sm">
          <AlertCircle className="h-3.5 w-3.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
