import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, Lock, CreditCard, Ticket, ShoppingCart } from "lucide-react";
import { format } from "date-fns";

interface TourBookingSummaryProps {
  tourTitle: string;
  variantTitle: string;
  selectedDate: Date | null;
  selectedTime: string | null;
  adults: number;
  children: number;
  adultPrice: number;
  childPrice: number | null;
  currency: string;
  onPayNow: () => void;
  onAddToCart?: () => void;
  isLoading?: boolean;
}

export function TourBookingSummary({
  tourTitle,
  variantTitle,
  selectedDate,
  selectedTime,
  adults,
  children,
  adultPrice,
  childPrice,
  currency,
  onPayNow,
  onAddToCart,
  isLoading = false,
}: TourBookingSummaryProps) {
  const adultTotal = adults * adultPrice;
  const childTotal = children * (childPrice || 0);
  const total = adultTotal + childTotal;
  
  const isComplete = selectedDate && selectedTime && (adults > 0 || children > 0);
  const currencySymbol = currency === "USD" ? "$" : "$";
  const currencyLabel = currency === "USD" ? "USD" : "MXN";

  return (
    <div className="relative">
      {/* Ticket-style card with torn edge effect */}
      <Card className="relative overflow-hidden border-2 border-dashed border-primary/30 bg-gradient-to-br from-background to-muted/30">
        {/* Top tear effect */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-b from-primary/10 to-transparent" />
        
        {/* Ticket header */}
        <div className="px-4 pt-5 pb-3 border-b border-dashed border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <Ticket className="w-5 h-5 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Booking Summary
            </span>
          </div>
          <h3 className="font-bold text-base line-clamp-2">{tourTitle}</h3>
          <p className="text-sm text-muted-foreground">{variantTitle}</p>
        </div>

        {/* Ticket body with circular cutouts on sides */}
        <div className="relative px-4 py-4">
          {/* Left cutout */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-6 bg-background rounded-r-full border-r border-t border-b border-dashed border-primary/20" />
          {/* Right cutout */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-6 bg-background rounded-l-full border-l border-t border-b border-dashed border-primary/20" />

          <div className="space-y-3">
            {/* Date & Time */}
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span className={selectedDate ? "font-medium" : "text-muted-foreground"}>
                {selectedDate ? format(selectedDate, "EEE, MMM d, yyyy") : "Select date"}
              </span>
            </div>
            
            <div className="flex items-center gap-3 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span className={selectedTime ? "font-medium" : "text-muted-foreground"}>
                {selectedTime || "Select time"}
              </span>
            </div>

            {/* Participants */}
            <div className="flex items-center gap-3 text-sm">
              <Users className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1">
                {adults > 0 || children > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {adults > 0 && (
                      <span className="font-medium">
                        {adults} Adult{adults !== 1 ? "s" : ""}
                      </span>
                    )}
                    {children > 0 && childPrice && (
                      <span className="font-medium">
                        {children} Child{children !== 1 ? "ren" : ""}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-muted-foreground">Select participants</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Price breakdown */}
        <div className="px-4 py-3 bg-muted/50 border-t border-dashed border-primary/20">
          {adults > 0 && (
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">
                {adults} × Adult ({currencySymbol}{adultPrice})
              </span>
              <span className="font-medium">
                {currencySymbol}{adultTotal.toLocaleString()} {currencyLabel}
              </span>
            </div>
          )}
          {children > 0 && childPrice && (
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">
                {children} × Child ({currencySymbol}{childPrice})
              </span>
              <span className="font-medium">
                {currencySymbol}{childTotal.toLocaleString()} {currencyLabel}
              </span>
            </div>
          )}
          
          {/* Total */}
          <div className="flex justify-between items-center pt-2 mt-2 border-t border-primary/20">
            <span className="font-semibold">Total</span>
            <span className="text-lg font-bold text-primary">
              {currencySymbol}{total.toLocaleString()} {currencyLabel}
            </span>
          </div>
        </div>

        {/* Bottom tear effect */}
        <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-t from-primary/10 to-transparent" />
      </Card>

      {/* Pay Now Button */}
      <Button
        onClick={onPayNow}
        disabled={!isComplete || isLoading}
        className="w-full mt-4 h-12 text-base font-semibold gap-2"
        size="lg"
      >
        {isLoading ? (
          <>Processing...</>
        ) : isComplete ? (
          <>
            <CreditCard className="w-5 h-5" />
            Pay now
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            Complete selections to pay
          </>
        )}
      </Button>

      {/* Add to Cart Button */}
      {onAddToCart && (
        <Button
          onClick={onAddToCart}
          disabled={!isComplete}
          variant="outline"
          className="w-full mt-2 h-10 text-sm font-semibold gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          Add to cart
        </Button>
      )}

      {isComplete && (
        <p className="text-xs text-center text-muted-foreground mt-2">
          Secure payment via Stripe. You'll be redirected to complete payment.
        </p>
      )}
    </div>
  );
}
