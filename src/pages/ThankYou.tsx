import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Language } from "@/components/LanguageToggle";
import { Home, Mail, Phone, Instagram } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { getWhatsAppUrl } from "@/lib/whatsapp";

const translations = {
  en: {
    success: "Request submitted successfully!",
    successDesc: "We'll review your property and contact you soon. Check your email for confirmation.",
    caseNumber: "Your Case Number",
    questions: "Have questions? Contact us",
    followUs: "Follow us on Instagram",
    backHome: "Back to Home",
    genericSuccess: "Thank you for your submission!",
    genericDesc: "Our team will review your request and get back to you shortly.",
  },
  es: {
    success: "¡Solicitud enviada con éxito!",
    successDesc: "Revisaremos su propiedad y nos contactaremos pronto. Revise su correo para la confirmación.",
    caseNumber: "Su Número de Caso",
    questions: "¿Tienes preguntas? Contáctanos",
    followUs: "Síguenos en Instagram",
    backHome: "Volver al Inicio",
    genericSuccess: "¡Gracias por su envío!",
    genericDesc: "Nuestro equipo revisará su solicitud y se comunicará con usted en breve.",
  },
};

export default function ThankYou() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [language, setLanguage] = useState<Language>("en");
  const t = translations[language];

  const caseNumber = searchParams.get("case");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar language={language} onLanguageChange={setLanguage} />

      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-lg">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Home className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl text-primary">
                {caseNumber ? t.success : t.genericSuccess}
              </CardTitle>
              <CardDescription className="text-base">
                {caseNumber ? t.successDesc : t.genericDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {caseNumber && (
                <div className="bg-primary/5 border-2 border-primary rounded-lg p-6">
                  <p className="text-sm text-muted-foreground mb-2">{t.caseNumber}</p>
                  <p className="text-3xl font-bold text-primary">{caseNumber}</p>
                </div>
              )}

              <div className="space-y-3 text-sm text-muted-foreground">
                <p>{t.questions}</p>
                <div className="flex items-center justify-center gap-2">
                  <Mail className="h-4 w-4" />
                  <a href="mailto:admin@margeatravel.com" className="text-primary hover:underline">
                    admin@margeatravel.com
                  </a>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <a
                      href="tel:+529982334867"
                      className="text-primary hover:underline"
                      aria-label="Call Margea: +52 998 233 4867"
                    >
                      +52 998 233 4867
                    </a>
                  </div>
                  <a
                    href={getWhatsAppUrl(language)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                    aria-label="WhatsApp Margea: +52 998 233 4867"
                  >
                    <WhatsAppIcon size={16} />
                    WhatsApp
                  </a>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Instagram className="h-4 w-4" />
                  <a
                    href="https://www.instagram.com/margeatravel/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    @margeatravel
                  </a>
                </div>
              </div>

              <Button onClick={() => navigate("/")} className="w-full">
                {t.backHome}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer language={language} />
    </div>
  );
}
