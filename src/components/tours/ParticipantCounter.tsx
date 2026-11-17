import { Button } from "@/components/ui/button";
import { Minus, Plus, Users } from "lucide-react";

interface ParticipantCounterProps {
  label: string;
  sublabel?: string;
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

export function ParticipantCounter({
  label,
  sublabel,
  count,
  onIncrement,
  onDecrement,
  min = 0,
  max = 20,
  disabled = false,
}: ParticipantCounterProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-muted-foreground" />
        <div>
          <span className="font-medium text-sm">{label}</span>
          {sublabel && (
            <span className="text-xs text-muted-foreground block">{sublabel}</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={onDecrement}
          disabled={disabled || count <= min}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="w-8 text-center font-semibold">{count}</span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={onIncrement}
          disabled={disabled || count >= max}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
