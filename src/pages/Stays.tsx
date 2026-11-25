import { useEffect, useState, useMemo } from "react";
import { SEO } from "@/components/SEO";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { StayCard } from "@/components/StayCard";
import { useLanguage } from "@/components/LanguageToggle";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Hotel, Building2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { sortPropertiesByPriority, getPropertyCity } from "@/utils/cityMapping";
import { isPropertyHidden } from "@/config/hidden-properties";
import { media } from "@/lib/media";

type FilterTab = 'all' | 'hotels' | 'stays';

const translations = {
  en: {
    title: "Our Properties",
    subtitle: "Discover your perfect stay in Riviera Maya",
    loading: "Loading properties...",
    noProperties: "No properties available at the moment.",
    listWithUs: "Want to List With Us?",
    listProperty: "List Your Property",
    listDescription: "Join our exclusive collection of premium properties and reach thousands of travelers",
    all: "All",
    hotels: "Hotels",
    stays: "Vacation Rentals",
    resultsFor: "Showing results for",
    guestsLabel: "guests",
    clearFilters: "Clear filters",
  },
  es: {
    title: "Nuestras Propiedades",
    subtitle: "Descubre tu estadía perfecta en Riviera Maya",
    loading: "Cargando propiedades...",
    noProperties: "No hay propiedades disponibles en este momento.",
    listWithUs: "¿Quieres Anunciarte con Nosotros?",
    listProperty: "Publica tu Propiedad",
    listDescription: "Únete a nuestra exclusiva colección de propiedades premium y alcanza miles de viajeros",
    all: "Todas",
    hotels: "Hoteles",
    stays: "Estancias",
    resultsFor: "Mostrando resultados para",
    guestsLabel: "huéspedes",
    clearFilters: "Quitar filtros",
  },
};

export default function Stays() {
  const { language, setLanguage } = useLanguage();
  const t = translations[language];
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [searchParams, setSearchParams] = useSearchParams();
  const destination = searchParams.get('destination') || '';
  const urlGuests = Number(searchParams.get('guests')) || 0;

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
        propertyType: prop.property_type,
        unitType: prop.unit_type,
      })) || [];

      const visibleProperties = formattedProperties.filter(p => !isPropertyHidden(p));
      const sortedProperties = sortPropertiesByPriority(visibleProperties);
      setProperties(sortedProperties);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = useMemo(() => {
    let result = properties;

    if (destination) {
      result = result.filter(p => getPropertyCity(p.title, p.location) === destination);
    }
    if (urlGuests > 0) {
      result = result.filter(p => !p.guests || p.guests >= urlGuests);
    }

    if (activeTab === 'hotels') {
      return result.filter(p => p.isHotel || p.isDevelopment);
    }
    if (activeTab === 'stays') {
      return result.filter(p => !p.isHotel && !p.isDevelopment);
    }
    return result;
  }, [properties, activeTab, destination, urlGuests]);

  const tabs: { key: FilterTab; label: string; icon: React.ReactNode }[] = [
    { key: 'all', label: t.all, icon: null },
    { key: 'hotels', label: t.hotels, icon: <Hotel className="h-4 w-4" /> },
    { key: 'stays', label: t.stays, icon: <Building2 className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Vacation Rentals in Riviera Maya | Margea Stays"
        description="Browse vacation rentals, villas and hotels across Tulum, Cancún, Playa del Carmen, Akumal, Puerto Morelos and Isla Mujeres. Book direct with Margea."
        path="/stays"
      />
      <Navbar language={language} onLanguageChange={setLanguage} />
      
      {/* Hero Section with Background Image */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(media('/property-images/akumal-hero.avif'))" }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl mb-4" style={{ color: '#ffffff', fontWeight: 400, textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>{t.title}</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto" style={{ color: '#ffffff', fontWeight: 400, textShadow: '0 2px 10px rgba(0,0,0,0.45)' }}>{t.subtitle}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          
          {/* Active search filters banner */}
          {(destination || urlGuests > 0) && (
            <div className="flex flex-wrap items-center justify-center gap-3 mb-8 text-sm text-muted-foreground">
              <span>
                {t.resultsFor}
                {destination && ` ${destination.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())}`}
                {urlGuests > 0 && ` · ${urlGuests} ${t.guestsLabel}`}
              </span>
              <button
                onClick={() => setSearchParams({})}
                className="underline underline-offset-2 hover:text-foreground transition-colors"
              >
                {t.clearFilters}
              </button>
            </div>
          )}

          {/* Filter Tabs */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                  activeTab === tab.key
                    ? 'bg-primary text-primary-foreground border-primary shadow-md'
                    : 'bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

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
          ) : filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((stay) => (
                <StayCard key={stay.id} {...stay} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground text-lg">{t.noProperties}</p>
          )}
        </div>

        {/* List Your Property CTA */}
        <div className="container mx-auto px-4 mt-16">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 max-w-4xl mx-auto">
            <CardContent className="p-8 md:p-12 text-center">
              <Home className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                {t.listWithUs}
              </h2>
              <p className="text-muted-foreground mb-6 text-lg max-w-2xl mx-auto">
                {t.listDescription}
              </p>
              <Link to="/property-request">
                <Button size="lg" variant="hero">
                  {t.listProperty}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer language={language} />
    </div>
  );
}