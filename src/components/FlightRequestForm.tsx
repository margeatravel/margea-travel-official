import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Loader2, CheckCircle, CreditCard } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { PhoneInputWithCountry } from "@/components/PhoneInputWithCountry";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getRouteNames } from "@/data/flights-data";
import { calculateFlightPricingFromMargeaPrice, type FlightPricing } from "@/lib/flight-pricing";
import type { FlightProduct } from "@/data/flights-data";

interface FlightRequestFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFlight: FlightProduct | null;
  language: 'en' | 'es';
}

const translations = {
  en: {
    title: "Book Flight",
    subtitle: "Pay a 25% deposit to secure your flight. Balance due before departure.",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    phone: "Phone",
    desiredDate: "Desired Date",
    route: "Route",
    selectRoute: "Select route",
    passengers: "Number of Passengers",
    aircraft: "Aircraft Preference (Optional)",
    selectAircraft: "Any aircraft",
    cessna: "Cessna 206 (Up to 5 pax)",
    kodiak: "Kodiak (Up to 9 pax)",
    pickupArea: "Pickup Area / Hotel Name",
    notes: "Additional Notes",
    payDeposit: "Pay Deposit Now",
    processing: "Processing...",
    successTitle: "Deposit Paid!",
    successMessage: "Your flight is being confirmed. We'll contact you within 24 hours.",
    whatsappChat: "Chat on WhatsApp",
    close: "Close",
    priceBreakdown: "Price Breakdown",
    subtotal: "Subtotal",
    iva: "IVA (16%)",
    total: "Total",
    depositNow: "Deposit (25%)",
    balanceDue: "Balance Due Later",
  },
  es: {
    title: "Reservar Vuelo",
    subtitle: "Paga un depósito del 25% para asegurar tu vuelo. Saldo pendiente antes de la salida.",
    firstName: "Nombre",
    lastName: "Apellido",
    email: "Correo Electrónico",
    phone: "Teléfono",
    desiredDate: "Fecha Deseada",
    route: "Ruta",
    selectRoute: "Seleccionar ruta",
    passengers: "Número de Pasajeros",
    aircraft: "Preferencia de Aeronave (Opcional)",
    selectAircraft: "Cualquier aeronave",
    cessna: "Cessna 206 (Hasta 5 pax)",
    kodiak: "Kodiak (Hasta 9 pax)",
    pickupArea: "Zona de Recogida / Nombre del Hotel",
    notes: "Notas Adicionales",
    payDeposit: "Pagar Depósito Ahora",
    processing: "Procesando...",
    successTitle: "¡Depósito Pagado!",
    successMessage: "Tu vuelo está siendo confirmado. Te contactaremos en 24 horas.",
    whatsappChat: "Chat en WhatsApp",
    close: "Cerrar",
    priceBreakdown: "Desglose de Precio",
    subtotal: "Subtotal",
    iva: "IVA (16%)",
    total: "Total",
    depositNow: "Depósito (25%)",
    balanceDue: "Saldo Pendiente",
  },
};

// Margea contact - all flight inquiries go to Margea
const WHATSAPP_NUMBER = "529982334867";

export function FlightRequestForm({ open, onOpenChange, selectedFlight, language }: FlightRequestFormProps) {
  const t = translations[language];
  const { toast } = useToast();
  const routeNames = getRouteNames();
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneE164, setPhoneE164] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [desiredDate, setDesiredDate] = useState<Date>();
  const [route, setRoute] = useState(selectedFlight?.route_name || "");
  const [passengers, setPassengers] = useState("1");
  const [aircraftPreference, setAircraftPreference] = useState("");
  const [pickupArea, setPickupArea] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Calculate pricing
  const pricing: FlightPricing | null = selectedFlight 
    ? calculateFlightPricingFromMargeaPrice(selectedFlight.margea_price_usd)
    : null;

  // Update route when selectedFlight changes
  useEffect(() => {
    if (selectedFlight) {
      setRoute(selectedFlight.route_name);
      // Set aircraft preference based on selected flight
      if (selectedFlight.aircraft.includes('Cessna')) {
        setAircraftPreference('cessna');
      } else if (selectedFlight.aircraft.includes('Kodiak')) {
        setAircraftPreference('kodiak');
      }
    }
  }, [selectedFlight]);

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhoneE164("");
    setIsPhoneValid(false);
    setDesiredDate(undefined);
    setRoute("");
    setPassengers("1");
    setAircraftPreference("");
    setPickupArea("");
    setNotes("");
    setIsSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !isPhoneValid || !desiredDate || !route || !passengers || !pickupArea) {
      toast({
        title: language === 'en' ? "Missing Fields" : "Campos Faltantes",
        description: language === 'en' ? "Please fill in all required fields." : "Por favor completa todos los campos requeridos.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedFlight || !pricing) {
      toast({
        title: language === 'en' ? "Error" : "Error",
        description: language === 'en' ? "Please select a flight." : "Por favor selecciona un vuelo.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-flight-checkout', {
        body: {
          // Flight details
          route_name: selectedFlight.route_name,
          aircraft: selectedFlight.aircraft,
          category: selectedFlight.category,
          
          // Pricing
          subtotal_usd: pricing.subtotal_usd,
          iva_usd: pricing.iva_usd,
          total_usd: pricing.total_usd,
          deposit_usd: pricing.deposit_usd,
          balance_due_usd: pricing.balance_due_usd,
          deposit_type: pricing.deposit_type,
          deposit_percent: pricing.deposit_percent,
          
          // Tracking
          source: 'flight_card',
          page_path: '/activities/flights',
          
          // Customer info
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone: phoneE164,
          
          // Booking details
          desired_date: format(desiredDate, 'yyyy-MM-dd'),
          passengers: parseInt(passengers),
          pickup_area: pickupArea,
          notes: notes || undefined,
        },
      });

      if (error) throw error;

      if (data?.url) {
        // Redirect to Stripe Checkout
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
    const message = encodeURIComponent(
      `Hi, I'd like to book a flight:\n\n` +
      `Route: ${route || 'TBD'}\n` +
      `Date: ${desiredDate ? format(desiredDate, 'PPP') : 'TBD'}\n` +
      `Passengers: ${passengers || 'TBD'}\n` +
      `Name: ${firstName} ${lastName}\n` +
      (pricing ? `Total: $${pricing.total_usd} USD (incl. IVA)` : '')
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  if (isSuccess) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">{t.successTitle}</h3>
            <p className="text-muted-foreground mb-6">{t.successMessage}</p>
            <Button onClick={handleClose} className="w-full">
              {t.close}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
          <DialogDescription>{t.subtitle}</DialogDescription>
        </DialogHeader>

        {/* Price Breakdown Box */}
        {pricing && (
          <div className="bg-muted/50 rounded-lg p-4 mb-4">
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

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Label>{t.desiredDate} *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !desiredDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {desiredDate ? format(desiredDate, 'PPP') : <span>{t.desiredDate}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={desiredDate}
                  onSelect={setDesiredDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>{t.route} *</Label>
            <Select value={route} onValueChange={setRoute}>
              <SelectTrigger>
                <SelectValue placeholder={t.selectRoute} />
              </SelectTrigger>
              <SelectContent>
                {routeNames.map((routeName) => (
                  <SelectItem key={routeName} value={routeName}>
                    {routeName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="passengers">{t.passengers} *</Label>
              <Select value={passengers} onValueChange={setPassengers}>
                <SelectTrigger>
                  <SelectValue placeholder="1-9" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t.aircraft}</Label>
              <Select value={aircraftPreference} onValueChange={setAircraftPreference}>
                <SelectTrigger>
                  <SelectValue placeholder={t.selectAircraft} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">{t.selectAircraft}</SelectItem>
                  <SelectItem value="cessna">{t.cessna}</SelectItem>
                  <SelectItem value="kodiak">{t.kodiak}</SelectItem>
                </SelectContent>
              </Select>
            </div>
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

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
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
                  {t.payDeposit} (${pricing?.deposit_usd.toLocaleString() || '0'})
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleWhatsApp}
              className="flex-1"
            >
              <WhatsAppIcon size={16} className="mr-2" />
              {t.whatsappChat}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
