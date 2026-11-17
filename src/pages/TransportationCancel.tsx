import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

const TransportationCancel = () => {
  const [language, setLanguage] = useState<'en' | 'es'>('en');

  useEffect(() => {
    document.title = "Payment Canceled | Margea Transportation";
  }, []);

  const t = {
    en: {
      title: "Payment Not Completed",
      subtitle: "Your transportation booking was not completed. No charges have been made.",
      tryAgain: "Return to Transportation",
      needHelp: "Need help? Contact us via WhatsApp",
    },
    es: {
      title: "Pago No Completado",
      subtitle: "Tu reserva de transporte no se completó. No se realizó ningún cargo.",
      tryAgain: "Volver a Transporte",
      needHelp: "¿Necesitas ayuda? Contáctanos por WhatsApp",
    },
  };

  const text = t[language];

  return (
    <div className="min-h-screen bg-background">
      <Navbar language={language} onLanguageChange={setLanguage} />

      <div className="container mx-auto px-4 py-24 min-h-[70vh] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">{text.title}</h1>
          <p className="text-muted-foreground mb-8">{text.subtitle}</p>
          
          <Link to="/activities/transportation">
            <Button size="lg">{text.tryAgain}</Button>
          </Link>

          <p className="text-sm text-muted-foreground mt-8">
            {text.needHelp}
          </p>
        </div>
      </div>

      <Footer language={language} />
    </div>
  );
};

export default TransportationCancel;
