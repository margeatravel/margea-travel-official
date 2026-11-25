import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/components/LanguageToggle";

const translations = {
  en: {
    title: "Car Rental Privacy Notice",
    subtitle: "Operated by YAAB Rental Car Cancún",
    lastUpdated: "Last updated: November 2026",
    sections: {
      introduction: {
        title: "1. Introduction",
        content:
          "This notice explains what personal data Margea Travel collects when you book a car rental, how we use it and who we share it with. It complements our general Privacy Policy.",
      },
      collected: {
        title: "2. Data we collect",
        content:
          "Driver full name, email address, phone number (optional), pickup and return dates, times and locations, additional-driver choice, and any notes you add (for example flight number or hotel). Payment data is processed by Stripe; we do not store card numbers.",
      },
      use: {
        title: "3. How we use your information",
        content:
          "To process and manage your booking, confirm availability with YAAB, send your booking confirmation and updates, and process the 50% deposit securely.",
      },
      sharing: {
        title: "4. Who we share it with",
        content:
          "YAAB Rental Car Cancún, the operator that delivers the car and provides the rental service; and Stripe, our payment processor. We do not sell your personal information to third parties.",
      },
      rights: {
        title: "5. Your rights (ARCO)",
        content:
          "You may access, rectify, cancel or oppose the processing of your personal data, and withdraw consent where applicable. To exercise these rights, contact admin@margeatravel.com.",
      },
      retention: {
        title: "6. Data retention",
        content:
          "We keep booking records for as long as needed to provide the service and comply with legal and accounting obligations. You may request deletion of your data at any time, subject to legal requirements.",
      },
      contact: {
        title: "7. Contact",
        content:
          "Questions about this notice: admin@margeatravel.com or +52 998 233 4867.",
      },
    },
  },
  es: {
    title: "Aviso de Privacidad de Renta de Coches",
    subtitle: "Operado por YAAB Rental Car Cancún",
    lastUpdated: "Última actualización: Noviembre 2026",
    sections: {
      introduction: {
        title: "1. Introducción",
        content:
          "Este aviso explica qué datos personales recopila Margea Travel cuando reservas una renta de auto, cómo los usamos y con quién los compartimos. Complementa nuestra Política de Privacidad general.",
      },
      collected: {
        title: "2. Datos que recopilamos",
        content:
          "Nombre completo del conductor, correo electrónico, teléfono (opcional), fechas, horas y lugares de entrega y devolución, conductor adicional, y las notas que agregues (por ejemplo, número de vuelo u hotel). Los datos de pago se procesan por Stripe; no guardamos números de tarjeta.",
      },
      use: {
        title: "3. Cómo usamos tu información",
        content:
          "Para procesar y gestionar tu reserva, confirmar la disponibilidad con YAAB, enviarte la confirmación y actualizaciones de tu reserva, y procesar el anticipo del 50% de forma segura.",
      },
      sharing: {
        title: "4. Con quién la compartimos",
        content:
          "YAAB Rental Car Cancún, el operador que entrega el auto y presta el servicio de renta; y Stripe, nuestro procesador de pagos. No vendemos tu información personal a terceros.",
      },
      rights: {
        title: "5. Tus derechos (ARCO)",
        content:
          "Puedes acceder, rectificar, cancelar u oponerte al tratamiento de tus datos personales, y retirar el consentimiento cuando corresponda. Para ejercer estos derechos, contáctanos en admin@margeatravel.com.",
      },
      retention: {
        title: "6. Retención de datos",
        content:
          "Conservamos los registros de reservas durante el tiempo necesario para prestar el servicio y cumplir con obligaciones legales y contables. Puedes solicitar la eliminación de tus datos en cualquier momento, sujeto a requisitos legales.",
      },
      contact: {
        title: "7. Contacto",
        content:
          "Preguntas sobre este aviso: admin@margeatravel.com o +52 998 233 4867.",
      },
    },
  },
};

export default function CarRentalPrivacy() {
  const { language, setLanguage } = useLanguage();
  const t = translations[language];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar language={language} onLanguageChange={setLanguage} />

      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-2">{t.title}</h1>
        <p className="text-muted-foreground mb-1">{t.subtitle}</p>
        <p className="text-muted-foreground mb-8">{t.lastUpdated}</p>

        <div className="space-y-8">
          {Object.values(t.sections).map((section, index) => (
            <section key={index}>
              <h2 className="text-2xl font-semibold mb-3">{section.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{section.content}</p>
            </section>
          ))}
        </div>
      </main>

      <Footer language={language} />
    </div>
  );
}
