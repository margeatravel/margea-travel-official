import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/components/LanguageToggle";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

const translations = {
  en: {
    title: "Payment Canceled",
    subtitle: "Your booking was not completed",
    message: "You have canceled the payment process. No charges have been made to your account.",
    help: "If you experienced any issues during checkout or have questions, please contact us.",
    returnHome: "Return to Home",
    tryAgain: "Try Booking Again",
    contactUs: "Contact Support"
  },
  es: {
    title: "Pago Cancelado",
    subtitle: "Tu reserva no se completó",
    message: "Has cancelado el proceso de pago. No se han realizado cargos a tu cuenta.",
    help: "Si experimentaste algún problema durante el proceso de pago o tienes preguntas, contáctanos.",
    returnHome: "Volver al Inicio",
    tryAgain: "Intentar Reservar Nuevamente",
    contactUs: "Contactar Soporte"
  }
};

export default function PaymentCanceled() {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const t = translations[language];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar language={language} onLanguageChange={setLanguage} />
      
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <div className="rounded-full bg-destructive/10 p-4">
              <XCircle className="h-16 w-16 text-destructive" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{t.title}</h1>
            <p className="text-xl text-muted-foreground">{t.subtitle}</p>
          </div>
          
          <p className="text-muted-foreground">{t.message}</p>
          
          <p className="text-sm text-muted-foreground">{t.help}</p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button onClick={() => navigate("/")} variant="default">
              {t.returnHome}
            </Button>
            <Button onClick={() => navigate("/stays")} variant="outline">
              {t.tryAgain}
            </Button>
            <Button onClick={() => navigate("/contact")} variant="outline">
              {t.contactUs}
            </Button>
          </div>
        </div>
      </main>

      <Footer language={language} />
    </div>
  );
}
