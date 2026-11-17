import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export interface BokunSlot {
  id: string;
  date: number;
  localizedDate: string;
  startTime: string;
  startTimeId: number;
  availabilityCount: number;
  unlimited: boolean;
  soldOut: boolean;
  prices: any[];
}

interface UseBokunAvailabilityOptions {
  experienceId: string | undefined;
  date: Date | undefined;
  currency?: string;
  enabled?: boolean;
}

export function useBokunAvailability({
  experienceId,
  date,
  currency = "USD",
  enabled = true,
}: UseBokunAvailabilityOptions) {
  const [slots, setSlots] = useState<BokunSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!experienceId || !date || !enabled) {
      setSlots([]);
      setError(null);
      return;
    }

    let cancelled = false;
    const fetchAvailability = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const dateStr = format(date, "yyyy-MM-dd");
        const { data, error: fnError } = await supabase.functions.invoke(
          "bokun-availability",
          {
            body: {
              experienceId,
              startDate: dateStr,
              endDate: dateStr,
              currency,
            },
          }
        );

        if (fnError) throw fnError;
        if (!cancelled) {
          setSlots(data?.availabilities || []);
        }
      } catch (err: any) {
        console.error("Bokun availability fetch failed:", err);
        if (!cancelled) {
          setError(err.message || "Failed to check availability");
          setSlots([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchAvailability();
    return () => {
      cancelled = true;
    };
  }, [experienceId, date, currency, enabled]);

  return { slots, isLoading, error };
}
