import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, Clock, ShoppingCart } from "lucide-react";
import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { ParticipantCounter } from "./ParticipantCounter";
import { TourBookingSummary } from "./TourBookingSummary";
import { TourVariantPricing } from "@/data/toursPricing";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useBokunAvailability } from "@/hooks/useBokunAvailability";
import { BokunAvailabilityDisplay } from "./BokunAvailabilityDisplay";
import { useCart } from "@/contexts/CartContext";

interface TourBookingModuleProps {
  tourId: string;
  tourTitle: string;
  variants: TourVariantPricing[];
  timeSlots: string[];
  currency: "USD" | "MXN";
  defaultVariantId?: string;
  onVariantChange?: (variantId: string) => void;
  bokunExperienceId?: string;
  seasonMonths?: number[];
  seasonNote?: string;
}

export function TourBookingModule({
  tourId,
  tourTitle,
  variants,
  timeSlots,
  currency,
  defaultVariantId,
  onVariantChange,
  bokunExperienceId,
  seasonMonths,
  seasonNote,
}: TourBookingModuleProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize state from URL params for persistence
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    searchParams.get("variant") || defaultVariantId || variants[0]?.id || ""
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() => {
    const dateParam = searchParams.get("date");
    return dateParam ? new Date(dateParam) : undefined;
  });
  const [selectedTime, setSelectedTime] = useState<string | null>(
    searchParams.get("time") || null
  );
  const [adults, setAdults] = useState<number>(() => {
    const adultsParam = searchParams.get("adults");
    return adultsParam ? parseInt(adultsParam, 10) : 1;
  });
  const [children, setChildren] = useState<number>(() => {
    const childrenParam = searchParams.get("children");
    return childrenParam ? parseInt(childrenParam, 10) : 0;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [bokunTimeId, setBokunTimeId] = useState<number | null>(null);
  const { addItem } = useCart();

  // Bokun real-time availability
  const useBokun = !!bokunExperienceId;
  const { slots: bokunSlots, isLoading: bokunLoading, error: bokunError } = useBokunAvailability({
    experienceId: bokunExperienceId,
    date: selectedDate,
    currency,
    enabled: useBokun,
  });

  const selectedVariant = variants.find((v) => v.id === selectedVariantId) || variants[0];
  const hasChildPricing = selectedVariant?.childPrice !== null;

  // Update URL params when selections change (for state persistence)
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedVariantId) params.set("variant", selectedVariantId);
    if (selectedDate) params.set("date", format(selectedDate, "yyyy-MM-dd"));
    if (selectedTime) params.set("time", selectedTime);
    if (adults > 0) params.set("adults", adults.toString());
    if (children > 0) params.set("children", children.toString());
    
    setSearchParams(params, { replace: true });
  }, [selectedVariantId, selectedDate, selectedTime, adults, children, setSearchParams]);

  // Notify parent of variant changes
  useEffect(() => {
    if (onVariantChange && selectedVariantId) {
      onVariantChange(selectedVariantId);
    }
  }, [selectedVariantId, onVariantChange]);

  const handlePayNow = async () => {
    if (!selectedDate || !selectedTime || (adults === 0 && children === 0)) {
      toast.error("Please complete all selections");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("create-tour-checkout", {
        body: {
          tourId,
          tourTitle,
          variantId: selectedVariantId,
          variantTitle: selectedVariant.title,
          date: format(selectedDate, "yyyy-MM-dd"),
          time: selectedTime,
          participants: { adults, children },
          currency,
          adultPrice: selectedVariant.adultPrice,
          childPrice: selectedVariant.childPrice,
          returnUrl: window.location.href,
        },
      });

      if (error) throw error;

      if (data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.message || "Failed to create checkout session. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!selectedDate || !selectedTime || (adults === 0 && children === 0)) {
      toast.error("Please complete all selections before adding to cart");
      return;
    }
    addItem({
      tourId,
      tourTitle,
      variantId: selectedVariantId,
      variantTitle: selectedVariant.title,
      date: format(selectedDate, "yyyy-MM-dd"),
      time: selectedTime,
      adults,
      children,
      adultPrice: selectedVariant.adultPrice,
      childPrice: selectedVariant.childPrice,
      currency,
    });
    toast.success("Added to cart!");
  };

  const handleVariantChange = (variantId: string) => {
    setSelectedVariantId(variantId);
    // Reset children if new variant doesn't have child pricing
    const newVariant = variants.find((v) => v.id === variantId);
    if (newVariant?.childPrice === null && children > 0) {
      setChildren(0);
    }
  };

  return (
    <div className="space-y-6">
      {/* Variant Selector - only show if multiple variants */}
      {variants.length > 1 && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3 text-sm">Select Option</h3>
          <RadioGroup
            value={selectedVariantId}
            onValueChange={handleVariantChange}
            className="space-y-2"
          >
            {variants.map((variant) => (
              <div key={variant.id} className="flex items-center space-x-3">
                <RadioGroupItem value={variant.id} id={variant.id} />
                <Label
                  htmlFor={variant.id}
                  className="flex-1 cursor-pointer flex justify-between items-center"
                >
                  <span className="text-sm">{variant.title}</span>
                  <span className="font-semibold text-sm">
                    ${variant.adultPrice} {currency}
                  </span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </Card>
      )}

      {/* Participants */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3 text-sm">Participants</h3>
        <div className="divide-y">
          <ParticipantCounter
            label="Adults"
            sublabel="Age 13+"
            count={adults}
            onIncrement={() => setAdults((p) => Math.min(p + 1, 20))}
            onDecrement={() => setAdults((p) => Math.max(p - 1, 0))}
            min={0}
            max={20}
          />
          {hasChildPricing && (
            <ParticipantCounter
              label="Children"
              sublabel="Age 4-12"
              count={children}
              onIncrement={() => setChildren((p) => Math.min(p + 1, 10))}
              onDecrement={() => setChildren((p) => Math.max(p - 1, 0))}
              min={0}
              max={10}
            />
          )}
        </div>
      </Card>

      {/* Date Selection */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3 text-sm">Select Date</h3>
        {seasonNote && (
          <p className="text-xs text-muted-foreground mb-3">{seasonNote}</p>
        )}
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date);
                setCalendarOpen(false);
              }}
              disabled={(date) =>
                date < addDays(new Date(), 1) ||
                (!!seasonMonths?.length && !seasonMonths.includes(date.getMonth() + 1))
              }
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </Card>

      {/* Time Selection */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3 text-sm flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Select Time
        </h3>
        {useBokun && selectedDate ? (
          <BokunAvailabilityDisplay
            slots={bokunSlots}
            isLoading={bokunLoading}
            error={bokunError}
            selectedTimeId={bokunTimeId}
            onSelectTime={(timeId, startTime) => {
              setBokunTimeId(timeId);
              setSelectedTime(startTime);
            }}
          />
        ) : !useBokun ? (
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map((time) => (
              <Button
                key={time}
                variant={selectedTime === time ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTime(time)}
                className="text-sm"
              >
                {time}
              </Button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Select a date to see available times</p>
        )}
      </Card>

      {/* Booking Summary Ticket */}
      <TourBookingSummary
        tourTitle={tourTitle}
        variantTitle={selectedVariant?.title || ""}
        selectedDate={selectedDate || null}
        selectedTime={selectedTime}
        adults={adults}
        children={children}
        adultPrice={selectedVariant?.adultPrice || 0}
        childPrice={selectedVariant?.childPrice}
        currency={currency}
        onPayNow={handlePayNow}
        onAddToCart={handleAddToCart}
        isLoading={isLoading}
      />
    </div>
  );
}
