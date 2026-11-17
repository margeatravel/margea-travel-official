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
import { Info, DollarSign } from "lucide-react";

const translations = {
  en: {
    title: "Akumal Rentals by Owner",
    subtitle: "Book direct and save on platform fees.",
    propertiesTitle: "Book Akumal Rentals Directly - No Platform Fees",
    loading: "Loading properties...",
    noProperties: "No properties available at the moment.",
    calloutMessage: "Often save on platform fees by booking direct with local managers",
    introTitle: "Book Direct, Save More",
    intro1: "Booking Akumal vacation rentals directly from owners through Margea eliminates the service fees charged by third-party platforms. You get transparent pricing with direct communication to owners and property managers.",
    intro2: "Direct booking means no surprise fees at checkout. The price you see is the price you pay—no cleaning fee add-ons, no service charges, no occupancy taxes hidden until the last step. Owners can offer flexible payment terms, custom arrival/departure times, and personalized recommendations for your stay.",
    intro3: "You get direct WhatsApp access to property managers who live in Akumal, respond within hours, and can arrange anything from pre-arrival grocery stocking to restaurant reservations to local guide services. Questions about the property, area, or your stay get answered by people who actually manage the property and know it intimately.",
    intro4: "Direct bookings often include perks that platforms don't offer: early check-in or late checkout when available, mid-stay cleaning, welcome packages with local goods, and concierge services for tours and transportation. Owners have flexibility to accommodate special requests, extend stays at better rates, and provide personalized service.",
  },
  es: {
    title: "Alquileres Directo del Propietario en Akumal",
    subtitle: "Reserva directo y ahorra en comisiones.",
    propertiesTitle: "Reserva Directa en Akumal - Sin Comisiones de Plataforma",
    loading: "Cargando propiedades...",
    noProperties: "No hay propiedades disponibles en este momento.",
    calloutMessage: "A menudo ahorras en comisiones de plataforma al reservar directo con administradores locales",
    introTitle: "Reserva Directo, Ahorra Más",
    intro1: "Reservar alquileres vacacionales en Akumal directamente con propietarios a través de Margea elimina las comisiones de servicio que cobran las plataformas de terceros.",
    intro2: "La reserva directa significa sin cargos sorpresa al finalizar. El precio que ves es el precio que pagas—sin cargos de limpieza adicionales, sin comisiones de servicio, sin impuestos ocultos.",
    intro3: "Obtienes acceso directo por WhatsApp a administradores de propiedades que viven en Akumal, responden en horas y pueden organizar desde compras de supermercado antes de tu llegada hasta reservaciones en restaurantes.",
    intro4: "Las reservas directas a menudo incluyen beneficios que las plataformas no ofrecen: check-in temprano o check-out tardío cuando está disponible, limpieza a mitad de estancia, paquetes de bienvenida con productos locales.",
  },
};

export default function AkumalByOwner() {
  const { language, setLanguage } = useLanguage();
  const t = translations[language];
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const breadcrumbItems = [
    { label: "Stays", href: "/stays" },
    { label: "Akumal", href: "/stays/akumal" },
    { label: "By Owner" },
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
      <title>Akumal Rentals by Owner - Direct Booking, No Fees | Margea</title>
      <meta name="description" content="Book Akumal vacation rentals direct from owners. Transparent pricing, no hidden charges, local support." />
      
      <AkumalSchemaMarkup pageType="by-owner" />
      
      <Navbar language={language} onLanguageChange={setLanguage} />
      
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/property-images/akumal-u7-1.jpg')" }}
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
          
          <Alert className="mb-6 border-green-500/20 bg-green-500/5">
            <DollarSign className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">{t.calloutMessage}</AlertDescription>
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

      <QuickFilterLinks language={language} currentPage="by-owner" />
      <AkumalFAQ language={language} />
      <CTASection language={language} />

      <Footer language={language} />
    </div>
  );
}
