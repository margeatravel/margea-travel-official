import { SEO } from "@/components/SEO";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroSearch, SearchFilters } from "@/components/HeroSearch";
import { StayCard } from "@/components/StayCard";
import { TourCard } from "@/components/TourCard";
import { YachtCard } from "@/components/YachtCard";
import { useLanguage } from "@/components/LanguageToggle";
import { PromoPopup } from "@/components/PromoPopup";
import { ImageHero } from "@/components/ImageHero";
import { Button } from "@/components/ui/button";
import { Star, Shield, Clock, Award, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import tourExtremeAtv from "@/assets/tour-extreme-atv.jpg";
import tourSnorkelReef from "@/assets/tour-snorkel-reef.jpg";
import tourCenoteWaterfall from "@/assets/tour-cenote-waterfall.jpg";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState, useMemo, useRef } from "react";
import { sortPropertiesByPriority } from "@/utils/cityMapping";
import { isPropertyHidden } from "@/config/hidden-properties";
import { media } from "@/lib/media";

// Define the translations object
const translations = {
  en: {
    heroTitle: "Discover Paradise in Riviera Maya",
    heroSubtitle: "Book direct with Margea and save on platform fees. 24/7 concierge. Instant confirmation.",
    featuredStays: "Featured Stays",
    viewAllStays: "View All Stays",
    popularTours: "Popular Tours & Activities",
    viewAllTours: "View All Tours",
    featuredYacht: "Featured Yacht Experience",
    viewAllYachts: "View All Yachts",
    whyMargea: "Why Book Direct with Margea?",
    bestPrice: "Best Price Guarantee",
    bestPriceDesc: "Save on platform fees with our direct booking",
    support247: "24/7 Concierge",
    support247Desc: "Dedicated support throughout your stay",
    instant: "Instant Confirmation",
    instantDesc: "Receive booking confirmation immediately",
    trusted: "Trusted & Licensed",
    trustedDesc: "Fully licensed and insured for your peace of mind",
  },
  es: {
    heroTitle: "Descubre el Paraíso en Riviera Maya",
    heroSubtitle: "Reserva directo con Margea y ahorra en comisiones. Atención 24/7. Confirmación inmediata.",
    featuredStays: "Alojamientos Destacados",
    viewAllStays: "Ver Todos los Alojamientos",
    popularTours: "Tours y Actividades Populares",
    viewAllTours: "Ver Todos los Tours",
    featuredYacht: "Experiencia en Yate Destacada",
    viewAllYachts: "Ver Todos los Yates",
    whyMargea: "¿Por qué Reservar Directo con Margea?",
    bestPrice: "Mejor Precio Garantizado",
    bestPriceDesc: "Ahorra en comisiones con nuestra reserva directa",
    support247: "Atención 24/7",
    support247Desc: "Soporte dedicado durante toda tu estadía",
    instant: "Confirmación Instantánea",
    instantDesc: "Recibe confirmación de reserva inmediatamente",
    trusted: "Confiable y Licenciado",
    trustedDesc: "Totalmente licenciado y asegurado para tu tranquilidad",
  },
};

// Define the popularTours array
const popularTours = [
  {
    id: "extreme-adventuring",
    image: tourExtremeAtv,
    title: "Extreme Adventuring",
    subtitle: "Cuatrimoto, Tirolesa, Cenote y Show Maya",
    duration: "4 horas",
    rating: 5.0,
    reviews: 3692,
    category: "Adventure",
    hasAtvToggle: true,
    includes: [
      "Paseo en ATV",
      "Circuito de 5 tirolesas",
      "Visita a un cenote abierto 100% natural",
      "Espectáculo maya"
    ],
    pricing: {
      shared: {
        currentPrice: 70
      },
      individual: {
        currentPrice: 90
      }
    },
    featured: true,
  },
  {
    id: "snorkeling-adventure",
    image: tourSnorkelReef,
    title: "Snorkeling Adventure",
    subtitle: "Snorkel en el arrecife más grande de \"Las Américas\"",
    duration: "4 horas",
    rating: 4.7,
    reviews: 1057,
    category: "Water Sports",
    hasAtvToggle: false,
    includes: [
      "Snorkel en el Arrecife",
      "Snack en un Restaurante Frente a la Playa",
      "Tiempo libre para visitar Puerto Morelos"
    ],
    pricing: {
      regularPrice: 69,
      currentPrice: 59
    },
    featured: true,
  },
  {
    id: "cenote-adventuring",
    image: tourCenoteWaterfall,
    title: "Cenote Adventuring",
    subtitle: "Experiencia Boutique en 3 Cenotes Privados",
    duration: "4 horas",
    rating: 4.5,
    reviews: 1982,
    category: "Nature",
    hasAtvToggle: false,
    includes: [
      "Cenote con Cascada",
      "Cenote con Cavernas",
      "Cenote con Tirolesa",
      "Espectáculo Maya"
    ],
    pricing: {
      regularPrice: 79,
      currentPrice: 70
    },
    featured: true,
  },
];

const featuredYacht = {
  id: "diva",
  name: "Diva",
  model: "Cranchi",
  marina: "Cancún",
  size: "60 ft",
  capacity: 18,
  maxCapacity: 23,
  image: media("/yachts/diva/diva-principal.jpg"),
  description: "Cranchi de 60 pies, nuestra opción premium de mayor tamaño. Tarifa para hasta 18 pasajeros, con máximo de 23.",
  pricing: [
    { hours: 4, price: "16,900" },
    { hours: 6, price: "18,900" },
    { hours: 8, price: "19,900" },
  ],
  currency: "MXN" as const,
  features: ["Agua, refrescos y hielo incluidos", "Tripulación profesional", "Puedes llevar alimentos y bebidas (sin vino tinto)"],
};

// Simple IntersectionObserver hook for fade-in-up
function useFadeInUp() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Safety net: never leave a section invisible
    const fallback = window.setTimeout(() => el.classList.add('visible'), 1200);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          observer.unobserve(el);
        }
      },
      { threshold: 0, rootMargin: '0px 0px -10% 0px' }
    );
    observer.observe(el);
    return () => {
      window.clearTimeout(fallback);
      observer.disconnect();
    };
  }, []);

  return ref;
}

const Index = () => {
  const { language, setLanguage } = useLanguage();
  const t = translations[language];
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const staysRef = useFadeInUp();
  const toursRef = useFadeInUp();
  const yachtRef = useFadeInUp();
  const whyRef = useFadeInUp();

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
      setProperties(visibleProperties);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (filters: SearchFilters) => {
    const params = new URLSearchParams();
    if (filters.destination) params.set("destination", filters.destination);
    if (filters.checkIn) params.set("checkIn", filters.checkIn);
    if (filters.checkOut) params.set("checkOut", filters.checkOut);
    if (filters.guests) params.set("guests", String(filters.guests));
    navigate(`/stays${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const filteredProperties = useMemo(
    () => sortPropertiesByPriority(properties),
    [properties]
  );


  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Margea | Riviera Maya Stays, Tours & Concierge"
        description="Book luxury vacation rentals and tours in Cancun, Playa del Carmen & Tulum. Save on platform fees. 24/7 concierge. Instant confirmation."
        path="/"
      />
      <PromoPopup showDelay={3000} />
      <Navbar language={language} onLanguageChange={setLanguage} />
      
      {/* Hero Section */}
      <ImageHero title={t.heroTitle} subtitle={t.heroSubtitle}>
        <HeroSearch language={language} onSearch={handleSearch} />
      </ImageHero>

      {/* Featured Stays */}
      <section ref={staysRef as React.RefObject<HTMLElement>} className="py-16 md:py-24 px-5 md:px-4 bg-white fade-in-up">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex items-center justify-between mb-14">
            <div>
              <span className="eyebrow block mb-3">Curated Properties</span>
              <h2 className="font-cormorant font-light text-[32px] md:text-[44px] text-[#1d2839]">{t.featuredStays}</h2>
            </div>
            <Link to="/stays" className="group hidden sm:flex items-center gap-1.5 font-inter font-medium text-[13px] text-[#1d2839] hover:text-[#b8975a] transition-colors duration-200">
              {t.viewAllStays}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <p className="text-[#6b7280] font-inter">Loading properties...</p>
            ) : filteredProperties.length > 0 ? (
              filteredProperties.map((stay) => (
                <StayCard 
                  key={stay.id} 
                  {...stay}
                />
              ))
            ) : (
              <p className="text-[#6b7280] font-inter">
                No properties available yet.
              </p>
            )}
          </div>
          <Link to="/stays" className="sm:hidden flex items-center justify-center gap-1.5 font-inter font-medium text-[13px] text-[#1d2839] hover:text-[#b8975a] transition-colors duration-200 mt-8 min-h-[44px]">
            {t.viewAllStays}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Popular Tours */}
      <section ref={toursRef as React.RefObject<HTMLElement>} className="py-16 md:py-24 px-5 md:px-4 bg-[#f7f6f3] fade-in-up">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex items-center justify-between mb-14">
            <div>
              <span className="eyebrow block mb-3">Experiences</span>
              <h2 className="font-cormorant font-light text-[32px] md:text-[44px] text-[#1d2839]">{t.popularTours}</h2>
            </div>
            <Link to="/tours" className="group hidden sm:flex items-center gap-1.5 font-inter font-medium text-[13px] text-[#1d2839] hover:text-[#b8975a] transition-colors duration-200">
              {t.viewAllTours}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularTours.map((tour) => (
              <TourCard key={tour.id} {...tour} />
            ))}
          </div>
          <Link to="/tours" className="sm:hidden flex items-center justify-center gap-1.5 font-inter font-medium text-[13px] text-[#1d2839] hover:text-[#b8975a] transition-colors duration-200 mt-8 min-h-[44px]">
            {t.viewAllTours}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Featured Yacht */}
      <section ref={yachtRef as React.RefObject<HTMLElement>} className="py-16 md:py-24 px-5 md:px-4 bg-white fade-in-up">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex items-center justify-between mb-14">
            <div>
              <span className="eyebrow block mb-3">On The Water</span>
              <h2 className="font-cormorant font-light text-[32px] md:text-[44px] text-[#1d2839]">{t.featuredYacht}</h2>
            </div>
            <Link to="/yachts" className="group hidden sm:flex items-center gap-1.5 font-inter font-medium text-[13px] text-[#1d2839] hover:text-[#b8975a] transition-colors duration-200">
              {t.viewAllYachts}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
          
          <div className="max-w-[680px] mx-auto">
            <YachtCard {...featuredYacht} />
          </div>
          <Link to="/yachts" className="sm:hidden flex items-center justify-center gap-1.5 font-inter font-medium text-[13px] text-[#1d2839] hover:text-[#b8975a] transition-colors duration-200 mt-8 min-h-[44px]">
            {t.viewAllYachts}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Why Margea - Navy background with glass cards */}
      <section ref={whyRef as React.RefObject<HTMLElement>} className="py-16 md:py-24 bg-[#1d2839] fade-in-up">
        <div className="max-w-[1280px] mx-auto px-5 md:px-4">
          <div className="text-center mb-16 md:mb-20">
            <span className="font-inter font-medium text-[11px] tracking-[0.2em] uppercase text-white/45 block mb-3">The Margea Difference</span>
            <h2 className="font-cormorant font-light text-[32px] md:text-[44px] text-white">
              {t.whyMargea}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Award, title: t.bestPrice, desc: t.bestPriceDesc },
              { icon: Clock, title: t.support247, desc: t.support247Desc },
              { icon: Star, title: t.instant, desc: t.instantDesc },
              { icon: Shield, title: t.trusted, desc: t.trustedDesc },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div 
                key={i} 
                className="rounded-[10px] p-7 md:p-8 text-center transition-all duration-[250ms] ease-out hover:bg-[rgba(255,255,255,0.13)] hover:-translate-y-1"
                style={{ 
                  background: 'rgba(255,255,255,0.07)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                <Icon className="h-7 w-7 text-white/85 mb-4 mx-auto" />
                <h3 className="font-inter font-semibold text-[15px] text-white mb-2" style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px' }}>{title}</h3>
                <p className="text-white/[0.62] text-[13px] font-inter leading-[1.6]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer language={language} />
    </div>
  );
};

export default Index;
