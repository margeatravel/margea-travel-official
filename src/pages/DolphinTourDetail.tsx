import { useNavigate } from "react-router-dom";
import { ShareButton } from "@/components/ShareButton";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/components/LanguageToggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Star, Clock, Globe, Bus, ArrowLeft, Check, X, MapPin, Users } from "lucide-react";
import { useState } from "react";
import { dolphinTour, DolphinTourVariant } from "@/data/dolphinTour";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TourBookingModule } from "@/components/tours/TourBookingModule";
import { getTourPricing } from "@/data/toursPricing";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

const translations = {
  en: {
    backToTours: "Back to Tours",
    reviews: "reviews",
    duration: "Duration",
    transport: "Transport",
    languages: "Languages",
    recommendedFor: "Recommended for",
    includes: "What's included",
    notIncluded: "Not included / Extra cost",
    selectLocation: "Select location",
  },
  es: {
    backToTours: "Volver a Tours",
    reviews: "reseñas",
    duration: "Duración",
    transport: "Transporte",
    languages: "Idiomas",
    recommendedFor: "Recomendado para",
    includes: "Qué incluye",
    notIncluded: "No incluido / Costo extra",
    selectLocation: "Selecciona ubicación",
  },
};

export default function DolphinTourDetail() {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const t = translations[language];
  const [selectedVariantId, setSelectedVariantId] = useState<string>(dolphinTour.variants[0].id);

  // Get the currently selected variant from the single source of truth
  const selectedVariant: DolphinTourVariant = 
    dolphinTour.variants.find(v => v.id === selectedVariantId) || dolphinTour.variants[0];

  // Get pricing config for this tour
  const tourPricing = getTourPricing("dolphin-swim-experience");

  return (
    <div className="min-h-screen bg-background">
      <Navbar language={language} onLanguageChange={setLanguage} />
      
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/tours")}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.backToTours}
          </Button>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Image and Info */}
            <div className="space-y-6">
              {/* Image */}
              <Carousel className="w-full" opts={{ loop: true }}>
                <CarouselContent>
                  {dolphinTour.galleryImages.map((src, i) => (
                    <CarouselItem key={i}>
                      <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                        <img
                          src={src}
                          alt={`${dolphinTour.title} ${i + 1}`}
                          loading={i === 0 ? "eager" : "lazy"}
                          decoding="async"
                          fetchPriority={i === 0 ? "high" : undefined}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>

              {/* Title and Rating */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold flex-1">{selectedVariant.title}</h1>
                  <ShareButton title={selectedVariant.title} stopPropagation={false} />
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-lg">{selectedVariant.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-muted-foreground">
                    ({selectedVariant.reviewsCount.toLocaleString()} {t.reviews})
                  </span>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{selectedVariant.location}</span>
                </div>
              </div>

              {/* Variant Selector - syncs with booking module */}
              <Card className="p-4">
                <p className="font-medium mb-3">{t.selectLocation}</p>
                <Tabs value={selectedVariantId} onValueChange={setSelectedVariantId} className="w-full">
                  <TabsList className="w-full grid grid-cols-2 h-auto">
                    {dolphinTour.variants.map((variant) => (
                      <TabsTrigger 
                        key={variant.id} 
                        value={variant.id}
                        className="flex flex-col py-3 px-2 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                      >
                        <span className="font-medium line-clamp-1">{variant.name}</span>
                        <span className="font-bold">${variant.priceFromUsd}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </Card>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t.duration}</p>
                    <p className="font-medium">{selectedVariant.duration}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Bus className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t.transport}</p>
                    <p className="font-medium">{selectedVariant.transportation}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t.languages}</p>
                    <p className="font-medium">{selectedVariant.languages}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t.recommendedFor}</p>
                    <p className="font-medium">{selectedVariant.recommendedFor}</p>
                  </div>
                </div>
              </div>

              {/* Included - GREEN check icons #16A34A */}
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Check className="w-5 h-5" style={{ color: '#16A34A' }} />
                  {t.includes}
                </h3>
                <ul className="space-y-2">
                  {selectedVariant.included.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#16A34A' }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Not Included - RED X icons #DC2626 */}
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <X className="w-5 h-5" style={{ color: '#DC2626' }} />
                  {t.notIncluded}
                </h3>
                <ul className="space-y-2">
                  {selectedVariant.notIncluded.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-muted-foreground">
                      <X className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#DC2626' }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* Right Column - Booking Module */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              {tourPricing && (
                <TourBookingModule
                  tourId="dolphin-swim-experience"
                  tourTitle={dolphinTour.title}
                  variants={tourPricing.variants}
                  timeSlots={tourPricing.timeSlots}
                  currency={tourPricing.currency}
                  defaultVariantId={selectedVariantId}
                  onVariantChange={setSelectedVariantId}
                  bokunExperienceId={tourPricing.bokunExperienceId}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer language={language} />
    </div>
  );
}
