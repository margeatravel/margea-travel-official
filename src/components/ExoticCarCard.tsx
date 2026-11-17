import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ExoticCar } from "@/data/exotic-cars-data";
import { ShareButton } from "@/components/ShareButton";

interface ExoticCarCardProps {
  car: ExoticCar;
  onBookNow: (car: ExoticCar) => void;
  language: 'en' | 'es';
}

const translations = {
  en: {
    bookNow: "Book Now",
    from: "From",
    perExperience: "per experience",
  },
  es: {
    bookNow: "Reservar",
    from: "Desde",
    perExperience: "por experiencia",
  },
};

export function ExoticCarCard({ car, onBookNow, language }: ExoticCarCardProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const t = translations[language];

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev + 1) % car.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev - 1 + car.images.length) % car.images.length);
  };

  const minPrice = Math.min(...car.experiences.map((exp) => exp.price));

  return (
    <div className="group bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-border flex flex-col h-full">
      {/* Image Gallery */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={car.images[currentImage]}
          alt={car.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Navigation Arrows */}
        {car.images.length > 1 && (
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
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-lg font-bold text-foreground flex-1">{car.name}</h3>
          <ShareButton title={car.name} size="sm" stopPropagation={false} />
        </div>
        
        {/* Pricing List */}
        <ul className="space-y-1.5 text-sm text-muted-foreground mb-4 flex-1">
          {car.experiences.map((exp) => (
            <li key={exp.id} className="flex justify-between">
              <span>{exp.name}</span>
              <span className="font-semibold text-foreground">${exp.price}</span>
            </li>
          ))}
        </ul>

        <Button 
          onClick={() => onBookNow(car)} 
          className="w-full"
          size="lg"
        >
          {t.bookNow}
        </Button>
      </div>
    </div>
  );
}
