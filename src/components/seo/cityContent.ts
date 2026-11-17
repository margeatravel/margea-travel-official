// City-specific content for SEO pages

export interface CityContentData {
  cityName: string;
  citySlug: string;
  heroImage: string;
  content: {
    en: {
      discoverTitle: string;
      sections: Array<{
        title: string;
        paragraphs: string[];
      }>;
    };
    es: {
      discoverTitle: string;
      sections: Array<{
        title: string;
        paragraphs: string[];
      }>;
    };
  };
}

export const cityContentData: Record<string, CityContentData> = {
  tulum: {
    cityName: "Tulum",
    citySlug: "tulum",
    heroImage: "/property-images/tulum-1.jpg",
    content: {
      en: {
        discoverTitle: "Discover Tulum, Mexico",
        sections: [
          {
            title: "Tulum's Beaches & Mayan Ruins",
            paragraphs: [
              "Tulum is where ancient Mayan history meets bohemian beach culture on Mexico's Caribbean coast. Located 80 miles south of Cancun, Tulum has evolved from a backpacker haven into a world-class destination offering everything from eco-chic beach clubs to luxury jungle retreats, all while maintaining its laid-back mystique.",
              "The town's most iconic attraction is the Tulum Archaeological Site—cliff-top Mayan ruins overlooking the turquoise Caribbean. These 13th-century ruins are among the most photographed in Mexico, offering both historical significance and stunning beach views. Below the ruins, Playa Ruinas beach provides swimming and snorkeling in calm, protected waters."
            ]
          },
          {
            title: "Beach Zone vs Town",
            paragraphs: [
              "Tulum splits into two distinct areas. The Beach Zone (Zona Hotelera) stretches along several miles of pristine coastline, featuring upscale beach clubs, boutique hotels, and wellness retreats. The beach road is famous for its Instagram-worthy beach clubs like Papaya Playa Project and Nomade, where you can spend entire days lounging on daybeds, practicing yoga, and enjoying fresh seafood.",
              "Tulum Town (Pueblo), located inland along Highway 307, offers more affordable accommodations, authentic Mexican restaurants, and local shops. The town maintains a more residential feel with grocery stores, pharmacies, and everyday services. Many vacation rentals in Tulum Town provide excellent value while being just a 5-10 minute drive to the beach."
            ]
          },
          {
            title: "Vacation Rentals & Property Types",
            paragraphs: [
              "Tulum vacation rentals range from jungle bungalows with open-air showers to modern beachfront villas with infinity pools. Beach Zone properties offer direct sand access and proximity to beach clubs, while Tulum Town rentals provide more space and better value. Many properties feature palapa roofs, outdoor living areas, and cenote-style pools that blend with the natural environment.",
              "The area provides easy access to adventure activities. Cenotes like Gran Cenote and Dos Ojos offer world-class snorkeling and diving in crystal-clear freshwater. The Sian Ka'an Biosphere Reserve, a UNESCO World Heritage site just south of Tulum, features pristine jungle, lagoons, and wildlife including manatees and dolphins. Playa del Carmen is 45 minutes north, while Akumal's turtle bays are just 20 minutes away."
            ]
          },
          {
            title: "Best Time to Visit & Travel Logistics",
            paragraphs: [
              "Weather in Tulum is warm year-round (75-90°F). The dry season (November-April) brings perfect beach weather but also peak crowds and prices. Summer and fall offer lower rates and fewer tourists, though afternoon rain showers are common. Hurricane season runs June-November but direct hits are relatively rare.",
              "Tulum vacation rentals typically require 3-7 night minimum stays. Weekly rentals offer the best value, especially during high season (December-April and July-August). Properties near the beach zone book months in advance, while Tulum Town rentals often have better availability. Booking direct with local property managers ensures transparent pricing, responsive support, and no platform fees."
            ]
          }
        ]
      },
      es: {
        discoverTitle: "Descubre Tulum, México",
        sections: [
          {
            title: "Playas y Ruinas Mayas de Tulum",
            paragraphs: [
              "Tulum es donde la antigua historia maya se encuentra con la cultura bohemia de playa en la costa caribeña de México. Ubicado a 130 km al sur de Cancún, Tulum ha evolucionado de un refugio de mochileros a un destino de clase mundial.",
              "La atracción más icónica del pueblo es el Sitio Arqueológico de Tulum—ruinas mayas en lo alto de acantilados con vista al Caribe turquesa. Estas ruinas del siglo XIII están entre las más fotografiadas de México."
            ]
          },
          {
            title: "Zona de Playa vs Pueblo",
            paragraphs: [
              "Tulum se divide en dos áreas distintas. La Zona de Playa (Zona Hotelera) se extiende a lo largo de varios kilómetros de costa prístina, con beach clubs de lujo, hoteles boutique y retiros de bienestar.",
              "Tulum Pueblo, ubicado tierra adentro a lo largo de la Carretera 307, ofrece alojamientos más económicos, restaurantes mexicanos auténticos y tiendas locales."
            ]
          },
          {
            title: "Alquileres Vacacionales y Tipos de Propiedades",
            paragraphs: [
              "Los alquileres vacacionales en Tulum van desde bungalows en la selva con duchas al aire libre hasta modernas villas frente al mar con piscinas infinitas.",
              "El área proporciona fácil acceso a actividades de aventura. Cenotes como Gran Cenote y Dos Ojos ofrecen snorkel y buceo de clase mundial en agua dulce cristalina."
            ]
          },
          {
            title: "Mejor Época para Visitar y Logística de Viaje",
            paragraphs: [
              "El clima en Tulum es cálido todo el año (24-32°C). La temporada seca (noviembre-abril) trae clima perfecto de playa pero también más multitudes y precios altos.",
              "Los alquileres vacacionales en Tulum típicamente requieren estadías mínimas de 3-7 noches. Los alquileres semanales ofrecen el mejor valor."
            ]
          }
        ]
      }
    }
  },
  "playa-del-carmen": {
    cityName: "Playa del Carmen",
    citySlug: "playa-del-carmen",
    heroImage: "/property-images/nickprice-1.jpg",
    content: {
      en: {
        discoverTitle: "Discover Playa del Carmen, Mexico",
        sections: [
          {
            title: "Fifth Avenue & Beach Culture",
            paragraphs: [
              "Playa del Carmen, or simply \"Playa,\" is the vibrant heart of the Riviera Maya. Located 45 miles south of Cancun, Playa combines urban energy with beach paradise—offering world-class restaurants, nightlife, and shopping alongside miles of white sand beaches and crystal-clear Caribbean waters.",
              "The town's main artery, Fifth Avenue (Quinta Avenida), is a pedestrian walkway stretching dozens of blocks parallel to the beach. Lined with boutiques, restaurants, beach clubs, and bars, Fifth Avenue pulses with activity from morning coffee to late-night dancing. The southern end features upscale shops and rooftop restaurants, while the northern section maintains a more laid-back, local vibe."
            ]
          },
          {
            title: "Neighborhoods & Beach Zones",
            paragraphs: [
              "Playa del Carmen divides into several distinct neighborhoods. Playacar, the gated residential community south of downtown, features luxury homes, golf courses, and quiet beaches away from crowds. The Centro area near Fifth Avenue offers walkability to everything, with vacation rentals in mid-rise buildings and townhouse complexes.",
              "North of downtown, areas like Colosio provide more affordable rentals while still being just minutes from the action. Many properties here feature pools, modern amenities, and easy access to beaches less crowded than the main tourist zones. The beach stretches for miles, with each section having its own character—from family-friendly Mamitas Beach to the upscale beach clubs of Playacar."
            ]
          },
          {
            title: "Vacation Rentals & Property Types",
            paragraphs: [
              "Playa del Carmen vacation rentals range from downtown condos walking distance to everything, to beachfront villas in Playacar with private pools and direct sand access. Many properties in newer developments feature rooftop pools, parking, and modern kitchens. The variety makes Playa ideal for any budget—from affordable studios to luxury penthouses.",
              "The location serves as the perfect base for exploring the Riviera Maya. Cozumel is a 45-minute ferry ride away, offering world-class scuba diving. Tulum's ruins and beaches are 45 minutes south. Cenotes like Chaak Tun and Rio Secreto are within 30 minutes. Xcaret, Xel-Ha, and other eco-parks are all easily accessible. The Cancun airport is just 35 minutes north via highway."
            ]
          },
          {
            title: "Best Time to Visit & Travel Logistics",
            paragraphs: [
              "Weather in Playa del Carmen is consistently warm (75-90°F year-round). High season (December-April) brings perfect beach weather but also peak crowds and prices, especially around spring break (March-April). Summer offers lower rates and fewer tourists, though humidity is higher and afternoon rain showers are common.",
              "Playa del Carmen vacation rentals typically require 3-7 night minimum stays. Weekly rentals provide the best value. Properties near Fifth Avenue book quickly during holidays and spring break, so reserve 3-6 months ahead for these periods. Off-season (May-June, September-November) offers deals and better availability. Booking direct with local managers means transparent pricing, no surprise fees, and 24/7 local support."
            ]
          }
        ]
      },
      es: {
        discoverTitle: "Descubre Playa del Carmen, México",
        sections: [
          {
            title: "Quinta Avenida y Cultura de Playa",
            paragraphs: [
              "Playa del Carmen, o simplemente \"Playa,\" es el corazón vibrante de la Riviera Maya. Ubicada a 70 km al sur de Cancún, Playa combina energía urbana con paraíso de playa.",
              "La arteria principal del pueblo, la Quinta Avenida, es un paseo peatonal que se extiende por docenas de cuadras paralelo a la playa. Llena de boutiques, restaurantes, beach clubs y bares."
            ]
          },
          {
            title: "Vecindarios y Zonas de Playa",
            paragraphs: [
              "Playa del Carmen se divide en varios vecindarios distintos. Playacar, la comunidad residencial cerrada al sur del centro, cuenta con casas de lujo, campos de golf y playas tranquilas.",
              "Al norte del centro, áreas como Colosio ofrecen alquileres más económicos mientras siguen estando a solo minutos de la acción."
            ]
          },
          {
            title: "Alquileres Vacacionales y Tipos de Propiedades",
            paragraphs: [
              "Los alquileres vacacionales en Playa del Carmen van desde condominios en el centro a poca distancia de todo, hasta villas frente al mar en Playacar con piscinas privadas.",
              "La ubicación sirve como la base perfecta para explorar la Riviera Maya. Cozumel está a 45 minutos en ferry, ofreciendo buceo de clase mundial."
            ]
          },
          {
            title: "Mejor Época para Visitar y Logística de Viaje",
            paragraphs: [
              "El clima en Playa del Carmen es consistentemente cálido (24-32°C todo el año). La temporada alta (diciembre-abril) trae clima perfecto de playa pero también más multitudes.",
              "Los alquileres vacacionales en Playa del Carmen típicamente requieren estadías mínimas de 3-7 noches. Los alquileres semanales proporcionan el mejor valor."
            ]
          }
        ]
      }
    }
  },
  cancun: {
    cityName: "Cancun",
    citySlug: "cancun",
    heroImage: "/property-images/cancun-estate-1.jpg",
    content: {
      en: {
        discoverTitle: "Discover Cancun, Mexico",
        sections: [
          {
            title: "Hotel Zone & Downtown Cancun",
            paragraphs: [
              "Cancun is Mexico's most famous Caribbean destination, attracting millions of visitors annually to its white sand beaches, turquoise waters, and year-round sunshine. The city divides into two distinct areas: the Hotel Zone (Zona Hotelera) and Downtown Cancun (Centro), each offering different experiences and vacation rental options.",
              "The Hotel Zone stretches along a 14-mile sandbar shaped like a \"7,\" with the Caribbean Sea on one side and Nichupte Lagoon on the other. This area features all-inclusive resorts, beach clubs, shopping malls, and nightlife, but also includes residential condos and vacation rentals offering direct beach access. The Hotel Zone's beaches rank among the Caribbean's finest, with powdery white sand and calm, swimmable waters perfect for families."
            ]
          },
          {
            title: "Neighborhoods & Property Areas",
            paragraphs: [
              "Downtown Cancun, where locals live and work, offers authentic Mexican culture, affordable restaurants, and local markets. Vacation rentals in Centro provide significantly better value than Hotel Zone properties while being just 15-20 minutes from the beach via taxi or bus. Many downtown rentals feature modern amenities, pools, and easy access to grocery stores and services.",
              "Puerto Cancun, a master-planned marina community, offers luxury vacation rentals, golf courses, and waterfront dining. This area provides a quieter, more upscale alternative to the Hotel Zone's party atmosphere while maintaining beach access and resort amenities. Isla Mujeres, visible from Cancun's shores, is accessible via a 20-minute ferry for day trips or overnight stays."
            ]
          },
          {
            title: "Vacation Rentals & Property Types",
            paragraphs: [
              "Cancun vacation rentals range from Hotel Zone condos with resort amenities and beach access to downtown apartments offering local living at lower prices. Hotel Zone properties often include access to beach clubs, restaurants, and water sports. Many buildings feature pools, gyms, and security. Downtown rentals provide more space for the money and authentic neighborhood experiences.",
              "Cancun serves as the gateway to the Riviera Maya. Chichen Itza, one of the New Seven Wonders of the World, is a 2.5-hour drive inland. Isla Mujeres and Cozumel offer excellent snorkeling and diving. Xcaret, Xel-Ha, and other eco-parks are within an hour south. Playa del Carmen is 45 minutes away, Tulum 90 minutes. The entire region is easily accessible from Cancun's central location."
            ]
          },
          {
            title: "Best Time to Visit & Travel Logistics",
            paragraphs: [
              "Cancun's weather is consistently warm (75-90°F) year-round. Peak season (December-April) brings perfect beach weather, lowest rainfall, and the most crowds. Spring break (March-April) sees the highest prices and most party atmosphere, especially in the Hotel Zone. Summer months offer lower rates but higher humidity and afternoon rain showers.",
              "Hurricane season officially runs June-November, with September and October being the most active months. However, direct hits are relatively rare, and many travelers take advantage of off-season deals during these months. Cancun vacation rentals typically require 3-7 night minimum stays. Hotel Zone properties book far in advance for holidays and spring break. Downtown rentals often have better availability and more flexible booking windows. Booking direct with local property managers ensures transparent pricing, no platform fees, and 24/7 support from people who live in Cancun."
            ]
          }
        ]
      },
      es: {
        discoverTitle: "Descubre Cancún, México",
        sections: [
          {
            title: "Zona Hotelera y Centro de Cancún",
            paragraphs: [
              "Cancún es el destino caribeño más famoso de México, atrayendo millones de visitantes anualmente a sus playas de arena blanca, aguas turquesas y sol durante todo el año.",
              "La Zona Hotelera se extiende a lo largo de 22 km en forma de \"7,\" con el Mar Caribe de un lado y la Laguna Nichupté del otro."
            ]
          },
          {
            title: "Vecindarios y Áreas de Propiedades",
            paragraphs: [
              "El Centro de Cancún, donde viven y trabajan los locales, ofrece cultura mexicana auténtica, restaurantes económicos y mercados locales.",
              "Puerto Cancún, una comunidad marina planificada, ofrece alquileres vacacionales de lujo, campos de golf y restaurantes frente al agua."
            ]
          },
          {
            title: "Alquileres Vacacionales y Tipos de Propiedades",
            paragraphs: [
              "Los alquileres vacacionales en Cancún van desde condominios en la Zona Hotelera con amenidades de resort y acceso a la playa hasta departamentos en el centro que ofrecen vida local a precios más bajos.",
              "Cancún sirve como la puerta de entrada a la Riviera Maya. Chichén Itzá, una de las Nuevas Siete Maravillas del Mundo, está a 2.5 horas en auto tierra adentro."
            ]
          },
          {
            title: "Mejor Época para Visitar y Logística de Viaje",
            paragraphs: [
              "El clima de Cancún es consistentemente cálido (24-32°C) todo el año. La temporada alta (diciembre-abril) trae clima perfecto de playa, menor lluvia y más multitudes.",
              "Los alquileres vacacionales en Cancún típicamente requieren estadías mínimas de 3-7 noches. Las propiedades de la Zona Hotelera se reservan con mucha anticipación para días festivos."
            ]
          }
        ]
      }
    }
  },
  "puerto-morelos": {
    cityName: "Puerto Morelos",
    citySlug: "puerto-morelos",
    heroImage: "/property-images/puerto-morelos-1.jpg",
    content: {
      en: {
        discoverTitle: "Discover Puerto Morelos, Mexico",
        sections: [
          {
            title: "The Hidden Gem Between Cancun & Playa",
            paragraphs: [
              "Puerto Morelos is a charming fishing village that has retained its authentic Mexican character despite being sandwiched between mega-resorts of Cancun (20 miles north) and the bustling streets of Playa del Carmen (20 miles south). This laid-back town offers the perfect blend of local culture, pristine beaches, and easy access to Riviera Maya attractions without the crowds or commercialization.",
              "The town's main plaza, just steps from the beach, features the iconic leaning lighthouse—tilted by Hurricane Beulah in 1967 and left as is, now a beloved town symbol. The plaza comes alive in evenings with local families, street vendors selling fresh coconuts, and restaurants serving authentic Mexican cuisine. Unlike tourist-heavy destinations, Puerto Morelos maintains a residential feel where expats and locals mix freely."
            ]
          },
          {
            title: "National Marine Park & Reef",
            paragraphs: [
              "Puerto Morelos sits on the Mesoamerican Barrier Reef, the second-largest reef system in the world. The reef lies just 1,800 feet offshore, making Puerto Morelos one of the best snorkeling destinations in Mexico. The entire reef area is protected as a National Marine Park, ensuring healthy coral and abundant marine life including sea turtles, rays, and colorful tropical fish.",
              "The shallow reef makes it ideal for families and beginner snorkelers. Local cooperatives run snorkel tours directly from the beach at reasonable prices. Unlike crowded snorkel tours in Cancun or Playa, Puerto Morelos offers intimate experiences with small groups. The reef also protects the shore from strong waves, creating calm, swimmable beaches perfect for children."
            ]
          },
          {
            title: "Vacation Rentals & Property Types",
            paragraphs: [
              "Puerto Morelos vacation rentals range from beachfront condos with reef views to jungle properties with private pools. The town's small size means everything is walkable—most rentals are within 5-10 minutes of the plaza and beach. Properties here offer better value than Cancun or Playa, with larger spaces and more authentic Mexican architecture featuring palapas, outdoor living areas, and local artisan touches.",
              "Many rentals cater to long-term visitors and snowbirds, offering monthly discounts and fully equipped kitchens. The town's slower pace and strong expat community make it ideal for extended stays. Weekly farmers markets, yoga classes, and community events provide opportunities to connect with residents. The location provides easy access to attractions while avoiding tourist crowds. Cancun Airport is just 20 minutes north—the closest beach town to the airport."
            ]
          },
          {
            title: "Best Time to Visit & Travel Logistics",
            paragraphs: [
              "Puerto Morelos enjoys the same warm Caribbean climate as the rest of the Riviera Maya (75-90°F year-round). The dry season (November-April) brings perfect beach weather and is popular with Canadian and American snowbirds escaping winter. Summer and fall offer lower rates and fewer tourists, though afternoon rain showers are common.",
              "The town is much less crowded than neighboring destinations even during peak season. Winter months see more long-term rentals to snowbirds, but short-term vacation rentals remain available. Spring break brings some spillover from Cancun but Puerto Morelos maintains its quiet character. Puerto Morelos vacation rentals typically require 3-7 night minimums, with many properties offering discounts for weekly and monthly stays. Booking direct with local property managers ensures accurate listings, responsive support from people who live in town, and no platform service fees."
            ]
          }
        ]
      },
      es: {
        discoverTitle: "Descubre Puerto Morelos, México",
        sections: [
          {
            title: "La Joya Escondida Entre Cancún y Playa",
            paragraphs: [
              "Puerto Morelos es un encantador pueblo pesquero que ha conservado su carácter mexicano auténtico a pesar de estar entre los mega-resorts de Cancún (32 km al norte) y las bulliciosas calles de Playa del Carmen (32 km al sur).",
              "La plaza principal del pueblo, a pasos de la playa, presenta el icónico faro inclinado—inclinado por el Huracán Beulah en 1967 y dejado así, ahora un símbolo querido del pueblo."
            ]
          },
          {
            title: "Parque Nacional Marino y Arrecife",
            paragraphs: [
              "Puerto Morelos está sobre el Arrecife Mesoamericano, el segundo sistema de arrecifes más grande del mundo. El arrecife está a solo 550 metros de la costa, haciendo de Puerto Morelos uno de los mejores destinos de snorkel en México.",
              "El arrecife poco profundo lo hace ideal para familias y snorkelers principiantes. Las cooperativas locales ofrecen tours de snorkel directamente desde la playa a precios razonables."
            ]
          },
          {
            title: "Alquileres Vacacionales y Tipos de Propiedades",
            paragraphs: [
              "Los alquileres vacacionales en Puerto Morelos van desde condominios frente al mar con vistas al arrecife hasta propiedades en la selva con piscinas privadas.",
              "Muchos alquileres atienden a visitantes de largo plazo y snowbirds, ofreciendo descuentos mensuales y cocinas completamente equipadas."
            ]
          },
          {
            title: "Mejor Época para Visitar y Logística de Viaje",
            paragraphs: [
              "Puerto Morelos disfruta del mismo clima caribeño cálido que el resto de la Riviera Maya (24-32°C todo el año). La temporada seca (noviembre-abril) trae clima perfecto de playa.",
              "El pueblo es mucho menos concurrido que los destinos vecinos incluso durante la temporada alta. Los alquileres vacacionales en Puerto Morelos típicamente requieren estadías mínimas de 3-7 noches."
            ]
          }
        ]
      }
    }
  },
  "isla-mujeres": {
    cityName: "Isla Mujeres",
    citySlug: "isla-mujeres",
    heroImage: "/property-images/isla-mujeres-1.jpg",
    content: {
      en: {
        discoverTitle: "Discover Isla Mujeres, Mexico",
        sections: [
          {
            title: "Caribbean Island Paradise",
            paragraphs: [
              "Isla Mujeres, meaning \"Island of Women,\" is a small Caribbean island just 8 miles off the coast of Cancun. Measuring only 4 miles long and half a mile wide, this charming island offers a completely different experience from mainland Mexico—slower-paced, more intimate, and focused on island living. Golf carts replace cars as the main transportation, and the island's beaches and downtown area are all easily walkable.",
              "The island's main attractions include Playa Norte, consistently ranked among the Caribbean's most beautiful beaches with its impossibly turquoise waters and soft white sand. The downtown area features colorful Caribbean-style buildings, seaside restaurants, local art galleries, and a laid-back atmosphere where everyone seems to know each other. The island attracts those seeking to escape the mega-resort experience."
            ]
          },
          {
            title: "Island Activities & Attractions",
            paragraphs: [
              "Isla Mujeres offers world-class snorkeling and diving. The island sits at the edge of the Mesoamerican Barrier Reef, with sites including the MUSA Underwater Museum—over 500 life-size sculptures submerged in shallow waters creating artificial reefs. Whale shark season (June-September) brings these gentle giants to the waters around Isla Mujeres, offering once-in-a-lifetime snorkeling experiences.",
              "The island's east coast features dramatic cliffs, natural rock formations, and Punta Sur—the southernmost point with a sculpture garden, lighthouse ruins, and Mayan temple dedicated to Ixchel, goddess of fertility. Garrafon Natural Reef Park offers snorkeling, kayaking, and zip-lining over Caribbean waters. Unlike party-focused Cancun, Isla Mujeres focuses on natural beauty and water activities."
            ]
          },
          {
            title: "Vacation Rentals & Property Types",
            paragraphs: [
              "Isla Mujeres vacation rentals range from budget-friendly downtown apartments to luxury beachfront villas. Downtown properties offer walkability to restaurants, shops, and the ferry dock, while north end rentals provide proximity to Playa Norte and sunset views over the bay. Some properties feature rooftop terraces with 360-degree ocean views—a rare amenity only possible on a small island.",
              "The island's small size means nothing is far. The widest part is less than a mile, so beach is always close. Golf cart rentals ($30-50/day) make exploring easy, though many visitors rent bikes or simply walk. The island's residential neighborhoods feel safe and welcoming, with expats, local families, and tourists mixing at the same taco stands and beach bars. Getting to Isla Mujeres requires a ferry from either Cancun or Puerto Juarez. Ferries run every 30 minutes and take just 15-20 minutes."
            ]
          },
          {
            title: "Best Time to Visit & Travel Logistics",
            paragraphs: [
              "Isla Mujeres enjoys warm Caribbean weather year-round (75-90°F). The island sees fewer seasonal fluctuations in tourism than mainland destinations—while December-April remains high season, the island never feels as crowded as Cancun or Playa del Carmen. Summer months bring afternoon rain showers and higher humidity but also lower rates and better availability.",
              "Whale shark season (June-September) attracts eco-tourists and divers, making summer surprisingly busy for an off-season period. November sees the island celebrate Day of the Dead with special events and traditions. Isla Mujeres vacation rentals typically require 3-7 night minimums, with weekly and monthly discounts common. Properties near Playa Norte and downtown book early for winter season and holidays. Many property managers live on the island full-time and can arrange golf cart rentals, snorkel tours, restaurant reservations, and water taxi services. Booking direct ensures transparent pricing, no platform fees, and support from people who genuinely love island living."
            ]
          }
        ]
      },
      es: {
        discoverTitle: "Descubre Isla Mujeres, México",
        sections: [
          {
            title: "Paraíso Isleño del Caribe",
            paragraphs: [
              "Isla Mujeres, que significa \"Isla de Mujeres,\" es una pequeña isla caribeña a solo 13 km de la costa de Cancún. Midiendo solo 6.5 km de largo y menos de 1 km de ancho, esta encantadora isla ofrece una experiencia completamente diferente de México continental.",
              "Las principales atracciones de la isla incluyen Playa Norte, constantemente clasificada entre las playas más hermosas del Caribe con sus aguas increíblemente turquesas y suave arena blanca."
            ]
          },
          {
            title: "Actividades y Atracciones de la Isla",
            paragraphs: [
              "Isla Mujeres ofrece snorkel y buceo de clase mundial. La isla está en el borde del Arrecife Mesoamericano, con sitios que incluyen el Museo Subacuático MUSA—más de 500 esculturas de tamaño real sumergidas en aguas poco profundas.",
              "La costa este de la isla presenta acantilados dramáticos, formaciones rocosas naturales y Punta Sur—el punto más al sur con un jardín de esculturas, ruinas de faro y templo maya dedicado a Ixchel."
            ]
          },
          {
            title: "Alquileres Vacacionales y Tipos de Propiedades",
            paragraphs: [
              "Los alquileres vacacionales en Isla Mujeres van desde departamentos económicos en el centro hasta lujosas villas frente al mar.",
              "El pequeño tamaño de la isla significa que nada está lejos. La parte más ancha es menos de 1.5 km, así que la playa siempre está cerca."
            ]
          },
          {
            title: "Mejor Época para Visitar y Logística de Viaje",
            paragraphs: [
              "Isla Mujeres disfruta de clima caribeño cálido todo el año (24-32°C). La isla ve menos fluctuaciones estacionales en turismo que los destinos continentales.",
              "Los alquileres vacacionales en Isla Mujeres típicamente requieren estadías mínimas de 3-7 noches, con descuentos semanales y mensuales comunes."
            ]
          }
        ]
      }
    }
  }
};

// Subpage content translations (same for all cities, just replace city name)
export const subpageContent = {
  oceanfront: {
    en: {
      introTitle: "Beachfront Living",
      intro1: "Our oceanfront rentals offer direct beach access and stunning Caribbean views. These properties sit right on the sand, allowing you to walk from your door straight into the turquoise waters.",
      intro2: "Oceanfront properties include beachfront patios, outdoor showers for rinsing off after snorkeling, and covered palapas for shade. Many feature infinity pools overlooking the ocean, rooftop terraces, and direct access to the best snorkeling spots.",
      intro3: "These premium rentals range from 2-bedroom condos in beachfront complexes to 6-bedroom luxury villas with private beach sections. All include loungers, hammocks, and beach equipment (kayaks, paddle boards, snorkel gear).",
      intro4: "Booking oceanfront means no crossing streets or walking paths—just steps to swimming, snorkeling, and sunset views. Perfect for families who want kids playing in sight, couples seeking romantic beach dinners, and anyone who wants to maximize beach time."
    },
    es: {
      introTitle: "Vida Frente al Mar",
      intro1: "Nuestros alquileres frente al mar ofrecen acceso directo a la playa y vistas impresionantes al Caribe. Estas propiedades están justo en la arena.",
      intro2: "Las propiedades frente al mar incluyen patios en la playa, duchas al aire libre y palapas cubiertas para dar sombra. Muchas cuentan con piscinas infinitas.",
      intro3: "Estos alquileres premium van desde condominios de 2 habitaciones en complejos frente al mar hasta villas de lujo de 6 habitaciones.",
      intro4: "Reservar frente al mar significa sin cruzar calles—solo pasos hasta el nado, snorkel y vistas del atardecer."
    }
  },
  "with-pool": {
    en: {
      introTitle: "Private Pool Retreats",
      intro1: "Our vacation rentals with pools offer private outdoor oases perfect for families, groups, and anyone who values poolside relaxation. These properties feature everything from intimate plunge pools to expansive resort-style pools.",
      intro2: "Pool properties include covered patios, outdoor dining areas, grills, and lounging spaces surrounding the pool. Many offer heated pools for comfortable swimming year-round, infinity edges with jungle or ocean views.",
      intro3: "Properties range from 3-bedroom villas with courtyard pools to 8-bedroom estates with multiple pools and jacuzzis. Pool areas typically include comfortable loungers, outdoor showers, pool floats and toys.",
      intro4: "Having a private pool means enjoying water activities without crowds, swimming at any hour, and creating your own pool bar and entertainment space. Kids can play safely in sight."
    },
    es: {
      introTitle: "Retiros con Piscina Privada",
      intro1: "Nuestros alquileres vacacionales con piscinas ofrecen oasis privados al aire libre perfectos para familias, grupos y cualquiera que valore la relajación junto a la piscina.",
      intro2: "Las propiedades con piscina incluyen patios cubiertos, áreas de comedor al aire libre, parrillas y espacios de descanso alrededor de la piscina.",
      intro3: "Las propiedades van desde villas de 3 habitaciones con piscinas de patio hasta fincas de 8 habitaciones con múltiples piscinas y jacuzzis.",
      intro4: "Tener una piscina privada significa disfrutar de actividades acuáticas sin multitudes, nadar a cualquier hora."
    }
  },
  "by-owner": {
    en: {
      introTitle: "Book Direct, Save More",
      intro1: "Booking vacation rentals directly from owners through Margea eliminates the service fees charged by third-party platforms. You get transparent pricing with direct communication to owners and property managers.",
      intro2: "Direct booking means no surprise fees at checkout. The price you see is the price you pay—no cleaning fee add-ons, no service charges, no occupancy taxes hidden until the last step.",
      intro3: "You get direct WhatsApp access to property managers who live locally, respond within hours, and can arrange anything from pre-arrival grocery stocking to restaurant reservations to local guide services.",
      intro4: "Direct bookings often include perks that platforms don't offer: early check-in or late checkout when available, mid-stay cleaning, welcome packages with local goods, and concierge services."
    },
    es: {
      introTitle: "Reserva Directo, Ahorra Más",
      intro1: "Reservar alquileres vacacionales directamente con propietarios a través de Margea elimina las comisiones de servicio que cobran las plataformas.",
      intro2: "La reserva directa significa sin cargos sorpresa al finalizar. El precio que ves es el precio que pagas.",
      intro3: "Obtienes acceso directo por WhatsApp a administradores de propiedades que viven localmente y responden en horas.",
      intro4: "Las reservas directas a menudo incluyen beneficios que las plataformas no ofrecen: check-in temprano o check-out tardío cuando está disponible."
    }
  },
  "pet-friendly": {
    en: {
      introTitle: "Vacation with Your Pets",
      intro1: "Our pet-friendly vacation rentals welcome your dogs and cats so the whole family can enjoy paradise together. These properties feature fenced yards or secure outdoor spaces where pets can roam safely.",
      intro2: "Pet-friendly rentals include outdoor areas perfect for dogs: private yards with grass or sand, covered patios for shade, outdoor showers for rinsing sandy paws, and beach access for dogs who love swimming.",
      intro3: "The area is dog-friendly with several beaches where leashed dogs are welcome during early morning and evening hours. There are veterinary clinics, pet supply stores, and restaurants with outdoor seating where well-behaved dogs can relax.",
      intro4: "Traveling with pets requires extra planning—these properties make it easier. Owners understand pet needs and typically charge modest pet fees. Some properties accommodate multiple pets, large dogs, and even cats."
    },
    es: {
      introTitle: "Vacaciones con tus Mascotas",
      intro1: "Nuestros alquileres pet-friendly dan la bienvenida a tus perros y gatos para que toda la familia pueda disfrutar del paraíso juntos.",
      intro2: "Los alquileres pet-friendly incluyen áreas al aire libre perfectas para perros: jardines privados con pasto o arena, patios cubiertos para sombra.",
      intro3: "El área es amigable con los perros, con varias playas donde los perros con correa son bienvenidos durante las primeras horas de la mañana y la tarde.",
      intro4: "Viajar con mascotas requiere planificación extra—estas propiedades lo hacen más fácil."
    }
  },
  "long-term": {
    en: {
      introTitle: "Extended Stays in Paradise",
      intro1: "Long-term rentals offer the perfect base for digital nomads, remote workers, snowbirds, and anyone seeking extended stays in paradise. Book 30+ days and enjoy monthly discounts—typically lower than nightly rates.",
      intro2: "Monthly rentals include everything needed for comfortable long-term living: full kitchens with cookware and appliances, reliable high-speed WiFi for remote work, laundry facilities, dedicated workspaces.",
      intro3: "The area is ideal for long-term stays because it has everything within walking distance: supermarkets, restaurants, dive shops, yoga studios, and beach access. The community is welcoming to long-term residents.",
      intro4: "Long-term rates vary depending on property size and location. Utilities are usually included, though some properties charge separately for electricity if usage is high.",
      intro5: "Many long-term renters are remote workers from the US and Canada escaping winter. The time zone makes it easy to maintain work hours aligned with North American colleagues. Internet speeds typically run 20-50 Mbps."
    },
    es: {
      introTitle: "Estadías Extendidas en el Paraíso",
      intro1: "Los alquileres a largo plazo ofrecen la base perfecta para nómadas digitales, trabajadores remotos, snowbirds y cualquiera que busque estadías extendidas en el paraíso.",
      intro2: "Los alquileres mensuales incluyen todo lo necesario para una vida cómoda a largo plazo: cocinas completas, WiFi de alta velocidad confiable para trabajo remoto.",
      intro3: "El área es ideal para estadías a largo plazo porque tiene todo a poca distancia: supermercados, restaurantes, tiendas de buceo, estudios de yoga.",
      intro4: "Las tarifas a largo plazo varían según el tamaño y ubicación de la propiedad. Los servicios generalmente están incluidos.",
      intro5: "Muchos inquilinos a largo plazo son trabajadores remotos de EE.UU. y Canadá que escapan del invierno."
    }
  }
};
