import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ExoticCarFlipCard } from "@/components/ExoticCarFlipCard";
import { ExoticCarBookingModal } from "@/components/ExoticCarBookingModal";
import { exoticCars, ExoticCar, getExoticCars, getSuvCars } from "@/data/exotic-cars-data";
import { Car, Mail, Phone, Truck } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { ActivityHero } from "@/components/ActivityHero";

import { getWhatsAppUrl } from "@/lib/whatsapp";
import { media } from "@/lib/media";

type Language = 'en' | 'es';

const translations = {
  en: {
    heroTitle: "Exotic Car Rentals",
    heroSubtitle: "Drive Exotic. Feel Prestige. Redefine Luxury.",
    operatedBy: "Operated by trusted local partners",
    ratesDisclaimer: "Rates may vary. Availability subject to confirmation.",
    contact: "Contact Us",
    email: "admin@margeatravel.com",
    phone: "+52 998 233 4867",
    paymentSuccess: "Payment successful! Your booking is confirmed.",
    paymentCanceled: "Payment was canceled. Please try again.",
    exoticCarsSection: "Exotic & Sports Cars",
    exoticCarsSubtitle: "Experience the thrill of driving world-class supercars",
    suvsSection: "Luxury SUVs",
    suvsSubtitle: "Premium comfort and style for any occasion",
  },
  es: {
    heroTitle: "Renta de Autos Exóticos",
    heroSubtitle: "Conduce lo Exótico. Siente el Prestigio. Redefine el Lujo.",
    operatedBy: "Operado por socios locales de confianza",
    ratesDisclaimer: "Las tarifas pueden variar. Disponibilidad sujeta a confirmación.",
    contact: "Contáctanos",
    email: "admin@margeatravel.com",
    phone: "+52 998 233 4867",
    paymentSuccess: "¡Pago exitoso! Tu reserva está confirmada.",
    paymentCanceled: "El pago fue cancelado. Por favor intenta de nuevo.",
    exoticCarsSection: "Autos Exóticos y Deportivos",
    exoticCarsSubtitle: "Experimenta la emoción de conducir superautos de clase mundial",
    suvsSection: "SUVs de Lujo",
    suvsSubtitle: "Confort y estilo premium para cualquier ocasión",
  },
};

const ExoticCarRentals = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<ExoticCar | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const t = translations[language];

  const exoticCarsList = getExoticCars();
  const suvCarsList = getSuvCars();

  // SEO
  useEffect(() => {
    document.title = "Exotic Car Rentals | Margea - Ferrari, Lamborghini, McLaren, Porsche, Mercedes, Range Rover";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Rent exotic cars and luxury SUVs in the Riviera Maya. Drive Ferrari Roma Spider, Lamborghini Huracan Tecnica, McLaren 750S, Porsche 911 Targa 4S, Mercedes-Benz AMG G63S, and Range Rover. Premium driving experiences by Margea.');
    }
  }, []);

  // Handle payment status from URL
  useEffect(() => {
    const payment = searchParams.get("payment");
    if (payment === "success") {
      toast({
        title: "🎉 " + t.paymentSuccess,
        description: "You will receive a confirmation email shortly.",
      });
      // Clear the search params
      setSearchParams({});
    } else if (payment === "canceled") {
      toast({
        title: t.paymentCanceled,
        variant: "destructive",
      });
      setSearchParams({});
    }
  }, [searchParams, t, setSearchParams]);

  const handleBookNow = (car: ExoticCar) => {
    setSelectedCar(car);
    setBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar language={language} onLanguageChange={setLanguage} />
      
      <ActivityHero
        title={t.heroTitle}
        subtitle={t.heroSubtitle}
        backgroundImage={media("/exotic-cars/exotic-cars-hero.jpg")}
      >
        <p className="text-xs text-white/80">
          {t.operatedBy}
        </p>
      </ActivityHero>

      {/* Exotic Cars Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-secondary/10 rounded-full">
                <Car className="w-8 h-8 text-secondary" />
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              {t.exoticCarsSection}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {t.exoticCarsSubtitle}
            </p>
          </div>

          {/* Exotic Cars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {exoticCarsList.map((car) => (
              <ExoticCarFlipCard
                key={car.id}
                car={car}
                onBookNow={handleBookNow}
                language={language}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SUVs Section */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Truck className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              {t.suvsSection}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {t.suvsSubtitle}
            </p>
          </div>

          {/* SUVs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {suvCarsList.map((car) => (
              <ExoticCarFlipCard
                key={car.id}
                car={car}
                onBookNow={handleBookNow}
                language={language}
              />
            ))}
          </div>
          
          {/* Rates Disclaimer */}
          <p className="text-center text-sm text-muted-foreground mt-10">
            {t.ratesDisclaimer}
          </p>
        </div>
      </section>

      {/* Contact Section */}
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

      {/* Booking Modal */}
      <ExoticCarBookingModal
        open={bookingModalOpen}
        onOpenChange={setBookingModalOpen}
        preselectedCar={selectedCar}
        language={language}
      />
    </div>
  );
};

export default ExoticCarRentals;
