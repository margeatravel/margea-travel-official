import { Button } from "@/components/ui/button";
import { MessageCircle, ArrowRight } from "lucide-react";

interface CTASectionProps {
  language: "en" | "es";
}

import { getWhatsAppUrl } from "@/lib/whatsapp";

const translations = {
  en: {
    title: "Ready to Book Your Akumal Vacation?",
    subtitle: "Contact our team for personalized recommendations and current availability.",
    whatsapp: "WhatsApp Us",
    viewProperties: "View All Properties",
  },
  es: {
    title: "¿Listo para Reservar tus Vacaciones en Akumal?",
    subtitle: "Contacta a nuestro equipo para recomendaciones personalizadas y disponibilidad actual.",
    whatsapp: "Escríbenos por WhatsApp",
    viewProperties: "Ver Todas las Propiedades",
  },
};

export function CTASection({ language }: CTASectionProps) {
  const t = translations[language];

  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
          {t.title}
        </h2>
        <p className="text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
          {t.subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href={getWhatsAppUrl(language)} target="_blank" rel="noopener noreferrer">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 gap-2"
            >
              <MessageCircle className="h-5 w-5" />
              {t.whatsapp}
            </Button>
          </a>
          <a href="/stays/akumal#properties">
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10 gap-2"
            >
              {t.viewProperties}
              <ArrowRight className="h-5 w-5" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
