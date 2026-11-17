import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Plus, Minus, AlertCircle, Plane } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AIRLINES } from "@/data/airlines";
import { PhoneInputWithCountry } from "@/components/PhoneInputWithCountry";
import { AddressAutocomplete, SelectedPlace } from "@/components/AddressAutocomplete";

// ============================================
// CONFIGURABLE PRICING CONSTANTS (EDIT HERE)
// ============================================
const BASE_FEE = 799; // Base fee in MXN
const KM_RATE = 15; // Price per kilometer in MXN
const MIN_FARE = 999; // Minimum fare in MXN
const STOP_FEE = 200; // Fee per extra stop in MXN
const ROUND_TRIP_MULTIPLIER = 1.85; // Multiplier for round trips
// ============================================

type Language = "en" | "es";

interface CustomRouteSectionProps {
  language: Language;
}

const translations = {
  en: {
    title: "Custom Route (Any Pickup → Any Dropoff)",
    subtitle: "Enter any pickup and dropoff location for an instant price",
    pickupAddress: "Pickup Address",
    dropoffAddress: "Dropoff Address",
    roundTrip: "Round Trip",
    addons: "Add-ons",
    extraStops: "Extra Stops",
    extraStopNote: `+$${STOP_FEE} MXN each`,
    passengers: "Passengers",
    date: "Date",
    time: "Pickup Time",
    fullName: "Full Name",
    whatsapp: "WhatsApp",
    email: "Email (optional)",
    airline: "Airline",
    flightNumber: "Flight Number",
    returnDate: "Return Date",
    returnTime: "Return Time",
    returnFlightNumber: "Return Flight Number (optional)",
    notes: "Notes",
    bookNow: "Book Now",
    calculating: "Calculating...",
    processing: "Processing...",
    priceBreakdown: "Price Breakdown",
    baseFee: "Base Fee",
    distanceRate: "Distance",
    stopsCharge: "Extra Stops",
    roundTripDiscount: "Round Trip",
    total: "Total",
    calculating2: "Calculate distance first",
    enterAddresses: "Enter pickup and dropoff to calculate",
    distanceError: "Unable to calculate distance. Please check addresses.",
    selectAirline: "Select airline",
    pickupPlaceholder: "e.g., Cancun Airport Terminal 4",
    dropoffPlaceholder: "e.g., Hotel Xcaret Mexico, Playa del Carmen",
  },
  es: {
    title: "Ruta Personalizada (Cualquier Origen → Cualquier Destino)",
    subtitle: "Ingresa cualquier ubicación para un precio instantáneo",
    pickupAddress: "Dirección de Recogida",
    dropoffAddress: "Dirección de Destino",
    roundTrip: "Viaje Redondo",
    addons: "Extras",
    extraStops: "Paradas Adicionales",
    extraStopNote: `+$${STOP_FEE} MXN cada una`,
    passengers: "Pasajeros",
    date: "Fecha",
    time: "Hora de Recogida",
    fullName: "Nombre Completo",
    whatsapp: "WhatsApp",
    email: "Email (opcional)",
    airline: "Aerolínea",
    flightNumber: "Número de Vuelo",
    returnDate: "Fecha de Regreso",
    returnTime: "Hora de Regreso",
    returnFlightNumber: "Número de Vuelo de Regreso (opcional)",
    notes: "Notas",
    bookNow: "Reservar Ahora",
    calculating: "Calculando...",
    processing: "Procesando...",
    priceBreakdown: "Desglose del Precio",
    baseFee: "Tarifa Base",
    distanceRate: "Distancia",
    stopsCharge: "Paradas Extra",
    roundTripDiscount: "Viaje Redondo",
    total: "Total",
    calculating2: "Calcular distancia primero",
    enterAddresses: "Ingresa origen y destino para calcular",
    distanceError: "No se pudo calcular la distancia. Verifica las direcciones.",
    selectAirline: "Seleccionar aerolínea",
    pickupPlaceholder: "ej., Aeropuerto de Cancún Terminal 4",
    dropoffPlaceholder: "ej., Hotel Xcaret Mexico, Playa del Carmen",
  },
};

// Keywords to detect airport in addresses
const AIRPORT_KEYWORDS = ["airport", "aeropuerto", "cun", "tqo", "terminal"];

export const CustomRouteSection = ({ language }: CustomRouteSectionProps) => {
  const t = translations[language];
  const { toast } = useToast();

  // Form state - use SelectedPlace for address autocomplete
  const [pickupPlace, setPickupPlace] = useState<SelectedPlace | null>(null);
  const [dropoffPlace, setDropoffPlace] = useState<SelectedPlace | null>(null);
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [extraStops, setExtraStops] = useState(0);
  const [passengers, setPassengers] = useState("2");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [fullName, setFullName] = useState("");
  const [whatsappE164, setWhatsappE164] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [email, setEmail] = useState("");
  const [airline, setAirline] = useState("");
  const [airlineOther, setAirlineOther] = useState("");
  const [flightNumber, setFlightNumber] = useState("");
  const [returnDate, setReturnDate] = useState<Date>();
  const [returnTime, setReturnTime] = useState("");
  const [returnFlightNumber, setReturnFlightNumber] = useState("");
  const [notes, setNotes] = useState("");

  // Distance calculation state
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [distanceError, setDistanceError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if pickup or dropoff contains airport keywords
  const isAirportRide = useCallback(() => {
    const pickupText = pickupPlace?.formattedAddress || pickupPlace?.name || "";
    const dropoffText = dropoffPlace?.formattedAddress || dropoffPlace?.name || "";
    const combined = `${pickupText} ${dropoffText}`.toLowerCase();
    return AIRPORT_KEYWORDS.some((keyword) => combined.includes(keyword));
  }, [pickupPlace, dropoffPlace]);

  // Calculate distance when both places are selected
  useEffect(() => {
    if (pickupPlace && dropoffPlace) {
      calculateDistance();
    } else {
      setDistanceKm(null);
      setDistanceError(null);
    }
  }, [pickupPlace, dropoffPlace]);

  const calculateDistance = async () => {
    if (!pickupPlace || !dropoffPlace) return;

    setIsCalculating(true);
    setDistanceError(null);

    try {
      const { data, error } = await supabase.functions.invoke("calculate-distance", {
        body: {
          pickup: pickupPlace.formattedAddress,
          dropoff: dropoffPlace.formattedAddress,
        },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setDistanceKm(data.distance_km);
    } catch (error) {
      console.error("Distance calculation error:", error);
      setDistanceError(t.distanceError);
      setDistanceKm(null);
    } finally {
      setIsCalculating(false);
    }
  };

  // Calculate pricing
  const calculatePrice = () => {
    if (distanceKm === null) return null;

    const distanceFee = distanceKm * KM_RATE;
    const stopsFee = extraStops * STOP_FEE;

    let subtotal = BASE_FEE + distanceFee;

    // Apply round trip multiplier
    if (isRoundTrip) {
      subtotal = subtotal * ROUND_TRIP_MULTIPLIER;
    }

    // Add stops fee
    subtotal += stopsFee;

    // Enforce minimum fare
    const total = Math.max(Math.round(subtotal), MIN_FARE);

    return {
      baseFee: BASE_FEE,
      distanceFee: Math.round(distanceFee),
      stopsFee,
      total,
    };
  };

  const pricing = calculatePrice();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-MX").format(price);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!fullName || !isPhoneValid || !passengers || !pickupPlace || !dropoffPlace || !date || !time) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields and select addresses from the dropdown.",
        variant: "destructive",
      });
      return;
    }

    if (distanceKm === null || !pricing) {
      toast({
        title: "Distance Required",
        description: "Please wait for distance calculation or check your addresses.",
        variant: "destructive",
      });
      return;
    }

    // Validate airline/flight if airport ride
    if (isAirportRide() && (!airline || !flightNumber)) {
      toast({
        title: "Flight Details Required",
        description: "Please enter your airline and flight number for airport transfers.",
        variant: "destructive",
      });
      return;
    }

    // Validate airline Other
    if (airline === "Other" && !airlineOther) {
      toast({
        title: "Missing Airline",
        description: "Please specify your airline.",
        variant: "destructive",
      });
      return;
    }

    // Validate round trip fields
    if (isRoundTrip && (!returnDate || !returnTime)) {
      toast({
        title: "Missing Return Details",
        description: "Please fill in return date and time for round trip.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const finalAirline = airline === "Other" ? airlineOther : airline;

      const { data, error } = await supabase.functions.invoke("create-custom-route-checkout", {
        body: {
          full_name: fullName,
          whatsapp_e164: whatsappE164,
          email: email || undefined,
          passengers: parseInt(passengers),
          pickup_address: pickupPlace?.formattedAddress || "",
          pickup_place_id: pickupPlace?.placeId,
          dropoff_address: dropoffPlace?.formattedAddress || "",
          dropoff_place_id: dropoffPlace?.placeId,
          distance_km: distanceKm,
          date: date ? format(date, "yyyy-MM-dd") : "",
          time: time,
          is_round_trip: isRoundTrip,
          extra_stops: extraStops,
          airline: finalAirline || undefined,
          flight_number: flightNumber || undefined,
          return_date: isRoundTrip && returnDate ? format(returnDate, "yyyy-MM-dd") : undefined,
          return_time: isRoundTrip ? returnTime : undefined,
          return_flight_number: isRoundTrip ? returnFlightNumber : undefined,
          notes: notes || undefined,
          total_price_mxn: pricing.total,
          price_breakdown: {
            base_fee: pricing.baseFee,
            distance_fee: pricing.distanceFee,
            stops_fee: pricing.stopsFee,
          },
        },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: unknown) {
      console.error("Error creating checkout:", error);
      toast({
        title: "Error",
        description: "There was an error processing your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const showAirlineFields = isAirportRide();

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-2">{t.title}</h2>
        <p className="text-center text-muted-foreground mb-8">{t.subtitle}</p>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-background rounded-xl shadow-lg p-6 md:p-8">
          {/* Pickup & Dropoff with Google Places Autocomplete */}
          <div className="space-y-4">
            <AddressAutocomplete
              label={`${t.pickupAddress} *`}
              placeholder={t.pickupPlaceholder}
              value={pickupPlace}
              onChange={setPickupPlace}
              required
            />
            <AddressAutocomplete
              label={`${t.dropoffAddress} *`}
              placeholder={t.dropoffPlaceholder}
              value={dropoffPlace}
              onChange={setDropoffPlace}
              required
            />

            {/* Distance Status */}
            {isCalculating && (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                {t.calculating}
              </div>
            )}
            {distanceError && (
              <div className="flex items-center gap-2 text-destructive text-sm">
                <AlertCircle className="w-4 h-4" />
                {distanceError}
              </div>
            )}
            {distanceKm !== null && !isCalculating && (
              <div className="text-sm text-muted-foreground">📍 {distanceKm} km</div>
            )}
          </div>

          {/* Round Trip Toggle */}
          <div className="flex items-center space-x-3 mt-6 p-4 bg-muted/30 rounded-lg">
            <Switch id="customRoundTrip" checked={isRoundTrip} onCheckedChange={setIsRoundTrip} />
            <Label htmlFor="customRoundTrip" className="cursor-pointer font-medium">
              {t.roundTrip}
            </Label>
          </div>

          {/* Add-ons - Only Extra Stops */}
          <div className="mt-6 p-4 border border-border rounded-lg">
            <h3 className="font-medium text-foreground mb-4">{t.addons}</h3>

            {/* Extra Stops */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium">{t.extraStops}</span>
                <span className="text-xs text-muted-foreground ml-2">{t.extraStopNote}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setExtraStops(Math.max(0, extraStops - 1))}
                  disabled={extraStops === 0}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-8 text-center font-medium">{extraStops}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setExtraStops(Math.min(5, extraStops + 1))}
                  disabled={extraStops === 5}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div>
              <Label htmlFor="customFullName">{t.fullName} *</Label>
              <Input id="customFullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="customWhatsapp">{t.whatsapp} *</Label>
              <PhoneInputWithCountry
                id="customWhatsapp"
                value={whatsappE164}
                onChange={(e164, isValid) => {
                  setWhatsappE164(e164);
                  setIsPhoneValid(isValid);
                }}
                required
              />
            </div>
            <div>
              <Label htmlFor="customEmail">{t.email}</Label>
              <Input id="customEmail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="customPassengers">{t.passengers} *</Label>
              <Select value={passengers} onValueChange={setPassengers}>
                <SelectTrigger id="customPassengers">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <Label>{t.date} *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={(d) => d < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="customTime">{t.time} *</Label>
              <Input id="customTime" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
            </div>
          </div>

          {/* Airline & Flight - Only show for airport rides */}
          {showAirlineFields && (
            <div className="mt-4 p-4 border border-primary/20 rounded-lg bg-primary/5">
              <div className="flex items-center gap-2 mb-4">
                <Plane className="w-5 h-5 text-primary" />
                <span className="font-medium text-foreground">Flight Details</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customAirline">{t.airline} *</Label>
                  <Select value={airline} onValueChange={setAirline}>
                    <SelectTrigger id="customAirline">
                      <SelectValue placeholder={t.selectAirline} />
                    </SelectTrigger>
                    <SelectContent>
                      {AIRLINES.map((a) => (
                        <SelectItem key={a} value={a}>
                          {a}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="customFlightNumber">{t.flightNumber} *</Label>
                  <Input
                    id="customFlightNumber"
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value)}
                    placeholder="e.g. AA1234"
                  />
                </div>
              </div>
              {airline === "Other" && (
                <div className="mt-4">
                  <Label htmlFor="customAirlineOther">Airline Name *</Label>
                  <Input
                    id="customAirlineOther"
                    value={airlineOther}
                    onChange={(e) => setAirlineOther(e.target.value)}
                    placeholder="Enter airline name"
                  />
                </div>
              )}
            </div>
          )}

          {/* Return Trip Fields */}
          {isRoundTrip && (
            <div className="mt-4 p-4 border border-primary/20 rounded-lg bg-primary/5">
              <div className="flex items-center gap-2 mb-4">
                <Plane className="w-5 h-5 text-primary" />
                <span className="font-medium text-foreground">{t.roundTrip}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>{t.returnDate} *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !returnDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {returnDate ? format(returnDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={returnDate}
                        onSelect={setReturnDate}
                        initialFocus
                        disabled={(d) => d < (date || new Date())}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="customReturnTime">{t.returnTime} *</Label>
                  <Input
                    id="customReturnTime"
                    type="time"
                    value={returnTime}
                    onChange={(e) => setReturnTime(e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-4">
                <Label htmlFor="customReturnFlight">{t.returnFlightNumber}</Label>
                <Input
                  id="customReturnFlight"
                  value={returnFlightNumber}
                  onChange={(e) => setReturnFlightNumber(e.target.value)}
                  placeholder="e.g. AA5678"
                />
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="mt-4">
            <Label htmlFor="customNotes">{t.notes}</Label>
            <Textarea
              id="customNotes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder={
                language === "en"
                  ? "Special requests, hotel name, etc."
                  : "Solicitudes especiales, nombre del hotel, etc."
              }
            />
          </div>

          {/* Price Breakdown */}
          <div className="mt-6 p-4 bg-primary/5 rounded-lg">
            <h3 className="font-medium text-foreground mb-3">{t.priceBreakdown}</h3>
            {pricing ? (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.baseFee}</span>
                  <span>${formatPrice(pricing.baseFee)} MXN</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t.distanceRate} ({distanceKm} km × ${KM_RATE})
                  </span>
                  <span>${formatPrice(pricing.distanceFee)} MXN</span>
                </div>
                {isRoundTrip && (
                  <div className="flex justify-between text-primary">
                    <span>
                      {t.roundTripDiscount} (×{ROUND_TRIP_MULTIPLIER})
                    </span>
                    <span>Applied</span>
                  </div>
                )}
                {pricing.stopsFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t.stopsCharge} (×{extraStops})
                    </span>
                    <span>${formatPrice(pricing.stopsFee)} MXN</span>
                  </div>
                )}
                <div className="border-t border-border pt-2 flex justify-between font-bold text-lg">
                  <span>{t.total}</span>
                  <span className="text-primary">${formatPrice(pricing.total)} MXN</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{isCalculating ? t.calculating : t.enterAddresses}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full mt-6"
            disabled={isSubmitting || !pricing || distanceKm === null || isCalculating}
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t.processing}
              </>
            ) : (
              t.bookNow
            )}
          </Button>
        </form>
      </div>
    </section>
  );
};
