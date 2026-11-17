import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Snowflake, Clock, Briefcase, Plane, Wrench, ArrowLeft, MapPin, ChevronLeft, ChevronRight, Navigation } from "lucide-react";
import type { AircraftSpec } from "@/data/flights-data";
import { flightTimes } from "@/data/flights-data";

type Language = 'en' | 'es';

interface AircraftInfoCardProps {
  aircraft: AircraftSpec;
  language: Language;
  imageUrl: string;
  onBookFlight?: () => void;
}

const featureIcons: Record<string, React.ElementType> = {
  'Passengers': Users,
  'Pasajeros': Users,
  'Air Conditioning': Snowflake,
  'Aire Acondicionado': Snowflake,
  'Express Flight': Clock,
  'Vuelo Express': Clock,
  'Private Flight': Plane,
  'Vuelo Privado': Plane,
  'Private Jet': Plane,
  'Jet Privado': Plane,
  'Long Range': Navigation,
  'Largo Alcance': Navigation,
  'Luggage Area': Briefcase,
  'Área para Maletas': Briefcase,
  'Model': Plane,
  'Modelo': Plane,
  'Restored': Wrench,
  'Restaurado': Wrench,
  'Base': MapPin,
  'Leather': Briefcase,
  'Piel': Briefcase,
  'Twin Engine': Plane,
  'Bimotor': Plane,
};

function getIcon(feature: string): React.ElementType {
  for (const [key, icon] of Object.entries(featureIcons)) {
    if (feature.includes(key)) return icon;
  }
  return Plane;
}

// Fallback image URL
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=800&q=80";

// Translations for back card content
const cardTranslations = {
  en: {
    bookFlight: "Book Flight",
    requestQuote: "Request Private Quote",
    back: "Back",
    destinations: "Available Destinations",
    flightTimes: "Typical Flight Times",
    description: {
      'Cessna 206': "A reliable single-engine aircraft perfect for small groups. Offers excellent visibility and a comfortable cabin for short to medium-range flights across the Riviera Maya.",
      'Kodiak 100': "A premium turboprop aircraft with spacious air-conditioned cabin. Ideal for larger groups seeking comfort and speed on their private charter experience.",
      'Piper Seneca': "A reliable twin-engine aircraft offering enhanced safety and performance. Perfect for small groups seeking a premium charter experience with modern avionics.",
      'Learjet 31A': "A premium light jet based in Toluca with a range of 1,000–1,300 nautical miles. Features a luxurious leather cabin seating 6–8 passengers for long-range private flights."
    },
    quoteHeadline: "Private Quotation",
    quoteBody: "National and international flights available. Pricing is tailored to each journey based on route, flight time, airport fees, positioning, and availability.",
    minutes: "min"
  },
  es: {
    bookFlight: "Reservar Vuelo",
    requestQuote: "Solicitar Cotización Privada",
    back: "Volver",
    destinations: "Destinos Disponibles",
    flightTimes: "Tiempos de Vuelo Típicos",
    description: {
      'Cessna 206': "Una aeronave monomotor confiable perfecta para grupos pequeños. Ofrece excelente visibilidad y una cabina cómoda para vuelos de corto a mediano alcance por la Riviera Maya.",
      'Kodiak 100': "Una aeronave turbohélice premium con cabina espaciosa con aire acondicionado. Ideal para grupos más grandes que buscan comodidad y velocidad en su experiencia de vuelo privado.",
      'Piper Seneca': "Una aeronave bimotor confiable que ofrece mayor seguridad y rendimiento. Perfecta para grupos pequeños que buscan una experiencia de vuelo charter premium con aviónica moderna.",
      'Learjet 31A': "Un jet ligero premium basado en Toluca con un alcance de 1,000–1,300 millas náuticas. Cuenta con una lujosa cabina de piel para 6–8 pasajeros en vuelos privados de largo alcance."
    },
    quoteHeadline: "Cotización Privada",
    quoteBody: "Vuelos nacionales e internacionales disponibles. El precio se personaliza según la ruta, tiempo de vuelo, tarifas aeroportuarias, posicionamiento y disponibilidad.",
    minutes: "min"
  }
};

// Destinations based on aircraft type (Piper has NO Holbox for Charter)
const destinations: Record<string, string[]> = {
  'Cessna 206': ['Cozumel', 'Holbox', 'Playa del Carmen', 'Tulum', 'Chichen Itza', 'Merida', 'Miami'],
  'Kodiak 100': ['Cozumel', 'Holbox', 'Playa del Carmen', 'Tulum', 'Chichen Itza', 'Merida', 'Mahahual', 'Chetumal', 'Miami'],
  'Piper Seneca': ['Cozumel', 'Playa del Carmen', 'Tulum', 'Chichen Itza', 'Merida', 'Mahahual', 'Chetumal', 'Miami'],
  'Learjet 31A': []
};

export function AircraftInfoCard({
  aircraft,
  language,
  imageUrl,
  onBookFlight
}: AircraftInfoCardProps) {
  const features = language === 'en' ? aircraft.features.en : aircraft.features.es;
  const [imgSrc, setImgSrc] = useState(imageUrl);
  const [hasError, setHasError] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const t = cardTranslations[language];
  const galleryImages = aircraft.galleryImages || [];
  const hasGallery = galleryImages.length > 1;
  const isPrivateQuote = aircraft.name === 'Learjet 31A';

  // Debug: Log the resolved image path
  useEffect(() => {
    console.log(`[AircraftInfoCard] ${aircraft.name} image path:`, imageUrl);
  }, [imageUrl, aircraft.name]);

  const handleImageError = () => {
    console.error(`[AircraftInfoCard] Failed to load image: ${imageUrl}, using fallback`);
    if (!hasError) {
      setHasError(true);
      setImgSrc(FALLBACK_IMAGE);
    }
  };

  const handleImageLoad = () => {
    console.log(`[AircraftInfoCard] Successfully loaded: ${imgSrc}`);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleBookClick = () => {
    if (onBookFlight) {
      onBookFlight();
    }
  };

  const handlePrevImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setGalleryIndex(prev => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  }, [galleryImages.length]);

  const handleNextImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setGalleryIndex(prev => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  }, [galleryImages.length]);

  // Alt text based on aircraft name
  const altText = aircraft.name.includes('Kodiak') 
    ? "Margea Flights — Kodiak cabin" 
    : `Margea Flights — ${aircraft.name}`;

  // Get aircraft key for destinations lookup
  const aircraftKey = aircraft.name;
  const aircraftDestinations = destinations[aircraftKey] || [];
  const description = t.description[aircraftKey as keyof typeof t.description] || '';

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  // Responsive card height - taller on mobile to accommodate content
  const cardHeight = 'clamp(380px, 50vh, 480px)';

  return (
    <div 
      className="relative"
      style={{ 
        perspective: '1000px',
        height: cardHeight
      }}
    >
      {/* Card container with flip animation */}
      <div
        className={`relative w-full ${
          prefersReducedMotion 
            ? 'transition-opacity duration-300' 
            : 'transition-transform duration-700 ease-in-out'
        }`}
        style={{
          transformStyle: prefersReducedMotion ? 'flat' : 'preserve-3d',
          transform: prefersReducedMotion 
            ? 'none' 
            : (isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'),
          height: '100%'
        }}
      >
        {/* FRONT SIDE */}
        <Card 
          className={`absolute inset-0 overflow-hidden bg-gradient-to-r from-muted/50 to-background border-primary/20 ${
            prefersReducedMotion ? (isFlipped ? 'opacity-0 pointer-events-none' : 'opacity-100') : ''
          }`}
          style={{ 
            backfaceVisibility: prefersReducedMotion ? 'visible' : 'hidden',
            height: '100%'
          }}
        >
          <div className="grid md:grid-cols-2 gap-0 h-full min-h-0">
            {/* Image Section - with optional gallery carousel */}
            <div className="relative h-40 sm:h-44 md:h-full overflow-hidden flex-shrink-0 group/gallery">
              {hasGallery ? (
                <>
                  <img
                    src={galleryImages[galleryIndex]}
                    alt={`${altText} ${galleryIndex + 1}`}
                    loading={galleryIndex === 0 ? "eager" : "lazy"}
                    decoding="async"
                    width={400}
                    height={200}
                    className="w-full h-full object-cover transition-opacity duration-300"
                  />
                  {/* Gallery nav buttons */}
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 opacity-0 group-hover/gallery:opacity-100 transition-opacity duration-200"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 opacity-0 group-hover/gallery:opacity-100 transition-opacity duration-200"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  {/* Dots indicator */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {galleryImages.map((_, i) => (
                      <button
                        key={i}
                        onClick={(e) => { e.stopPropagation(); setGalleryIndex(i); }}
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${i === galleryIndex ? 'bg-white scale-110' : 'bg-white/50'}`}
                        aria-label={`View image ${i + 1}`}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <img
                  src={imgSrc}
                  alt={altText}
                  loading="lazy"
                  decoding="async"
                  width={400}
                  height={200}
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            
            {/* Info Section */}
            <div className="p-3 sm:p-4 md:p-5 flex flex-col justify-between bg-gradient-to-br from-muted/30 to-muted/10 min-h-0 overflow-hidden">
              <div className="pt-0.5 flex-1 min-h-0 overflow-hidden">
                {/* Clickable Aircraft Name */}
                <button
                  onClick={handleFlip}
                  className="text-left w-full group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md"
                  aria-label={`View details for ${aircraft.name}`}
                >
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-200 underline decoration-transparent group-hover:decoration-primary underline-offset-4" style={{ lineHeight: '1.2' }}>
                    {aircraft.name}
                  </h3>
                </button>
                
                {/* Feature Pills */}
                <div className="flex flex-wrap gap-1 sm:gap-1.5">
                  {features.map((feature, index) => {
                    const Icon = getIcon(feature);
                    return (
                      <div 
                        key={index} 
                        className="margea-hover-pill flex items-center gap-1 sm:gap-1.5 bg-background/80 rounded-lg px-2 py-1 sm:px-2.5 sm:py-1.5 shadow-sm cursor-default"
                      >
                        <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary flex-shrink-0" />
                        <span className="text-[10px] sm:text-xs text-foreground font-medium" style={{ lineHeight: '1.4' }}>
                          {feature}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Private quote section for LJ31A */}
              {isPrivateQuote && (
                <div className="mt-1 sm:mt-2 border-t border-primary/10 pt-1.5 sm:pt-2 flex-shrink-0">
                  <p className="text-[10px] sm:text-xs text-muted-foreground italic leading-snug">
                    {t.quoteBody}
                  </p>
                </div>
              )}

              {/* Book CTA - always at bottom */}
              <Button 
                onClick={handleBookClick}
                variant={isPrivateQuote ? "hero" : "default"}
                className="w-full mt-2 sm:mt-3 flex-shrink-0"
                size="sm"
              >
                <Plane className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                <span className="text-sm">{isPrivateQuote ? t.requestQuote : t.bookFlight}</span>
              </Button>
            </div>
          </div>
        </Card>

        {/* BACK SIDE */}
        <Card 
          className={`absolute inset-0 overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 border-primary/20 ${
            prefersReducedMotion ? (isFlipped ? 'opacity-100' : 'opacity-0 pointer-events-none') : ''
          }`}
          style={{ 
            backfaceVisibility: prefersReducedMotion ? 'visible' : 'hidden',
            transform: prefersReducedMotion ? 'none' : 'rotateY(180deg)',
            height: '100%'
          }}
        >
          {/* Grid layout: content row + actions row - optimized for mobile */}
          <div 
            className="h-full p-3 sm:p-4 md:p-5"
            style={{ 
              display: 'grid', 
              gridTemplateRows: '1fr auto',
              gap: '8px'
            }}
          >
            {/* Content area - scrollable only if absolutely needed, but sized to fit */}
            <div className="min-h-0 flex flex-col overflow-hidden" style={{ gap: '8px' }}>
              {/* Title */}
              <div>
                <h3 
                  className="text-base sm:text-lg md:text-xl font-bold text-foreground"
                  style={{ lineHeight: '1.2', marginBottom: '4px' }}
                >
                  {aircraft.name}
                </h3>
                
                {/* Description - hidden on very small screens */}
                <p 
                  className="text-xs sm:text-sm text-muted-foreground line-clamp-2"
                  style={{ lineHeight: '1.4' }}
                >
                  {description}
                </p>
              </div>
              
              {/* Destinations or Private Quote details on back */}
              {isPrivateQuote ? (
                <div className="space-y-2">
                  <div className="bg-primary/5 rounded-lg p-2 sm:p-3 border border-primary/10">
                    <h4 className="text-xs sm:text-sm font-semibold text-foreground mb-1" style={{ lineHeight: '1.3' }}>
                      {t.quoteHeadline}
                    </h4>
                    <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed">
                      {t.quoteBody}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-semibold text-foreground" style={{ lineHeight: '1.3' }}>
                        {t.destinations}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-0.5 sm:gap-1">
                      {aircraftDestinations.map((dest) => (
                        <span 
                          key={dest}
                          className="margea-hover-pill text-[10px] sm:text-xs bg-primary/10 text-primary px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md font-medium cursor-default"
                          style={{ lineHeight: '1.3' }}
                        >
                          {dest}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Flight Times - compact grid */}
                  <div className="hidden sm:block">
                    <div className="flex items-center gap-1 mb-1">
                      <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-semibold text-foreground" style={{ lineHeight: '1.3' }}>
                        {t.flightTimes}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-0.5 sm:gap-1 text-[10px] sm:text-xs">
                      {aircraftDestinations.slice(0, 6).map((dest) => (
                        <div 
                          key={dest} 
                          className="flex justify-between bg-muted/50 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded"
                          style={{ lineHeight: '1.4' }}
                        >
                          <span className="text-muted-foreground truncate">{dest}</span>
                          <span className="text-foreground font-medium ml-1 whitespace-nowrap">
                            {flightTimes[dest] || '—'} {t.minutes}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
            
            {/* Actions row - pinned at bottom */}
            <div className="flex gap-2 sm:gap-3 flex-shrink-0">
              <Button 
                variant="outline"
                onClick={handleFlip}
                className="flex-1"
                size="sm"
              >
                <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="text-sm">{t.back}</span>
              </Button>
              <Button 
                onClick={handleBookClick}
                variant={isPrivateQuote ? "hero" : "default"}
                className="flex-1"
                size="sm"
              >
                <Plane className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="text-sm">{isPrivateQuote ? t.requestQuote : t.bookFlight}</span>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
