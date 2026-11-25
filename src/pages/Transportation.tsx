import { useState, useRef, useEffect, useCallback } from "react";
import { SEO } from "@/components/SEO";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Car, Users, Shield, Clock, Wifi, Snowflake, Briefcase, Phone, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { CustomRouteSection } from "@/components/CustomRouteSection";
import { ActivityHero } from "@/components/ActivityHero";
import { media } from "@/lib/media";

type Language = 'en' | 'es';

const translations = {
  en: {
    heroTitle: "Private Transportation Across Cancun & Riviera Maya",
    heroSubtitle: "Private, safe, on-time transportation. 24/7 support. Vans up to 8 passengers.",
    searchCta: "Get Your Price",
    featuresTitle: "Why Choose Margea Transportation",
    fleetTitle: "Our Fleet",
    fleetCaption: "Modern, insured, air-conditioned vans with certified drivers",
    features: [
      { icon: Car, text: "Private transportation" },
      { icon: Users, text: "Vans up to 8 passengers" },
      { icon: Snowflake, text: "Double A/C system" },
      { icon: Briefcase, text: "Luggage space" },
      { icon: Wifi, text: "USB chargers (Apple & Android)" },
      { icon: CheckCircle, text: "Units disinfected" },
      { icon: Shield, text: "Traveler insurance" },
      { icon: Shield, text: "Safety package" },
      { icon: Phone, text: "24/7 support" },
    ],
  },
  es: {
    heroTitle: "Transporte Privado en Cancún y Riviera Maya",
    heroSubtitle: "Transporte privado, seguro y puntual. Soporte 24/7. Vans hasta 8 pasajeros.",
    searchCta: "Obtén Tu Precio",
    featuresTitle: "¿Por Qué Elegir Margea Transporte?",
    fleetTitle: "Nuestra Flota",
    fleetCaption: "Vans modernas, aseguradas y con aire acondicionado con conductores certificados",
    features: [
      { icon: Car, text: "Transporte privado" },
      { icon: Users, text: "Vans hasta 8 pasajeros" },
      { icon: Snowflake, text: "Sistema de doble A/C" },
      { icon: Briefcase, text: "Espacio para equipaje" },
      { icon: Wifi, text: "Cargadores USB (Apple & Android)" },
      { icon: CheckCircle, text: "Unidades desinfectadas" },
      { icon: Shield, text: "Seguro de viajero" },
      { icon: Shield, text: "Paquete de seguridad" },
      { icon: Phone, text: "Soporte 24/7" },
    ],
  },
};

const Transportation = () => {
  const [language, setLanguage] = useState<Language>('en');
  const t = translations[language];
  
  const customRouteRef = useRef<HTMLDivElement>(null);

  // SEO - Set page title
  useEffect(() => {
    document.title = "Private Transportation Cancun & Riviera Maya | Margea";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Private airport transfers across Cancun, Playa del Carmen, Tulum & Riviera Maya. Vans up to 8 passengers. 24/7 support.');
    }
  }, []);

  const scrollToCustomRoute = () => {
    customRouteRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Riviera Maya Private Transportation & Airport Transfers | Margea"
        description="Private vans and SUVs for Cancún airport transfers and Riviera Maya transportation. Instant quote, fixed pricing, 24/7 dispatch."
        path="/activities/transportation"
      />
      <Navbar language={language} onLanguageChange={setLanguage} />
      
      <ActivityHero
        title={t.heroTitle}
        subtitle={t.heroSubtitle}
        backgroundImage={media("/transportation/van-fleet.jpg")}
      >
        <div className="flex justify-center">
          <Button 
            size="lg" 
            onClick={scrollToCustomRoute}
            aria-label={t.searchCta}
            className="bg-white text-primary hover:bg-white/90"
          >
            {t.searchCta}
          </Button>
        </div>
      </ActivityHero>

      {/* Custom Route Section - The only booking flow */}
      <div ref={customRouteRef}>
        <CustomRouteSection language={language} />
      </div>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-12">
            {t.featuresTitle}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {t.features.map((feature, index) => (
              <div 
                key={index}
                className="flex flex-col items-center text-center p-4 bg-muted/30 rounded-lg"
              >
                <feature.icon className="w-8 h-8 text-primary mb-3" />
                <span className="text-sm text-foreground font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fleet Carousel Section */}
      <FleetCarousel fleetTitle={t.fleetTitle} fleetCaption={t.fleetCaption} />

      <Footer language={language} />
    </div>
  );
};

const fleetImages = [
  { src: media("/transportation/van-1.jpg"), alt: "Margea Transportation Fleet" },
  { src: media("/transportation/van-2.jpg"), alt: "Margea Transportation Vans" },
  { src: media("/transportation/van-3.jpg"), alt: "Premium interior with entertainment screens" },
  { src: media("/transportation/van-4.jpg"), alt: "Black Suburban front view with palm trees" },
  { src: media("/transportation/van-5.jpg"), alt: "Suburban at luxury hotel entrance" },
  { src: media("/transportation/van-6.jpg"), alt: "Suburban on beach road" },
];

const FleetCarousel = ({ fleetTitle, fleetCaption }: { fleetTitle: string; fleetCaption: string }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" }, [Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, onSelect]);

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-8">
          {fleetTitle}
        </h2>
        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden rounded-xl" ref={emblaRef}>
            <div className="flex">
              {fleetImages.map((image, index) => (
                <div key={index} className="flex-[0_0_100%] min-w-0">
                  <div className="aspect-video mx-1">
                    <img
                      src={image.src}
                      alt={image.alt}
                      loading={index === 0 ? "eager" : "lazy"}
                      className="w-full h-full object-cover rounded-xl shadow-lg"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Arrows */}
          <button
            onClick={() => emblaApi?.scrollPrev()}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90 backdrop-blur-sm rounded-full h-10 w-10 flex items-center justify-center shadow-md z-10"
            aria-label="Previous"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={() => emblaApi?.scrollNext()}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90 backdrop-blur-sm rounded-full h-10 w-10 flex items-center justify-center shadow-md z-10"
            aria-label="Next"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          {/* Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {fleetImages.map((_, index) => (
              <button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === selectedIndex ? "bg-primary w-6" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
        <p className="text-center text-muted-foreground mt-6">{fleetCaption}</p>
      </div>
    </section>
  );
};

export default Transportation;
