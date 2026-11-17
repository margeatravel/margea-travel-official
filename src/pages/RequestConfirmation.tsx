import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/components/LanguageToggle";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Calendar, Mail, Phone, Home } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

import { getWhatsAppUrl } from "@/lib/whatsapp";

const translations = {
  en: {
    title: "Request Confirmed!",
    subtitle: "Your request has been successfully submitted",
    confirmationNumber: "Confirmation Number",
    whatNext: "What happens next?",
    step1Title: "We Review Your Request",
    step1Desc: "Our team will carefully review all the details you provided",
    step2Title: "We'll Contact You",
    step2Desc: "We will reach out within 24 hours to confirm availability and discuss details",
    step3Title: "Finalize Your Experience",
    step3Desc: "Once confirmed, we'll send you payment information and final details",
    contactInfo: "In the meantime, feel free to contact us:",
    backHome: "Back to Home",
    viewYachts: "View More Yachts",
    viewPackages: "View Custom Packages"
  },
  es: {
    title: "¡Solicitud Confirmada!",
    subtitle: "Tu solicitud ha sido enviada con éxito",
    confirmationNumber: "Número de Confirmación",
    whatNext: "¿Qué sigue ahora?",
    step1Title: "Revisamos tu Solicitud",
    step1Desc: "Nuestro equipo revisará cuidadosamente todos los detalles que proporcionaste",
    step2Title: "Te Contactaremos",
    step2Desc: "Nos pondremos en contacto en las próximas 24 horas para confirmar disponibilidad y discutir detalles",
    step3Title: "Finaliza tu Experiencia",
    step3Desc: "Una vez confirmado, te enviaremos la información de pago y los detalles finales",
    contactInfo: "Mientras tanto, no dudes en contactarnos:",
    backHome: "Volver al Inicio",
    viewYachts: "Ver Más Yates",
    viewPackages: "Ver Paquetes Personalizados"
  }
};

export default function RequestConfirmation() {
  const { language, setLanguage } = useLanguage();
  const t = translations[language];
  const [searchParams] = useSearchParams();
  const confirmationNumber = searchParams.get("ref");
  const type = searchParams.get("type") || "package";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar language={language} onLanguageChange={setLanguage} />

      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Success Icon */}
            <div className="text-center mb-8 animate-fade-in">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
                <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.title}</h1>
              <p className="text-lg text-muted-foreground">{t.subtitle}</p>
            </div>

            {/* Confirmation Number Card */}
            {confirmationNumber && (
              <Card className="mb-8 border-primary/20 shadow-elegant animate-slide-up">
                <CardContent className="p-8 text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    {t.confirmationNumber}
                  </p>
                  <p className="text-3xl md:text-4xl font-bold text-primary tracking-wider">
                    {confirmationNumber}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Next Steps */}
            <Card className="mb-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">{t.whatNext}</h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{t.step1Title}</h3>
                      <p className="text-sm text-muted-foreground">{t.step1Desc}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{t.step2Title}</h3>
                      <p className="text-sm text-muted-foreground">{t.step2Desc}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{t.step3Title}</h3>
                      <p className="text-sm text-muted-foreground">{t.step3Desc}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="mb-8 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <CardContent className="p-8">
                <h3 className="font-semibold mb-4">{t.contactInfo}</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Mail className="w-5 h-5" />
                    <a href="mailto:admin@margeatravel.com" className="hover:text-primary transition-colors">admin@margeatravel.com</a>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Phone className="w-5 h-5" />
                    <a 
                      href="tel:+529982334867" 
                      className="hover:text-primary transition-colors"
                      aria-label="Call Margea: +52 998 233 4867"
                    >
                      +52 998 233 4867
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <WhatsAppIcon size={20} />
                    <a 
                      href={getWhatsAppUrl(language)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors"
                      aria-label="WhatsApp Margea: +52 998 233 4867"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <Button asChild variant="default" size="lg" className="flex-1">
                <Link to="/">
                  <Home className="w-5 h-5 mr-2" />
                  {t.backHome}
                </Link>
              </Button>
              {type === "yacht" ? (
                <Button asChild variant="outline" size="lg" className="flex-1">
                  <Link to="/yachts">{t.viewYachts}</Link>
                </Button>
              ) : (
                <Button asChild variant="outline" size="lg" className="flex-1">
                  <Link to="/custom-package">{t.viewPackages}</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer language={language} />
    </div>
  );
}
