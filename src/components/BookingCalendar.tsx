import { useState, useEffect, useCallback, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { differenceInDays, eachDayOfInterval, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Users, Baby, ShieldCheck, Info } from "lucide-react";
import { useCurrency } from "@/hooks/use-currency";
import { MemberCodeInput } from "@/components/MemberCodeInput";
import { MemberCode, calculateDiscount } from "@/config/member-codes";
import { useICalSync } from "@/hooks/useICalSync";

interface BookingCalendarProps {
  propertyId: string;
  pricePerNight: number;
  maxGuests: number;
  minimumNights?: number;
  /** Number of guests included in base rate */
  baseIncludedGuests?: number;
  /** Extra guest rate per night in MXN */
  extraGuestRateMXN?: number;
  /** Damage waiver fee in MXN (one-time) */
  damageWaiverMXN?: number;
  /** Max adults allowed */
  maxAdults?: number;
  /** Max children allowed */
  maxChildren?: number;
}

interface Booking {
  check_in: string;
  check_out: string;
}

interface SeasonalPricing {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  price_modifier: number;
  min_nights: number | null;
}

export function BookingCalendar({
  propertyId,
  pricePerNight,
  maxGuests,
  minimumNights = 1,
  baseIncludedGuests,
  extraGuestRateMXN,
  damageWaiverMXN,
  maxAdults,
  maxChildren,
}: BookingCalendarProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [seasonalPricing, setSeasonalPricing] = useState<SeasonalPricing[]>([]);
  const [loading, setLoading] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [numberOfAdults, setNumberOfAdults] = useState(1);
  const [numberOfChildren, setNumberOfChildren] = useState(0);
  const [memberDiscount, setMemberDiscount] = useState(0);
  const [appliedMemberCode, setAppliedMemberCode] = useState<MemberCode | null>(null);
  const { formatPrice } = useCurrency();
  const [cleaningFee, setCleaningFee] = useState(0);

  // One-time cleaning fee per stay, configured on the property record
  useEffect(() => {
    supabase
      .from("properties")
      .select("cleaning_fee")
      .eq("id", propertyId)
      .maybeSingle()
      .then(({ data }) => setCleaningFee(Number(data?.cleaning_fee) || 0));
  }, [propertyId]);

  const hasOccupancyRules = baseIncludedGuests !== undefined;
  const totalGuests = hasOccupancyRules ? numberOfAdults + numberOfChildren : numberOfAdults;

  // Trigger iCal sync on page load; refresh blocked dates after sync completes
  useICalSync(() => {
    fetchBookedDates();
  });

  const handleMemberCodeApplied = (discount: number, code: MemberCode | null) => {
    setMemberDiscount(discount);
    setAppliedMemberCode(code);
  };

  const fetchBookedDates = useCallback(async () => {
    try {
      const { data: bookings, error: bookingsError } = await supabase
        .from("bookings")
        .select("check_in, check_out")
        .eq("property_id", propertyId)
        .in("status", ["pending", "confirmed"]);

      if (bookingsError) throw bookingsError;

      // Read via security-definer RPC so blocked dates are visible to public visitors
      const { data: externalBookings, error: externalError } = await supabase
        .rpc("get_property_blocked_dates", { p_property_id: propertyId });

      if (externalError) {
        console.error("Error fetching external bookings:", externalError);
      }

      const dates: Date[] = [];
      const parseLocalDate = (dateStr: string) => {
        const [year, month, day] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day);
      };

      bookings?.forEach((booking: Booking) => {
        const range = eachDayOfInterval({
          start: parseLocalDate(booking.check_in),
          end: parseLocalDate(booking.check_out),
        });
        dates.push(...range);
      });

      externalBookings?.forEach((booking: Booking) => {
        const range = eachDayOfInterval({
          start: parseLocalDate(booking.check_in),
          end: parseLocalDate(booking.check_out),
        });
        dates.push(...range);
      });

      console.log(`[BookingCalendar] Loaded ${bookings?.length || 0} internal + ${externalBookings?.length || 0} external bookings, blocking ${dates.length} total dates`);
      setBookedDates(dates);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  }, [propertyId]);

  const fetchSeasonalPricing = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("seasonal_pricing")
        .select("*")
        .eq("property_id", propertyId);

      if (error) throw error;
      setSeasonalPricing((data as SeasonalPricing[]) || []);
    } catch (error) {
      console.error("Error fetching seasonal pricing:", error);
    }
  }, [propertyId]);

  useEffect(() => {
    fetchBookedDates();
    fetchSeasonalPricing();
  }, [fetchBookedDates, fetchSeasonalPricing]);

  const getSeasonForDate = (date: Date): SeasonalPricing | undefined => {
    const dateStr = format(date, "yyyy-MM-dd");
    return seasonalPricing.find((season) => {
      const startDate = String(season.start_date).slice(0, 10);
      const endDate = String(season.end_date).slice(0, 10);
      return dateStr >= startDate && dateStr <= endDate;
    });
  };

  const getPriceForDate = (date: Date): number => {
    const applicableSeason = getSeasonForDate(date);
    if (applicableSeason) {
      return Number(applicableSeason.price_modifier);
    }
    return pricePerNight;
  };

  // Calculate dynamic minimum nights based on check-in date season
  const dynamicMinNights = useMemo(() => {
    if (!dateRange?.from) return minimumNights;
    const season = getSeasonForDate(dateRange.from);
    if (season?.min_nights) return season.min_nights;
    return minimumNights;
  }, [dateRange?.from, seasonalPricing, minimumNights]);

  // Calculate the lowest available nightly rate for display
  const lowestRate = seasonalPricing.length > 0
    ? Math.min(pricePerNight, ...seasonalPricing.map(s => Number(s.price_modifier)))
    : pricePerNight;
  const hasSeasonalPricing = seasonalPricing.length > 0;

  const calculateTotal = () => {
    if (!dateRange?.from || !dateRange?.to) return 0;
    const days = eachDayOfInterval({ start: dateRange.from, end: dateRange.to });
    days.pop(); // Remove checkout day
    return days.reduce((total, date) => total + getPriceForDate(date), 0);
  };

  // Extra children charge calculation
  const extraChildrenCount = useMemo(() => {
    if (!baseIncludedGuests || !extraGuestRateMXN) return 0;
    const extra = totalGuests - baseIncludedGuests;
    return Math.max(0, extra);
  }, [totalGuests, baseIncludedGuests, extraGuestRateMXN]);

  const extraChildrenCharge = useMemo(() => {
    if (!extraGuestRateMXN || extraChildrenCount === 0) return 0;
    const nights = calculateNights();
    return extraChildrenCount * extraGuestRateMXN * nights;
  }, [extraChildrenCount, extraGuestRateMXN, dateRange]);

  const getPriceBreakdown = () => {
    if (!dateRange?.from || !dateRange?.to) return [];
    const days = eachDayOfInterval({ start: dateRange.from, end: dateRange.to });
    days.pop();

    const breakdown: { [key: string]: { nights: number; price: number; seasonName?: string } } = {};

    days.forEach((date) => {
      const price = getPriceForDate(date);
      const applicableSeason = getSeasonForDate(date);
      const key = applicableSeason ? `season_${applicableSeason.id}` : "regular";

      if (!breakdown[key]) {
        breakdown[key] = { nights: 0, price: price, seasonName: applicableSeason?.name };
      }
      breakdown[key].nights += 1;
    });

    return Object.values(breakdown);
  };

  function calculateNights() {
    if (!dateRange?.from || !dateRange?.to) return 0;
    return differenceInDays(dateRange.to, dateRange.from);
  }

  // Validate date range on selection
  const handleDateSelect = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      const nights = differenceInDays(range.to, range.from);
      const season = getSeasonForDate(range.from);
      const requiredMin = season?.min_nights || minimumNights;

      if (nights < requiredMin) {
        toast.error(`Minimum stay for ${season?.name || 'this period'} is ${requiredMin} nights`);
        // Keep from date, clear to date
        setDateRange({ from: range.from, to: undefined });
        return;
      }
    }
    setDateRange(range);
  };

  const handleBooking = async () => {
    if (!dateRange?.from || !dateRange?.to) {
      toast.error("Please select check-in and check-out dates");
      return;
    }

    const nights = differenceInDays(dateRange.to, dateRange.from);
    if (nights < dynamicMinNights) {
      toast.error(`Minimum stay is ${dynamicMinNights} nights`);
      return;
    }

    if (!guestName || !guestEmail) {
      toast.error("Please fill in your contact information");
      return;
    }

    if (totalGuests > maxGuests) {
      toast.error(`Maximum ${maxGuests} guests allowed`);
      return;
    }

    if (maxAdults && numberOfAdults > maxAdults) {
      toast.error(`Maximum ${maxAdults} adults allowed`);
      return;
    }

    setLoading(true);

    try {
      const totalNights = calculateNights();
      const accommodationTotal = calculateTotal();
      const extraCharge = extraChildrenCharge;
      const waiver = damageWaiverMXN || 0;
      const subtotal = accommodationTotal + extraCharge + waiver;

      const { data: propertyData } = await supabase
        .from("properties")
        .select("title")
        .eq("id", propertyId)
        .single();

      const { data, error } = await supabase.functions.invoke(
        "create-booking-checkout",
        {
          body: {
            propertyId,
            propertyTitle: propertyData?.title || "Property",
            checkIn: format(dateRange.from, "MMM dd, yyyy"),
            checkOut: format(dateRange.to, "MMM dd, yyyy"),
            totalNights,
            totalPrice: subtotal,
            cleaningFee,
            guests: totalGuests,
            guestName,
            guestEmail,
            guestPhone,
            memberCode: appliedMemberCode?.code || "",
            stripePromotionCodeId: appliedMemberCode?.stripePromotionCodeId || "",
            extraChildrenCount,
            extraChildrenCharge: extraCharge,
            damageWaiver: waiver,
          },
        }
      );

      if (error) {
        console.error("Checkout error:", error);
        if (error.message?.includes("promotion code") || error.message?.includes("promo")) {
          toast.error(error.message || "Failed to apply promotion code");
        } else {
          toast.error(error.message || "Failed to initiate payment");
        }
        setLoading(false);
        return;
      }

      if (data?.error) {
        console.error("Checkout error from backend:", data.error);
        toast.error(data.error);
        setLoading(false);
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error: any) {
      console.error("Booking error:", error);
      toast.error(error.message || "Failed to initiate payment");
      setLoading(false);
    }
  };

  const isDateBooked = (date: Date) => {
    return bookedDates.some(
      (bookedDate) => format(bookedDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );
  };

  const accommodationSubtotal = calculateTotal();
  const totalNights = calculateNights();
  const waiver = damageWaiverMXN || 0;
  const appliedCleaningFee = totalNights > 0 ? cleaningFee : 0;
  const grandSubtotal = accommodationSubtotal + extraChildrenCharge + waiver + appliedCleaningFee;
  const currentDiscount = appliedMemberCode ? calculateDiscount(grandSubtotal, appliedMemberCode) : 0;
  const totalPrice = grandSubtotal - currentDiscount;

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Book Your Stay</CardTitle>
        <div className="flex items-baseline gap-2">
          {hasSeasonalPricing && (
            <span className="text-sm text-muted-foreground">From</span>
          )}
          <span className="text-3xl font-bold text-primary">
            {formatPrice(lowestRate)}
          </span>
          <span className="text-muted-foreground">/ night</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="mb-2 block">Select Dates</Label>
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={handleDateSelect}
            numberOfMonths={1}
            disabled={(date) => date < new Date() || isDateBooked(date)}
            className={cn("rounded-md border pointer-events-auto")}
            modifiers={{ booked: bookedDates }}
            modifiersStyles={{
              booked: {
                textDecoration: "line-through",
                color: "var(--muted-foreground)",
                opacity: 0.5,
              },
            }}
          />
          <p className="text-xs text-muted-foreground mt-2">
            Crossed out dates are already booked
            {dateRange?.from && dynamicMinNights > 1 && (
              <span> • Min. stay: <strong>{dynamicMinNights} nights</strong>
                {(() => {
                  const season = getSeasonForDate(dateRange.from!);
                  return season ? ` (${season.name})` : '';
                })()}
              </span>
            )}
            {!dateRange?.from && minimumNights > 1 && ` • Minimum stay: ${minimumNights} nights`}
          </p>
        </div>

        {/* Pricing Summary */}
        <div className={cn(
          "p-4 rounded-lg space-y-2 transition-colors",
          totalNights > 0
            ? "bg-success-soft border border-success-soft-border"
            : "bg-background border border-border"
        )}>
          {/* Check-in / Check-out dates */}
          {dateRange?.from && (
            <div className="flex gap-4 pb-2 mb-2 border-b border-border/50">
              <div className="flex-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Check-in</span>
                <p className="text-sm font-semibold">{format(dateRange.from, "MMM dd, yyyy")}</p>
              </div>
              {dateRange?.to && (
                <div className="flex-1">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Check-out</span>
                  <p className="text-sm font-semibold">{format(dateRange.to, "MMM dd, yyyy")}</p>
                </div>
              )}
            </div>
          )}

          {totalNights > 0 ? (
            <>
              {getPriceBreakdown().map((breakdown, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>
                    {formatPrice(breakdown.price)} × {breakdown.nights} night{breakdown.nights > 1 ? 's' : ''}
                    {breakdown.seasonName && (
                      <span className="text-xs text-primary ml-1">({breakdown.seasonName})</span>
                    )}
                  </span>
                  <span>{formatPrice(breakdown.price * breakdown.nights)}</span>
                </div>
              ))}

              {extraChildrenCharge > 0 && (
                <div className="flex justify-between text-sm">
                  <span>
                    Extra guests ({extraChildrenCount} × {totalNights} nights)
                  </span>
                  <span>{formatPrice(extraChildrenCharge)}</span>
                </div>
              )}

              {damageWaiverMXN && damageWaiverMXN > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Security deposit (refundable)
                  </span>
                  <span>{formatPrice(damageWaiverMXN)}</span>
                </div>
              )}

              {cleaningFee > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Cleaning fee</span>
                  <span>{formatPrice(cleaningFee)}</span>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Select dates to see total</p>
          )}

          {/* Member Code Input */}
          <div className={cn(totalNights > 0 && "pt-2 border-t border-success-soft-border")}>
            <MemberCodeInput
              subtotal={grandSubtotal}
              onDiscountApplied={handleMemberCodeApplied}
              language="en"
            />
          </div>

          {currentDiscount > 0 && (
            <div className="flex justify-between text-sm text-success-soft-foreground">
              <span>Member discount</span>
              <span>-{formatPrice(currentDiscount)}</span>
            </div>
          )}

          {totalNights > 0 && (
            <div className="flex justify-between font-bold text-lg border-t border-success-soft-border pt-2">
              <span>Total</span>
              <span className="text-primary">{formatPrice(totalPrice)}</span>
            </div>
          )}
        </div>

        {/* Guest Information */}
        <div className="space-y-3">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="John Doe"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              placeholder="john@example.com"
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input
              id="phone"
              type="tel"
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
              placeholder="+52 998 123 4567"
            />
          </div>

          {hasOccupancyRules ? (
            <>
              <div>
                <Label htmlFor="adults">Adults</Label>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="adults"
                    type="number"
                    min={1}
                    max={maxAdults || maxGuests}
                    value={numberOfAdults}
                    onChange={(e) => setNumberOfAdults(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Max {maxAdults || maxGuests} adults
                </p>
              </div>

              <div>
                <Label htmlFor="children">Children</Label>
                <div className="flex items-center gap-2">
                  <Baby className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="children"
                    type="number"
                    min={0}
                    max={maxChildren || maxGuests}
                    value={numberOfChildren}
                    onChange={(e) => setNumberOfChildren(Math.max(0, parseInt(e.target.value) || 0))}
                  />
                </div>
                {extraGuestRateMXN && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Base rate includes {baseIncludedGuests} guests. Additional guests: {formatPrice(extraGuestRateMXN)}/night each.
                  </p>
                )}
              </div>
            </>
          ) : (
            <div>
              <Label htmlFor="guests">Number of Guests</Label>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="guests"
                  type="number"
                  min={1}
                  max={maxGuests}
                  value={numberOfAdults}
                  onChange={(e) => setNumberOfAdults(parseInt(e.target.value))}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Maximum {maxGuests} guests
              </p>
            </div>
          )}
        </div>

        <Button
          className="w-full"
          size="lg"
          onClick={handleBooking}
          disabled={loading || !dateRange?.from || !dateRange?.to}
        >
          {loading ? "Processing..." : "Book Now"}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Your booking will be confirmed via email
        </p>
      </CardContent>
    </Card>
  );
}
