import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/components/LanguageToggle";

const translations = {
  en: {
    title: "Privacy Policy",
    lastUpdated: "Last updated: January 2025",
    sections: {
      introduction: {
        title: "1. Introduction",
        content: "Margea ('we', 'our', or 'us') is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services."
      },
      informationCollected: {
        title: "2. Information We Collect",
        content: "We collect personal information that you provide to us such as name, email address, phone number, and payment information. We automatically collect certain information when you visit our website, including IP address, browser type, and usage data. Booking information including dates, property preferences, and guest details is also collected."
      },
      howWeUse: {
        title: "3. How We Use Your Information",
        content: "We use your information to process and manage your bookings, communicate with you about your reservations, send booking confirmations and updates, process payments securely, improve our services and user experience, and comply with legal obligations."
      },
      informationSharing: {
        title: "4. Information Sharing",
        content: "We share your information with property owners and tour operators to fulfill your bookings, payment processors (Stripe) to process transactions, and email service providers to send communications. We do not sell your personal information to third parties."
      },
      dataSecurity: {
        title: "5. Data Security",
        content: "We implement appropriate security measures to protect your personal information. Payment information is processed through Stripe's secure payment gateway. We use SSL encryption to protect data transmission. However, no method of transmission over the internet is 100% secure."
      },
      cookies: {
        title: "6. Cookies and Tracking",
        content: "We use cookies and similar tracking technologies to improve your experience. You can control cookie settings through your browser preferences. Some features may not function properly if cookies are disabled."
      },
      yourRights: {
        title: "7. Your Rights",
        content: "You have the right to access your personal information, request corrections to your data, request deletion of your information, opt-out of marketing communications, and withdraw consent where applicable. To exercise these rights, contact us at admin@margeatravel.com."
      },
      dataRetention: {
        title: "8. Data Retention",
        content: "We retain your personal information for as long as necessary to provide our services and comply with legal obligations. Booking records are kept for 7 years for accounting purposes. You may request deletion of your data at any time, subject to legal requirements."
      },
      thirdPartyLinks: {
        title: "9. Third-Party Links",
        content: "Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to read their privacy policies."
      },
      childrenPrivacy: {
        title: "10. Children's Privacy",
        content: "Our services are not directed to individuals under 18 years of age. We do not knowingly collect personal information from children."
      },
      changes: {
        title: "11. Changes to Privacy Policy",
        content: "We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date. Continued use of our services constitutes acceptance of the updated policy."
      },
      contact: {
        title: "12. Contact Us",
        content: "If you have questions about this Privacy Policy, please contact us at admin@margeatravel.com or call +52 998 233 4867."
      }
    }
  },
  es: {
    title: "Política de Privacidad",
    lastUpdated: "Última actualización: Enero 2025",
    sections: {
      introduction: {
        title: "1. Introducción",
        content: "Margea ('nosotros', 'nuestro' o 'nos') está comprometido con la protección de su privacidad. Esta Política de Privacidad explica cómo recopilamos, usamos, divulgamos y protegemos su información cuando utiliza nuestros servicios."
      },
      informationCollected: {
        title: "2. Información que Recopilamos",
        content: "Recopilamos información personal que usted nos proporciona, como nombre, dirección de correo electrónico, número de teléfono e información de pago. Recopilamos automáticamente cierta información cuando visita nuestro sitio web, incluida la dirección IP, tipo de navegador y datos de uso. También se recopila información de reserva, incluidas fechas, preferencias de propiedad y detalles de huéspedes."
      },
      howWeUse: {
        title: "3. Cómo Usamos su Información",
        content: "Usamos su información para procesar y gestionar sus reservas, comunicarnos con usted sobre sus reservas, enviar confirmaciones y actualizaciones de reservas, procesar pagos de forma segura, mejorar nuestros servicios y experiencia de usuario, y cumplir con obligaciones legales."
      },
      informationSharing: {
        title: "4. Compartir Información",
        content: "Compartimos su información con propietarios y operadores turísticos para cumplir con sus reservas, procesadores de pago (Stripe) para procesar transacciones, y proveedores de servicios de correo electrónico para enviar comunicaciones. No vendemos su información personal a terceros."
      },
      dataSecurity: {
        title: "5. Seguridad de Datos",
        content: "Implementamos medidas de seguridad apropiadas para proteger su información personal. La información de pago se procesa a través de la pasarela de pago segura de Stripe. Usamos cifrado SSL para proteger la transmisión de datos. Sin embargo, ningún método de transmisión por internet es 100% seguro."
      },
      cookies: {
        title: "6. Cookies y Seguimiento",
        content: "Usamos cookies y tecnologías de seguimiento similares para mejorar su experiencia. Puede controlar la configuración de cookies a través de las preferencias de su navegador. Algunas funciones pueden no funcionar correctamente si las cookies están deshabilitadas."
      },
      yourRights: {
        title: "7. Sus Derechos",
        content: "Tiene derecho a acceder a su información personal, solicitar correcciones a sus datos, solicitar la eliminación de su información, optar por no recibir comunicaciones de marketing, y retirar el consentimiento cuando corresponda. Para ejercer estos derechos, contáctenos en admin@margeatravel.com."
      },
      dataRetention: {
        title: "8. Retención de Datos",
        content: "Conservamos su información personal durante el tiempo necesario para proporcionar nuestros servicios y cumplir con obligaciones legales. Los registros de reservas se conservan durante 7 años con fines contables. Puede solicitar la eliminación de sus datos en cualquier momento, sujeto a requisitos legales."
      },
      thirdPartyLinks: {
        title: "9. Enlaces de Terceros",
        content: "Nuestro sitio web puede contener enlaces a sitios web de terceros. No somos responsables de las prácticas de privacidad de estos sitios externos. Le recomendamos que lea sus políticas de privacidad."
      },
      childrenPrivacy: {
        title: "10. Privacidad de Niños",
        content: "Nuestros servicios no están dirigidos a personas menores de 18 años. No recopilamos intencionalmente información personal de niños."
      },
      changes: {
        title: "11. Cambios a la Política de Privacidad",
        content: "Podemos actualizar esta Política de Privacidad de vez en cuando. Los cambios se publicarán en esta página con una fecha de revisión actualizada. El uso continuo de nuestros servicios constituye la aceptación de la política actualizada."
      },
      contact: {
        title: "12. Contáctenos",
        content: "Si tiene preguntas sobre esta Política de Privacidad, contáctenos en admin@margeatravel.com o llame al +52 998 233 4867."
      }
    }
  }
};

export default function Privacy() {
  const { language, setLanguage } = useLanguage();
  const t = translations[language];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar language={language} onLanguageChange={setLanguage} />
      
      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-2">{t.title}</h1>
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
