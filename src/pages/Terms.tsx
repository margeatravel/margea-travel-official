import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/components/LanguageToggle";

const translations = {
  en: {
    title: "Terms & Conditions",
    lastUpdated: "Last updated: January 2025",
    sections: {
      acceptance: {
        title: "1. Acceptance of Terms",
        content: "By accessing and using Margea's services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our services."
      },
      bookings: {
        title: "2. Booking and Reservations",
        content: "All bookings are subject to availability and confirmation. Prices are subject to change until booking is confirmed. Full payment is required at the time of booking unless otherwise specified. Booking confirmation will be sent via email."
      },
      cancellation: {
        title: "3. Cancellation Policy",
        content: "Cancellation policies vary by property and tour. Please refer to our Cancellation Policy page for detailed information. Cancellations must be made in writing via email. Refunds, if applicable, will be processed within 14 business days."
      },
      userResponsibilities: {
        title: "4. User Responsibilities",
        content: "You are responsible for providing accurate booking information. You must comply with all property rules and local laws. Any damage to properties will be charged to the responsible party. Guests must be at least 18 years old to make a booking."
      },
      payment: {
        title: "5. Payment Terms",
        content: "We accept major credit cards through our secure payment processor, Stripe. All prices are listed in USD unless otherwise stated. Additional fees may apply for certain services. Payment information must be valid and accurate."
      },
      liability: {
        title: "6. Limitation of Liability",
        content: "Margea acts as an intermediary between guests and property owners/tour operators. We are not liable for any injuries, losses, or damages incurred during your stay or tour. Property owners and tour operators maintain their own insurance. We recommend purchasing travel insurance for your protection."
      },
      privacy: {
        title: "7. Privacy",
        content: "Your use of our services is also governed by our Privacy Policy. We collect and use personal information as described in our Privacy Policy. We do not share your personal information with third parties except as necessary to provide our services."
      },
      modifications: {
        title: "8. Modifications to Terms",
        content: "Margea reserves the right to modify these terms at any time. Changes will be effective immediately upon posting to our website. Continued use of our services constitutes acceptance of modified terms."
      },
      contact: {
        title: "9. Contact Information",
        content: "For questions about these Terms & Conditions, please contact us at admin@margeatravel.com or call +52 998 233 4867."
      }
    }
  },
  es: {
    title: "Términos y Condiciones",
    lastUpdated: "Última actualización: Enero 2025",
    sections: {
      acceptance: {
        title: "1. Aceptación de Términos",
        content: "Al acceder y utilizar los servicios de Margea, acepta y se compromete a cumplir los términos y disposiciones de este acuerdo. Si no está de acuerdo con estos términos, por favor no utilice nuestros servicios."
      },
      bookings: {
        title: "2. Reservas",
        content: "Todas las reservas están sujetas a disponibilidad y confirmación. Los precios están sujetos a cambios hasta que se confirme la reserva. Se requiere el pago completo al momento de la reserva a menos que se especifique lo contrario. La confirmación de la reserva se enviará por correo electrónico."
      },
      cancellation: {
        title: "3. Política de Cancelación",
        content: "Las políticas de cancelación varían según la propiedad y el tour. Consulte nuestra página de Política de Cancelación para obtener información detallada. Las cancelaciones deben realizarse por escrito vía correo electrónico. Los reembolsos, si corresponden, se procesarán dentro de 14 días hábiles."
      },
      userResponsibilities: {
        title: "4. Responsabilidades del Usuario",
        content: "Es responsable de proporcionar información de reserva precisa. Debe cumplir con todas las reglas de la propiedad y las leyes locales. Cualquier daño a las propiedades se cobrará a la parte responsable. Los huéspedes deben tener al menos 18 años para hacer una reserva."
      },
      payment: {
        title: "5. Términos de Pago",
        content: "Aceptamos las principales tarjetas de crédito a través de nuestro procesador de pagos seguro, Stripe. Todos los precios se muestran en USD a menos que se indique lo contrario. Pueden aplicarse tarifas adicionales para ciertos servicios. La información de pago debe ser válida y precisa."
      },
      liability: {
        title: "6. Limitación de Responsabilidad",
        content: "Margea actúa como intermediario entre huéspedes y propietarios/operadores turísticos. No somos responsables de lesiones, pérdidas o daños incurridos durante su estadía o tour. Los propietarios y operadores turísticos mantienen su propio seguro. Recomendamos contratar un seguro de viaje para su protección."
      },
      privacy: {
        title: "7. Privacidad",
        content: "Su uso de nuestros servicios también se rige por nuestra Política de Privacidad. Recopilamos y usamos información personal como se describe en nuestra Política de Privacidad. No compartimos su información personal con terceros excepto según sea necesario para proporcionar nuestros servicios."
      },
      modifications: {
        title: "8. Modificaciones a los Términos",
        content: "Margea se reserva el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigencia inmediatamente después de su publicación en nuestro sitio web. El uso continuo de nuestros servicios constituye la aceptación de los términos modificados."
      },
      contact: {
        title: "9. Información de Contacto",
        content: "Para preguntas sobre estos Términos y Condiciones, contáctenos en admin@margeatravel.com o llame al +52 998 233 4867."
      }
    }
  }
};

export default function Terms() {
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
