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
    title: "Akumal Oceanfront Rentals",
    subtitle: "Beachfront properties with direct ocean access.",
    propertiesTitle: "Available Oceanfront Rentals in Akumal",
    loading: "Loading properties...",
    noProperties: "No properties available at the moment.",
    fallbackMessage: "Oceanfront filtering coming soon — showing all Akumal rentals",
    introTitle: "Beachfront Living in Akumal",
    intro1: "Our Akumal oceanfront rentals offer direct beach access and stunning Caribbean views. These properties sit right on the sand, allowing you to walk from your door straight into the turquoise waters of Akumal Bay, Half Moon Bay, or Jade Bay.",
    intro2: "Oceanfront properties include beachfront patios, outdoor showers for rinsing off after snorkeling, and covered palapas for shade. Many feature infinity pools overlooking the ocean, rooftop terraces, and direct access to the best snorkeling spots where sea turtles feed daily.",
    intro3: "These premium rentals range from 2-bedroom condos in beachfront complexes to 6-bedroom luxury villas with private beach sections. All include loungers, hammocks, and beach equipment (kayaks, paddle boards, snorkel gear). Some properties have beach staff who set up chairs and umbrellas daily.",
    intro4: "Booking oceanfront means no crossing streets or walking paths—just steps to swimming, snorkeling, and sunset views. Perfect for families who want kids playing in sight, couples seeking romantic beach dinners, and anyone who wants to maximize beach time without logistics.",
  },
  es: {
    title: "Alquileres Frente al Mar en Akumal",
    subtitle: "Propiedades frente a la playa con acceso directo al océano.",
    propertiesTitle: "Alquileres Disponibles Frente al Mar en Akumal",
    loading: "Cargando propiedades...",
    noProperties: "No hay propiedades disponibles en este momento.",
    fallbackMessage: "Filtro frente al mar próximamente — mostrando todos los alquileres de Akumal",
    introTitle: "Vida Frente al Mar en Akumal",
    intro1: "Nuestros alquileres frente al mar en Akumal ofrecen acceso directo a la playa y vistas impresionantes al Caribe. Estas propiedades están justo en la arena, permitiéndote caminar desde tu puerta directamente a las aguas turquesas.",
    intro2: "Las propiedades frente al mar incluyen patios en la playa, duchas al aire libre y palapas cubiertas para dar sombra. Muchas cuentan con piscinas infinitas con vista al océano y terrazas en la azotea.",
    intro3: "Estos alquileres premium van desde condominios de 2 habitaciones en complejos frente al mar hasta villas de lujo de 6 habitaciones con secciones de playa privadas.",
    intro4: "Reservar frente al mar significa sin cruzar calles ni caminos—solo pasos hasta el nado, snorkel y vistas del atardecer. Perfecto para familias que quieren a los niños jugando a la vista.",
  },
};

export default function AkumalOceanfront() {
  const { language, setLanguage } = useLanguage();
  const t = translations[language];
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFallback, setShowFallback] = useState(false);

  const breadcrumbItems = [
    { label: "Stays", href: "/stays" },
    { label: "Akumal", href: "/stays/akumal" },
    { label: "Oceanfront" },
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

      // Filter for Akumal properties (oceanfront field doesn't exist, so show all Akumal)
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
      setShowFallback(true); // Always show fallback since we don't have oceanfront field
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <title>Akumal Oceanfront Rentals - Beachfront Vacation Homes | Margea</title>
      <meta name="description" content="Beachfront Akumal vacation rentals with direct ocean access. Private beaches, infinity pools, turtle snorkeling. Book direct, no platform fees." />
      
      <AkumalSchemaMarkup pageType="oceanfront" />
      
      <Navbar language={language} onLanguageChange={setLanguage} />
      
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(media('/property-images/akumal-u7-1.jpg'))" }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{t.title}</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">{t.subtitle}</p>
        </div>
      </section>

      {/* Breadcrumbs */}
      <div className="container mx-auto px-4">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Intro Content */}
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

      {/* Property Grid */}
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

      <QuickFilterLinks language={language} currentPage="oceanfront" />
      <AkumalFAQ language={language} />
      <CTASection language={language} />

      <Footer language={language} />
    </div>
  );
}
