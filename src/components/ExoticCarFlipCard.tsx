import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar, Users, Zap, Car, CreditCard, ChevronDown, ChevronUp, Shield } from "lucide-react";
import { ExoticCar, reservationRequirements } from "@/data/exotic-cars-data";
import { cn } from "@/lib/utils";

interface ExoticCarFlipCardProps {
  car: ExoticCar;
  onBookNow: (car: ExoticCar) => void;
  language: 'en' | 'es';
}

const translations = {
  en: {
    bookNow: "Book Now",
    from: "From",
    perHour: "/hour",
    per24Hours: "/24 hrs",
    tapForDetails: "Tap for details",
    hoverForDetails: "Hover for details",
    backToFront: "Back to front",
    year: "Year",
    type: "Type",
    acceleration: "0-100 km/h",
    passengers: "Passengers",
    deposit: "Deposit",
    minAge: "Min. Age",
    requirements: "Reservation Requirements",
    yearsOld: "years",
  },
  es: {
    bookNow: "Reservar",
    from: "Desde",
    perHour: "/hora",
    per24Hours: "/24 hrs",
    tapForDetails: "Toca para detalles",
    hoverForDetails: "Pasa el cursor para detalles",
    backToFront: "Volver al frente",
    year: "Año",
    type: "Tipo",
    acceleration: "0-100 km/h",
    passengers: "Pasajeros",
    deposit: "Depósito",
    minAge: "Edad Mín.",
    requirements: "Requisitos de Reserva",
    yearsOld: "años",
  },
};

export function ExoticCarFlipCard({ car, onBookNow, language }: ExoticCarFlipCardProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [requirementsOpen, setRequirementsOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const t = translations[language];
  const requirements = reservationRequirements[language];

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev + 1) % car.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev - 1 + car.images.length) % car.images.length);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleBookClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBookNow(car);
  };

  // Get starting price
  const getStartingPrice = () => {
    if (car.category === 'exotic' && car.experiences) {
      return Math.min(...car.experiences.map((exp) => exp.price));
    }
    if (car.category === 'suv' && car.suvPricing) {
      return car.suvPricing.hourly;
    }
    return 0;
  };

  const getPriceLabel = () => {
    if (car.category === 'suv') {
      return t.perHour;
    }
    return '';
  };

  const currentImageSrc = imageError ? car.fallbackImage : car.images[currentImage];

  return (
    <div 
      className="group perspective-1000 h-full min-h-[480px] cursor-pointer"
      onClick={handleFlip}
    >
      <div 
        className={cn(
          "relative w-full h-full transition-transform duration-700 transform-style-3d",
          isFlipped && "rotate-y-180"
        )}
      >
        {/* ===== FRONT SIDE ===== */}
        <div className="absolute inset-0 backface-hidden">
          <div className="bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-border flex flex-col h-full">
            {/* Image Gallery */}
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src={currentImageSrc}
                alt={car.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                decoding="async"
                width={400}
                height={250}
                onError={() => setImageError(true)}
              />
              
              {/* Navigation Arrows */}
              {car.images.length > 1 && !isFlipped && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}

              {/* Dots Indicator */}
              {car.images.length > 1 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {car.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImage(idx);
                      }}
                      className={`w-2 h-2 rounded-full transition-all ${
                        idx === currentImage ? "bg-white scale-110" : "bg-white/50"
                      }`}
                      aria-label={`Go to image ${idx + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Badge */}
              {car.badge && (
                <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground font-semibold text-xs">
                  {car.badge}
                </Badge>
              )}
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
              <h3 className="text-lg font-bold text-foreground mb-2">{car.name}</h3>
              
              {/* Pricing Display */}
              {car.category === 'exotic' && car.experiences && (
                <ul className="space-y-1.5 text-sm text-muted-foreground mb-4 flex-1">
                  {car.experiences.map((exp) => (
                    <li key={exp.id} className="flex justify-between">
                      <span>{language === 'es' ? exp.nameEs : exp.name}</span>
                      <span className="font-semibold text-foreground">${exp.price}</span>
                    </li>
                  ))}
                </ul>
              )}

              {car.category === 'suv' && car.suvPricing && (
                <div className="space-y-1.5 text-sm text-muted-foreground mb-4 flex-1">
                  <div className="flex justify-between">
                    <span>{language === 'es' ? 'Por hora' : 'Per hour'}</span>
                    <span className="font-semibold text-foreground">${car.suvPricing.hourly}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === 'es' ? '24 horas' : '24 hours'}</span>
                    <span className="font-semibold text-foreground">${car.suvPricing.daily}</span>
                  </div>
                </div>
              )}

              {/* Hint to flip */}
              <p className="text-xs text-muted-foreground/70 text-center mb-3 hidden md:block">
                {t.hoverForDetails}
              </p>
              <p className="text-xs text-muted-foreground/70 text-center mb-3 md:hidden">
                {t.tapForDetails}
              </p>

              <Button 
                onClick={handleBookClick} 
                className="w-full"
                size="lg"
              >
                {t.bookNow}
              </Button>
            </div>
          </div>
        </div>

        {/* ===== BACK SIDE ===== */}
        <div className="absolute inset-0 backface-hidden rotate-y-180">
          <div className="bg-card rounded-xl overflow-hidden shadow-md border border-border flex flex-col h-full">
            <div className="p-5 flex flex-col flex-1 overflow-y-auto">
              <h3 className="text-lg font-bold text-foreground mb-3">{car.name}</h3>
              
              {/* Description */}
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {language === 'es' ? car.descriptionEs : car.description}
              </p>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">{t.year}:</span>
                  <span className="font-semibold">{car.year}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Car className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">{t.type}:</span>
                  <span className="font-semibold text-xs">{car.vehicleType}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">{t.acceleration}:</span>
                  <span className="font-semibold">{car.acceleration}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">{t.passengers}:</span>
                  <span className="font-semibold">{car.passengers}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CreditCard className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">{t.deposit}:</span>
                  <span className="font-semibold">${car.deposit.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">{t.minAge}:</span>
                  <span className="font-semibold">{car.minAge} {t.yearsOld}</span>
                </div>
              </div>

              {/* Requirements Accordion */}
              <div className="border-t border-border pt-3 mb-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setRequirementsOpen(!requirementsOpen);
                  }}
                  className="flex items-center justify-between w-full text-sm font-medium text-foreground"
                >
                  <span>{t.requirements}</span>
                  {requirementsOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {requirementsOpen && (
                  <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                    {requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mt-auto space-y-2">
                <Button 
                  onClick={handleBookClick} 
                  className="w-full"
                  size="lg"
                >
                  {t.bookNow}
                </Button>
                <p className="text-xs text-muted-foreground/70 text-center">
                  {t.tapForDetails}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
