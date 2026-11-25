import { useState, useEffect, useCallback, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { differenceInDays, eachDayOfInterval, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ShieldCheck, Info } from "lucide-react";
import { useCurrency } from "@/hooks/use-currency";
import { YaabCar, pickupLocations, pickupTimes } from "@/data/yaab-cars-data";

interface CarBookingCalendarProps {
  car: YaabCar;
  language: "en" | "es";
}

const translations = {
  en: {
    title: "Book this car",
    perDay: "/ day",
    selectDates: "Select dates",
    minStay: "Minimum rental",
    days: "days",
    crossedOut: "Crossed out dates are already booked",
    pickup: "Pickup",
    return: "Return",
    pickupTime: "Pickup time",
    returnTime: "Return time",
    pickupLocation: "Pickup location",
    returnLocation: "Return location",
    driverName: "Driver full name",
    driverEmail: "Email",
    driverPhone: "Phone (optional)",
    additionalDriver: "Additional driver (extra cost per YAAB)",
    notes: "Notes (optional)",
    notesPlaceholder: "Flight number, hotel, special requests...",
    pricePerDay: "Price per day",
    total: "Rental total",
    depositNow: "Deposit due now (50%)",
    balanceDelivery: "Balance on delivery (50%)",
    balanceNote: "Cash or bank transfer to YAAB at delivery",
    securityDeposit: "Security deposit (refundable, not charged online)",
    securityDepositNote: "YAAB will inform the amount before delivery",
    selectDatesFirst: "Select dates to see total",
    bookButton: "Book — pay 50% deposit",
    processing: "Processing...",
    confirmNote: "Availability is confirmed with YAAB within 24 hours. If no car is available, your deposit is refunded in full.",
    minDaysError: "Minimum rental is",
    selectDatesError: "Please select pickup and return dates",
    contactError: "Please fill in your name and email",
    invalidEmail: "Please enter a valid email",
    checkoutError: "Failed to initiate payment",
    pickupDateLabel: "Pickup date",
    returnDateLabel: "Return date",
    acceptTermsStart: "I have read and accept the",
    termsLink: "rental Terms & Conditions",
    acceptTermsAnd: "and the",
    privacyLink: "Privacy Notice",
    acceptTermsError: "Please accept the rental terms and privacy notice to continue",
  },
  es: {
    title: "Reserva este auto",
    perDay: "/ día",
    selectDates: "Elige las fechas",
    minStay: "Renta mínima",
    days: "días",
    crossedOut: "Las fechas tachadas ya están reservadas",
    pickup: "Entrega",
    return: "Devolución",
    pickupTime: "Hora de entrega",
    returnTime: "Hora de devolución",
    pickupLocation: "Lugar de entrega",
    returnLocation: "Lugar de devolución",
    driverName: "Nombre completo del conductor",
    driverEmail: "Correo electrónico",
    driverPhone: "Teléfono (opcional)",
    additionalDriver: "Conductor adicional (costo extra según YAAB)",
    notes: "Notas (opcional)",
    notesPlaceholder: "Número de vuelo, hotel, peticiones especiales...",
    pricePerDay: "Precio por día",
    total: "Total de la renta",
    depositNow: "Anticipo a pagar ahora (50%)",
    balanceDelivery: "Saldo a la entrega (50%)",
    balanceNote: "Efectivo o transferencia a YAAB al recibir el auto",
    securityDeposit: "Depósito en garantía (reembolsable, no se cobra en línea)",
    securityDepositNote: "YAAB informará el monto antes de la entrega",
    selectDatesFirst: "Elige las fechas para ver el total",
    bookButton: "Reservar — pagar anticipo del 50%",
    processing: "Procesando...",
    confirmNote: "La disponibilidad se confirma con YAAB en menos de 24 horas. Si no hay auto disponible, se te reembolsa el anticipo completo.",
    minDaysError: "La renta mínima es de",
    selectDatesError: "Elige las fechas de entrega y devolución",
    contactError: "Completa tu nombre y correo electrónico",
    invalidEmail: "Ingresa un correo electrónico válido",
    checkoutError: "No se pudo iniciar el pago",
    pickupDateLabel: "Fecha de entrega",
    returnDateLabel: "Fecha de devolución",
    acceptTermsStart: "Leí y acepto los",
    termsLink: "Términos y Condiciones de la renta",
    acceptTermsAnd: "y el",
    privacyLink: "Aviso de Privacidad",
    acceptTermsError: "Acepta los términos y el aviso de privacidad para continuar",
  },
};

const isUuid = (s: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);

const parseLocalDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export function CarBookingCalendar({ car, language }: CarBookingCalendarProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(false);
  const [driverName, setDriverName] = useState("");
  const [driverEmail, setDriverEmail] = useState("");
  const [driverPhone, setDriverPhone] = useState("");
  const [pickupTime, setPickupTime] = useState("10:00");
  const [returnTime, setReturnTime] = useState("10:00");
  const [pickupLocation, setPickupLocation] = useState(pickupLocations[language][0]);
  const [returnLocation, setReturnLocation] = useState(pickupLocations[language][0]);
  const [additionalDriver, setAdditionalDriver] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [notes, setNotes] = useState("");
  const { formatPrice } = useCurrency();
  const t = translations[language];
  const locations = pickupLocations[language];
  const minDays = car.minDays || 3;

  const fetchBookedDates = useCallback(async () => {
    // No DB id yet (seed fallback): nothing to block.
    if (!isUuid(car.id)) return;
    try {
      const dates: Date[] = [];
      // Public RPC (security definer) — mirrors get_property_blocked_dates.
      const { data: rpcData, error: rpcError } = await supabase.rpc(
        "get_car_blocked_dates",
        { p_car_id: car.id }
      );
      if (!rpcError && rpcData) {
        rpcData.forEach((b: { pickup_date: string; return_date: string }) => {
          dates.push(
            ...eachDayOfInterval({
              start: parseLocalDate(b.pickup_date),
              end: parseLocalDate(b.return_date),
            })
          );
        });
      } else {
        // Fallback: direct query (works only once the table exists).
        const { data: bookings } = await supabase
          .from("car_bookings")
          .select("pickup_date, return_date")
          .eq("car_id", car.id)
          .in("status", ["pending", "confirmed"]);
        bookings?.forEach((b: { pickup_date: string; return_date: string }) => {
          dates.push(
            ...eachDayOfInterval({
              start: parseLocalDate(b.pickup_date),
              end: parseLocalDate(b.return_date),
            })
          );
        });
      }
      setBookedDates(dates);
    } catch (error) {
      console.error("Error fetching car bookings:", error);
    }
  }, [car.id]);

  useEffect(() => {
    fetchBookedDates();
  }, [fetchBookedDates]);

  const totalDays = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return 0;
    return differenceInDays(dateRange.to, dateRange.from);
  }, [dateRange]);

  const totalMxn = totalDays * car.pricePerDayMxn;
  const depositMxn = Math.round(totalMxn / 2);
  const balanceDueMxn = totalMxn - depositMxn;

  const handleDateSelect = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      const days = differenceInDays(range.to, range.from);
      if (days < minDays) {
        toast.error(`${t.minDaysError} ${minDays} ${t.days}`);
        setDateRange({ from: range.from, to: undefined });
        return;
      }
    }
    setDateRange(range);
  };

  const handleBooking = async () => {
    if (!dateRange?.from || !dateRange?.to) {
      toast.error(t.selectDatesError);
      return;
    }
    if (totalDays < minDays) {
      toast.error(`${t.minDaysError} ${minDays} ${t.days}`);
      return;
    }
    if (!driverName.trim() || !driverEmail.trim()) {
      toast.error(t.contactError);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(driverEmail.trim())) {
      toast.error(t.invalidEmail);
      return;
    }
    if (!acceptedTerms) {
      toast.error(t.acceptTermsError);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "create-yaab-car-checkout",
        {
          body: {
            carSlug: car.slug,
            pickupDate: format(dateRange.from, "yyyy-MM-dd"),
            returnDate: format(dateRange.to, "yyyy-MM-dd"),
            pickupTime,
            returnTime,
            pickupLocation,
            returnLocation,
            driverName: driverName.trim(),
            driverEmail: driverEmail.trim(),
            driverPhone: driverPhone.trim(),
            additionalDriver,
            notes: notes.trim(),
          },
        }
      );

      if (error) {
        toast.error(error.message || t.checkoutError);
        setLoading(false);
        return;
      }
      if (data?.error) {
        toast.error(data.error);
        setLoading(false);
        return;
      }
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error(t.checkoutError);
      }
    } catch (error: unknown) {
      console.error("Car booking error:", error);
      toast.error(error instanceof Error ? error.message : t.checkoutError);
      setLoading(false);
    }
  };

  const isDateBooked = (date: Date) =>
    bookedDates.some(
      (bookedDate) => format(bookedDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-primary">
            {formatPrice(car.pricePerDayMxn)}
          </span>
          <span className="text-muted-foreground">{t.perDay}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="mb-2 block">{t.selectDates}</Label>
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={handleDateSelect}
            numberOfMonths={1}
            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0)) || isDateBooked(date)}
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
            {t.crossedOut} • {t.minStay}: <strong>{minDays} {t.days}</strong>
          </p>
        </div>

        {/* Pickup / return details */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="pickup-time">{t.pickupTime}</Label>
            <Select value={pickupTime} onValueChange={setPickupTime}>
              <SelectTrigger id="pickup-time">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pickupTimes.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="return-time">{t.returnTime}</Label>
            <Select value={returnTime} onValueChange={setReturnTime}>
              <SelectTrigger id="return-time">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pickupTimes.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="pickup-location">{t.pickupLocation}</Label>
          <Select value={pickupLocation} onValueChange={setPickupLocation}>
            <SelectTrigger id="pickup-location">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {locations.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="return-location">{t.returnLocation}</Label>
          <Select value={returnLocation} onValueChange={setReturnLocation}>
            <SelectTrigger id="return-location">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {locations.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Pricing summary */}
        <div
          className={cn(
            "p-4 rounded-lg space-y-2 transition-colors",
            totalDays > 0
              ? "bg-success-soft border border-success-soft-border"
              : "bg-background border border-border"
          )}
        >
          {dateRange?.from && (
            <div className="flex gap-4 pb-2 mb-2 border-b border-border/50">
              <div className="flex-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {t.pickupDateLabel}
                </span>
                <p className="text-sm font-semibold">{format(dateRange.from, "MMM dd, yyyy")}</p>
              </div>
              {dateRange?.to && (
                <div className="flex-1">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {t.returnDateLabel}
                  </span>
                  <p className="text-sm font-semibold">{format(dateRange.to, "MMM dd, yyyy")}</p>
                </div>
              )}
            </div>
          )}

          {totalDays > 0 ? (
            <>
              <div className="flex justify-between text-sm">
                <span>
                  {formatPrice(car.pricePerDayMxn)} × {totalDays} {t.days}
                </span>
                <span>{formatPrice(totalMxn)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>{t.total}</span>
                <span className="font-semibold">{formatPrice(totalMxn)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-primary border-t border-success-soft-border pt-2">
                <span>{t.depositNow}</span>
                <span>{formatPrice(depositMxn)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>{t.balanceDelivery}</span>
                <span>{formatPrice(balanceDueMxn)}</span>
              </div>
              <p className="text-xs text-muted-foreground">{t.balanceNote}</p>
              {car.depositMxn != null && (
                <div className="flex justify-between text-sm pt-1">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {t.securityDeposit}
                  </span>
                  <span>{formatPrice(car.depositMxn)}</span>
                </div>
              )}
              {car.depositMxn == null && (
                <p className="text-xs text-muted-foreground flex items-start gap-1">
                  <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                  {t.securityDepositNote}
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">{t.selectDatesFirst}</p>
          )}
        </div>

        {/* Driver information */}
        <div className="space-y-3">
          <div>
            <Label htmlFor="driver-name">{t.driverName}</Label>
            <Input
              id="driver-name"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              placeholder="John Doe"
            />
          </div>
          <div>
            <Label htmlFor="driver-email">{t.driverEmail}</Label>
            <Input
              id="driver-email"
              type="email"
              value={driverEmail}
              onChange={(e) => setDriverEmail(e.target.value)}
              placeholder="john@example.com"
            />
          </div>
          <div>
            <Label htmlFor="driver-phone">{t.driverPhone}</Label>
            <Input
              id="driver-phone"
              type="tel"
              value={driverPhone}
              onChange={(e) => setDriverPhone(e.target.value)}
              placeholder="+52 998 123 4567"
            />
          </div>
          <label className="flex items-start gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={additionalDriver}
              onChange={(e) => setAdditionalDriver(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-primary"
            />
            <span>{t.additionalDriver}</span>
          </label>
          <div>
            <Label htmlFor="notes">{t.notes}</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t.notesPlaceholder}
            />
          </div>
        </div>

        {/* Terms acceptance */}
        <div className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            id="accept-terms"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-primary shrink-0"
          />
          <span className="text-muted-foreground">
            {t.acceptTermsStart}{" "}
            <Link
              to="/activities/car-rentals/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              {t.termsLink}
            </Link>{" "}
            {t.acceptTermsAnd}{" "}
            <Link
              to="/activities/car-rentals/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              {t.privacyLink}
            </Link>
          </span>
        </div>

        <Button
          className="w-full"
          size="lg"
          onClick={handleBooking}
          disabled={loading || !dateRange?.from || !dateRange?.to}
        >
          {loading ? t.processing : t.bookButton}
        </Button>

        <p className="text-xs text-center text-muted-foreground">{t.confirmNote}</p>
      </CardContent>
    </Card>
  );
}
