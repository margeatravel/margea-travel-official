import { useEffect, useState, useMemo } from "react";
import { ShareButton } from "@/components/ShareButton";
import { useParams, Link } from "react-router-dom";
import { useLanguage } from "@/components/LanguageToggle";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { StayCard } from "@/components/StayCard";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  MapPin,
  BedDouble,
  Users,
  ChevronLeft,
  ChevronRight,
  Building2,
  Hotel,
  Home,
  type LucideIcon } from
"lucide-react";
import { toast } from "sonner";
import { useCurrency } from "@/hooks/use-currency";
import { useCarouselPreload } from "@/components/OptimizedImage";

const translations = {
  en: {
    loading: "Loading...",
    notFound: "Property Not Found",
    backToHome: "Back to Home",
    backToProperties: "Back to properties",
    description: "About this Property",
    amenities: "Amenities",
    units: "Available Units",
    condos: "Condos",
    rooms: "Rooms",
    villas: "Villas",
    all: "All",
    startingFrom: "Starting from",
    perNight: "/ night",
    unitsAvailable: "units available"
  },
  es: {
    loading: "Cargando...",
    notFound: "Propiedad No Encontrada",
    backToHome: "Volver al Inicio",
    backToProperties: "Volver a propiedades",
    description: "Sobre esta Propiedad",
    amenities: "Amenidades",
    units: "Unidades Disponibles",
    condos: "Condos",
    rooms: "Habitaciones",
    villas: "Villas",
    all: "Todas",
    startingFrom: "Desde",
    perNight: "/ noche",
    unitsAvailable: "unidades disponibles"
  }
};

interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  property_type: string;
  price_per_night: number;
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  minimum_nights: number;
  amenities: string[];
  image_urls: string[];
  unit_type: string | null;
  beds: number | null;
  special_features: string[] | null;
}

const unitTypeIcons: Record<string, LucideIcon> = {
  condo: Building2,
  room: Hotel,
  villa: Home
};

export default function DevelopmentDetail() {
  const { id } = useParams();
  const { language, setLanguage } = useLanguage();
  const t = translations[language];
  const { formatPrice } = useCurrency();
  const [development, setDevelopment] = useState<Property | null>(null);
  const [units, setUnits] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  useCarouselPreload(development?.image_urls || [], currentImageIndex);

  useEffect(() => {
    fetchDevelopment();
  }, [id]);

  const fetchDevelopment = async () => {
    try {
      // Fetch parent development
      const { data: devData, error: devError } = await supabase.
      from("properties").
      select("*").
      eq("id", id).
      maybeSingle();

      if (devError) throw devError;
      if (!devData) {
        toast.error("Property not found");
        return;
      }

      setDevelopment(devData as Property);

      // Fetch child units
      const { data: unitsData, error: unitsError } = await supabase.
      from("properties").
      select("*").
      eq("parent_property_id", id).
      eq("available", true).
      order("price_per_night", { ascending: false });

      if (unitsError) throw unitsError;
      setUnits(unitsData as Property[] || []);
    } catch (error: any) {
      toast.error("Error loading property");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const unitTypes = useMemo(() => {
    const types = new Set(units.map((u) => u.unit_type).filter(Boolean));
    return Array.from(types) as string[];
  }, [units]);

  const filteredUnits = useMemo(() => {
    if (activeFilter === "all") return units;
    return units.filter((u) => u.unit_type === activeFilter);
  }, [units, activeFilter]);

  const lowestPrice = useMemo(() => {
    if (units.length === 0) return 0;
    return Math.min(...units.map((u) => Number(u.price_per_night)));
  }, [units]);

  const nextImage = () => {
    if (development?.image_urls?.length) {
      setImageLoaded(false);
      setCurrentImageIndex((prev) =>
      prev === development.image_urls.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (development?.image_urls?.length) {
      setImageLoaded(false);
      setCurrentImageIndex((prev) =>
      prev === 0 ? development.image_urls.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">{t.loading}</div>
      </div>);

  }

  if (!development) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar language={language} onLanguageChange={setLanguage} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">{t.notFound}</h1>
            <Link to="/stays">
              <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg">
                {t.backToHome}
              </button>
            </Link>
          </div>
        </main>
        <Footer language={language} />
      </div>);

  }

  const filterLabels: Record<string, string> = {
    all: t.all,
    condo: t.condos,
    room: t.rooms,
    villa: t.villas
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar language={language} onLanguageChange={setLanguage} />

      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        {development.image_urls && development.image_urls.length > 0 ?
        <>
            <div
            className={cn(
              "absolute inset-0 bg-gradient-to-br from-muted to-muted/80 transition-opacity duration-300 z-10",
              imageLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
            )}>

              <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>
            <img
            src={development.image_urls[currentImageIndex]}
            alt={development.title}
            onLoad={() => setImageLoaded(true)}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-200",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            key={currentImageIndex} />

            {development.image_urls.length > 1 &&
          <>
                <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-background/90 backdrop-blur-sm p-3 rounded-full hover:scale-110 transition-all shadow-lg">

                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-background/90 backdrop-blur-sm p-3 rounded-full hover:scale-110 transition-all shadow-lg">

                  <ChevronRight className="h-6 w-6" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                  {development.image_urls.map((_, index) =>
              <button
                key={index}
                onClick={() => {
                  setImageLoaded(false);
                  setCurrentImageIndex(index);
                }}
                className={`h-2 rounded-full transition-all ${
                index === currentImageIndex ?
                "w-8 bg-white" :
                "w-2 bg-white/50 hover:bg-white/70"}`
                } />

              )}
                </div>
              </>
          }
          </> :

        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
        }
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="relative z-20 text-center text-white px-4">
          <Badge className="mb-4 bg-white/20 backdrop-blur-sm border-white/30 text-white">
            {development.property_type.toUpperCase()}
          </Badge>
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground">
              {development.title}
            </h1>
            <ShareButton title={development.title} variant="light" stopPropagation={false} />
          </div>
          <div className="flex items-center justify-center gap-2 text-white/90 text-lg">
            <MapPin className="h-5 w-5" />
            <span>{development.location}</span>
          </div>
          <div className="mt-4 flex items-center justify-center gap-6 text-white/80">
            <span className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {units.length} {t.unitsAvailable}
            </span>
            {lowestPrice > 0 &&
            <span>
                {t.startingFrom}{" "}
                <span className="font-bold text-white">
                  {formatPrice(lowestPrice)}
                </span>{" "}
                {t.perNight}
              </span>
            }
          </div>
        </div>
      </section>

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8">
        <Link
          to="/stays"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">

          <ChevronLeft className="h-4 w-4" />
          {t.backToProperties}
        </Link>

        {/* Description */}
        <div className="max-w-4xl mb-12">
          <h2 className="text-2xl font-bold mb-4">{t.description}</h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            {development.description}
          </p>
        </div>

        {/* Amenities */}
        {development.amenities && development.amenities.length > 0 &&
        <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">{t.amenities}</h2>
            <div className="flex flex-wrap gap-3">
              {development.amenities.map((amenity) =>
            <Badge
              key={amenity}
              variant="secondary"
              className="px-4 py-2 text-sm">

                  {amenity}
                </Badge>
            )}
            </div>
          </div>
        }

        {/* Units Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6">{t.units}</h2>

          {/* Filter Tabs */}
          {unitTypes.length > 1 &&
          <div className="flex flex-wrap gap-2 mb-8">
              <button
              onClick={() => setActiveFilter("all")}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-medium transition-all",
                activeFilter === "all" ?
                "bg-primary text-primary-foreground shadow-md" :
                "bg-muted text-muted-foreground hover:bg-muted/80"
              )}>

                {t.all} ({units.length})
              </button>
              {unitTypes.map((type) => {
              const count = units.filter(
                (u) => u.unit_type === type
              ).length;
              const Icon = unitTypeIcons[type] || Building2;
              return (
                <button
                  key={type}
                  onClick={() => setActiveFilter(type)}
                  className={cn(
                    "px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2",
                    activeFilter === type ?
                    "bg-primary text-primary-foreground shadow-md" :
                    "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}>

                    <Icon className="h-4 w-4" />
                    {filterLabels[type] || type} ({count})
                  </button>);

            })}
            </div>
          }

          {/* Units Grid */}
          {(() => {
            // Top-3 prices among ALL units (not just filtered), dynamic
            const sortedPrices = [...units].
            map((u) => Number(u.price_per_night)).
            sort((a, b) => b - a);
            const premiumThreshold = sortedPrices[2] ?? sortedPrices[0] ?? 0;
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUnits.map((unit) => {
                  const price = Number(unit.price_per_night);
                  const isPremium = price >= premiumThreshold && premiumThreshold > 0;
                  return (
                    <StayCard
                      key={unit.id}
                      id={unit.id}
                      image={unit.image_urls?.[0] || ""}
                      title={unit.title}
                      location={unit.location}
                      bedrooms={unit.bedrooms}
                      guests={unit.max_guests}
                      pricePerNight={price}
                      featured={false}
                      isPremium={isPremium} />);


                })}
              </div>);

          })()}
        </div>
      </main>

      <Footer language={language} />
    </div>);

}