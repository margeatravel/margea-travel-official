import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { StayCard } from "@/components/StayCard";
import { useLanguage } from "@/components/LanguageToggle";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { TrustSection } from "@/components/seo/TrustSection";
import { CityQuickFilterLinks } from "@/components/seo/CityQuickFilterLinks";
import { CityFAQ } from "@/components/seo/CityFAQ";
import { CTASection } from "@/components/seo/CTASection";
import { CitySchemaMarkup } from "@/components/seo/CitySchemaMarkup";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, DollarSign } from "lucide-react";
import { subpageContent } from "@/components/seo/cityContent";
import { filterPropertiesByCity, sortPropertiesByPriority, type CitySlug } from "@/utils/cityMapping";
import { isPropertyHidden } from "@/config/hidden-properties";

type SubpageType = "oceanfront" | "with-pool" | "by-owner" | "pet-friendly" | "long-term";

interface CitySubpageProps {
  cityName: string;
  citySlug: string;
  subpageType: SubpageType;
  heroImage: string;
}

const subpageMeta: Record<SubpageType, { 
  en: { title: string; subtitle: string; propertiesTitle: string; fallbackMessage: string };
  es: { title: string; subtitle: string; propertiesTitle: string; fallbackMessage: string };
  breadcrumbLabel: string;
}> = {
  oceanfront: {
    en: {
      title: "Oceanfront Rentals",
      subtitle: "Beachfront properties with direct ocean access.",
      propertiesTitle: "Available Oceanfront Rentals",
      fallbackMessage: "Oceanfront filtering coming soon — showing all rentals"
    },
    es: {
      title: "Alquileres Frente al Mar",
      subtitle: "Propiedades frente a la playa con acceso directo al océano.",
      propertiesTitle: "Alquileres Disponibles Frente al Mar",
      fallbackMessage: "Filtro frente al mar próximamente — mostrando todos los alquileres"
    },
    breadcrumbLabel: "Oceanfront"
  },
  "with-pool": {
    en: {
      title: "Rentals with Pool",
      subtitle: "Luxury properties featuring private pools.",
      propertiesTitle: "Available Rentals with Pool",
      fallbackMessage: "Pool filtering coming soon — showing all rentals"
    },
    es: {
      title: "Alquileres con Piscina",
      subtitle: "Propiedades de lujo con piscinas privadas.",
      propertiesTitle: "Alquileres Disponibles con Piscina",
      fallbackMessage: "Filtro de piscina próximamente — mostrando todos los alquileres"
    },
    breadcrumbLabel: "With Pool"
  },
  "by-owner": {
    en: {
      title: "Rentals by Owner",
      subtitle: "Book direct and save on platform fees.",
      propertiesTitle: "Book Rentals Directly - No Platform Fees",
      fallbackMessage: "Often save on platform fees by booking direct with local managers"
    },
    es: {
      title: "Alquileres Directo del Propietario",
      subtitle: "Reserva directo y ahorra en comisiones.",
      propertiesTitle: "Reserva Directa - Sin Comisiones de Plataforma",
      fallbackMessage: "A menudo ahorras en comisiones al reservar directo con administradores locales"
    },
    breadcrumbLabel: "By Owner"
  },
  "pet-friendly": {
    en: {
      title: "Pet-Friendly Rentals",
      subtitle: "Bring your furry family members along.",
      propertiesTitle: "Pet-Friendly Vacation Rentals",
      fallbackMessage: "Contact us to inquire about pet policies for specific properties"
    },
    es: {
      title: "Alquileres Pet-Friendly",
      subtitle: "Trae a tus amigos peludos.",
      propertiesTitle: "Alquileres Pet-Friendly",
      fallbackMessage: "Contáctanos para preguntar sobre políticas de mascotas para propiedades específicas"
    },
    breadcrumbLabel: "Pet-Friendly"
  },
  "long-term": {
    en: {
      title: "Long-Term Rentals",
      subtitle: "Monthly rates for 30+ day stays.",
      propertiesTitle: "Long-Term Rentals (30+ Days)",
      fallbackMessage: "Prices shown are nightly rates - contact us for monthly discount pricing"
    },
    es: {
      title: "Alquileres a Largo Plazo",
      subtitle: "Tarifas mensuales para estadías de 30+ días.",
      propertiesTitle: "Alquileres a Largo Plazo (30+ Días)",
      fallbackMessage: "Los precios mostrados son tarifas por noche - contáctanos para precios mensuales"
    },
    breadcrumbLabel: "Long-Term"
  }
};

export function CitySubpage({ cityName, citySlug, subpageType, heroImage }: CitySubpageProps) {
  const { language, setLanguage } = useLanguage();
  const meta = subpageMeta[subpageType];
  const t = meta[language];
  const content = subpageContent[subpageType][language];
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFallback, setShowFallback] = useState(false);

  const breadcrumbItems = [
    { label: "Stays", href: "/stays" },
    { label: cityName, href: `/stays/${citySlug}` },
    { label: meta.breadcrumbLabel },
  ];

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

      // Hide properties that are temporarily removed from the UI
      const visibleProperties = formattedProperties.filter(p => !isPropertyHidden(p));

      // Use strict city filtering then apply custom sorting
      const cityProperties = filterPropertiesByCity(visibleProperties, citySlug as CitySlug);

      if (cityProperties.length === 0) {
        setProperties(sortPropertiesByPriority(visibleProperties));
      } else {
        setProperties(sortPropertiesByPriority(cityProperties));
      }
      setShowFallback(true); // Always show fallback since we don't have specific filter fields
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMetaTitle = () => {
    const typeMap: Record<SubpageType, string> = {
      oceanfront: `${cityName} Oceanfront Rentals - Beachfront Vacation Homes | Margea`,
      "with-pool": `${cityName} Rentals with Pool - Private Pool Vacation Homes | Margea`,
      "by-owner": `${cityName} Rentals by Owner - Direct Booking, No Fees | Margea`,
      "pet-friendly": `Pet-Friendly ${cityName} Rentals - Dog-Friendly Vacation Homes | Margea`,
      "long-term": `Long-Term ${cityName} Rentals - Monthly Vacation Homes | Margea`
    };
    return typeMap[subpageType];
  };

  const getMetaDescription = () => {
    const typeMap: Record<SubpageType, string> = {
      oceanfront: `Beachfront ${cityName} vacation rentals with direct ocean access. Private beaches, infinity pools. Book direct, no platform fees.`,
      "with-pool": `${cityName} vacation rentals with private pools. Heated pools, infinity edges, outdoor living spaces. Book direct, no platform fees.`,
      "by-owner": `Book ${cityName} vacation rentals direct from owners. Transparent pricing, no hidden charges, local support.`,
      "pet-friendly": `Pet-friendly ${cityName} vacation rentals. Bring your dog or cat. Fenced yards, beach access.`,
      "long-term": `Long-term ${cityName} rentals for digital nomads and snowbirds. Monthly discounts, high-speed WiFi, full kitchens.`
    };
    return typeMap[subpageType];
  };

  const isByOwner = subpageType === "by-owner";
  const AlertIcon = isByOwner ? DollarSign : Info;
  const alertClasses = isByOwner 
    ? "mb-6 border-green-500/20 bg-green-500/5" 
    : "mb-6 border-primary/20 bg-primary/5";
  const alertTextClasses = isByOwner ? "text-green-700" : "";

  return (
    <div className="min-h-screen bg-background">
      <title>{getMetaTitle()}</title>
      <meta name="description" content={getMetaDescription()} />
      
      <CitySchemaMarkup cityName={cityName} citySlug={citySlug} pageType={subpageType} />
      
      <Navbar language={language} onLanguageChange={setLanguage} />
      
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${heroImage}')` }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-3xl md:text-5xl mb-4" style={{ color: '#ffffff', fontWeight: 400, textShadow: '0 2px 12px rgba(0,0,0,0.45)' }}>{cityName} {t.title}</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto" style={{ color: '#ffffff', fontWeight: 400, textShadow: '0 1px 8px rgba(0,0,0,0.35)' }}>{t.subtitle}</p>
        </div>
      </section>

      <div className="container mx-auto px-4">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <section id="properties" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">{t.propertiesTitle} - {cityName}</h2>
          
          {showFallback && (
            <Alert className={alertClasses}>
              <AlertIcon className={`h-4 w-4 ${isByOwner ? 'text-green-600' : ''}`} />
              <AlertDescription className={alertTextClasses}>{t.fallbackMessage}</AlertDescription>
            </Alert>
          )}
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
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
            <p className="text-center text-muted-foreground text-lg">
              {language === "es" ? "No hay propiedades disponibles en este momento." : "No properties available at the moment."}
            </p>
          )}
        </div>
      </section>

      <CityQuickFilterLinks language={language} cityName={cityName} citySlug={citySlug} currentPage={subpageType} />

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <h2 className="text-2xl font-bold mb-6">{content.introTitle} - {cityName}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">{content.intro1}</p>
            <p className="text-muted-foreground leading-relaxed mb-4">{content.intro2}</p>
            <p className="text-muted-foreground leading-relaxed mb-4">{content.intro3}</p>
            <p className="text-muted-foreground leading-relaxed">{content.intro4}</p>
            {'intro5' in content && (
              <p className="text-muted-foreground leading-relaxed mt-4">{(content as any).intro5}</p>
            )}
          </div>
        </div>
      </section>

      <TrustSection language={language} />
      <CityFAQ language={language} cityName={cityName} />
      <CTASection language={language} />

      <Footer language={language} />
    </div>
  );
}
