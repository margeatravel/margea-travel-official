import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { media } from "@/lib/media";

type Language = 'en' | 'es';

interface FlightGalleryProps {
  language: Language;
}

const galleryImages = [
  { src: media("/flight-images/gallery-pink.jpg"), alt: "Aerial view over pink lagoon" },
  { src: media("/flight-images/gallery-cockpit-view.jpg"), alt: "Cockpit view with glass avionics over Caribbean" },
  { src: media("/flight-images/gallery-cabin-table.jpg"), alt: "Premium cabin with refreshments" },
  { src: media("/flight-images/gallery-coastal-flight.jpg"), alt: "Piper Seneca flying over coastal scenery" },
  { src: media("/flight-images/gallery-pilot-city.jpg"), alt: "Pilot view over city" },
  { src: media("/flight-images/gallery-kodiak-ocean.jpg"), alt: "Kodiak cockpit over ocean" },
  { src: media("/flight-images/gallery-fbo-terminal.jpg"), alt: "Aircraft at FBO terminal" },
  { src: media("/flight-images/gallery-cockpit-wide.jpg"), alt: "Wide cockpit view with digital displays" },
  { src: media("/flight-images/gallery-kodiak-sunset.jpg"), alt: "Kodiak aircraft at sunset" },
];

const translations = {
  en: {
    title: "Flight Gallery",
    subtitle: "Experience the beauty of flying over the Riviera Maya",
  },
  es: {
    title: "Galería de Vuelos",
    subtitle: "Experimenta la belleza de volar sobre la Riviera Maya",
  },
};

export const FlightGallery = ({ language }: FlightGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const t = translations[language];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {t.title}
          </h2>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>

        {/* Main carousel */}
        <div className="relative max-w-5xl mx-auto">
          <div className="relative aspect-[16/9] overflow-hidden rounded-xl shadow-lg">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                  index === currentIndex
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-105"
                }`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}

            {/* Navigation arrows */}
            <Button
              variant="ghost"
              size="icon"
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90 backdrop-blur-sm rounded-full h-10 w-10 shadow-md"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90 backdrop-blur-sm rounded-full h-10 w-10 shadow-md"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>

          {/* Thumbnail navigation */}
          <div className="flex justify-center gap-3 mt-6">
            {galleryImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`relative w-20 h-14 md:w-28 md:h-20 rounded-lg overflow-hidden transition-all duration-300 ${
                  index === currentIndex
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-105"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-4">
            {galleryImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-primary w-6"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
