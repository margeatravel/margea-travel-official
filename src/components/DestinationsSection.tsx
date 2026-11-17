import { MapPin } from "lucide-react";

type Language = 'en' | 'es';

interface DestinationsSectionProps {
  language: Language;
}

const translations = {
  en: {
    charterTitle: "Charter Destinations",
    charterSubtitle: "Fly direct to these amazing locations",
    scenicTitle: "Scenic Tours & Overflights",
    scenicSubtitle: "Experience breathtaking aerial views",
  },
  es: {
    charterTitle: "Destinos de Vuelos Charter",
    charterSubtitle: "Vuela directo a estos increíbles destinos",
    scenicTitle: "Tours y Sobrevuelos Escénicos",
    scenicSubtitle: "Experimenta vistas aéreas impresionantes",
  },
};

const charterDestinations = [
  'Cancun',
  'Holbox',
  'Cozumel',
  'Playa del Carmen',
  'Chichen Itza',
  'Tulum',
  'Mahahual',
  'Chetumal (Bacalar)',
  'Merida',
  'Campeche',
];

const scenicTours = [
  { en: 'Las Coloradas (Pink Lakes)', es: 'Las Coloradas (Lagos Rosados)' },
  { en: 'Hotel Zone', es: 'Zona Hotelera' },
  { en: 'Riviera Maya', es: 'Riviera Maya' },
  { en: 'Chichen Itza', es: 'Chichen Itza' },
  { en: 'Tulum & Coba', es: 'Tulum y Coba' },
  { en: 'Isla Mujeres & Contoy', es: 'Isla Mujeres y Contoy' },
  { en: 'Whale Shark Zone', es: 'Zona de Tiburón Ballena' },
  { en: 'Cenotes', es: 'Cenotes' },
];

export function DestinationsSection({ language }: DestinationsSectionProps) {
  const t = translations[language];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Charter Destinations */}
          <div className="relative overflow-hidden rounded-xl">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: 'url(https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=1200&q=80)',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80" />
            
            <div className="relative z-10 p-6 md:p-8">
              <div className="mb-6">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
                  {t.charterTitle}
                </h3>
                <p className="text-white/70 text-sm">{t.charterSubtitle}</p>
              </div>
              
              <div className="space-y-2">
                {charterDestinations.map((destination) => (
                  <div
                    key={destination}
                    className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20 margea-hover-pill-light"
                  >
                    <MapPin className="w-4 h-4 text-primary-foreground flex-shrink-0" />
                    <span className="text-sm text-white font-medium">
                      {destination}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Scenic Tours */}
          <div className="relative overflow-hidden rounded-xl">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: 'url(https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80)',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-primary/70 to-primary/90" />
            
            <div className="relative z-10 p-6 md:p-8">
              <div className="mb-6">
                <h3 className="text-xl md:text-2xl font-bold text-primary-foreground mb-1">
                  {t.scenicTitle}
                </h3>
                <p className="text-primary-foreground/70 text-sm">{t.scenicSubtitle}</p>
              </div>
              
              <div className="space-y-2">
                {scenicTours.map((tour) => (
                  <div
                    key={tour.en}
                    className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/30 margea-hover-pill-light"
                  >
                    <MapPin className="w-4 h-4 text-primary-foreground flex-shrink-0" />
                    <span className="text-sm text-primary-foreground font-medium">
                      {language === 'en' ? tour.en : tour.es}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
