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

const translations = {
  en: {
    title: "Pet-Friendly Akumal Rentals",
    subtitle: "Bring your furry family members along.",
    propertiesTitle: "Pet-Friendly Vacation Rentals in Akumal",
    loading: "Loading properties...",
    noProperties: "No properties available at the moment.",
    fallbackMessage: "Contact us to inquire about pet policies for specific properties",
    introTitle: "Vacation with Your Pets in Akumal",
    intro1: "Our pet-friendly Akumal vacation rentals welcome your dogs and cats so the whole family can enjoy paradise together. These properties feature fenced yards or secure outdoor spaces where pets can roam safely, plus tile or easy-clean floors that handle paws and occasional accidents.",
    intro2: "Pet-friendly rentals include outdoor areas perfect for dogs: private yards with grass or sand, covered patios for shade, outdoor showers for rinsing sandy paws, and beach access for dogs who love swimming. Many properties provide water bowls, tie-out stakes, and recommendations for local vets and pet supply stores.",
    intro3: "Akumal is dog-friendly with several beaches where leashed dogs are welcome during early morning and evening hours. Half Moon Bay and South Akumal are particularly accommodating. The town has veterinary clinics, pet supply stores with familiar brands, and restaurants with outdoor seating where well-behaved dogs can relax by your table.",
    intro4: "Traveling with pets requires extra planning—these properties make it easier. Owners understand pet needs and typically charge modest pet fees. Some properties accommodate multiple pets, large dogs, and even cats. Just communicate your pet's size, breed, and behavior when booking so we can match you with the perfect property.",
  },
  es: {
    title: "Alquileres Pet-Friendly en Akumal",
    subtitle: "Trae a tus amigos peludos.",
    propertiesTitle: "Alquileres Pet-Friendly en Akumal",
    loading: "Cargando propiedades...",
    noProperties: "No hay propiedades disponibles en este momento.",
    fallbackMessage: "Contáctanos para preguntar sobre políticas de mascotas para propiedades específicas",
    introTitle: "Vacaciones con tus Mascotas en Akumal",
    intro1: "Nuestros alquileres pet-friendly en Akumal dan la bienvenida a tus perros y gatos para que toda la familia pueda disfrutar del paraíso juntos.",
    intro2: "Los alquileres pet-friendly incluyen áreas al aire libre perfectas para perros: jardines privados con pasto o arena, patios cubiertos para sombra, duchas al aire libre para enjuagar patitas arenosas.",
    intro3: "Akumal es amigable con los perros, con varias playas donde los perros con correa son bienvenidos durante las primeras horas de la mañana y la tarde. Half Moon Bay y South Akumal son particularmente acogedores.",
    intro4: "Viajar con mascotas requiere planificación extra—estas propiedades lo hacen más fácil. Los propietarios entienden las necesidades de las mascotas y típicamente cobran tarifas modestas por mascotas.",
  },
};

export default function AkumalPetFriendly() {
  const { language, setLanguage } = useLanguage();
  const t = translations[language];
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFallback, setShowFallback] = useState(false);

  const breadcrumbItems = [
    { label: "Stays", href: "/stays" },
    { label: "Akumal", href: "/stays/akumal" },
    { label: "Pet-Friendly" },
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
      <title>Pet-Friendly Akumal Rentals - Dog-Friendly Vacation Homes | Margea</title>
      <meta name="description" content="Pet-friendly Akumal vacation rentals. Bring your dog or cat. Fenced yards, beach access." />
      
      <AkumalSchemaMarkup pageType="pet-friendly" />
      
      <Navbar language={language} onLanguageChange={setLanguage} />
      
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/property-images/akumal-u5-1.jpg')" }}
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

      <QuickFilterLinks language={language} currentPage="pet-friendly" />
      <AkumalFAQ language={language} />
      <CTASection language={language} />

      <Footer language={language} />
    </div>
  );
}
