import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/components/LanguageToggle";

const translations = {
  en: {
    title: "Cancellation Policy",
    lastUpdated: "Last updated: January 2025",
    sections: {
      general: {
        title: "1. General Policy",
        content: "Cancellation policies may vary depending on the property or tour booked. Please review the specific cancellation terms for your reservation at the time of booking. All cancellation requests must be submitted in writing to admin@margeatravel.com."
      },
      properties: {
        title: "2. Property Cancellations",
        content: "Free cancellation up to 30 days before check-in date (100% refund). Cancellations 15-29 days before check-in receive 50% refund. Cancellations 7-14 days before check-in receive 25% refund. Cancellations less than 7 days before check-in are non-refundable. No-shows are non-refundable."
      },
      tours: {
        title: "3. Tour & Activity Cancellations",
        content: "Free cancellation up to 48 hours before tour start time (100% refund). Cancellations 24-48 hours before receive 50% refund. Cancellations less than 24 hours before are non-refundable. Weather-related cancellations initiated by tour operator receive 100% refund or rescheduling option."
      },
      modifications: {
        title: "4. Booking Modifications",
        content: "Date changes are subject to availability and may incur additional fees. Modifications must be requested at least 14 days before check-in/tour date. Guest number changes may affect the total price. Property or tour changes are treated as a new booking."
      },
      refundProcess: {
        title: "5. Refund Processing",
        content: "Refunds will be processed within 14 business days of cancellation approval. Refunds are issued to the original payment method. Processing fees (3%) are non-refundable. Currency exchange rate differences may apply."
      },
      forcemajeure: {
        title: "6. Force Majeure",
        content: "In cases of natural disasters, government travel restrictions, or other unforeseeable circumstances, special cancellation terms may apply. We will work with you to reschedule or provide a credit for future bookings. Each case is evaluated individually."
      },
      propertyOwner: {
        title: "7. Property Owner Cancellations",
        content: "If a property owner cancels your confirmed booking, you will receive a 100% refund. We will assist in finding alternative accommodation when possible. Additional compensation may be provided at our discretion."
      },
      disputes: {
        title: "8. Disputes",
        content: "If you have concerns about a cancellation or refund, please contact us at admin@margeatravel.com. We will review your case within 5 business days. All decisions are made in accordance with our terms and conditions."
      },
      contact: {
        title: "9. Contact for Cancellations",
        content: "To cancel a booking, email admin@margeatravel.com with your booking reference number and cancellation reason. For urgent matters, call +52 998 233 4867. Include all booking details in your cancellation request."
      }
    }
  },
  es: {
    title: "Política de Cancelación",
    lastUpdated: "Última actualización: Enero 2025",
    sections: {
      general: {
        title: "1. Política General",
        content: "Las políticas de cancelación pueden variar según la propiedad o el tour reservado. Revise los términos específicos de cancelación para su reserva al momento de la reserva. Todas las solicitudes de cancelación deben enviarse por escrito a admin@margeatravel.com."
      },
      properties: {
        title: "2. Cancelaciones de Propiedades",
        content: "Cancelación gratuita hasta 30 días antes de la fecha de check-in (reembolso del 100%). Cancelaciones 15-29 días antes reciben 50% de reembolso. Cancelaciones 7-14 días antes reciben 25% de reembolso. Cancelaciones menos de 7 días antes no son reembolsables. Las no presentaciones no son reembolsables."
      },
      tours: {
        title: "3. Cancelaciones de Tours y Actividades",
        content: "Cancelación gratuita hasta 48 horas antes de la hora de inicio del tour (reembolso del 100%). Cancelaciones 24-48 horas antes reciben 50% de reembolso. Cancelaciones menos de 24 horas antes no son reembolsables. Cancelaciones relacionadas con el clima iniciadas por el operador del tour reciben 100% de reembolso u opción de reprogramación."
      },
      modifications: {
        title: "4. Modificaciones de Reserva",
        content: "Los cambios de fecha están sujetos a disponibilidad y pueden incurrir en tarifas adicionales. Las modificaciones deben solicitarse al menos 14 días antes de la fecha de check-in/tour. Los cambios en el número de huéspedes pueden afectar el precio total. Los cambios de propiedad o tour se tratan como una nueva reserva."
      },
      refundProcess: {
        title: "5. Proceso de Reembolso",
        content: "Los reembolsos se procesarán dentro de 14 días hábiles después de la aprobación de la cancelación. Los reembolsos se emiten al método de pago original. Las tarifas de procesamiento (3%) no son reembolsables. Pueden aplicarse diferencias en el tipo de cambio de divisas."
      },
      forcemajeure: {
        title: "6. Fuerza Mayor",
        content: "En casos de desastres naturales, restricciones de viaje gubernamentales u otras circunstancias imprevistas, pueden aplicarse términos especiales de cancelación. Trabajaremos con usted para reprogramar o proporcionar un crédito para futuras reservas. Cada caso se evalúa individualmente."
      },
      propertyOwner: {
        title: "7. Cancelaciones del Propietario",
        content: "Si un propietario cancela su reserva confirmada, recibirá un reembolso del 100%. Ayudaremos a encontrar alojamiento alternativo cuando sea posible. Se puede proporcionar compensación adicional a nuestra discreción."
      },
      disputes: {
        title: "8. Disputas",
        content: "Si tiene inquietudes sobre una cancelación o reembolso, contáctenos en admin@margeatravel.com. Revisaremos su caso dentro de 5 días hábiles. Todas las decisiones se toman de acuerdo con nuestros términos y condiciones."
      },
      contact: {
        title: "9. Contacto para Cancelaciones",
        content: "Para cancelar una reserva, envíe un correo electrónico a admin@margeatravel.com con su número de referencia de reserva y motivo de cancelación. Para asuntos urgentes, llame al +52 998 233 4867. Incluya todos los detalles de la reserva en su solicitud de cancelación."
      }
    }
  }
};

export default function Cancellation() {
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
