import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface CityFAQProps {
  language: "en" | "es";
  cityName: string;
}

const getFAQData = (cityName: string) => ({
  en: [
    {
      question: `How far is ${cityName} from Cancun Airport?`,
      answer: `${cityName} is easily accessible from Cancun International Airport. We can arrange private transportation for competitive rates. Contact us for exact distance and transfer pricing.`
    },
    {
      question: `What activities are available in ${cityName}?`,
      answer: `${cityName} offers amazing snorkeling, diving, beach activities, and access to cenotes and Mayan ruins. The area is rich in natural beauty and Mexican culture.`
    },
    {
      question: "What's the difference between booking with Margea vs booking platforms?",
      answer: "Booking direct with Margea means no platform service fees. You get direct contact with property managers, transparent pricing, and 24/7 WhatsApp support from our local team in Riviera Maya."
    },
    {
      question: `Are ${cityName} vacation rentals safe?`,
      answer: `Yes, ${cityName} is a safe destination in the Riviera Maya. Most properties are in secure communities. We carefully vet all properties and provide emergency contact numbers for all guests.`
    },
    {
      question: `What's the best time to visit ${cityName}?`,
      answer: "December through April offers the best weather with minimal rain and comfortable temperatures. May-June and September-November are shoulder season with lower prices and fewer crowds."
    },
    {
      question: `Do I need a car in ${cityName}?`,
      answer: "It depends on your plans. Many areas are walkable, but a car is helpful for exploring cenotes, nearby towns, and attractions. We can arrange car rentals or private drivers as needed."
    },
    {
      question: `What amenities are included in ${cityName} rentals?`,
      answer: "Most properties include WiFi, air conditioning, full kitchens, and weekly cleaning. Many have pools, outdoor grills, and beach equipment. Specific amenities are listed on each property page."
    }
  ],
  es: [
    {
      question: `¿Qué tan lejos está ${cityName} del Aeropuerto de Cancún?`,
      answer: `${cityName} es fácilmente accesible desde el Aeropuerto Internacional de Cancún. Podemos organizar transporte privado a tarifas competitivas. Contáctanos para distancia exacta y precios de traslado.`
    },
    {
      question: `¿Qué actividades hay disponibles en ${cityName}?`,
      answer: `${cityName} ofrece increíble snorkel, buceo, actividades de playa y acceso a cenotes y ruinas mayas. El área es rica en belleza natural y cultura mexicana.`
    },
    {
      question: "¿Cuál es la diferencia entre reservar con Margea vs plataformas?",
      answer: "Reservar directamente con Margea significa sin comisiones de plataforma. Obtienes contacto directo con los administradores de propiedades, precios transparentes y soporte 24/7 por WhatsApp."
    },
    {
      question: `¿Son seguros los alquileres vacacionales en ${cityName}?`,
      answer: `Sí, ${cityName} es un destino seguro en la Riviera Maya. La mayoría de las propiedades están en comunidades seguras. Verificamos cuidadosamente todas las propiedades.`
    },
    {
      question: `¿Cuál es la mejor época para visitar ${cityName}?`,
      answer: "De diciembre a abril ofrece el mejor clima con lluvia mínima y temperaturas agradables. Mayo-junio y septiembre-noviembre son temporada baja con precios más bajos."
    },
    {
      question: `¿Necesito un auto en ${cityName}?`,
      answer: "Depende de tus planes. Muchas áreas son caminables, pero un auto es útil para explorar cenotes, pueblos cercanos y atracciones. Podemos organizar alquiler de autos o conductores privados."
    },
    {
      question: `¿Qué amenidades están incluidas en los alquileres de ${cityName}?`,
      answer: "La mayoría de las propiedades incluyen WiFi, aire acondicionado, cocinas completas y limpieza semanal. Muchas tienen piscinas, parrillas al aire libre y equipo de playa."
    }
  ]
});

export function CityFAQ({ language, cityName }: CityFAQProps) {
  const faqData = getFAQData(cityName);
  const faqs = faqData[language];
  const title = language === "es" 
    ? `Alquileres Vacacionales en ${cityName} – Preguntas Frecuentes`
    : `${cityName} Vacation Rentals – Frequently Asked Questions`;

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
