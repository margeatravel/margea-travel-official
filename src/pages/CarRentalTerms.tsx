import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/components/LanguageToggle";

const translations = {
  en: {
    title: "Car Rental Terms & Conditions",
    subtitle: "Operated by YAAB Rental Car Cancún",
    lastUpdated: "Last updated: November 2026",
    sections: {
      about: {
        title: "1. About this rental service",
        content:
          "Car rentals booked on Margea Travel are operated by YAAB Rental Car Cancún. Margea Travel acts as an intermediary: we take your booking and your 50% deposit, and YAAB delivers the car, confirms availability and provides the service under its own lease contract (contrato de arrendamiento), which you sign at delivery. YAAB Rental Car Cancún — Carretera Cancún–Tulum 786, Cancún, Quintana Roo 77504. WhatsApp +52 998 104 9534, reservas@yaabcar.mx.",
      },
      requirements: {
        title: "2. Requirements",
        content:
          "You must be 18 or older and present a valid driver's license (foreign licenses are accepted if valid) and a valid official ID (INE or passport) at delivery.",
      },
      booking: {
        title: "3. Booking, payment and availability",
        content:
          "To confirm a reservation, a 50% deposit is paid online through Margea (Stripe). The remaining 50% is paid at delivery, in cash or by bank transfer to YAAB. Daily rates are in MXN and the minimum rental is 3 days. Availability is confirmed with YAAB within 24 hours; if no car is available, your deposit is refunded in full.",
      },
      deposit: {
        title: "4. Security deposit",
        content:
          "Depending on the vehicle, a refundable security deposit may apply. When it applies, YAAB informs the amount before delivery; it is not charged online. It is refunded after the rental, once the car is inspected and returned in the conditions set in the contract.",
      },
      insurance: {
        title: "5. Insurance and mileage",
        content:
          "All cars include insurance. Coverage and exclusions are specified in the lease contract. All rentals include unlimited mileage.",
      },
      delivery: {
        title: "6. Delivery and return",
        content:
          "Delivery and return are available 24 hours a day in Cancún (Cancún International Airport, hotels, Hotel Zone and other previously agreed points), subject to coordination with the client. Return the car with the same fuel level as delivered. A late return carries an extra charge depending on the delay; if the delay affects a later booking, the client covers the costs caused by that.",
      },
      during: {
        title: "7. During the rental",
        content:
          "If the car has a failure or you have an accident, contact YAAB immediately for assistance and instructions. Do not make repairs without prior authorization. You may extend the rental if the car is available; the extension must be confirmed and paid before the original period ends. Adding an additional driver may have an extra cost.",
      },
      changes: {
        title: "8. Changes and cancellations",
        content:
          "Changes are subject to availability. If you cancel less than 24 hours before the delivery date and time, the deposit is not refundable. We recommend booking as early as possible, especially in high season.",
      },
      liability: {
        title: "9. Margea's role and liability",
        content:
          "Margea Travel is the booking intermediary. The vehicle, the delivery, the insurance and the service during the rental are YAAB's responsibility under its lease contract. Margea is not liable for damages, fines or incidents arising from the use of the rented vehicle; the driver is responsible for fines and infractions and for following traffic rules.",
      },
      contact: {
        title: "10. Contact",
        content:
          "Questions about a car rental: admin@margeatravel.com or +52 998 233 4867. YAAB Rental Car Cancún: WhatsApp +52 998 104 9534, reservas@yaabcar.mx.",
      },
    },
  },
  es: {
    title: "Términos y Condiciones de Renta de Coches",
    subtitle: "Operado por YAAB Rental Car Cancún",
    lastUpdated: "Última actualización: Noviembre 2026",
    sections: {
      about: {
        title: "1. Sobre este servicio de renta",
        content:
          "Las rentas de autos reservadas en Margea Travel son operadas por YAAB Rental Car Cancún. Margea Travel actúa como intermediario: nosotros tomamos tu reserva y tu anticipo del 50%, y YAAB entrega el auto, confirma la disponibilidad y presta el servicio bajo su propio contrato de arrendamiento, que se firma a la entrega. YAAB Rental Car Cancún — Carretera Cancún–Tulum 786, Cancún, Quintana Roo 77504. WhatsApp +52 998 104 9534, reservas@yaabcar.mx.",
      },
      requirements: {
        title: "2. Requisitos",
        content:
          "Debes tener 18 años o más y presentar una licencia de conducir vigente (las licencias extranjeras se aceptan si están vigentes) y una identificación oficial vigente (INE o pasaporte) a la entrega.",
      },
      booking: {
        title: "3. Reserva, pago y disponibilidad",
        content:
          "Para confirmar una reserva se paga un anticipo del 50% en línea a través de Margea (Stripe). El 50% restante se paga a la entrega, en efectivo o por transferencia bancaria a YAAB. Las tarifas por día son en MXN y la renta mínima es de 3 días. La disponibilidad se confirma con YAAB en menos de 24 horas; si no hay auto disponible, se te reembolsa el anticipo completo.",
      },
      deposit: {
        title: "4. Depósito en garantía",
        content:
          "Según el vehículo, puede aplicar un depósito en garantía reembolsable. Cuando aplica, YAAB informa el monto antes de la entrega; no se cobra en línea. Se reembolsa al finalizar la renta, una vez revisada la unidad y siempre que se entregue en las condiciones establecidas en el contrato.",
      },
      insurance: {
        title: "5. Seguro y kilometraje",
        content:
          "Todos los autos incluyen seguro. La cobertura y sus exclusiones se especifican en el contrato de arrendamiento. Todas las rentas incluyen kilometraje libre.",
      },
      delivery: {
        title: "6. Entrega y devolución",
        content:
          "La entrega y devolución están disponibles las 24 horas del día en Cancún (Aeropuerto Internacional de Cancún, hoteles, Zona Hotelera y otros puntos previamente acordados), previa coordinación con el cliente. Devuelve el auto con el mismo nivel de gasolina con el que se entregó. La devolución fuera del horario acordado genera un cargo adicional, que dependerá del tiempo de retraso; si el retraso afecta una reservación posterior, el cliente deberá cubrir los costos ocasionados por esa afectación.",
      },
      during: {
        title: "7. Durante la renta",
        content:
          "Si el auto presenta una falla o tienes un accidente, comunícate de inmediato con YAAB para recibir asistencia e indicarte el procedimiento. No se deben realizar reparaciones sin autorización previa. Puedes extender la renta si la unidad está disponible; la extensión deberá confirmarse y liquidarse antes de finalizar el periodo originalmente contratado. Agregar un conductor adicional puede generar un costo extra.",
      },
      changes: {
        title: "8. Cambios y cancelaciones",
        content:
          "Las modificaciones están sujetas a disponibilidad. Si cancelas con menos de 24 horas de anticipación a la fecha y hora de entrega, el anticipo no será reembolsable. Te recomendamos reservar con la mayor anticipación posible, especialmente en temporada alta.",
      },
      liability: {
        title: "9. Papel de Margea y responsabilidad",
        content:
          "Margea Travel es el intermediario de la reserva. El vehículo, la entrega, el seguro y el servicio durante la renta son responsabilidad de YAAB bajo su contrato de arrendamiento. Margea no es responsable de daños, multas o incidentes derivados del uso del vehículo rentado; el conductor es responsable de las multas e infracciones y de respetar las reglas de tránsito.",
      },
      contact: {
        title: "10. Contacto",
        content:
          "Preguntas sobre una renta de auto: admin@margeatravel.com o +52 998 233 4867. YAAB Rental Car Cancún: WhatsApp +52 998 104 9534, reservas@yaabcar.mx.",
      },
    },
  },
};

export default function CarRentalTerms() {
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
