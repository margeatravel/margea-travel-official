import { BokunSlot } from "@/hooks/useBokunAvailability";
import { Loader2, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface BokunAvailabilityDisplayProps {
  slots: BokunSlot[];
  isLoading: boolean;
  error: string | null;
  selectedTimeId: number | null;
  onSelectTime: (timeId: number, startTime: string) => void;
}

export function BokunAvailabilityDisplay({
  slots,
  isLoading,
  error,
  selectedTimeId,
  onSelectTime,
}: BokunAvailabilityDisplayProps) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground text-sm py-3">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Checking availability...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-destructive text-sm py-3">
        <AlertCircle className="w-4 h-4" />
        <span>Could not check availability. Please try again.</span>
      </div>
    );
  }

  if (slots.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {slots.map((slot) => {
        const available = !slot.soldOut && (slot.unlimited || slot.availabilityCount > 0);
        const isSelected = selectedTimeId === slot.startTimeId;

        return (
          <button
            key={slot.id}
            disabled={!available}
            onClick={() => available && onSelectTime(slot.startTimeId, slot.startTime)}
            className={cn(
              "w-full flex items-center justify-between p-3 rounded-lg border text-sm transition-colors text-left",
              available && !isSelected && "border-border hover:border-primary/50 cursor-pointer",
              available && isSelected && "border-primary bg-primary/5 ring-1 ring-primary",
              !available && "border-border/50 bg-muted/30 opacity-60 cursor-not-allowed"
            )}
          >
            <div className="flex items-center gap-2">
              {available ? (
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-destructive flex-shrink-0" />
              )}
              <span className="font-medium">{slot.startTime}</span>
            </div>
            <div className="text-right">
              {slot.soldOut ? (
                <span className="text-destructive font-medium">Sold Out</span>
              ) : slot.unlimited ? (
                <span className="text-green-600">Available</span>
              ) : (
                <span className={cn(
                  slot.availabilityCount <= 5 ? "text-orange-600" : "text-green-600"
                )}>
                  {slot.availabilityCount} spots left
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
