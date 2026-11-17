import { useState, useMemo, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, ArrowUp } from "lucide-react";
import { FlightCard } from "@/components/FlightCard";
import { cn } from "@/lib/utils";
import type { FlightProduct } from "@/data/flights-data";

interface CharterFlightNavigationProps {
  cessnaFlights: FlightProduct[];
  kodiakFlights: FlightProduct[];
  piperFlights: FlightProduct[];
  onRequestAvailability: (flight: FlightProduct) => void;
  buttonText: string;
  language: 'en' | 'es';
  cessnaTitle: string;
  cessnaSubtitle: string;
  kodiakTitle: string;
  kodiakSubtitle: string;
  piperTitle: string;
  piperSubtitle: string;
}

const translations = {
  en: {
    searchPlaceholder: "Search destination...",
    noResults: "No destinations found",
    clearSearch: "Clear search",
    backToTop: "Back to top",
    jumpToLetter: "Jump to letter",
  },
  es: {
    searchPlaceholder: "Buscar destino...",
    noResults: "No se encontraron destinos",
    clearSearch: "Limpiar búsqueda",
    backToTop: "Volver arriba",
    jumpToLetter: "Ir a letra",
  },
};

// Combine and sort flights by destination A-Z
const sortFlightsByDestination = (flights: FlightProduct[]): FlightProduct[] => {
  return [...flights].sort((a, b) => a.route_name.localeCompare(b.route_name));
};

// Group flights by first letter
const groupByFirstLetter = (flights: FlightProduct[]): Record<string, FlightProduct[]> => {
  const groups: Record<string, FlightProduct[]> = {};
  flights.forEach(flight => {
    const letter = flight.route_name.charAt(0).toUpperCase();
    if (!groups[letter]) {
      groups[letter] = [];
    }
    groups[letter].push(flight);
  });
  return groups;
};

// Get all letters A-Z
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export function CharterFlightNavigation({
  cessnaFlights,
  kodiakFlights,
  piperFlights,
  onRequestAvailability,
  buttonText,
  language,
  cessnaTitle,
  cessnaSubtitle,
  kodiakTitle,
  kodiakSubtitle,
  piperTitle,
  piperSubtitle,
}: CharterFlightNavigationProps) {
  const t = translations[language];
  const [searchQuery, setSearchQuery] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Combine all flights and sort A-Z
  const allFlights = useMemo(() => {
    const combined = [...cessnaFlights, ...kodiakFlights, ...piperFlights];
    return sortFlightsByDestination(combined);
  }, [cessnaFlights, kodiakFlights, piperFlights]);

  // Filter by search
  const filteredFlights = useMemo(() => {
    if (!searchQuery.trim()) return allFlights;
    const query = searchQuery.toLowerCase();
    return allFlights.filter(f => f.route_name.toLowerCase().includes(query));
  }, [allFlights, searchQuery]);

  // Group filtered flights by letter
  const groupedFlights = useMemo(() => {
    return groupByFirstLetter(filteredFlights);
  }, [filteredFlights]);

  // Available letters (have destinations)
  const availableLetters = useMemo(() => {
    return new Set(Object.keys(groupedFlights));
  }, [groupedFlights]);

  // Track scroll for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowBackToTop(scrollY > 600);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Jump to letter
  const handleLetterClick = (letter: string) => {
    const ref = letterRefs.current[letter];
    if (ref) {
      const headerOffset = 100; // Account for sticky header
      const elementPosition = ref.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  // Back to top
  const handleBackToTop = () => {
    if (sectionRef.current) {
      const headerOffset = 100;
      const elementPosition = sectionRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div ref={sectionRef} className="space-y-6">
      {/* Search and A-Z Navigation */}
      <div className="sticky top-[70px] z-40 bg-background/95 backdrop-blur-sm py-4 border-b border-border">
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* A-Z Jump Navigation */}
          <div className="overflow-x-auto pb-2 -mb-2">
            <div className="flex gap-1 min-w-max">
              {ALPHABET.map(letter => {
                const isAvailable = availableLetters.has(letter);
                return (
                  <button
                    key={letter}
                    onClick={() => isAvailable && handleLetterClick(letter)}
                    disabled={!isAvailable}
                    className={cn(
                      "w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition-colors",
                      isAvailable
                        ? "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground cursor-pointer"
                        : "bg-muted/50 text-muted-foreground/40 cursor-not-allowed"
                    )}
                    aria-label={`Jump to ${letter}`}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Flight Groups by Letter */}
      {filteredFlights.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">{t.noResults}</p>
          <Button variant="outline" onClick={handleClearSearch}>
            {t.clearSearch}
          </Button>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.keys(groupedFlights).sort().map(letter => (
            <div 
              key={letter} 
              ref={(el) => { letterRefs.current[letter] = el; }}
              className="scroll-mt-40"
            >
              {/* Letter Header */}
              <div className="sticky top-[180px] z-30 bg-background/95 backdrop-blur-sm py-2 mb-4 border-b border-primary/20">
                <h3 className="text-2xl font-bold text-primary">{letter}</h3>
              </div>

              {/* Flights Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedFlights[letter].map(flight => (
                  <FlightCard
                    key={flight.id}
                    flight={flight}
                    onRequestAvailability={onRequestAvailability}
                    buttonText={buttonText}
                    language={language}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={handleBackToTop}
          className="fixed bottom-6 right-6 z-50 p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-all hover:scale-105"
          aria-label={t.backToTop}
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}