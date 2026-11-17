import { Clock } from "lucide-react";
import { flightTimes } from "@/data/flights-data";

type Language = 'en' | 'es';

interface FlightTimesSectionProps {
  language: Language;
}

const translations = {
  en: {
    title: "Flight Times",
    subtitle: "Approximate flight duration from Cancun",
    minutes: "min",
  },
  es: {
    title: "Tiempos de Vuelo",
    subtitle: "Duración aproximada del vuelo desde Cancún",
    minutes: "min",
  },
};

// Main destinations to show (shorter route names)
const mainDestinations = [
  'Holbox',
  'Cozumel',
  'Playa del Carmen',
  'Tulum',
  'Chichen Itza',
  'Mahahual',
  'Chetumal',
  'Merida',
  'Campeche',
];

export function FlightTimesSection({ language }: FlightTimesSectionProps) {
  const t = translations[language];

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: 'url(https://images.unsplash.com/photo-1469041797191-50ace28483c3?auto=format&fit=crop&w=1920&q=80)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
              {t.title}
            </h2>
            <p className="text-primary-foreground/80">{t.subtitle}</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {mainDestinations.map((destination) => {
              const time = flightTimes[destination];
              if (!time) return null;
              
              return (
                <div
                  key={destination}
                  className="flex items-center gap-3 bg-white/95 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg border border-transparent margea-hover-pill"
                >
                  <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm md:text-base font-medium text-foreground block truncate">
                      {destination}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-primary whitespace-nowrap">
                    {time} {t.minutes}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
