import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CarBookingCalendar } from "@/components/CarBookingCalendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Settings2, DoorOpen, Snowflake, ShieldCheck, Fuel, Clock, ChevronLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { YaabCar, getYaabCarBySlug, mapRentalCarRow } from "@/data/yaab-cars-data";
import { useCurrency } from "@/hooks/use-currency";

type Language = "en" | "es";

const translations = {
  en: {
    back: "Car Rentals",
    specs: "Specifications",
    passengers: "Passengers",
    transmission: "Transmission",
    automatic: "Automatic",
    doors: "Doors",
    ac: "Air conditioning",
    year: "Year",
    minRental: "Minimum rental",
    days: "days",
    included: "Included",
    deposit: "Security deposit",
    depositInfo: "Refundable. YAAB informs the amount before delivery; it is not charged online.",
    depositNotSet: "The security deposit depends on the vehicle and is informed before delivery.",
    requirementsTitle: "Requirements & terms",
    requirements: [
      "18+ years old, valid driver's license (foreign licenses accepted if valid) and official ID (INE or passport).",
      "50% deposit online to confirm — the remaining 50% at delivery, cash or bank transfer to YAAB.",
      "Insurance included and unlimited mileage.",
      "Delivery and return 24h in Cancún (airport, hotels, Hotel Zone).",
      "Return the car with the same fuel level. Late return may carry an extra charge.",
      "Cancellation less than 24h before delivery: the deposit is not refundable.",
    ],
    fullTermsLink: "Read the full rental Terms & Conditions",
    privacyLink: "Car rental Privacy Notice",
    operatedBy: "Operated by YAAB Rental Car Cancún",
    notFound: "Car not found",
    notFoundText: "This car is no longer available.",
    loading: "Loading...",
  },
  es: {
    back: "Renta de Coches",
    specs: "Especificaciones",
    passengers: "Pasajeros",
    transmission: "Transmisión",
    automatic: "Automática",
    doors: "Puertas",
    ac: "Aire acondicionado",
    year: "Año",
    minRental: "Renta mínima",
    days: "días",
    included: "Incluido",
    deposit: "Depósito en garantía",
    depositInfo: "Reembolsable. YAAB informa el monto antes de la entrega; no se cobra en línea.",
    depositNotSet: "El depósito en garantía depende del vehículo y se informa antes de la entrega.",
    requirementsTitle: "Requisitos y términos",
    requirements: [
      "18 años o más, licencia de conducir vigente (extranjera aceptada si está vigente) e identificación oficial (INE o pasaporte).",
      "Anticipo del 50% en línea para confirmar — el 50% restante a la entrega, en efectivo o transferencia a YAAB.",
      "Seguro incluido y kilometraje libre.",
      "Entrega y devolución 24 h en Cancún (aeropuerto, hoteles, Zona Hotelera).",
      "Devolver el auto con el mismo nivel de gasolina. La devolución tardía puede tener cargo extra.",
      "Cancelación con menos de 24 h antes de la entrega: el anticipo no es reembolsable.",
    ],
    fullTermsLink: "Leer los Términos y Condiciones completos de la renta",
    privacyLink: "Aviso de Privacidad de renta de coches",
    operatedBy: "Operado por YAAB Rental Car Cancún",
    notFound: "Auto no encontrado",
    notFoundText: "Este auto ya no está disponible.",
    loading: "Cargando...",
  },
};

const CarRentalDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [language, setLanguage] = useState<Language>("en");
  const [car, setCar] = useState<YaabCar | null>(null);
  const [loading, setLoading] = useState(true);
  const { formatPrice } = useCurrency();
  const t = translations[language];

  useEffect(() => {
    const fetchCar = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from("rental_cars")
          .select("*")
          .eq("slug", slug)
          .eq("active", true)
          .maybeSingle();
        if (error) throw error;
        if (data) {
          setCar(mapRentalCarRow(data as unknown as Record<string, unknown>));
        } else {
          setCar(getYaabCarBySlug(slug));
        }
      } catch (error) {
        console.error("Error fetching rental car, using seed data:", error);
        setCar(getYaabCarBySlug(slug));
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [slug]);

  useEffect(() => {
    if (car) {
      document.title = `${car.name} ${car.trim} ${car.year} — Car Rental Cancún | Margea`;
    }
  }, [car]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar language={language} onLanguageChange={setLanguage} forceOpaque />
        <main className="container mx-auto px-4 py-24 text-center text-muted-foreground">
          {t.loading}
        </main>
        <Footer language={language} />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar language={language} onLanguageChange={setLanguage} forceOpaque />
        <main className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold mb-2">{t.notFound}</h1>
          <p className="text-muted-foreground mb-6">{t.notFoundText}</p>
          <Button asChild>
            <Link to="/activities/car-rentals">{t.back}</Link>
          </Button>
        </main>
        <Footer language={language} />
      </div>
    );
  }

  const features = language === "es" ? car.featuresEs : car.features;

  return (
    <div className="min-h-screen bg-background">
      <Navbar language={language} onLanguageChange={setLanguage} forceOpaque />

      <main className="container mx-auto px-4 py-8 pt-24">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/activities/car-rentals" className="flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />
            {t.back}
          </Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left: gallery + details */}
          <div className="lg:col-span-2 space-y-8">
            <div className="relative rounded-xl overflow-hidden aspect-[16/10]">
              <img
                src={car.imageUrl}
                alt={`${car.name} ${car.trim} ${car.year}`}
                className="w-full h-full object-cover"
              />
              <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground font-semibold">
                {car.year}
              </Badge>
            </div>

            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {car.name} {car.trim}
              </h1>
              <p className="text-muted-foreground text-lg">
                {language === "es" ? car.descriptionEs : car.description}
              </p>
              <p className="text-xs text-muted-foreground mt-3">{t.operatedBy}</p>
            </div>

            {/* Specs */}
            <div>
              <h2 className="text-xl font-semibold mb-4">{t.specs}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border border-border">
                  <Users className="w-5 h-5 text-primary mb-2" />
                  <p className="text-xs text-muted-foreground">{t.passengers}</p>
                  <p className="font-semibold">{car.passengers}</p>
                </div>
                <div className="p-4 rounded-lg border border-border">
                  <Settings2 className="w-5 h-5 text-primary mb-2" />
                  <p className="text-xs text-muted-foreground">{t.transmission}</p>
                  <p className="font-semibold">
                    {car.transmission === "Automática" ? t.automatic : car.transmission}
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-border">
                  <DoorOpen className="w-5 h-5 text-primary mb-2" />
                  <p className="text-xs text-muted-foreground">{t.doors}</p>
                  <p className="font-semibold">{car.doors}</p>
                </div>
                <div className="p-4 rounded-lg border border-border">
                  <Snowflake className="w-5 h-5 text-primary mb-2" />
                  <p className="text-xs text-muted-foreground">{t.ac}</p>
                  <p className="font-semibold">{car.airConditioning ? "✓" : "—"}</p>
                </div>
                <div className="p-4 rounded-lg border border-border">
                  <Clock className="w-5 h-5 text-primary mb-2" />
                  <p className="text-xs text-muted-foreground">{t.minRental}</p>
                  <p className="font-semibold">
                    {car.minDays} {t.days}
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-border">
                  <ShieldCheck className="w-5 h-5 text-primary mb-2" />
                  <p className="text-xs text-muted-foreground">{t.deposit}</p>
                  <p className="font-semibold">
                    {car.depositMxn != null ? formatPrice(car.depositMxn) : "—"}
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                {car.depositMxn != null ? t.depositInfo : t.depositNotSet}
              </p>
            </div>

            {/* Included */}
            <div>
              <h2 className="text-xl font-semibold mb-4">{t.included}</h2>
              <ul className="space-y-2">
                {features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-muted-foreground">
                    <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                    {feature}
                  </li>
                ))}
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Fuel className="w-4 h-4 text-primary shrink-0" />
                  {language === "es"
                    ? "Devolver con el mismo nivel de gasolina"
                    : "Return with the same fuel level"}
                </li>
              </ul>
            </div>

            {/* Requirements */}
            <div>
              <h2 className="text-xl font-semibold mb-4">{t.requirementsTitle}</h2>
              <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
                {t.requirements.map((req) => (
                  <li key={req}>{req}</li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/activities/car-rentals/terms">{t.fullTermsLink}</Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/activities/car-rentals/privacy">{t.privacyLink}</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Right: booking calendar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <CarBookingCalendar car={car} language={language} />
            </div>
          </div>
        </div>
      </main>

      <Footer language={language} />
    </div>
  );
};

export default CarRentalDetail;
