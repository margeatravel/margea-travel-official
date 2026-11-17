import { useEffect, useState, useMemo } from "react";
import { SEO } from "@/components/SEO";
import { ShareButton } from "@/components/ShareButton";
import { useParams, Link, Navigate } from "react-router-dom";
import { useLanguage, Language } from "@/components/LanguageToggle";
import { BookingCalendar } from "@/components/BookingCalendar";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCarouselPreload } from "@/components/OptimizedImage";
import { PropertyHouseRules, getCasaAzanikRules } from "@/components/PropertyHouseRules";
import { isPropertyHidden } from "@/config/hidden-properties";
import { cn } from "@/lib/utils";
import {
  MapPin,
  BedDouble,
  Bath,
  Users,
  Wifi,
  Car,
  Waves,
  Utensils,
  Tv,
  Wind,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Flame,
  UtensilsCrossed,
  ShowerHead,
  Shirt,
  Lock,
  Snowflake,
  Coffee,
  Microwave,
  WashingMachine,
  Palmtree,
  Sun,
  Anchor,
  type LucideIcon } from
"lucide-react";
import { toast } from "sonner";

const translations = {
  en: {
    loading: "Loading...",
    propertyNotFound: "Property Not Found",
    backToHome: "Back to Home",
    backToProperties: "Back to properties",
    bedrooms: "Bedrooms",
    bathrooms: "Bathrooms",
    guests: "Guests",
    description: "Description",
    amenities: "Amenities",
    errorLoading: "Error loading property"
  },
  es: {
    loading: "Cargando...",
    propertyNotFound: "Propiedad No Encontrada",
    backToHome: "Volver al Inicio",
    backToProperties: "Volver a propiedades",
    bedrooms: "Habitaciones",
    bathrooms: "Baños",
    guests: "Huéspedes",
    description: "Descripción",
    amenities: "Amenidades",
    errorLoading: "Error al cargar propiedad"
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
}

const amenityIcons: Record<string, LucideIcon> = {
  wifi: Wifi,
  "wi-fi": Wifi,
  internet: Wifi,
  parking: Car,
  "free parking": Car,
  garage: Car,
  pool: Waves,
  "swimming pool": Waves,
  "infinity pool": Waves,
  "private pool": Waves,
  kitchen: Utensils,
  "full kitchen": Utensils,
  "equipped kitchen": Utensils,
  tv: Tv,
  television: Tv,
  "smart tv": Tv,
  "cable tv": Tv,
  ac: Wind,
  "air conditioning": Wind,
  "air conditioner": Wind,
  gym: Dumbbell,
  fitness: Dumbbell,
  "fitness center": Dumbbell,
  bbq: Flame,
  grill: Flame,
  barbecue: Flame,
  "outdoor grill": Flame,
  "hot tub": ShowerHead,
  jacuzzi: ShowerHead,
  spa: ShowerHead,
  laundry: WashingMachine,
  washer: WashingMachine,
  dryer: WashingMachine,
  "washer/dryer": WashingMachine,
  garden: Palmtree,
  terrace: Sun,
  balcony: Sun,
  patio: Sun,
  "rooftop terrace": Sun,
  "beach access": Anchor,
  beachfront: Anchor,
  oceanfront: Anchor,
  coffee: Coffee,
  "coffee maker": Coffee,
  safe: Lock,
  "security safe": Lock,
  refrigerator: Snowflake,
  fridge: Snowflake,
  microwave: Microwave,
  dishwasher: UtensilsCrossed
};

const CASA_AZANIK_ID = "2d517ac7-9547-483c-99cd-221455db19f2";

export default function StayDetail() {
  const { id } = useParams();
  const { language, setLanguage } = useLanguage();
  const t = translations[language];
  const isCasaAzanik = id === CASA_AZANIK_ID;
  const [property, setProperty] = useState<Property | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isDevelopment, setIsDevelopment] = useState(false);
  const [isHotel, setIsHotel] = useState(false);

  // Preload adjacent carousel images
  useCarouselPreload(property?.image_urls || [], currentImageIndex);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const { data, error } = await supabase.
      from("properties").
      select("*").
      eq("id", id).
      maybeSingle();

      if (error) throw error;

      if (!data) {
        toast.error(t.errorLoading);
        return;
      }

      // Temporarily hidden from the UI but kept in the database/code
      if (isPropertyHidden(data)) {
        setProperty(null);
        setLoading(false);
        return;
      }

      // If it's a development (parent), redirect to appropriate detail page
      if (data.unit_type === 'development' || data.property_type === 'development') {
        if (data.unit_type === 'hotel') {
          setIsHotel(true);
        } else {
          setIsDevelopment(true);
        }
        return;
      }

      setProperty(data as Property);
    } catch (error: any) {
      toast.error(t.errorLoading);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    if (property?.image_urls) {
      setImageLoaded(false);
      setCurrentImageIndex((prev) =>
      prev === property.image_urls.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (property?.image_urls) {
      setImageLoaded(false);
      setCurrentImageIndex((prev) =>
      prev === 0 ? property.image_urls.length - 1 : prev - 1
      );
    }
  };

  if (isHotel) {
    return <Navigate to={`/hotel/${id}`} replace />;
  }

  if (isDevelopment) {
    return <Navigate to={`/development/${id}`} replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">{t.loading}</div>
      </div>);

  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar language={language} onLanguageChange={setLanguage} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">{t.propertyNotFound}</h1>
            <Link to="/">
              <Button>{t.backToHome}</Button>
            </Link>
          </div>
        </main>
        <Footer language={language} />
      </div>);

  }

  return (
    <div className="min-h-screen flex flex-col" style={{ paddingTop: '80px' }}>
      <SEO
        title={`${property.title} | Margea Stays`}
        description={(property.description || `${property.title} in ${property.location} — ${property.bedrooms} bedrooms, sleeps ${property.max_guests}. Book direct with Margea.`).slice(0, 160)}
        path={`/stays/${property.id}`}
        image={property.image_urls?.[0]}
        type="product"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "LodgingBusiness",
          name: property.title,
          description: property.description,
          image: property.image_urls,
          address: { "@type": "PostalAddress", addressLocality: property.location, addressCountry: "MX" },
          numberOfRooms: property.bedrooms,
          priceRange: `$${property.price_per_night} USD / night`,
          url: `https://margeatravel.com/stays/${property.id}`,
        }}
      />
      <Navbar language={language} onLanguageChange={setLanguage} forceOpaque />
      <main className="flex-1 container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">

          <ChevronLeft className="h-4 w-4" />
          {t.backToProperties}
        </Link>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-4 md:space-y-6 min-w-0">
            {/* Image Gallery */}
            {property.image_urls && property.image_urls.length > 0 &&
            <div className="relative h-[250px] sm:h-[350px] md:h-[400px] lg:h-[500px] rounded-xl overflow-hidden group bg-muted">
                {/* Shimmer placeholder */}
                <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-br from-muted to-muted/80 transition-opacity duration-300 z-10",
                  imageLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
                )}>

                  <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                </div>
                
                <img
                src={property.image_urls[currentImageIndex]}
                alt={property.title}
                loading={currentImageIndex === 0 ? "eager" : "lazy"}
                decoding="async"
                fetchPriority={currentImageIndex === 0 ? "high" : "auto"}
                onLoad={() => setImageLoaded(true)}
                className={cn(
                  "w-full h-full object-cover transition-opacity duration-200",
                  imageLoaded ? "opacity-100" : "opacity-0"
                )}
                key={currentImageIndex} />

                {property.image_urls.length > 1 &&
              <>
                    <button
                  onClick={prevImage}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-background/90 backdrop-blur-sm p-2 sm:p-3 rounded-full opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95 shadow-lg">

                      <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                    </button>
                    <button
                  onClick={nextImage}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-background/90 backdrop-blur-sm p-2 sm:p-3 rounded-full opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95 shadow-lg">

                      <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {property.image_urls.map((_, index) =>
                  <button
                    key={index}
                    onClick={() => {
                      setImageLoaded(false);
                      setCurrentImageIndex(index);
                    }}
                    className={`h-2 rounded-full transition-all duration-200 ${
                    index === currentImageIndex ?
                    "w-8 bg-primary" :
                    "w-2 bg-background/50 hover:bg-background/70"}`
                    } />

                  )}
                    </div>
                  </>
              }
              </div>
            }

            {/* Property Details */}
            <div className="rounded-xl p-5 mb-4" style={{ backgroundColor: '#1d2839' }}>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="min-w-0 flex items-start gap-3">
                  <div className="min-w-0">
                    <h1 className="text-2xl sm:text-3xl font-bold mb-2 break-words" style={{ color: '#ffffff', textShadow: '0 2px 16px rgba(0,0,0,0.6)' }}>{property.title}</h1>
                    <div className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.7)' }}>
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm sm:text-base">{property.location}</span>
                    </div>
                  </div>
                  <ShareButton title={property.title} variant="light" stopPropagation={false} />
                </div>
                <Badge variant="glass" className="bg-primary/80 backdrop-blur-[12px] border-primary-light/25 flex-shrink-0 self-start">
                  {property.property_type.toUpperCase()}
                </Badge>
              </div>
            </div>

            <div>
              <div className="flex flex-wrap gap-4 sm:gap-6 py-4 border-y border-border">
                <div className="flex items-center gap-2">
                  <BedDouble className="h-5 w-5 text-muted-foreground" />
                  <span>{property.bedrooms} {t.bedrooms}</span>
                </div>
                {property.bathrooms > 0 && (
                  <div className="flex items-center gap-2">
                    <Bath className="h-5 w-5 text-muted-foreground" />
                    <span>{property.bathrooms} {t.bathrooms}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span>{property.max_guests} {t.guests}</span>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-3">{t.description}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {property.description}
                </p>
              </div>

              {property.amenities && property.amenities.length > 0 &&
              <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4">{t.amenities}</h2>
                  <div className="bg-champagne rounded-xl p-6 overflow-hidden">
                    <div className="flex animate-carousel-scroll hover:[animation-play-state:paused]">
                      {[...property.amenities, ...property.amenities].map((amenity, index) => {
                      const amenityKey = amenity.toLowerCase().trim();
                      const Icon = amenityIcons[amenityKey];
                      return (
                        <div
                          key={`${amenity}-${index}`}
                          className="flex items-center gap-3 px-6 py-3 mr-4 whitespace-nowrap rounded-lg bg-white/60 backdrop-blur-sm border border-white/40 shadow-sm">
                            {Icon && <Icon className="h-5 w-5 text-champagne-foreground/70" />}
                            <span className="capitalize text-champagne-foreground font-medium">{amenity}</span>
                          </div>);
                    })}
                    </div>
                  </div>
                </div>
              }

              {/* House Rules - Casa Azanik */}
              {isCasaAzanik && <PropertyHouseRules rules={getCasaAzanikRules()} />}
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {Number(property.price_per_night) <= 0 ? (
                <Card>
                  <CardContent className="p-6 space-y-4 text-center">
                    <p className="text-2xl font-semibold">{language === 'es' ? 'Consultar tarifa' : 'Rate on request'}</p>
                    <Button asChild size="lg" className="w-full">
                      <a href={`https://wa.me/529982334867?text=${encodeURIComponent((language === 'es' ? 'Hola, me interesa reservar: ' : "Hi, I'd like to book: ") + property.title)}`} target="_blank" rel="noopener noreferrer">
                        {language === 'es' ? 'Contactar para reservar' : 'Contact to book'}
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
              <BookingCalendar
                propertyId={property.id}
                pricePerNight={Number(property.price_per_night)}
                maxGuests={property.max_guests}
                minimumNights={property.minimum_nights}
                {...property.id === CASA_AZANIK_ID ? {
                  baseIncludedGuests: 14,
                  extraGuestRateMXN: 917, // $50 USD × 18.34
                  damageWaiverMXN: 6419, // $350 USD × 18.34
                  maxAdults: 14,
                  maxChildren: 10
                } : {}} />
              )}

            </div>
          </div>
        </div>
      </main>
      <Footer language={language} />
    </div>);

}