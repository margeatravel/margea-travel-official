import { useParams, useNavigate } from "react-router-dom";
import { ShareButton } from "@/components/ShareButton";
import { SEO } from "@/components/SEO";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/components/LanguageToggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Star, Clock, Users, Calendar, Globe, Bus, ArrowLeft, Check, X, AlertCircle, Backpack, Info } from "lucide-react";
import { useState } from "react";
import tourExtremeAtv from "@/assets/tour-extreme-atv.jpg";
import tourHorseback from "@/assets/tour-horseback.jpg";
import tourCenoteWaterfall from "@/assets/tour-cenote-waterfall.jpg";
import tourSnorkelReef from "@/assets/tour-snorkel-reef.jpg";
import tourTacos from "@/assets/tour-tacos.jpg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { TourBookingModule } from "@/components/tours/TourBookingModule";
import { getTourPricing } from "@/data/toursPricing";
import { whaleSharkCover, whaleSharkGallery } from "@/data/whaleSharkImages";

const translations = {
  en: {
    backToTours: "Back to Tours",
    reviews: "reviews",
    duration: "Duration",
    minAge: "Min. Age",
    schedules: "Schedules",
    transport: "Transport",
    roundTrip: "round trip",
    languages: "Languages",
    includes: "Includes:",
    notIncluded: "Not Included:",
    importantInfo: "Important Information",
    whatToBring: "What to Bring",
    tourNotFound: "Tour not found",
    pricingNotAvailable: "Pricing not available for this tour. Please contact support.",
  },
  es: {
    backToTours: "Volver a Tours",
    reviews: "reseñas",
    duration: "Duración",
    minAge: "Edad mínima",
    schedules: "Horarios",
    transport: "Transporte",
    roundTrip: "redondo",
    languages: "Idiomas",
    includes: "Incluye:",
    notIncluded: "No Incluido:",
    importantInfo: "Información Importante",
    whatToBring: "Qué Llevar",
    tourNotFound: "Tour no encontrado",
    pricingNotAvailable: "Precios no disponibles para este tour. Por favor contacte soporte.",
  },
};

const tourContent = {
  en: {
    "extreme-adventuring": {
      title: "Extreme Adventuring",
      subtitle: "ATV, Zipline, Cenote & Mayan Show",
      description: "The Best ATV Excursion in Cancun.",
      duration: "4 hours",
      transport: "round trip",
      languages: ["English", "Spanish"],
      includes: [
        "ATV Ride",
        "Circuit of 5 Ziplines",
        "3 Interactive bridges",
        "Visit to a 100% natural open cenote",
        "Tequila Tasting",
        "Mayan Performance"
      ],
    },
    "extreme-horseback-riding": {
      title: "Extreme Horseback Riding",
      subtitle: "Horseback Circuit, ATV, Zipline, Cenote & Mayan Show",
      description: "Horseback and ATV Circuit, Zipline, Cenote and Mayan Show",
      duration: "4 hours",
      transport: "round trip",
      languages: ["English", "Spanish"],
      includes: [
        "ATV Ride",
        "Horseback Ride",
        "Circuit of 5 Ziplines",
        "3 Interactive bridges",
        "Visit to a 100% natural open cenote",
        "Tequila Tasting",
        "Mayan Performance"
      ],
    },
    "cenote-adventuring": {
      title: "Cenote Adventuring",
      subtitle: "3 Private Cenotes + Mayan Show + Snack",
      description: "Boutique Experience in 3 Private Cenotes with Mayan Show and Snack",
      duration: "4 hours",
      transport: "round trip",
      languages: ["English", "Spanish"],
      includes: [
        "Conservation Fee (Included)",
        "Round-trip transportation from your hotel",
        "3 Cenotes (with Waterfall, Zipline and Cavern)",
        "Lifejacket",
        "Specialized and bilingual guides",
        "Tequila Tasting (in the Cenote)",
        "Regional Show"
      ],
      notIncluded: [
        "Professional Photographs (available for purchase)",
        "Tips or Gratuities",
        "Souvenirs"
      ],
    },
    "snorkeling-adventure": {
      title: "Snorkeling Adventure",
      subtitle: "Snorkeling in the Great Mayan Reef",
      description: "Snorkel the biggest reef in 'The Americas'",
      duration: "4 hours",
      transport: "round trip",
      languages: ["English", "Spanish"],
      includes: [
        "Snorkel in Reef",
        "Snack at a beachside restaurant",
        "Guided tour through Puerto Morelos",
        "Tequila Tasting"
      ],
    },
    "private-snorkeling": {
      title: "Private Snorkeling",
      subtitle: "Private boat ride & Snorkeling in Puerto Morelos",
      description: "Exclusive private boat experience with snorkeling in Puerto Morelos",
      duration: "4 hours",
      transport: "round trip",
      languages: ["English", "Spanish"],
      includes: [
        "Unlimited drinks on the boat",
        "Priority check-in",
        "Private boat reserved for your group",
        "Fresh ceviche served on board",
        "VIP meal: 4 tacos and 2 drinks"
      ],
    },
    "city-taco-tour": {
      title: "Beach Taco Tour",
      subtitle: "Beachside tacos & town tour with tequila tasting",
      description: "Beachside Gastronomic Experience in Puerto Morelos (From Cancun)",
      duration: "4 hours",
      transport: "round trip",
      languages: ["English", "Spanish"],
      includes: [
        "3 Taco Spots",
        "Stroll by Puerto Morelos",
        "Ice Cream",
        "Shopping at 'Mi Pueblito Mall'",
        "Tequila Tasting"
      ],
    },
    "wave-runner": {
      title: "Puerto Maya Wave Runner",
      subtitle: "Adrenaline ride across the Nichupté Lagoon",
      description: "Start your adventure with a warm welcome and safety briefing from expert guides. After receiving instructions and equipment, explore the beautiful Nichupté Lagoon surrounded by mangroves and tropical wildlife. Feel the adrenaline as you speed across open waters on easy-to-handle wave runners in a safe, controlled environment. Finish your experience back at the marina with access to showers, restrooms, artisan shops, and the Mayan Lounge restaurant.",
      duration: "30 min – 1 hour",
      transport: "Not included",
      languages: ["English", "Spanish"],
      includes: [
        "Single or double wave runner",
        "Life jacket",
        "Locker service (ID required)",
      ],
      notIncluded: [
        "Towel",
        "Dock tax: $10 USD",
        "Photo service",
        "Souvenirs, crafts, and additional beverages",
        "Gratuities",
      ],
      importantInfo: [
        "Minimum age to participate: 13 years",
        "Minimum age to drive: 18 years",
        "Maximum weight: 120 kg",
        "Arrive 15 minutes before departure",
        "Minors must be accompanied by an adult",
        "Not recommended for pregnant women, people with heart conditions, severe physical limitations, or under the influence of alcohol/drugs",
      ],
      whatToBring: [
        "Credit card or cash for photos, souvenirs, tips",
        "Cap or sunglasses",
        "Biodegradable sunscreen and insect repellent",
      ],
    },
    "mayan-jungle-tour": {
      title: "Mayan Jungle Tour",
      subtitle: "Speed boat, snorkeling & sacred Mayan ceremony",
      description: "Begin your journey at a sacred Mayan Calendar site, where a guide explains its solar cycles and spiritual meaning while you participate in a ceremonial experience. Walk through the Maya Trail alongside Mayan warriors, cross hanging bridges, and explore replicas of ancient temples. Drive your own speed boat through Nichupté Lagoon's mangroves before snorkeling at Punta Nizuc Reef, part of the world's second-largest coral reef system. Conclude with a traditional regional Mayan meal and refreshing natural beverages.",
      duration: "3 hours",
      transport: "Not included",
      languages: ["English", "Spanish"],
      includes: [
        "Speed boat (2 or 4 passengers)",
        "Snorkeling equipment",
        "Life jacket",
        "Locker service",
      ],
      notIncluded: [
        "Dock & marine park tax: $20 USD",
        "Photo service",
        "Souvenirs and additional beverages",
        "Gratuities",
        "Round transportation",
        "Towel",
      ],
      importantInfo: [
        "Minimum age: 6 years",
        "Maximum weight: 120 kg",
        "Arrive 20 minutes before departure",
        "Minors must be accompanied by an adult",
        "Not recommended for pregnant women, people with heart conditions, severe physical limitations, or under the influence of alcohol/drugs",
        "Capacity: 60 pax per schedule",
      ],
      whatToBring: [
        "Credit card or cash for photos, souvenirs, tips",
        "Cap or sunglasses",
        "Swimsuit",
        "Biodegradable sunscreen and insect repellent",
      ],
    },
    "whale-shark-snorkeling": {
      title: "Whale Shark Snorkeling Adventure",
      subtitle: "Swim alongside the gentle giants of the Caribbean",
      description: "Sail out into the open Caribbean to meet the largest fish in the ocean. After a safety and conservation briefing, you'll snorkel in small, guided groups beside whale sharks in their natural habitat, accompanied by certified guides. The tour includes a stop for snorkeling and a fresh ceviche lunch on board before heading back to shore. A once-in-a-lifetime, strictly seasonal experience available from May through September.",
      duration: "7-8 hours",
      transport: "round trip",
      languages: ["English", "Spanish"],
      includes: [
        "Round-trip transportation",
        "Certified bilingual guide",
        "Snorkel equipment and life jacket",
        "Whale shark swim in small groups",
        "Additional snorkeling stop",
        "Fresh ceviche, snacks and drinks on board",
        "Marine park bracelet",
      ],
      notIncluded: [
        "Photo and video service",
        "Gratuities",
        "Souvenirs and additional beverages",
      ],
      importantInfo: [
        "Seasonal tour: available May through September only",
        "Minimum age: 5 years",
        "Guests must be able to swim",
        "Departure is early morning; please arrive on time",
        "Only biodegradable sunscreen is permitted",
        "Not recommended for pregnant women or guests prone to seasickness",
        "Subject to weather and maritime authority conditions",
      ],
      whatToBring: [
        "Swimsuit and towel",
        "Biodegradable sunscreen",
        "Cap and sunglasses",
        "Change of clothes",
        "Cash or card for photos, souvenirs and tips",
      ],
    },
    "extreme-snorkeling-package": {
      title: "Extreme Adventuring + Snorkeling Adventure Package",
      subtitle: "Extreme Adventuring Package",
      description: "The ultimate combo: ATV jungle adventure meets Caribbean snorkeling",
      duration: "8 hours",
      transport: "round trip",
      languages: ["English", "Spanish"],
      includes: [
        "ATV jungle adventure",
        "Caribbean snorkeling",
        "Cenote visit",
        "Zipline circuit",
        "Beachside snack",
        "Tequila Tasting",
        "Mayan Performance"
      ],
      familyNote: {
        title: "Traveling with kids?",
        items: [
          {
            label: "Park",
            text: "Children must be at least 4 years old and accompanied by an adult who has also purchased a park ticket.",
          },
          {
            label: "Snorkeling",
            text: "Children can participate from 8 years old, with an adult accompanying them at all times.",
          },
          {
            label: "ATV",
            text: "Children can ride the quads as passengers only.",
          },
        ],
        footer: "Questions? Feel free to contact us, we're happy to help!",
      },
    },
    "full-experience-two-days": {
      title: "Full Experience Adventure Two Days ATV Package",
      subtitle: "Extreme Adventuring Package",
      description: "Two days of pure adventure: explore cenotes, jungle trails, and ancient Maya sites",
      duration: "2 days",
      transport: "round trip",
      languages: ["English", "Spanish"],
      includes: [
        "2 full days of adventure",
        "ATV ride through Maya jungle",
        "Visit to multiple cenotes",
        "Zipline circuits",
        "Interactive bridges",
        "Regional snacks",
        "Tequila Tasting",
        "Mayan Performance"
      ],
    },
    "snorkeling-cenote-package": {
      title: "Snorkeling Adventure with Cenote Adventure Package",
      subtitle: "Extreme Adventuring Package",
      description: "Discover the best of both worlds: snorkel in the Caribbean and swim in magical cenotes",
      duration: "6 hours",
      transport: "round trip",
      languages: ["English", "Spanish"],
      includes: [
        "Great Maya Reef snorkel",
        "3 private cenotes",
        "Time in Puerto Morelos",
        "Beachside snack",
        "Tequila Tasting"
      ],
    },
  },
  es: {
    "extreme-adventuring": {
      title: "Extreme Adventuring",
      subtitle: "Cuatrimoto, Tirolesa, Cenote y Show Maya",
      description: "La Mejor Excursión en Cuatrimoto en Cancún.",
      duration: "4 horas",
      transport: "redondo",
      languages: ["inglés", "español"],
      includes: [
        "Paseo en ATV",
        "Circuito de 5 tirolesas",
        "3 Puentes interactivos",
        "Visita a un cenote abierto 100% natural",
        "Degustación de tequila",
        "Espectáculo maya"
      ],
    },
    "extreme-horseback-riding": {
      title: "Extreme Horseback Riding",
      subtitle: "Circuito a Caballo, Cuatrimoto, Tirolesa, Cenote y Show Maya",
      description: "Circuito a Caballo y en Cuatrimoto, Tirolesa, Cenote y Show Maya",
      duration: "4 horas",
      transport: "redondo",
      languages: ["inglés", "español"],
      includes: [
        "Paseo en Cuatrimoto",
        "Paseo a Caballo",
        "Circuito de 5 Tirolesas",
        "3 Puentes Interactivos",
        "Visita a un cenote abierto 100% natural",
        "Degustación de Tequila",
        "Espectáculo Maya"
      ],
    },
    "cenote-adventuring": {
      title: "Cenote Adventuring",
      subtitle: "3 Cenotes Privados + Show Maya + Snack",
      description: "Experiencia Boutique en 3 Cenotes Privados con Show Maya y Snack",
      duration: "4 horas",
      transport: "redondo",
      languages: ["inglés", "español"],
      includes: [
        "Cuota de Conservación (Incluida)",
        "Transportación redonda desde tu hotel",
        "3 Cenotes (con Cascada, Tirolesa y Caverna)",
        "Chaleco salvavidas",
        "Guías especializados y bilingües",
        "Degustación de Tequila (en el Cenote)",
        "Show Regional"
      ],
      notIncluded: [
        "Fotografías profesionales (disponibles para compra)",
        "Propinas",
        "Souvenirs"
      ],
    },
    "snorkeling-adventure": {
      title: "Snorkeling Adventure",
      subtitle: "Snorkel en el Gran Arrecife Maya",
      description: "Snorkel en el arrecife más grande de 'Las Américas'",
      duration: "4 horas",
      transport: "redondo",
      languages: ["inglés", "español"],
      includes: [
        "Snorkel en el Arrecife",
        "Snack en un Restaurante Frente a la Playa",
        "Tour guiado por Puerto Morelos",
        "Degustación de Tequila"
      ],
    },
    "private-snorkeling": {
      title: "Private Snorkeling",
      subtitle: "Paseo privado en bote y Snorkel en Puerto Morelos",
      description: "Experiencia exclusiva en bote privado con snorkel en Puerto Morelos",
      duration: "4 horas",
      transport: "redondo",
      languages: ["inglés", "español"],
      includes: [
        "Bebidas ilimitadas en el bote",
        "Check-in prioritario",
        "Bote privado reservado para tu grupo",
        "Ceviche fresco servido a bordo",
        "Comida VIP: 4 tacos y 2 bebidas"
      ],
    },
    "city-taco-tour": {
      title: "Beach Taco Tour",
      subtitle: "Tacos junto a la playa y tour con degustación de tequila",
      description: "Experiencia Gastronómica junto a la Playa en Puerto Morelos (Desde Cancún)",
      duration: "4 horas",
      transport: "redondo",
      languages: ["inglés", "español"],
      includes: [
        "3 lugares de tacos",
        "Paseo por Puerto Morelos",
        "Helado",
        "Compras en 'Mi Pueblito Mall'",
        "Degustación de Tequila"
      ],
    },
    "wave-runner": {
      title: "Puerto Maya Wave Runner",
      subtitle: "Adrenalina sobre la Laguna Nichupté",
      description: "Comienza tu aventura con una bienvenida y briefing de seguridad de guías expertos. Después de recibir instrucciones y equipo, explora la hermosa Laguna Nichupté rodeada de manglares y vida silvestre tropical. Siente la adrenalina mientras recorres aguas abiertas en motos acuáticas fáciles de manejar en un entorno seguro y controlado. Termina tu experiencia en la marina con acceso a duchas, baños, tiendas artesanales y el restaurante Mayan Lounge.",
      duration: "30 min – 1 hora",
      transport: "No incluido",
      languages: ["inglés", "español"],
      includes: [
        "Moto acuática individual o doble",
        "Chaleco salvavidas",
        "Servicio de casilleros (se requiere ID)",
      ],
      notIncluded: [
        "Toalla",
        "Impuesto de muelle: $10 USD",
        "Servicio de fotos",
        "Souvenirs, artesanías y bebidas adicionales",
        "Propinas",
      ],
      importantInfo: [
        "Edad mínima para participar: 13 años",
        "Edad mínima para conducir: 18 años",
        "Peso máximo: 120 kg",
        "Llegar 15 minutos antes de la salida",
        "Menores deben ir acompañados de un adulto",
        "No recomendado para mujeres embarazadas, personas con problemas cardíacos, limitaciones físicas severas o bajo influencia de alcohol/drogas",
      ],
      whatToBring: [
        "Tarjeta de crédito o efectivo para fotos, souvenirs, propinas",
        "Gorra o lentes de sol",
        "Protector solar biodegradable y repelente de insectos",
      ],
    },
    "mayan-jungle-tour": {
      title: "Mayan Jungle Tour",
      subtitle: "Lancha rápida, snorkel y ceremonia maya sagrada",
      description: "Comienza tu viaje en un sitio sagrado del Calendario Maya, donde un guía explica sus ciclos solares y significado espiritual mientras participas en una experiencia ceremonial. Camina por el Sendero Maya junto a guerreros mayas, cruza puentes colgantes y explora réplicas de templos antiguos. Conduce tu propia lancha rápida por los manglares de la Laguna Nichupté antes de hacer snorkel en el Arrecife Punta Nizuc, parte del segundo sistema de arrecifes de coral más grande del mundo. Concluye con una comida tradicional maya regional y bebidas naturales refrescantes.",
      duration: "3 horas",
      transport: "No incluido",
      languages: ["inglés", "español"],
      includes: [
        "Lancha rápida (2 o 4 pasajeros)",
        "Equipo de snorkel",
        "Chaleco salvavidas",
        "Servicio de casilleros",
      ],
      notIncluded: [
        "Impuesto de muelle y parque marino: $20 USD",
        "Servicio de fotos",
        "Souvenirs y bebidas adicionales",
        "Propinas",
        "Transporte redondo",
        "Toalla",
      ],
      importantInfo: [
        "Edad mínima: 6 años",
        "Peso máximo: 120 kg",
        "Llegar 20 minutos antes de la salida",
        "Menores deben ir acompañados de un adulto",
        "No recomendado para mujeres embarazadas, personas con problemas cardíacos, limitaciones físicas severas o bajo influencia de alcohol/drogas",
        "Capacidad: 60 personas por horario",
      ],
      whatToBring: [
        "Tarjeta de crédito o efectivo para fotos, souvenirs, propinas",
        "Gorra o lentes de sol",
        "Traje de baño",
        "Protector solar biodegradable y repelente de insectos",
      ],
    },
    "whale-shark-snorkeling": {
      title: "Whale Shark Snorkeling Adventure",
      subtitle: "Nada junto a los gigantes gentiles del Caribe",
      description: "Navega mar adentro en el Caribe para encontrarte con el pez más grande del océano. Tras un briefing de seguridad y conservación, harás snorkel en grupos pequeños y guiados junto a los tiburones ballena en su hábitat natural, acompañado por guías certificados. El tour incluye una parada adicional de snorkel y ceviche fresco a bordo antes de regresar a tierra. Una experiencia única y estrictamente estacional, disponible de mayo a septiembre.",
      duration: "7-8 horas",
      transport: "redondo",
      languages: ["inglés", "español"],
      includes: [
        "Transporte redondo",
        "Guía bilingüe certificado",
        "Equipo de snorkel y chaleco salvavidas",
        "Nado con tiburón ballena en grupos pequeños",
        "Parada adicional de snorkel",
        "Ceviche fresco, snacks y bebidas a bordo",
        "Brazalete del parque marino",
      ],
      notIncluded: [
        "Servicio de fotos y video",
        "Propinas",
        "Souvenirs y bebidas adicionales",
      ],
      importantInfo: [
        "Tour estacional: disponible solo de mayo a septiembre",
        "Edad mínima: 5 años",
        "Los pasajeros deben saber nadar",
        "La salida es temprano por la mañana; favor de llegar puntual",
        "Solo se permite protector solar biodegradable",
        "No recomendado para mujeres embarazadas o personas propensas al mareo",
        "Sujeto a condiciones climáticas y de la autoridad marítima",
      ],
      whatToBring: [
        "Traje de baño y toalla",
        "Protector solar biodegradable",
        "Gorra y lentes de sol",
        "Cambio de ropa",
        "Efectivo o tarjeta para fotos, souvenirs y propinas",
      ],
    },
    "extreme-snorkeling-package": {
      title: "Extreme Adventuring + Snorkeling Adventure Package",
      subtitle: "Paquete Extreme Adventuring",
      description: "El combo definitivo: aventura en ATV por la selva y snorkel en el Caribe",
      duration: "8 horas",
      transport: "redondo",
      languages: ["inglés", "español"],
      includes: [
        "Aventura en ATV por la selva",
        "Snorkel en el Caribe",
        "Visita a cenote",
        "Circuito de tirolesas",
        "Snack junto a la playa",
        "Degustación de Tequila",
        "Espectáculo Maya"
      ],
      familyNote: {
        title: "¿Viajas con niños?",
        items: [
          {
            label: "Parque",
            text: "Los niños deben tener al menos 4 años y estar acompañados por un adulto que también haya comprado su entrada al parque.",
          },
          {
            label: "Snorkel",
            text: "Los niños pueden participar desde los 8 años, con un adulto que los acompañe en todo momento.",
          },
          {
            label: "ATV",
            text: "Los niños pueden ir en las cuatrimotos solo como pasajeros.",
          },
        ],
        footer: "¿Preguntas? Contáctanos, con gusto te ayudamos.",
      },
    },
    "full-experience-two-days": {
      title: "Full Experience Adventure Two Days ATV Package",
      subtitle: "Paquete Extreme Adventuring",
      description: "Dos días de pura aventura: explora cenotes, senderos en la selva y sitios mayas",
      duration: "2 días",
      transport: "redondo",
      languages: ["inglés", "español"],
      includes: [
        "2 días completos de aventura",
        "Paseo en ATV por la selva maya",
        "Visita a múltiples cenotes",
        "Circuitos de tirolesas",
        "Puentes interactivos",
        "Snacks regionales",
        "Degustación de Tequila",
        "Espectáculo Maya"
      ],
    },
    "snorkeling-cenote-package": {
      title: "Snorkeling Adventure with Cenote Adventure Package",
      subtitle: "Paquete Extreme Adventuring",
      description: "Descubre lo mejor de ambos mundos: snorkel en el Caribe y nada en cenotes mágicos",
      duration: "6 horas",
      transport: "redondo",
      languages: ["inglés", "español"],
      includes: [
        "Snorkel en el Gran Arrecife Maya",
        "3 cenotes privados",
        "Tiempo en Puerto Morelos",
        "Snack junto a la playa",
        "Degustación de Tequila"
      ],
    },
  }
};

const getTours = (language: "en" | "es"): Array<{
  id: string;
  image: string;
  galleryImages: string[];
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  transport: string;
  languages: string[];
  includes: string[];
  notIncluded?: string[];
  importantInfo?: string[];
  whatToBring?: string[];
  familyNote?: {
    title: string;
    items: { label: string; text: string }[];
    footer: string;
  };
  rating: number;
  reviews: number;
  minAge: string;
  minPeople?: string;
  schedules: string[];
}> => [
  {
    id: "extreme-adventuring",
    image: tourExtremeAtv,
    galleryImages: [
      "/tour-images/extreme-adventuring-1.png",
      "/tour-images/extreme-adventuring-2.png",
      "/tour-images/extreme-adventuring-3.png",
      "/tour-images/extreme-adventuring-4.png",
      "/tour-images/extreme-adventuring-5.png",
      "/tour-images/extreme-adventuring-6.png",
      "/tour-images/extreme-adventuring-7.png",
      "/tour-images/extreme-adventuring-8.png"
    ],
    ...tourContent[language]["extreme-adventuring"],
    rating: 5.0,
    reviews: 3692,
    minAge: "4+",
    schedules: ["09:30", "13:30"],
  },
  {
    id: "extreme-horseback-riding",
    image: tourHorseback,
    galleryImages: [
      "/tour-images/horseback-cover.jpg",
      "/tour-images/horseback-1.png",
      "/tour-images/horseback-2.png",
      "/tour-images/horseback-3.png"
    ],
    ...tourContent[language]["extreme-horseback-riding"],
    rating: 4.6,
    reviews: 1483,
    minAge: "6+",
    schedules: ["09:30", "13:30"],
  },
  {
    id: "cenote-adventuring",
    image: tourCenoteWaterfall,
    galleryImages: [
      "/tour-images/cenote-1.png",
      "/tour-images/cenote-cover.jpg",
      "/tour-images/cenote-2.png",
      "/tour-images/cenote-3.png",
      "/tour-images/cenote-4.png",
      "/tour-images/cenote-5.png"
    ],
    ...tourContent[language]["cenote-adventuring"],
    rating: 4.5,
    reviews: 1982,
    minAge: "5+",
    schedules: ["09:30", "13:30"],
  },
  {
    id: "snorkeling-adventure",
    image: "/tour-images/snorkeling-2.png",
    galleryImages: [
      "/tour-images/snorkeling-2.png",
      "/tour-images/snorkeling-1.png",
      tourSnorkelReef,
      "/tour-images/snorkeling-3.png",
      "/tour-images/snorkeling-4.png"
    ],
    ...tourContent[language]["snorkeling-adventure"],
    rating: 4.7,
    reviews: 1057,
    minAge: "6+",
    schedules: ["10:00", "14:00"],
  },
  {
    id: "private-snorkeling",
    image: "/tour-images/snorkeling-2.png",
    galleryImages: [
      "/tour-images/snorkeling-2.png",
      "/tour-images/snorkeling-1.png",
      tourSnorkelReef,
      "/tour-images/snorkeling-3.png",
      "/tour-images/snorkeling-4.png"
    ],
    ...tourContent[language]["private-snorkeling"],
    rating: 4.8,
    reviews: 892,
    minAge: "6+",
    minPeople: "Min. 6 people",
    schedules: ["10:00", "14:00"],
  },
  {
    id: "city-taco-tour",
    image: tourTacos,
    galleryImages: [
      tourTacos,
      "/tour-images/taco-1.png",
      "/tour-images/taco-2.png",
      "/tour-images/taco-3.png",
      "/tour-images/taco-4.png",
      "/tour-images/taco-5.png"
    ],
    ...tourContent[language]["city-taco-tour"],
    rating: 4.5,
    reviews: 1548,
    minAge: "5+",
    schedules: ["10:00", "14:00"],
  },
  {
    id: "wave-runner",
    image: "/tour-images/wave-runner-1.jpeg",
    galleryImages: [
      "/tour-images/wave-runner-1.jpeg",
      "/tour-images/wave-runner-2.jpeg",
      "/tour-images/wave-runner-3.jpeg",
      "/tour-images/wave-runner-4.jpeg",
      "/tour-images/wave-runner-5.jpeg",
      "/tour-images/wave-runner-6.jpeg",
    ],
    ...tourContent[language]["wave-runner"],
    rating: 4.7,
    reviews: 1245,
    minAge: "13+",
    schedules: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"],
  },
  {
    id: "mayan-jungle-tour",
    image: "/tour-images/mayan-jungle-tour-1.jpeg",
    galleryImages: [
      "/tour-images/mayan-jungle-tour-1.jpeg",
      "/tour-images/mayan-jungle-tour-2.jpeg",
      "/tour-images/mayan-jungle-tour-3.jpeg",
      "/tour-images/mayan-jungle-tour-4.jpeg",
      "/tour-images/mayan-jungle-tour-5.jpeg",
      "/tour-images/mayan-jungle-tour-6.jpeg",
      "/tour-images/mayan-jungle-tour-7.jpeg",
      "/tour-images/mayan-jungle-tour-8.jpeg",
    ],
    ...tourContent[language]["mayan-jungle-tour"],
    rating: 4.6,
    reviews: 1832,
    minAge: "6+",
    schedules: ["09:00", "11:00", "13:00", "15:00"],
  },
  {
    id: "whale-shark-snorkeling",
    image: whaleSharkCover,
    galleryImages: whaleSharkGallery,
    ...tourContent[language]["whale-shark-snorkeling"],
    rating: 4.9,
    reviews: 742,
    minAge: "5+",
    schedules: ["07:00"],
  },
  {
    id: "extreme-snorkeling-package",
    image: "/tour-images/extreme-combo-1.png",
    galleryImages: [
      "/tour-images/extreme-combo-1.png",
      "/tour-images/extreme-combo-2.png",
      "/tour-images/extreme-combo-3.png",
      "/tour-images/extreme-combo-4.png",
      "/tour-images/extreme-combo-5.png",
      "/tour-images/extreme-combo-6.png"
    ],
    ...tourContent[language]["extreme-snorkeling-package"],
    rating: 4.8,
    reviews: 892,
    minAge: "4+",
    schedules: ["09:30"],
  },
  {
    id: "full-experience-two-days",
    image: "/tour-images/extreme-adventuring-1.png",
    galleryImages: [
      "/tour-images/extreme-adventuring-1.png",
      "/tour-images/cenote-1.png",
      "/tour-images/extreme-adventuring-3.png"
    ],
    ...tourContent[language]["full-experience-two-days"],
    rating: 4.9,
    reviews: 634,
    minAge: "6+",
    schedules: ["09:30"],
  },
  {
    id: "snorkeling-cenote-package",
    image: "/tour-images/snorkeling-2.png",
    galleryImages: [
      "/tour-images/snorkeling-2.png",
      "/tour-images/cenote-1.png",
      "/tour-images/snorkeling-3.png"
    ],
    ...tourContent[language]["snorkeling-cenote-package"],
    rating: 4.7,
    reviews: 1124,
    minAge: "5+",
    schedules: ["09:30", "13:30"],
  },
];

export default function TourDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const t = translations[language];
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>();

  const tours = getTours(language);
  const tour = tours.find((t) => t.id === id);
  
  // Get pricing from centralized config
  const tourPricing = id ? getTourPricing(id) : undefined;

  if (!tour) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar language={language} onLanguageChange={setLanguage} />
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold mb-4">{t.tourNotFound}</h1>
          <Button onClick={() => navigate("/tours")}>{t.backToTours}</Button>
        </div>
        <Footer language={language} />
      </div>
    );
  }

  // Log warning if pricing is missing
  if (!tourPricing) {
    console.warn(`[PRICING WARNING] Missing pricing config for tour: ${id}`);
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${tour.title} | Margea Tours`}
        description={(tour.description || `${tour.title} — book a Riviera Maya tour direct with Margea. Instant confirmation.`).slice(0, 160)}
        path={`/tours/${id}`}
        image={tour.image}
        type="product"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: tour.title,
          description: tour.description,
          image: tour.image,
          brand: { "@type": "Brand", name: "Margea Travel" },
          ...(tourPricing && tourPricing.variants?.[0] && {
            offers: {
              "@type": "Offer",
              priceCurrency: tourPricing.currency || "USD",
              price: String(tourPricing.variants[0].adultPrice),
              availability: "https://schema.org/InStock",
              url: `https://margeatravel.com/tours/${id}`,
            },
          }),
        }}
      />
      <Navbar language={language} onLanguageChange={setLanguage} />
      
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/tours")}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.backToTours}
          </Button>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Image and Info */}
            <div className="space-y-6">
              {/* Image Carousel */}
              {tour.galleryImages && tour.galleryImages.length > 0 ? (
                <Carousel className="w-full">
                  <CarouselContent>
                    {tour.galleryImages.map((image, index) => (
                      <CarouselItem key={index}>
                         <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                          <img
                            src={image}
                            alt={`${tour.title} - Image ${index + 1}`}
                            loading={index === 0 ? "eager" : "lazy"}
                            decoding="async"
                            fetchPriority={index === 0 ? "high" : "auto"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-4" />
                  <CarouselNext className="right-4" />
                </Carousel>
              ) : (
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                  <img
                    src={tour.image}
                    alt={tour.title}
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Title and Rating */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold flex-1">{tour.title}</h1>
                  <ShareButton title={tour.title} stopPropagation={false} />
                </div>
                <p className="text-xl text-muted-foreground mb-4">{tour.subtitle}</p>
                
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-lg">{tour.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-muted-foreground">
                    ({tour.reviews.toLocaleString()} {t.reviews})
                  </span>
                </div>

                <p className="text-lg mb-6">{tour.description}</p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t.duration}</p>
                    <p className="font-medium">{tour.duration}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t.minAge}</p>
                    <p className="font-medium">{tour.minAge}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t.schedules}</p>
                    <p className="font-medium">{tour.schedules.join(" | ")}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Bus className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t.transport}</p>
                    <p className="font-medium capitalize">{language === "en" && tour.transport === "redondo" ? "round trip" : tour.transport}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 col-span-2">
                  <Globe className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t.languages}</p>
                    <p className="font-medium capitalize">{language === "en" ? tour.languages.join(" and ") : tour.languages.join(" y ")}</p>
                  </div>
                </div>
              </div>

              {/* Includes */}
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Check className="w-5 h-5" style={{ color: '#16A34A' }} />
                  {t.includes}
                </h3>
                <ul className="space-y-2">
                  {tour.includes.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#16A34A' }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
              {/* Traveling with kids */}
              {tour.familyNote && (
                <Card
                  className="p-6"
                  style={{
                    background: 'rgba(184,151,90,0.07)',
                    borderColor: 'rgba(184,151,90,0.25)',
                  }}
                >
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Info className="w-4 h-4" style={{ color: '#b8975a' }} />
                    {tour.familyNote.title}
                  </h3>
                  <ul className="space-y-2">
                    {tour.familyNote.items.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span
                          className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                          style={{ background: '#b8975a' }}
                        />
                        <span>
                          <span className="font-medium">{item.label}:</span> {item.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm mt-4" style={{ color: '#6b7280' }}>
                    {tour.familyNote.footer}
                  </p>
                </Card>
              )}
              {/* Not Included */}
              {tour.notIncluded && tour.notIncluded.length > 0 && (
                <Card className="p-6">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <X className="w-5 h-5" style={{ color: '#DC2626' }} />
                    {t.notIncluded}
                  </h3>
                  <ul className="space-y-2">
                    {tour.notIncluded.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <X className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#DC2626' }} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {/* Important Information */}
              {tour.importantInfo && tour.importantInfo.length > 0 && (
                <Card className="p-6">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                    {t.importantInfo}
                  </h3>
                  <ul className="space-y-2">
                    {tour.importantInfo.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-amber-500 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {/* What to Bring */}
              {tour.whatToBring && tour.whatToBring.length > 0 && (
                <Card className="p-6">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Backpack className="w-5 h-5 text-primary" />
                    {t.whatToBring}
                  </h3>
                  <ul className="space-y-2">
                    {tour.whatToBring.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </div>

            {/* Right Column - Booking Module */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              {tourPricing ? (
                <TourBookingModule
                  tourId={id!}
                  tourTitle={tour.title}
                  variants={tourPricing.variants}
                  timeSlots={tourPricing.timeSlots}
                  currency={tourPricing.currency}
                  defaultVariantId={selectedVariantId}
                  onVariantChange={setSelectedVariantId}
                  bokunExperienceId={tourPricing.bokunExperienceId}
                  seasonMonths={tourPricing.seasonMonths}
                  seasonNote={tourPricing.seasonNote}
                />
              ) : (
                <Card className="p-6">
                  <p className="text-center text-muted-foreground">{t.pricingNotAvailable}</p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer language={language} />
    </div>
  );
}
