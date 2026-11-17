import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Plane, CalendarIcon, Users, MapPin, Loader2, CheckCircle, ArrowLeft } from "lucide-react";

type Language = "en" | "es";

const AIRCRAFT_BASE = "Toluca (TLC)";

const translations = {
  en: {
    title: "Private Flight Charter",
    subtitle: "Learjet 31A — Based in Toluca (TLC)",
    desc: "National and international flights available. Our aviation team will provide a tailored quote based on your route, flight time, airport fees, and availability.",
    origin: "Departure Airport",
    destination: "Destination",
    departureDate: "Departure Date",
    returnDate: "Return Date (optional)",
    passengers: "Passengers",
    flightType: "Flight Type",
    oneWay: "One Way",
    roundTrip: "Round Trip",
    fullName: "Full Name",
    email: "Email",
    phone: "Phone (optional)",
    notes: "Additional Notes (optional)",
    submit: "Request Quote",
    submitting: "Submitting...",
    successTitle: "Request Submitted!",
    successMsg: "Our aviation team will contact you shortly with a tailored quote.",
    caseLabel: "Case Number",
    backToFlights: "Back to Flights",
    selectDate: "Select date",
    repositioningNote: "Aircraft may require repositioning. Final pricing will reflect routing.",
    baseLabel: "Aircraft base",
  },
  es: {
    title: "Vuelo Charter Privado",
    subtitle: "Learjet 31A — Base en Toluca (TLC)",
    desc: "Vuelos nacionales e internacionales disponibles. Nuestro equipo de aviación le proporcionará una cotización personalizada basada en su ruta, tiempo de vuelo, tarifas aeroportuarias y disponibilidad.",
    origin: "Aeropuerto de Salida",
    destination: "Destino",
    departureDate: "Fecha de Salida",
    returnDate: "Fecha de Regreso (opcional)",
    passengers: "Pasajeros",
    flightType: "Tipo de Vuelo",
    oneWay: "Solo Ida",
    roundTrip: "Ida y Vuelta",
    fullName: "Nombre Completo",
    email: "Correo Electrónico",
    phone: "Teléfono (opcional)",
    notes: "Notas Adicionales (opcional)",
    submit: "Solicitar Cotización",
    submitting: "Enviando...",
    successTitle: "¡Solicitud Enviada!",
    successMsg: "Nuestro equipo de aviación se pondrá en contacto contigo con una cotización personalizada.",
    caseLabel: "Número de Caso",
    backToFlights: "Volver a Vuelos",
    selectDate: "Seleccionar fecha",
    repositioningNote: "La aeronave puede requerir reposicionamiento. El precio final reflejará la ruta completa.",
    baseLabel: "Base de la aeronave",
  },
};

export default function CharterRequest() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<Language>("en");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [caseNumber, setCaseNumber] = useState("");

  const [origin, setOrigin] = useState(AIRCRAFT_BASE);
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [passengers, setPassengers] = useState("2");
  const [flightType, setFlightType] = useState("one_way");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const requiresRepositioning = origin.trim().toLowerCase() !== AIRCRAFT_BASE.toLowerCase();

  const t = translations[language];

  useEffect(() => {
    document.title = "Private Charter — Learjet 31A | Margea Aviation";
  }, []);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin || !destination || !departureDate || !fullName || !email) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      // Insert into DB
      const { data: insertData, error: insertError } = await supabase
        .from("charter_requests")
        .insert({
          aircraft: "Learjet 31A",
          origin,
          destination,
          departure_date: format(departureDate, "yyyy-MM-dd"),
          return_date: returnDate ? format(returnDate, "yyyy-MM-dd") : null,
          passengers: parseInt(passengers),
          flight_type: flightType,
          full_name: fullName,
          email,
          phone: phone || null,
          notes: notes || null,
          requires_repositioning: requiresRepositioning,
          aircraft_base: AIRCRAFT_BASE,
        })
        .select("case_number")
        .single();

      if (insertError) throw insertError;

      const confirmationNumber = insertData.case_number;

      // Send email notification
      try {
        await supabase.functions.invoke("send-charter-request-email", {
          body: {
            fullName,
            email,
            phone,
            aircraft: "Learjet 31A",
            origin,
            destination,
            departureDate: format(departureDate, "PPP"),
            returnDate: returnDate ? format(returnDate, "PPP") : null,
            passengers,
            flightType: flightType === "round_trip" ? "Round Trip" : "One Way",
            notes,
            caseNumber: confirmationNumber,
            requiresRepositioning,
            aircraftBase: AIRCRAFT_BASE,
          },
        });
      } catch (emailErr) {
        console.error("Email failed:", emailErr);
      }

      setCaseNumber(confirmationNumber);
      setSuccess(true);
    } catch (err: any) {
      console.error("Charter request error:", err);
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar language={language} onLanguageChange={setLanguage} />
        <div className="container mx-auto px-4 py-20 md:py-28">
          <div className="max-w-lg mx-auto text-center">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-foreground mb-3">{t.successTitle}</h1>
            <p className="text-muted-foreground mb-8">{t.successMsg}</p>
            <div className="bg-card border border-border rounded-2xl p-6 mb-8">
              <p className="text-xs text-muted-foreground">{t.caseLabel}</p>
              <p className="text-2xl font-bold text-primary">{caseNumber}</p>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Follow us{" "}
              <a href="https://www.instagram.com/margeatravel/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                @margeatravel
              </a>
            </p>
            <Button onClick={() => navigate("/activities/flights")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t.backToFlights}
            </Button>
          </div>
        </div>
        <Footer language={language} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar language={language} onLanguageChange={setLanguage} />

      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-2xl mx-auto">
          {/* Back button */}
          <Button variant="ghost" size="sm" className="mb-6" onClick={() => navigate("/activities/flights")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.backToFlights}
          </Button>

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-4">
              <Plane className="w-4 h-4" />
              Learjet 31A
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{t.title}</h1>
            <p className="text-lg text-primary font-medium mb-3">{t.subtitle}</p>
            <p className="text-muted-foreground max-w-xl mx-auto">{t.desc}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm space-y-5">
            {/* Origin (editable, defaults to Toluca) */}
            <div>
              <Label htmlFor="charter-origin" className="text-sm font-medium mb-2 block">{t.origin} *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                <Input
                  id="charter-origin"
                  required
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="pl-9"
                  placeholder="Toluca (TLC)"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">{t.baseLabel}: Toluca (TLC) — MMTO</p>
              {requiresRepositioning && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1.5 flex items-center gap-1.5">
                  <Plane className="w-3 h-3 shrink-0" />
                  {t.repositioningNote}
                </p>
              )}
            </div>

            {/* Destination */}
            <div>
              <Label htmlFor="charter-dest" className="text-sm font-medium mb-2 block">{t.destination} *</Label>
              <Input
                id="charter-dest"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Cancún, Miami, Los Cabos..."
              />
            </div>

            {/* Flight Type & Passengers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">{t.flightType}</Label>
                <Select value={flightType} onValueChange={setFlightType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one_way">{t.oneWay}</SelectItem>
                    <SelectItem value="round_trip">{t.roundTrip}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">{t.passengers} *</Label>
                <Select value={passengers} onValueChange={setPassengers}>
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n} {n === 1 ? "Passenger" : "Passengers"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">{t.departureDate} *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !departureDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {departureDate ? format(departureDate, "PPP") : t.selectDate}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={departureDate} onSelect={setDepartureDate} disabled={(d) => d < tomorrow} initialFocus className="p-3 pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">{t.returnDate}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !returnDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {returnDate ? format(returnDate, "PPP") : t.selectDate}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={returnDate} onSelect={setReturnDate} disabled={(d) => d < (departureDate || tomorrow)} initialFocus className="p-3 pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="charter-name" className="text-sm font-medium mb-2 block">{t.fullName} *</Label>
                <Input id="charter-name" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" />
              </div>
              <div>
                <Label htmlFor="charter-email" className="text-sm font-medium mb-2 block">{t.email} *</Label>
                <Input id="charter-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@email.com" />
              </div>
            </div>

            <div>
              <Label htmlFor="charter-phone" className="text-sm font-medium mb-2 block">{t.phone}</Label>
              <Input id="charter-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 123 4567" />
            </div>

            <div>
              <Label htmlFor="charter-notes" className="text-sm font-medium mb-2 block">{t.notes}</Label>
              <Textarea id="charter-notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Special requests, preferred timing, luggage details..." />
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t.submitting}
                </>
              ) : (
                <>
                  <Plane className="w-4 h-4 mr-2" />
                  {t.submit}
                </>
              )}
            </Button>
          </form>
        </div>
      </div>

      <Footer language={language} />
    </div>
  );
}
