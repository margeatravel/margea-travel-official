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
    title: "Long-Term Akumal Rentals",
    subtitle: "Monthly rates for 30+ day stays.",
    propertiesTitle: "Long-Term Rentals in Akumal (30+ Days)",
    loading: "Loading properties...",
    noProperties: "No properties available at the moment.",
    fallbackMessage: "Prices shown are nightly rates - contact us for monthly discount pricing",
    introTitle: "Extended Stays in Paradise",
    intro1: "Long-term Akumal rentals offer the perfect base for digital nomads, remote workers, snowbirds, and anyone seeking extended stays in paradise. Book 30+ days and enjoy monthly discounts—typically lower than nightly rates—plus the stability of having your own home base in Mexico.",
    intro2: "Monthly rentals include everything needed for comfortable long-term living: full kitchens with cookware and appliances, reliable high-speed WiFi for remote work, laundry facilities (in-unit or on-property), dedicated workspaces with desks and ergonomic chairs, and ample storage for extended stays.",
    intro3: "Akumal is ideal for long-term stays because it has everything within walking distance: supermarkets, restaurants, dive shops, yoga studios, and beach access. The community is welcoming to long-term residents with established expat groups, weekly events, and local businesses that remember regular customers.",
    intro4: "Long-term rates vary depending on property size and location. Utilities are usually included, though some properties charge separately for electricity if usage is high (AC use). Most require 30-day minimum stays, with 60-day and 90-day stays often earning deeper discounts.",
    intro5: "Many long-term renters are remote workers from the US and Canada escaping winter. Akumal's time zone (EST) makes it easy to maintain work hours aligned with North American colleagues. Internet speeds typically run 20-50 Mbps, sufficient for video calls, though we recommend confirming speeds for your specific work needs.",
  },
  es: {
    title: "Alquileres a Largo Plazo en Akumal",
    subtitle: "Tarifas mensuales para estadías de 30+ días.",
    propertiesTitle: "Alquileres a Largo Plazo en Akumal (30+ Días)",
    loading: "Cargando propiedades...",
    noProperties: "No hay propiedades disponibles en este momento.",
    fallbackMessage: "Los precios mostrados son tarifas por noche - contáctanos para precios mensuales con descuento",
    introTitle: "Estadías Extendidas en el Paraíso",
    intro1: "Los alquileres a largo plazo en Akumal ofrecen la base perfecta para nómadas digitales, trabajadores remotos, snowbirds y cualquiera que busque estadías extendidas en el paraíso.",
    intro2: "Los alquileres mensuales incluyen todo lo necesario para una vida cómoda a largo plazo: cocinas completas con utensilios y electrodomésticos, WiFi de alta velocidad confiable para trabajo remoto.",
    intro3: "Akumal es ideal para estadías a largo plazo porque tiene todo a poca distancia: supermercados, restaurantes, tiendas de buceo, estudios de yoga y acceso a la playa.",
    intro4: "Las tarifas a largo plazo varían según el tamaño y ubicación de la propiedad. Los servicios generalmente están incluidos, aunque algunas propiedades cobran por separado la electricidad.",
    intro5: "Muchos inquilinos a largo plazo son trabajadores remotos de EE.UU. y Canadá que escapan del invierno. La zona horaria de Akumal (EST) facilita mantener horarios de trabajo alineados con colegas norteamericanos.",
  },
};

export default function AkumalLongTerm() {
  const { language, setLanguage } = useLanguage();
  const t = translations[language];
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const breadcrumbItems = [
    { label: "Stays", href: "/stays" },
    { label: "Akumal", href: "/stays/akumal" },
    { label: "Long-Term" },
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

      setProperties(akumalProperties.length > 0 ? akumalProperties : visibleProperties);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <title>Long-Term Akumal Rentals - Monthly Vacation Homes | Margea</title>
      <meta name="description" content="Long-term Akumal rentals for digital nomads and snowbirds. Monthly discounts, high-speed WiFi, full kitchens." />
      
      <AkumalSchemaMarkup pageType="long-term" />
      
      <Navbar language={language} onLanguageChange={setLanguage} />
      
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(media('/property-images/akumal-u6-22.jpg'))" }}
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
            <p className="text-muted-foreground leading-relaxed mb-4">{t.intro4}</p>
            <p className="text-muted-foreground leading-relaxed">{t.intro5}</p>
          </div>
        </div>
      </section>

      <TrustSection language={language} />

      <section id="properties" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">{t.propertiesTitle}</h2>
          
          <Alert className="mb-6 border-primary/20 bg-primary/5">
            <Info className="h-4 w-4" />
            <AlertDescription>{t.fallbackMessage}</AlertDescription>
          </Alert>
          
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

      <QuickFilterLinks language={language} currentPage="long-term" />
      <AkumalFAQ language={language} />
      <CTASection language={language} />

      <Footer language={language} />
    </div>
  );
}
