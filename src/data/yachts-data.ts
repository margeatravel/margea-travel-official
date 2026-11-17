export interface YachtPricing {
  duration: string;
  price: string;
  isHourly?: boolean;
  minHours?: number;
  note?: string;
}

export interface YachtContent {
  name: string;
  description: string;
  features?: string[];
}

export interface Yacht {
  id: string;
  name: string;
  marina: string;
  size: string;
  capacity: number;
  image: string;
  images?: string[];
  description: string;
  pricing: YachtPricing[];
  currency: "MXN" | "USD";
  features?: string[];
}

export const yachtContent: Record<string, { en: YachtContent; es: YachtContent }> = {
  "sea-ray-44-1": {
    en: {
      name: "Sea Ray 44 feet",
      description: "Elegant 44-foot Sea Ray perfect for celebrations and Caribbean cruises. Equipped with all amenities for an unforgettable experience.",
      features: ["Captain included", "Music", "Sun deck", "Full bathroom"],
    },
    es: {
      name: "Sea Ray 44 pies",
      description: "Elegante Sea Ray de 44 pies perfecto para celebraciones y paseos por el Caribe. Equipado con todas las comodidades para una experiencia inolvidable.",
      features: ["Capitán incluido", "Música", "Área de sol", "Baño completo"],
    },
  },
  "sea-ray-50-1": {
    en: {
      name: "Sea Ray 50 feet",
      description: "50-foot Sea Ray yacht with spacious and comfortable areas, ideal for groups looking to enjoy the sea in style.",
      features: ["Captain included", "Snorkel", "Cooler", "Sound system"],
    },
    es: {
      name: "Sea Ray 50 pies",
      description: "Yate Sea Ray de 50 pies con espacios amplios y confortables, ideal para grupos que buscan disfrutar del mar con estilo.",
      features: ["Capitán incluido", "Snorkel", "Nevera", "Sistema de audio"],
    },
  },
  "sea-ray-50-2": {
    en: {
      name: "Sea Ray 50 feet",
      description: "50-foot Sea Ray with modern design and complete equipment for a premium experience in the Mexican Caribbean.",
      features: ["Captain included", "Fishing gear", "Cooler", "Awning"],
    },
    es: {
      name: "Sea Ray 50 pies",
      description: "Sea Ray de 50 pies con diseño moderno y equipamiento completo para una experiencia premium en el Caribe mexicano.",
      features: ["Capitán incluido", "Equipo de pesca", "Hielera", "Toldo"],
    },
  },
  "sea-ray-27": {
    en: {
      name: "Sea Ray 27 feet",
      description: "Compact 27-foot Sea Ray yacht, perfect for small groups seeking an intimate experience in crystal-clear waters.",
      features: ["Captain included", "Lounge area", "Bathroom", "Music system"],
    },
    es: {
      name: "Sea Ray 27 pies",
      description: "Yate compacto Sea Ray de 27 pies, perfecto para grupos pequeños que buscan una experiencia íntima en las aguas cristalinas.",
      features: ["Capitán incluido", "Área lounge", "Baño", "Sistema de música"],
    },
  },
  "sunseeker-predator-62": {
    en: {
      name: "Sunseeker Predator 62 feet",
      description: "62-foot Sunseeker Predator, sporty and luxurious. Speed and style in the Mexican Caribbean.",
      features: ["Captain included", "Sport design", "Bar", "Premium sound system"],
    },
    es: {
      name: "Sunseeker Predator 62 pies",
      description: "Sunseeker Predator de 62 pies, deportivo y lujoso. Velocidad y estilo en el Caribe mexicano.",
      features: ["Capitán incluido", "Diseño deportivo", "Bar", "Sistema de audio premium"],
    },
  },
  "avalon-115": {
    en: {
      name: "Avalon Luxury 115 feet",
      description: "The most exclusive yacht in the fleet. 115 feet of pure Avalon luxury. A world-class experience.",
      features: ["Full crew", "Multiple cabins", "Jacuzzi", "Chef included"],
    },
    es: {
      name: "Avalon Luxury 115 pies",
      description: "El yate más exclusivo de la flota. 115 pies de puro lujo Avalon. Una experiencia de nivel mundial.",
      features: ["Tripulación completa", "Múltiples camarotes", "Jacuzzi", "Chef incluido"],
    },
  },
};

export const getYachtContent = (yachtId: string, language: "en" | "es"): YachtContent => {
  return yachtContent[yachtId]?.[language] || yachtContent[yachtId]?.es;
};

export const yachts: Yacht[] = [
  {
    id: "sea-ray-44-1",
    name: "Sea Ray 44 pies",
    marina: "Cancún",
    size: "44 ft",
    capacity: 15,
    image: "/yacht-images/searay-1.jpg",
    images: [
      "/yacht-images/searay-1.jpg",
      "/yacht-images/searay-2.jpg",
      "/yacht-images/searay-3.jpg",
      "/yacht-images/searay-4.jpg",
      "/yacht-images/searay-5.jpg",
      "/yacht-images/searay-6.jpg",
    ],
    description: "Elegante Sea Ray de 44 pies perfecto para celebraciones y paseos por el Caribe. Equipado con todas las comodidades para una experiencia inolvidable.",
    pricing: [{ duration: "6 horas", price: "22,000" }],
    currency: "MXN",
    features: ["Capitán incluido", "Música", "Área de sol", "Baño completo"],
  },
  {
    id: "sea-ray-50-1",
    name: "Sea Ray 50 pies",
    marina: "Cancún",
    size: "50 ft",
    capacity: 16,
    image: "/yacht-images/searay50-1.jpg",
    images: [
      "/yacht-images/searay50-1.jpg",
      "/yacht-images/searay50-2.jpg",
      "/yacht-images/searay50-3.jpg",
      "/yacht-images/searay50-4.jpg",
      "/yacht-images/searay50-5.jpg",
      "/yacht-images/searay50-6.jpg",
      "/yacht-images/searay50-7.jpg",
    ],
    description: "Yate Sea Ray de 50 pies con espacios amplios y confortables, ideal para grupos que buscan disfrutar del mar con estilo.",
    pricing: [{ duration: "6 horas", price: "25,000" }],
    currency: "MXN",
    features: ["Capitán incluido", "Snorkel", "Nevera", "Sistema de audio"],
  },
  {
    id: "sea-ray-50-2",
    name: "Sea Ray 50 pies",
    marina: "Cancún",
    size: "50 ft",
    capacity: 16,
    image: "/yacht-images/yacht3-1.jpg",
    images: [
      "/yacht-images/yacht3-1.jpg",
      "/yacht-images/yacht3-2.jpg",
      "/yacht-images/yacht3-3.jpg",
      "/yacht-images/yacht3-4.jpg",
      "/yacht-images/yacht3-5.jpg",
      "/yacht-images/yacht3-6.jpg",
      "/yacht-images/yacht3-7.jpg",
      "/yacht-images/yacht3-8.jpg",
    ],
    description: "Sea Ray de 50 pies con diseño moderno y equipamiento completo para una experiencia premium en el Caribe mexicano.",
    pricing: [{ duration: "6 horas", price: "23,000" }],
    currency: "MXN",
    features: ["Capitán incluido", "Equipo de pesca", "Hielera", "Toldo"],
  },
  {
    id: "sea-ray-27",
    name: "Sea Ray 27 pies",
    marina: "Cancún",
    size: "27 ft",
    capacity: 10,
    image: "/yacht-images/yacht4-1.jpg",
    images: [
      "/yacht-images/yacht4-1.jpg",
      "/yacht-images/yacht4-2.jpg",
      "/yacht-images/yacht4-3.jpg",
      "/yacht-images/yacht4-4.jpg",
      "/yacht-images/yacht4-5.jpg",
    ],
    description: "Yate compacto Sea Ray de 27 pies, perfecto para grupos pequeños que buscan una experiencia íntima en las aguas cristalinas.",
    pricing: [{ duration: "6 horas", price: "15,000" }],
    currency: "MXN",
    features: ["Capitán incluido", "Área lounge", "Baño", "Sistema de música"],
  },
  {
    id: "sunseeker-predator-62",
    name: "Sunseeker Predator 62 pies",
    marina: "Cancún",
    size: "62 ft",
    capacity: 16,
    image: "/yacht-images/sunseeker62-1.jpg",
    images: [
      "/yacht-images/sunseeker62-1.jpg",
      "/yacht-images/sunseeker62-2.jpg",
      "/yacht-images/sunseeker62-3.jpg",
      "/yacht-images/sunseeker62-4.jpg",
      "/yacht-images/sunseeker62-5.jpg",
      "/yacht-images/sunseeker62-6.jpg",
      "/yacht-images/sunseeker62-7.jpg",
    ],
    description: "Sunseeker Predator de 62 pies, deportivo y lujoso. Velocidad y estilo en el Caribe mexicano.",
    pricing: [{ duration: "6 horas", price: "80,000" }],
    currency: "MXN",
    features: ["Capitán incluido", "Diseño deportivo", "Bar", "Sistema de audio premium"],
  },
  {
    id: "avalon-115",
    name: "Avalon Luxury 115 pies",
    marina: "Cancún",
    size: "115 ft",
    capacity: 25,
    image: "/yacht-images/avalon115-1.jpg",
    images: [
      "/yacht-images/avalon115-1.jpg",
      "/yacht-images/avalon115-2.jpg",
      "/yacht-images/avalon115-3.jpg",
      "/yacht-images/avalon115-4.jpg",
      "/yacht-images/avalon115-5.jpg",
      "/yacht-images/avalon115-6.jpg",
      "/yacht-images/avalon115-7.jpg",
    ],
    description: "El yate más exclusivo de la flota. 115 pies de puro lujo Avalon. Una experiencia de nivel mundial.",
    pricing: [{ duration: "6 horas", price: "300,000" }],
    currency: "MXN",
    features: ["Tripulación completa", "Múltiples camarotes", "Jacuzzi", "Chef incluido"],
  },
];
