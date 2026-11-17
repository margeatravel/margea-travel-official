import { DollarSign, MessageCircle, Handshake } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface TrustSectionProps {
  language: "en" | "es";
}

const translations = {
  en: {
    title: "Why Book Akumal Rentals with Margea",
    card1Title: "No Platform Fees",
    card1Text: "Book directly with local managers and avoid third-party platform fees.",
    card2Title: "Local Concierge Support",
    card2Text: "WhatsApp access to a local team for check-in, questions, and services.",
    card3Title: "Owner-Direct Rates",
    card3Text: "Transparent pricing set directly by property owners.",
  },
  es: {
    title: "Por Qué Reservar con Margea",
    card1Title: "Sin Comisiones",
    card1Text: "Reserva directamente con administradores locales y evita comisiones de plataformas.",
    card2Title: "Soporte Concierge Local",
    card2Text: "Acceso por WhatsApp a un equipo local para check-in, preguntas y servicios.",
    card3Title: "Tarifas Directas del Propietario",
    card3Text: "Precios transparentes establecidos directamente por los propietarios.",
  },
};

export function TrustSection({ language }: TrustSectionProps) {
  const t = translations[language];

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          {t.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="text-center border-border bg-card">
            <CardContent className="pt-8 pb-6 px-6">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">{t.card1Title}</h3>
              <p className="text-muted-foreground text-sm">{t.card1Text}</p>
            </CardContent>
          </Card>

          <Card className="text-center border-border bg-card">
            <CardContent className="pt-8 pb-6 px-6">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">{t.card2Title}</h3>
              <p className="text-muted-foreground text-sm">{t.card2Text}</p>
            </CardContent>
          </Card>

          <Card className="text-center border-border bg-card">
            <CardContent className="pt-8 pb-6 px-6">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Handshake className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">{t.card3Title}</h3>
              <p className="text-muted-foreground text-sm">{t.card3Text}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
