import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { StayCard } from "@/components/StayCard";
import { useLanguage } from "@/components/LanguageToggle";
import { supabase } from "@/integrations/supabase/client";
import { isPropertyHidden } from "@/config/hidden-properties";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { TrustSection } from "@/components/seo/TrustSection";
import { QuickFilterLinks } from "@/components/seo/QuickFilterLinks";
import { AkumalFAQ } from "@/components/seo/AkumalFAQ";
import { CTASection } from "@/components/seo/CTASection";
import { AkumalSchemaMarkup } from "@/components/seo/AkumalSchemaMarkup";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { media } from "@/lib/media";

const translations = {
  en: {
    title: "Akumal Rentals with Pool",
    subtitle: "Luxury properties featuring private pools.",
    propertiesTitle: "Available Rentals with Pool in Akumal",
    loading: "Loading properties...",
    noProperties: "No properties available at the moment.",
    fallbackMessage: "Pool filtering coming soon — showing all Akumal rentals",
    introTitle: "Private Pool Retreats in Akumal",
    intro1: "Our Akumal vacation rentals with pools offer private outdoor oases perfect for families, groups, and anyone who values poolside relaxation. These properties feature everything from intimate plunge pools to expansive resort-style pools with sun shelves and swim-up bars.",
    intro2: "Pool properties include covered patios, outdoor dining areas, grills, and lounging spaces surrounding the pool. Many offer heated pools for comfortable swimming year-round, infinity edges with jungle or ocean views, and separate kiddie pools or shallow areas for young children.",
    intro3: "Properties range from 3-bedroom villas with courtyard pools to 8-bedroom estates with multiple pools and jacuzzis. Pool areas typically include comfortable loungers, outdoor showers, pool floats and toys, and evening lighting for nighttime swimming under the stars.",
    intro4: "Having a private pool means enjoying water activities without crowds, swimming at any hour, and creating your own pool bar and entertainment space. Kids can play safely in sight, adults can relax poolside with drinks, and everyone enjoys the flexibility of having their own private retreat steps from their bedroom.",
  },
  es: {
    title: "Alquileres con Piscina en Akumal",
    subtitle: "Propiedades de lujo con piscinas privadas.",
    propertiesTitle: "Alquileres Disponibles con Piscina en Akumal",
    loading: "Cargando propiedades...",
    noProperties: "No hay propiedades disponibles en este momento.",
    fallbackMessage: "Filtro de piscina próximamente — mostrando todos los alquileres de Akumal",
    introTitle: "Retiros con Piscina Privada en Akumal",
    intro1: "Nuestros alquileres vacacionales con piscinas en Akumal ofrecen oasis privados al aire libre perfectos para familias, grupos y cualquiera que valore la relajación junto a la piscina.",
    intro2: "Las propiedades con piscina incluyen patios cubiertos, áreas de comedor al aire libre, parrillas y espacios de descanso alrededor de la piscina. Muchas ofrecen piscinas climatizadas para nadar cómodamente todo el año.",
    intro3: "Las propiedades van desde villas de 3 habitaciones con piscinas de patio hasta fincas de 8 habitaciones con múltiples piscinas y jacuzzis.",
    intro4: "Tener una piscina privada significa disfrutar de actividades acuáticas sin multitudes, nadar a cualquier hora y crear tu propio espacio de bar y entretenimiento junto a la piscina.",
  },
};

export default function AkumalWithPool() {
  const { language, setLanguage } = useLanguage();
  const t = translations[language];
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFallback, setShowFallback] = useState(false);

  const breadcrumbItems = [
    { label: "Stays", href: "/stays" },
    { label: "Akumal", href: "/stays/akumal" },
    { label: "With Pool" },
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

      const visibleProperties = formattedProperties.filter(p => !isPropertyHidden(p));

      const akumalProperties = visibleProperties.filter(prop => {
        const titleLower = prop.title.toLowerCase();
        const locationLower = prop.location.toLowerCase();
        return titleLower.includes('akumal') || locationLower.includes('akumal');
      });

      if (akumalProperties.length === 0) {
        setProperties(visibleProperties);
      } else {
        setProperties(akumalProperties);
      }
      setShowFallback(true);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <title>Akumal Rentals with Pool - Private Pool Vacation Homes | Margea</title>
      <meta name="description" content="Akumal vacation rentals with private pools. Heated pools, infinity edges, outdoor living spaces. Book direct, no platform fees." />
      
      <AkumalSchemaMarkup pageType="with-pool" />
      
      <Navbar language={language} onLanguageChange={setLanguage} />
      
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(media('/property-images/akumal-u5-cover.jpg'))" }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{t.title}</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">{t.subtitle}</p>
        </div>
      </section>

      <div className="container mx-auto px-4">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <h2 className="text-2xl font-bold mb-6">{t.introTitle}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">{t.intro1}</p>
            <p className="text-muted-foreground leading-relaxed mb-4">{t.intro2}</p>
            <p className="text-muted-foreground leading-relaxed mb-4">{t.intro3}</p>
            <p className="text-muted-foreground leading-relaxed">{t.intro4}</p>
          </div>
        </div>
      </section>

      <TrustSection language={language} />

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
            <p className="text-center text-muted-foreground text-lg">{t.noProperties}</p>
          )}
        </div>
      </section>

      <QuickFilterLinks language={language} currentPage="with-pool" />
      <AkumalFAQ language={language} />
      <CTASection language={language} />

      <Footer language={language} />
    </div>
  );
}
