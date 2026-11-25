import { media } from "@/lib/media";
export type VehicleCategory = 'exotic' | 'suv';

export interface ExperienceOption {
  id: string;
  name: string;
  nameEs: string;
  duration: string;
  price: number; // USD
}

export interface SuvPricing {
  hourly: number;
  daily: number; // 24 hours
}

export interface ExoticCar {
  id: string;
  name: string;
  badge?: string;
  category: VehicleCategory;
  images: string[];
  fallbackImage: string;
  // For exotic/sports cars
  experiences?: ExperienceOption[];
  // For SUVs
  suvPricing?: SuvPricing;
  // Specs
  year: number;
  vehicleType: string;
  acceleration: string; // 0-100 km/h
  passengers: number;
  deposit: number; // USD
  minAge: number;
  // Description
  description: string;
  descriptionEs: string;
}

// Experience options for exotic/sports cars
export const experienceOptions: ExperienceOption[] = [
  { id: '15min-drive', name: '15 min drive', nameEs: 'Manejo 15 min', duration: '15 min', price: 200 },
  { id: '45min-drive', name: '45 min drive', nameEs: 'Manejo 45 min', duration: '45 min', price: 510 },
  { id: '1hr-drive', name: '1 hour drive', nameEs: 'Manejo 1 hora', duration: '1 hour', price: 650 },
  { id: '1hr-passenger', name: '1 hour passenger experience', nameEs: 'Experiencia pasajero 1 hora', duration: '1 hour', price: 700 },
];

// SUV duration options
export const suvDurationOptions = [
  { id: 'hourly', name: 'Per Hour', nameEs: 'Por Hora', duration: '1 hour' },
  { id: 'daily', name: '24 Hours', nameEs: '24 Horas', duration: '24 hours' },
];

export const reservationRequirements = {
  en: [
    'Official valid ID',
    'Driver license',
    'Passport or INE',
    'Proof of accommodation',
    'Flight details (if applicable)',
    'Credit card',
  ],
  es: [
    'Identificación oficial vigente',
    'Licencia de conducir',
    'Pasaporte o INE',
    'Comprobante de hospedaje',
    'Detalles de vuelo (si aplica)',
    'Tarjeta de crédito',
  ],
};

export const exoticCars: ExoticCar[] = [
  // === EXOTIC / SPORTS CARS ===
  {
    id: 'ferrari-roma-spider',
    name: 'Ferrari Roma Spider',
    badge: 'NEW',
    category: 'exotic',
    images: [
      media('/car-images/ferrari-roma-spider.png'),
    ],
    fallbackImage: media('/car-images/ferrari-roma-spider.png'),
    experiences: experienceOptions,
    year: 2024,
    vehicleType: 'Grand Tourer',
    acceleration: '3.4s',
    passengers: 2,
    deposit: 9000,
    minAge: 30,
    description: 'A refined open-top grand tourer blending Italian elegance with a 620-hp twin-turbo V8. Designed for luxury cruising with supercar performance.',
    descriptionEs: 'Un gran turismo descapotable refinado que combina elegancia italiana con un V8 biturbo de 620 hp. Diseñado para cruceros de lujo con rendimiento de superauto.',
  },
  {
    id: 'lamborghini-huracan-tecnica',
    name: 'Lamborghini Huracan Tecnica',
    category: 'exotic',
    images: [
      media('/car-images/lamborghini-huracan.png'),
    ],
    fallbackImage: media('/car-images/lamborghini-huracan.png'),
    experiences: experienceOptions,
    year: 2023,
    vehicleType: 'Supercar',
    acceleration: '3.2s',
    passengers: 2,
    deposit: 10000,
    minAge: 30,
    description: 'A naturally aspirated V10 masterpiece celebrating Lamborghini\'s racing heritage with razor-sharp handling and iconic design.',
    descriptionEs: 'Una obra maestra V10 atmosférico que celebra la herencia de carreras de Lamborghini con manejo preciso y diseño icónico.',
  },
  {
    id: 'mclaren-750s',
    name: 'McLaren 750S',
    category: 'exotic',
    images: [
      media('/car-images/mclaren-750s.png'),
    ],
    fallbackImage: media('/car-images/mclaren-750s.png'),
    experiences: experienceOptions,
    year: 2024,
    vehicleType: 'Supercar',
    acceleration: '2.8s',
    passengers: 2,
    deposit: 10000,
    minAge: 30,
    description: 'An ultra-lightweight British supercar delivering extreme aerodynamics, precision handling, and blistering acceleration.',
    descriptionEs: 'Un superauto británico ultraligero con aerodinámica extrema, manejo de precisión y aceleración fulminante.',
  },
  {
    id: 'porsche-911-targa-4s',
    name: 'Porsche 911 Targa 4S',
    category: 'exotic',
    images: [
      media('/car-images/porsche-911-targa.png'),
    ],
    fallbackImage: media('/car-images/porsche-911-targa.png'),
    experiences: experienceOptions,
    year: 2021,
    vehicleType: 'Sports Car',
    acceleration: '3.6s',
    passengers: 2,
    deposit: 7000,
    minAge: 30,
    description: 'A timeless convertible icon combining everyday usability with 443-hp performance and legendary Porsche engineering.',
    descriptionEs: 'Un ícono convertible atemporal que combina usabilidad diaria con 443 hp y la legendaria ingeniería Porsche.',
  },
  {
    id: 'bmw-4-series-convertible',
    name: 'BMW 4 Series Convertible (M Sport)',
    category: 'exotic',
    images: [
      media('/car-images/bmw-4-series-convertible.png'),
    ],
    fallbackImage: media('/car-images/bmw-4-series-convertible.png'),
    experiences: experienceOptions,
    year: 2024,
    vehicleType: 'Sport / Convertible',
    acceleration: '5.8s',
    passengers: 4,
    deposit: 5000,
    minAge: 30,
    description: 'A refined convertible blending German engineering with sporty elegance. Perfect for coastal drives, offering smooth performance, premium comfort, and open-top freedom.',
    descriptionEs: 'Un convertible refinado que combina ingeniería alemana con elegancia deportiva. Perfecto para paseos costeros, ofreciendo rendimiento suave, confort premium y libertad a cielo abierto.',
  },

  // === SUVs ===
  {
    id: 'mercedes-amg-g63s',
    name: 'Mercedes-Benz AMG G63S',
    badge: 'POPULAR',
    category: 'suv',
    images: [
      media('/car-images/mercedes-g63.png'),
    ],
    fallbackImage: media('/car-images/mercedes-g63.png'),
    suvPricing: {
      hourly: 250,
      daily: 1200,
    },
    year: 2024,
    vehicleType: 'Luxury SUV',
    acceleration: '4.5s',
    passengers: 5,
    deposit: 7000,
    minAge: 25,
    description: 'A bold luxury SUV pairing handcrafted V8 power with commanding presence and premium comfort.',
    descriptionEs: 'Un SUV de lujo audaz que combina un V8 artesanal con presencia imponente y confort premium.',
  },
  {
    id: 'mercedes-gle-450-coupe',
    name: 'Mercedes-Benz GLE 450 4MATIC Coupe',
    category: 'suv',
    images: [
      media('/car-images/mercedes-gle-450.png'),
    ],
    fallbackImage: media('/car-images/mercedes-gle-450.png'),
    suvPricing: {
      hourly: 180,
      daily: 480,
    },
    year: 2023,
    vehicleType: 'SUV Coupe',
    acceleration: '5.7s',
    passengers: 5,
    deposit: 5000,
    minAge: 25,
    description: 'A sleek SUV coupe balancing modern design, turbocharged performance, and refined interior comfort.',
    descriptionEs: 'Un SUV coupé elegante que equilibra diseño moderno, rendimiento turbo y confort interior refinado.',
  },
  {
    id: 'range-rover-autobiography',
    name: 'Range Rover Autobiography 50th Anniversary',
    category: 'suv',
    images: [
      media('/car-images/range-rover-autobiography.png'),
    ],
    fallbackImage: media('/car-images/range-rover-autobiography.png'),
    suvPricing: {
      hourly: 200,
      daily: 900,
    },
    year: 2021,
    vehicleType: 'Luxury SUV',
    acceleration: '5.4s',
    passengers: 5,
    deposit: 5000,
    minAge: 25,
    description: 'A heritage luxury SUV offering exceptional comfort, advanced technology, and understated prestige.',
    descriptionEs: 'Un SUV de lujo patrimonial que ofrece confort excepcional, tecnología avanzada y prestigio discreto.',
  },
];

// Helper to get cars by category
export const getExoticCars = () => exoticCars.filter(car => car.category === 'exotic');
export const getSuvCars = () => exoticCars.filter(car => car.category === 'suv');
