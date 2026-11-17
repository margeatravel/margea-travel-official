import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface AkumalFAQProps {
  language: "en" | "es";
}

const faqData = {
  en: [
    {
      question: "How far is Akumal from Cancun Airport?",
      answer: "Akumal is approximately 60 miles (95 km) south of Cancun International Airport, about a 90-minute drive via Highway 307. We can arrange private transportation for $120-150 USD each way for groups up to 8 people."
    },
    {
      question: "Can you really swim with turtles in Akumal?",
      answer: "Yes! Sea turtles feed in Akumal Bay year-round. Simply bring snorkel gear and wade into the shallow water. The best time is morning (8-11 AM) when waters are calmest. Life jackets and snorkel rentals ($10-15) are available on the beach."
    },
    {
      question: "What's the difference between booking with Margea vs booking platforms?",
      answer: "Booking direct with Margea means no platform service fees. You get direct contact with property managers, transparent pricing, and 24/7 WhatsApp support from our local team in Riviera Maya."
    },
    {
      question: "Are Akumal vacation rentals safe?",
      answer: "Yes, Akumal is one of the safest areas in Riviera Maya. Most properties are in gated communities with 24/7 security. Crime rates are very low. We carefully vet all properties and provide emergency contact numbers for all guests."
    },
    {
      question: "What's the best time to visit Akumal?",
      answer: "December through April offers the best weather with minimal rain and comfortable temperatures. May-June and September-November are shoulder season with lower prices and fewer crowds. July-August is hot and humid. Hurricane season runs June-November but direct hits are rare."
    },
    {
      question: "Do I need a car in Akumal?",
      answer: "Not necessarily. Many restaurants and shops are walkable from vacation rentals. However, a car is helpful for visiting cenotes, Tulum, and Playa del Carmen. We can arrange car rentals starting at $35/day or private drivers as needed."
    },
    {
      question: "What amenities are included in Akumal rentals?",
      answer: "Most properties include WiFi, air conditioning, full kitchens, beach access, and weekly cleaning. Many have private pools, outdoor grills, and beach equipment (kayaks, snorkel gear). Specific amenities are listed on each property page."
    }
  ],
  es: [
    {
      question: "¿Qué tan lejos está Akumal del Aeropuerto de Cancún?",
      answer: "Akumal está aproximadamente a 95 km al sur del Aeropuerto Internacional de Cancún, a unos 90 minutos en auto por la Carretera 307. Podemos organizar transporte privado por $120-150 USD por trayecto para grupos de hasta 8 personas."
    },
    {
      question: "¿Realmente se puede nadar con tortugas en Akumal?",
      answer: "¡Sí! Las tortugas marinas se alimentan en la Bahía de Akumal todo el año. Simplemente trae equipo de snorkel y entra al agua poco profunda. El mejor horario es por la mañana (8-11 AM) cuando las aguas están más tranquilas."
    },
    {
      question: "¿Cuál es la diferencia entre reservar con Margea vs plataformas?",
      answer: "Reservar directamente con Margea significa sin comisiones de plataforma. Obtienes contacto directo con los administradores de propiedades, precios transparentes y soporte 24/7 por WhatsApp de nuestro equipo local en Riviera Maya."
    },
    {
      question: "¿Son seguros los alquileres vacacionales en Akumal?",
      answer: "Sí, Akumal es una de las zonas más seguras de la Riviera Maya. La mayoría de las propiedades están en comunidades cerradas con seguridad 24/7. Los índices de criminalidad son muy bajos."
    },
    {
      question: "¿Cuál es la mejor época para visitar Akumal?",
      answer: "De diciembre a abril ofrece el mejor clima con lluvia mínima y temperaturas agradables. Mayo-junio y septiembre-noviembre son temporada baja con precios más bajos y menos multitudes."
    },
    {
      question: "¿Necesito un auto en Akumal?",
      answer: "No necesariamente. Muchos restaurantes y tiendas están a poca distancia de los alquileres vacacionales. Sin embargo, un auto es útil para visitar cenotes, Tulum y Playa del Carmen. Podemos organizar alquiler de autos desde $35/día."
    },
    {
      question: "¿Qué amenidades están incluidas en los alquileres de Akumal?",
      answer: "La mayoría de las propiedades incluyen WiFi, aire acondicionado, cocinas completas, acceso a la playa y limpieza semanal. Muchas tienen piscinas privadas, parrillas al aire libre y equipo de playa."
    }
  ]
};

export function AkumalFAQ({ language }: AkumalFAQProps) {
  const faqs = faqData[language];
  const title = language === "es" 
    ? "Alquileres Vacacionales en Akumal – Preguntas Frecuentes"
    : "Akumal Vacation Rentals – Frequently Asked Questions";

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          {title}
        </h2>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
