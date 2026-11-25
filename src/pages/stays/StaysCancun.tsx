import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { StayCard } from "@/components/StayCard";
import { useLanguage } from "@/components/LanguageToggle";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { TrustSection } from "@/components/seo/TrustSection";
import { CityContent } from "@/components/seo/CityContent";
import { CityQuickFilterLinks } from "@/components/seo/CityQuickFilterLinks";
import { CityFAQ } from "@/components/seo/CityFAQ";
import { DestinationLinks } from "@/components/seo/DestinationLinks";
import { CTASection } from "@/components/seo/CTASection";
import { CitySchemaMarkup } from "@/components/seo/CitySchemaMarkup";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { filterPropertiesByCity, sortPropertiesByPriority } from "@/utils/cityMapping";
import { isPropertyHidden } from "@/config/hidden-properties";
import { media } from "@/lib/media";

const translations = {
  en: {
    title: "Cancun Vacation Rentals",
    subtitle: "Direct booking with local support. No platform fees.",
    propertiesTitle: "Available Cancun Vacation Rentals",
    loading: "Loading properties...",
    noProperties: "No properties available at the moment.",
    fallbackMessage: "Showing all properties - Cancun-specific filtering coming soon",
  },
  es: {
    title: "Alquileres Vacacionales en Cancún",
    subtitle: "Reserva directa con soporte local. Sin comisiones.",
    propertiesTitle: "Alquileres Vacacionales Disponibles en Cancún",
    loading: "Cargando propiedades...",
    noProperties: "No hay propiedades disponibles en este momento.",
    fallbackMessage: "Mostrando todas las propiedades - Filtro de Cancún próximamente",
  },
};

const cityImages = [
  media("/property-images/cancun-estate-1.jpg"),
  media("/property-images/cancun-estate-2.jpg"),
  media("/property-images/akumal-u7-1.jpg"),
];

export default function StaysCancun() {
  const { language, setLanguage } = useLanguage();
  const t = translations[language];
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('available', true)
        .is('parent_property_id', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedProperties = data?.map(prop => ({
        id: prop.id,
        image: prop.image_urls?.[0] || '',
        title: prop.title,
        location: prop.location,
        bedrooms: prop.bedrooms,
        guests: prop.max_guests,
        pricePerNight: Number(prop.price_per_night),
        featured: true,
        isDevelopment: prop.property_type === 'development' || prop.unit_type === 'development',
        isHotel: prop.unit_type === 'hotel',
      })) || [];

      const visibleProperties = formattedProperties.filter(p => !isPropertyHidden(p));

      // Use strict city filtering then apply custom sorting
      const cityProperties = filterPropertiesByCity(visibleProperties, 'cancun');

      if (cityProperties.length === 0) {
        setProperties(sortPropertiesByPriority(visibleProperties));
        setShowFallback(true);
      } else {
        setProperties(sortPropertiesByPriority(cityProperties));
        setShowFallback(false);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <title>Cancun Vacation Rentals - Direct Booking | Margea</title>
      <meta name="description" content="Book professionally managed Cancun vacation rentals direct. No platform fees. Hotel Zone condos, downtown apartments, local concierge support." />
      
      <CitySchemaMarkup cityName="Cancun" citySlug="cancun" pageType="pillar" />
      
      <Navbar language={language} onLanguageChange={setLanguage} />
      
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(media('/property-images/cancun-hero.avif'))" }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-3xl md:text-5xl mb-4 animate-fade-in" style={{ color: '#ffffff', fontWeight: 400, textShadow: '0 2px 12px rgba(0,0,0,0.45)' }}>
            {t.title}
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto animate-slide-up" style={{ color: '#ffffff', fontWeight: 400, textShadow: '0 1px 8px rgba(0,0,0,0.35)' }}>
            {t.subtitle}
          </p>
        </div>
      </section>

      <section id="properties" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">{t.propertiesTitle}</h2>
          
          {showFallback && (
            <Alert className="mb-6 border-primary/20 bg-primary/5">
              <Info className="h-4 w-4" />
              <AlertDescription>{t.fallbackMessage}</AlertDescription>
            </Alert>
          )}
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((stay) => (
                <StayCard key={stay.id} {...stay} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground text-lg">{t.noProperties}</p>
          )}
        </div>
      </section>

      <CityQuickFilterLinks language={language} cityName="Cancun" citySlug="cancun" />
      <CityContent language={language} citySlug="cancun" images={cityImages} />
      <TrustSection language={language} />
      <CityFAQ language={language} cityName="Cancun" />
      <DestinationLinks language={language} excludeCurrent="cancun" />
      <CTASection language={language} />

      <Footer language={language} />
    </div>
  );
}
