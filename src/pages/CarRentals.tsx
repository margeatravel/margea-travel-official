import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CarCard } from "@/components/CarCard";
import { ActivityHero } from "@/components/ActivityHero";
import { Button } from "@/components/ui/button";
import { Car, Mail, Phone, ShieldCheck, Fuel, Clock, Users } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { supabase } from "@/integrations/supabase/client";
import { YaabCar, yaabCarsSeed, mapRentalCarRow } from "@/data/yaab-cars-data";
import { getWhatsAppUrl } from "@/lib/whatsapp";

type Language = "en" | "es";

const translations = {
  en: {
    heroTitle: "Car Rentals",
    heroSubtitle: "Rent your freedom. Live Cancún.",
    operatedBy: "Operated by YAAB Rental Car Cancún",
    sectionTitle: "Choose the ideal car for your trip",
    sectionSubtitle: "Modern cars, personal service and clear rates — no hidden fees.",
    filterAll: "All cars",
    filter5: "5 passengers",
    filter7: "7 passengers",
    disclaimer: "Daily rates in MXN. Minimum rental 3 days. Availability subject to confirmation with YAAB within 24 hours.",
    termsTitle: "Good to know",
    terms: [
      "50% deposit online to confirm — the remaining 50% at delivery (cash or bank transfer to YAAB).",
      "Insurance included and unlimited mileage on all cars.",
      "Delivery and return 24h in Cancún (airport, hotels, Hotel Zone).",
      "18+ years old, valid driver's license and official ID (INE or passport).",
      "Refundable security deposit depends on the vehicle and is informed before delivery.",
    ],
    contact: "Contact Us",
    email: "admin@margeatravel.com",
    phone: "+52 998 233 4867",
    loading: "Loading cars...",
  },
  es: {
    heroTitle: "Renta de Coches",
    heroSubtitle: "Renta tu libertad. Vive Cancún.",
    operatedBy: "Operado por YAAB Rental Car Cancún",
    sectionTitle: "Elige el auto ideal para tu viaje",
    sectionSubtitle: "Autos modernos, atención personalizada y tarifas claras, sin cargos ocultos.",
    filterAll: "Todos los autos",
    filter5: "5 pasajeros",
    filter7: "7 pasajeros",
    disclaimer: "Tarifas por día en MXN. Renta mínima 3 días. Disponibilidad sujeta a confirmación con YAAB en menos de 24 horas.",
    termsTitle: "Lo que debes saber",
    terms: [
      "Anticipo del 50% en línea para confirmar — el 50% restante a la entrega (efectivo o transferencia a YAAB).",
      "Seguro incluido y kilometraje libre en todos los autos.",
      "Entrega y devolución 24 h en Cancún (aeropuerto, hoteles, Zona Hotelera).",
      "18 años o más, licencia de conducir vigente e identificación oficial (INE o pasaporte).",
      "El depósito en garantía reembolsable depende del vehículo y se informa antes de la entrega.",
    ],
    contact: "Contáctanos",
    email: "admin@margeatravel.com",
    phone: "+52 998 233 4867",
    loading: "Cargando autos...",
  },
};

const CarRentals = () => {
  const [language, setLanguage] = useState<Language>("en");
  const [cars, setCars] = useState<YaabCar[]>([]);
  const [loading, setLoading] = useState(true);
  const [passengerFilter, setPassengerFilter] = useState<number | null>(null);
  const t = translations[language];

  useEffect(() => {
    document.title = "Car Rentals in Cancún | Margea — YAAB Rental Car";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Rent a car in Cancún with Margea: JAC SEI 8, Suzuki Ertiga and Dodge Attitude from $650 MXN/day. Insurance included, unlimited mileage, 24h delivery. Operated by YAAB Rental Car Cancún."
      );
    }
  }, []);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const { data, error } = await supabase
          .from("rental_cars")
          .select("*")
          .eq("active", true)
          .order("sort_order", { ascending: true });
        if (error) throw error;
        if (data && data.length > 0) {
          setCars(data.map((row) => mapRentalCarRow(row as unknown as Record<string, unknown>)));
        } else {
          setCars(yaabCarsSeed);
        }
      } catch (error) {
        console.error("Error fetching rental cars, using seed data:", error);
        setCars(yaabCarsSeed);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  const visibleCars =
    passengerFilter == null
      ? cars
      : cars.filter((car) => car.passengers === passengerFilter);

  return (
    <div className="min-h-screen bg-background">
      <Navbar language={language} onLanguageChange={setLanguage} />

      <ActivityHero
        title={t.heroTitle}
        subtitle={t.heroSubtitle}
        backgroundImage="/yaab-cars/jac_sei_8_2025_roja.png"
      >
        <p className="text-xs text-white/80">{t.operatedBy}</p>
      </ActivityHero>

      {/* Fleet */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-secondary/10 rounded-full">
                <Car className="w-8 h-8 text-secondary" />
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              {t.sectionTitle}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">{t.sectionSubtitle}</p>
          </div>

          {/* Passenger filter */}
          <div className="flex justify-center gap-2 mb-8">
            {[
              { value: null, label: t.filterAll },
              { value: 5, label: t.filter5 },
              { value: 7, label: t.filter7 },
            ].map((option) => (
              <Button
                key={option.label}
                variant={passengerFilter === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => setPassengerFilter(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>

          {loading ? (
            <p className="text-center text-muted-foreground">{t.loading}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
              {visibleCars.map((car) => (
                <CarCard key={car.slug} car={car} language={language} />
              ))}
            </div>
          )}

          <p className="text-center text-sm text-muted-foreground mt-10">{t.disclaimer}</p>
        </div>
      </section>

      {/* Terms */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
              {t.termsTitle}
            </h2>
            <ul className="space-y-3">
              {t.terms.map((term, index) => (
                <li key={index} className="flex items-start gap-3 text-muted-foreground">
                  {index === 0 ? (
                    <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  ) : index === 1 ? (
                    <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  ) : index === 2 ? (
                    <Car className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  ) : index === 3 ? (
                    <Users className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  ) : (
                    <Fuel className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  )}
                  <span>{term}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-xl font-semibold text-foreground mb-6">{t.contact}</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
              <Button variant="outline" asChild>
                <a href={`mailto:${t.email}`} className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {t.email}
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a
                  href="tel:+529982334867"
                  className="flex items-center gap-2"
                  aria-label="Call Margea: +52 998 233 4867"
                >
                  <Phone className="w-4 h-4" />
                  {t.phone}
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a
                  href={getWhatsAppUrl(language)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                  aria-label="WhatsApp Margea: +52 998 233 4867"
                >
                  <WhatsAppIcon size={16} />
                  WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer language={language} />
    </div>
  );
};

export default CarRentals;
