import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Loader2, MessageCircle, CreditCard, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { PhoneInputWithCountry } from "@/components/PhoneInputWithCountry";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { flights, scenicFlights, getDepositRule, type FlightProduct } from "@/data/flights-data";
import { calculateFlightPricingWithRule, type FlightPricing } from "@/lib/flight-pricing";

type Language = 'en' | 'es';
type FlightType = 'charter' | 'scenic';
type AircraftType = 'cessna' | 'kodiak' | 'piper';

// Source tracking for analytics
export type BookingSource = 
  | 'aircraft_front' 
  | 'aircraft_back' 
  | 'route_chip' 
  | 'charter_list' 
  | 'scenic_list'
  | 'destination_card'
  | 'flight_card';

interface FlightPickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedAircraft: AircraftType;
  preselectedRoute?: string;
  preselectedFlightType?: FlightType;
  source: BookingSource;
  language: Language;
}

// Charter routes (Miami added)
const charterRoutes = [
  'Cancun',
  'Holbox',
  'Cozumel',
  'Playa del Carmen',
  'Tulum',
  'Chichen Itza',
  'Mahahual',
  'Chetumal',
  'Merida',
  'Miami',
];

// Scenic routes (updated to match data)
const scenicRoutes = [
  'Cancun / Hotel Zone / Isla Mujeres',
  'Riviera Maya / Playa del Carmen / Tulum Ruins',
  'Holbox / El Cuyo / Gulf of Mexico / Las Coloradas / Flamingos',
];

const translations = {
  en: {
    title: "Choose Your Flight",
    subtitle: "Select your flight details and pay a deposit to secure your booking.",
    flightType: "Flight Type",
    charter: "Charter Flight",
    scenic: "Scenic Tour",
    route: "Route",
    selectRoute: "Select a route",
    aircraft: "Aircraft",
    cessna: "Cessna 206 (up to 5 passengers)",
    kodiak: "Kodiak (up to 9 passengers)",
    piper: "Piper Seneca (up to 5 passengers)",
    date: "Date",
    selectDate: "Select date",
    passengers: "Passengers",
    contactInfo: "Contact Information",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    phone: "Phone",
    pickupArea: "Pickup Area / Hotel Name",
    notes: "Additional Notes (Optional)",
    priceBreakdown: "Price Breakdown",
    subtotal: "Subtotal",
    iva: "IVA (16%)",
    total: "Total",
    depositNow: "Deposit Due Now",
    balanceDue: "Balance Due Later",
    continueToDeposit: "Continue to Deposit",
    cancel: "Cancel",
    processing: "Processing...",
    whatsappChat: "Chat on WhatsApp",
    validationPassengers: "Passengers exceed aircraft capacity",
    validationDate: "Please select a date",
    validationRequired: "Please fill in all required fields",
    noFlightAvailable: "No flight available for this selection. Please contact us via WhatsApp.",
  },
  es: {
    title: "Elige Tu Vuelo",
    subtitle: "Selecciona los detalles de tu vuelo y paga un depósito para asegurar tu reserva.",
    flightType: "Tipo de Vuelo",
    charter: "Vuelo Charter",
    scenic: "Tour Escénico",
    route: "Ruta",
    selectRoute: "Selecciona una ruta",
    aircraft: "Aeronave",
    cessna: "Cessna 206 (hasta 5 pasajeros)",
    kodiak: "Kodiak (hasta 9 pasajeros)",
    piper: "Piper Seneca (hasta 5 pasajeros)",
    date: "Fecha",
    selectDate: "Selecciona fecha",
    passengers: "Pasajeros",
    contactInfo: "Información de Contacto",
    firstName: "Nombre",
    lastName: "Apellido",
    email: "Correo Electrónico",
    phone: "Teléfono",
    pickupArea: "Zona de Recogida / Nombre del Hotel",
    notes: "Notas Adicionales (Opcional)",
    priceBreakdown: "Desglose de Precio",
    subtotal: "Subtotal",
    iva: "IVA (16%)",
    total: "Total",
    depositNow: "Depósito a Pagar",
    balanceDue: "Saldo Pendiente",
    continueToDeposit: "Continuar al Depósito",
    cancel: "Cancelar",
    processing: "Procesando...",
    whatsappChat: "Chat en WhatsApp",
    validationPassengers: "Los pasajeros exceden la capacidad de la aeronave",
    validationDate: "Por favor selecciona una fecha",
    validationRequired: "Por favor completa todos los campos requeridos",
    noFlightAvailable: "No hay vuelo disponible para esta selección. Contáctanos por WhatsApp.",
  },
};

// Margea contact - all flight inquiries go to Margea
const WHATSAPP_NUMBER = "529982334867";

export function FlightPickerModal({ 
  open, 
  onOpenChange, 
  preselectedAircraft,
  preselectedRoute,
  preselectedFlightType,
  source,
  language 
}: FlightPickerModalProps) {
  const t = translations[language];
  const { toast } = useToast();
  
  // Flight selection state
  const [flightType, setFlightType] = useState<FlightType>(preselectedFlightType || 'charter');
  const [route, setRoute] = useState(preselectedRoute || '');
  const [aircraft, setAircraft] = useState<AircraftType>(preselectedAircraft);
  const [date, setDate] = useState<Date>();
  const [passengers, setPassengers] = useState(1);
  
  // Contact info state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneE164, setPhoneE164] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [pickupArea, setPickupArea] = useState('');
  const [notes, setNotes] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passengerError, setPassengerError] = useState('');

  // Max passengers based on aircraft (Piper and Cessna = 5, Kodiak = 9)
  const maxPassengers = aircraft === 'kodiak' ? 9 : 5;
  
  // Get routes based on flight type
  const availableRoutes = flightType === 'charter' ? charterRoutes : scenicRoutes;

  // Update preselected values when props change
  useEffect(() => {
    setAircraft(preselectedAircraft);
  }, [preselectedAircraft]);

  useEffect(() => {
    if (preselectedRoute) {
      setRoute(preselectedRoute);
    }
  }, [preselectedRoute]);

  useEffect(() => {
    if (preselectedFlightType) {
      setFlightType(preselectedFlightType);
    }
  }, [preselectedFlightType]);

  // Reset route when flight type changes (only if not matching preselected)
  useEffect(() => {
    if (!preselectedRoute || !availableRoutes.includes(route)) {
      setRoute('');
    }
  }, [flightType]);

  // Validate passengers when aircraft or passengers change
  useEffect(() => {
    if (passengers > maxPassengers) {
      setPassengerError(t.validationPassengers);
    } else {
      setPassengerError('');
    }
  }, [passengers, maxPassengers, t.validationPassengers]);

  // Find matching flight product
  const findFlightProduct = (): FlightProduct | null => {
    const flightList = flightType === 'charter' ? flights : scenicFlights;
    const aircraftMatch = aircraft === 'cessna' ? 'Cessna' : aircraft === 'piper' ? 'Piper' : 'Kodiak';
    
    // Try exact route match first
    let match = flightList.find(f => 
      f.route_name === route && f.aircraft.includes(aircraftMatch)
    );
    
    // If no exact match, try partial match
    if (!match) {
      match = flightList.find(f => 
        f.route_name.includes(route) && f.aircraft.includes(aircraftMatch)
      );
    }
    
    // Fallback to first flight of matching aircraft if we have a custom route
    if (!match && route) {
      match = flightList.find(f => f.aircraft.includes(aircraftMatch));
    }
    
    return match || null;
  };

  const selectedFlight = findFlightProduct();
  
  // Calculate pricing with dynamic deposit rule
  const pricing: FlightPricing | null = selectedFlight 
    ? calculateFlightPricingWithRule(selectedFlight.margea_price_usd, getDepositRule(selectedFlight))
    : null;

  const resetForm = () => {
    setFlightType(preselectedFlightType || 'charter');
    setRoute(preselectedRoute || '');
    setAircraft(preselectedAircraft);
    setDate(undefined);
    setPassengers(1);
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhoneE164('');
    setIsPhoneValid(false);
    setPickupArea('');
    setNotes('');
    setPassengerError('');
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!date) {
      toast({
        title: language === 'en' ? "Missing Date" : "Fecha Faltante",
        description: t.validationDate,
        variant: "destructive",
      });
      return;
    }

    if (passengers > maxPassengers) {
      toast({
        title: language === 'en' ? "Invalid Passengers" : "Pasajeros Inválidos",
        description: t.validationPassengers,
        variant: "destructive",
      });
      return;
    }

    if (!firstName || !lastName || !email || !isPhoneValid || !route || !pickupArea) {
      toast({
        title: language === 'en' ? "Missing Fields" : "Campos Faltantes",
        description: t.validationRequired,
        variant: "destructive",
      });
      return;
    }

    if (!selectedFlight || !pricing) {
      toast({
        title: language === 'en' ? "No Flight Available" : "Vuelo No Disponible",
        description: t.noFlightAvailable,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-flight-checkout', {
        body: {
          // Flight details
          route_name: route,
          aircraft: selectedFlight.aircraft,
          category: flightType === 'charter' ? 'Flights' : 'Scenic Flights',
          flight_type: flightType,
          
          // Pricing
          subtotal_usd: pricing.subtotal_usd,
          iva_usd: pricing.iva_usd,
          total_usd: pricing.total_usd,
          deposit_usd: pricing.deposit_usd,
          balance_due_usd: pricing.balance_due_usd,
          
          // Deposit rule details
          deposit_type: pricing.deposit_type,
          deposit_percent: pricing.deposit_percent,
          deposit_fixed_usd: pricing.deposit_fixed_usd,
          deposit_min_usd: pricing.deposit_min_usd,
          
          // Customer info
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone: phoneE164,
          
          // Booking details
          desired_date: format(date, 'yyyy-MM-dd'),
          passengers: passengers,
          pickup_area: pickupArea,
          notes: notes || undefined,
          
          // Tracking
          source: source,
          page_path: '/activities/flights',
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: language === 'en' ? "Error" : "Error",
        description: language === 'en' 
          ? "There was an error processing your payment. Please try again."
          : "Hubo un error al procesar tu pago. Por favor intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsApp = () => {
    const aircraftName = aircraft === 'cessna' ? 'Cessna 206' : aircraft === 'piper' ? 'Piper Seneca' : 'Kodiak';
    const message = encodeURIComponent(
      `Hi, I'd like to book a ${flightType === 'charter' ? 'charter flight' : 'scenic tour'}:\n\n` +
      `Route: ${route || 'TBD'}\n` +
      `Aircraft: ${aircraftName}\n` +
      `Date: ${date ? format(date, 'PPP') : 'TBD'}\n` +
      `Passengers: ${passengers}\n` +
      `Name: ${firstName} ${lastName}\n` +
      (pricing ? `Estimated Total: $${pricing.total_usd} USD (incl. IVA)` : '')
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
          <DialogDescription>{t.subtitle}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Flight Type Segmented Control */}
          <div className="space-y-2">
            <Label>{t.flightType}</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={flightType === 'charter' ? 'default' : 'outline'}
                onClick={() => setFlightType('charter')}
                className="w-full"
              >
                {t.charter}
              </Button>
              <Button
                type="button"
                variant={flightType === 'scenic' ? 'default' : 'outline'}
                onClick={() => setFlightType('scenic')}
                className="w-full"
              >
                {t.scenic}
              </Button>
            </div>
          </div>

          {/* Route Selection */}
          <div className="space-y-2">
            <Label>{t.route} *</Label>
            <Select value={route} onValueChange={setRoute}>
              <SelectTrigger>
                <SelectValue placeholder={t.selectRoute} />
              </SelectTrigger>
              <SelectContent>
                {availableRoutes.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Aircraft Selection */}
          <div className="space-y-2">
            <Label>{t.aircraft} *</Label>
            <Select value={aircraft} onValueChange={(v) => setAircraft(v as AircraftType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cessna">{t.cessna}</SelectItem>
                <SelectItem value="kodiak">{t.kodiak}</SelectItem>
                <SelectItem value="piper">{t.piper}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date and Passengers Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t.date} *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : <span>{t.selectDate}</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(d) => d < new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>{t.passengers} * (max {maxPassengers})</Label>
              <div className="relative">
                <Input
                  type="number"
                  min={1}
                  max={maxPassengers}
                  value={passengers}
                  onChange={(e) => setPassengers(parseInt(e.target.value) || 1)}
                  className={cn(passengerError && "border-destructive")}
                />
                {passengerError && (
                  <div className="flex items-center gap-1 mt-1 text-destructive text-xs">
                    <AlertCircle className="w-3 h-3" />
                    <span>{passengerError}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          {pricing && route && (
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-semibold text-foreground mb-3">{t.priceBreakdown}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.subtotal}:</span>
                  <span className="text-foreground">${pricing.subtotal_usd.toLocaleString()} USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.iva}:</span>
                  <span className="text-foreground">${pricing.iva_usd.toLocaleString()} USD</span>
                </div>
                <div className="flex justify-between font-semibold border-t border-border pt-2">
                  <span className="text-foreground">{t.total}:</span>
                  <span className="text-foreground">${pricing.total_usd.toLocaleString()} USD</span>
                </div>
                <div className="flex justify-between text-primary font-bold border-t border-border pt-2">
                  <span>{t.depositNow}:</span>
                  <span>${pricing.deposit_usd.toLocaleString()} USD</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>{t.balanceDue}:</span>
                  <span>${pricing.balance_due_usd.toLocaleString()} USD</span>
                </div>
              </div>
            </div>
          )}

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">{t.contactInfo}</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">{t.firstName} *</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">{t.lastName} *</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t.email} *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>{t.phone} *</Label>
              <PhoneInputWithCountry
                value={phoneE164}
                onChange={(value, isValid) => {
                  setPhoneE164(value);
                  setIsPhoneValid(isValid);
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pickupArea">{t.pickupArea} *</Label>
              <Input
                id="pickupArea"
                value={pickupArea}
                onChange={(e) => setPickupArea(e.target.value)}
                placeholder="e.g., Grand Hyatt Cancun, Tulum Centro"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">{t.notes}</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || !!passengerError}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.processing}
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  {t.continueToDeposit} {pricing ? `($${pricing.deposit_usd.toLocaleString()})` : ''}
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleWhatsApp}
              className="sm:w-auto"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              {t.whatsappChat}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              className="sm:w-auto"
            >
              {t.cancel}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
