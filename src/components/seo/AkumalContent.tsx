interface AkumalContentProps {
  language: "en" | "es";
  images: string[];
}

export function AkumalContent({ language, images }: AkumalContentProps) {
  if (language === "es") {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">Descubre Akumal, México</h2>
            
            <h3 className="text-xl font-semibold mt-8 mb-4">Bahía de Akumal y Nado con Tortugas Marinas</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Akumal, que significa "Lugar de Tortugas" en maya, es un paraíso prístino en la costa caribeña de México. Ubicado a 95 km al sur de Cancún y 32 km al norte de Tulum, Akumal ofrece la combinación perfecta de belleza natural y cultura mexicana auténtica sin las multitudes de las zonas turísticas más concurridas.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              La atracción principal del pueblo es nadar con tortugas marinas en la Bahía de Akumal. Las tortugas verdes y caguamas se alimentan de pastos marinos en las aguas cristalinas poco profundas a solo pasos de la playa. Hacer snorkel aquí es como explorar un acuario natural, con peces tropicales coloridos, rayas y tortugas deslizándose debajo de ti. No se necesita tour—simplemente entra al agua con tu equipo de snorkel.
            </p>

            {images[0] && (
              <img 
                src={images[0]} 
                alt="Vista de la bahía de Akumal" 
                className="w-full h-64 object-cover rounded-lg my-8"
                loading="lazy"
                decoding="async"
                width={800}
                height={256}
              />
            )}

            <h3 className="text-xl font-semibold mt-8 mb-4">Playas y Vecindarios</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Más allá del avistamiento de tortugas, Akumal cuenta con tres bahías impresionantes: Bahía de Akumal, Half Moon Bay y Jade Bay. Cada una ofrece experiencias diferentes, desde playas tranquilas perfectas para familias hasta costas rocosas ideales para snorkelers experimentados. La Laguna Yal-Ku, donde arroyos de agua dulce de cenotes se encuentran con el Mar Caribe, crea un ecosistema único lleno de vida marina.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              El pueblo mantiene un ambiente relajado y residencial. A diferencia de la zona hotelera de Cancún o la escena de fiestas de Tulum, Akumal es tranquilo y orientado a familias. Restaurantes locales como La Buena Vida y Turtle Bay Cafe sirven mariscos frescos y cocina mexicana auténtica.
            </p>

            {images[1] && (
              <img 
                src={images[1]} 
                alt="Propiedad frente al mar en Akumal" 
                className="w-full h-64 object-cover rounded-lg my-8"
                loading="lazy"
                decoding="async"
                width={800}
                height={256}
              />
            )}

            <h3 className="text-xl font-semibold mt-8 mb-4">Alquileres Vacacionales y Tipos de Propiedades</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Los alquileres vacacionales en Akumal van desde villas frente al mar con piscinas privadas hasta acogedores condominios con amenidades compartidas. Muchas propiedades ofrecen acceso directo a la playa, cocinas completas y espacios al aire libre con palapas y hamacas. Reservar directamente con administradores de propiedades locales como Margea garantiza listados precisos, soporte receptivo y sin cargos sorpresa al finalizar la reserva.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              La ubicación proporciona fácil acceso a las principales atracciones de la Riviera Maya. Las ruinas mayas de Tulum y los beach clubs están a 20 minutos al sur. La Quinta Avenida de Playa del Carmen está a 30 minutos al norte. Los cenotes—sumideros naturales de agua dulce perfectos para nadar y bucear—salpican la selva que rodea Akumal.
            </p>

            {images[2] && (
              <img 
                src={images[2]} 
                alt="Interior de alquiler vacacional en Akumal" 
                className="w-full h-64 object-cover rounded-lg my-8"
                loading="lazy"
                decoding="async"
                width={800}
                height={256}
              />
            )}

            <h3 className="text-xl font-semibold mt-8 mb-4">Mejor Época para Visitar y Logística de Viaje</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              El clima en Akumal es cálido todo el año, con temperaturas que oscilan entre 24-32°C. La temporada seca (noviembre-abril) ofrece las mejores condiciones de playa con lluvia mínima y humedad cómoda. El verano y el otoño traen temperaturas más cálidas, lluvias por la tarde y tormentas tropicales ocasionales, pero precios más bajos y menos turistas lo hacen atractivo para viajeros con presupuesto.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              La mayoría de los alquileres vacacionales en Akumal requieren estadías mínimas de 3-7 noches. Los alquileres semanales ofrecen el mejor valor, especialmente durante la temporada alta (diciembre-abril). Las propiedades se reservan rápidamente para días festivos y vacaciones de primavera, así que reserva con 3-6 meses de anticipación para estas fechas.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Discover Akumal, Mexico</h2>
          
          <h3 className="text-xl font-semibold mt-8 mb-4">Akumal Bay & Swimming with Sea Turtles</h3>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Akumal, meaning "Place of Turtles" in Mayan, is a pristine beach paradise on Mexico's Caribbean coast. Located 60 miles south of Cancun and 20 miles north of Tulum, Akumal offers the perfect blend of natural beauty and authentic Mexican culture without the crowds of busier resort towns.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-6">
            The town's main attraction is swimming with sea turtles in Akumal Bay. Green sea turtles and loggerhead turtles feed on seagrass in the shallow, crystal-clear waters just steps from the beach. Snorkeling here feels like exploring a natural aquarium, with colorful tropical fish, rays, and turtles gliding beneath you. No tour required—simply walk into the water with your snorkel gear.
          </p>

          {images[0] && (
            <img 
              src={images[0]} 
              alt="Akumal Bay beachfront view" 
              className="w-full h-64 object-cover rounded-lg my-8"
              loading="lazy"
              decoding="async"
              width={800}
              height={256}
            />
          )}

          <h3 className="text-xl font-semibold mt-8 mb-4">Beaches & Neighborhoods</h3>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Beyond turtle watching, Akumal features three stunning bays: Akumal Bay, Half Moon Bay, and Jade Bay. Each offers different experiences, from calm swimming beaches perfect for families to rocky shores ideal for experienced snorkelers. Yal-Ku Lagoon, where freshwater cenote streams meet the Caribbean Sea, creates a unique brackish ecosystem teeming with marine life.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-6">
            The town maintains a laid-back, residential feel. Unlike Cancun's hotel zone or Tulum's party scene, Akumal is quiet and family-oriented. Local restaurants like La Buena Vida and Turtle Bay Cafe serve fresh seafood and authentic Mexican cuisine. Small shops and dive centers line the main road, but there's no large-scale commercial development.
          </p>

          {images[1] && (
            <img 
              src={images[1]} 
              alt="Beachfront property in Akumal" 
              className="w-full h-64 object-cover rounded-lg my-8"
              loading="lazy"
              decoding="async"
              width={800}
              height={256}
            />
          )}

          <h3 className="text-xl font-semibold mt-8 mb-4">Vacation Rentals & Property Types</h3>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Akumal vacation rentals range from beachfront villas with private pools to cozy condos with shared amenities. Many properties offer direct beach access, full kitchens, and outdoor spaces with palapas and hammocks. Booking direct with local property managers like Margea ensures accurate listings, responsive support, and no surprise fees at checkout.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-6">
            The location provides easy access to Riviera Maya's top attractions. Tulum's Mayan ruins and beach clubs are 20 minutes south. Playa del Carmen's Fifth Avenue shopping district is 30 minutes north. Cenotes—natural freshwater sinkholes perfect for swimming and diving—dot the jungle surrounding Akumal. Xcaret, Xel-Ha, and other eco-parks are within 30 minutes.
          </p>

          {images[2] && (
            <img 
              src={images[2]} 
              alt="Akumal vacation rental interior" 
              className="w-full h-64 object-cover rounded-lg my-8"
              loading="lazy"
              decoding="async"
              width={800}
              height={256}
            />
          )}

          <h3 className="text-xl font-semibold mt-8 mb-4">Best Time to Visit & Travel Logistics</h3>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Weather in Akumal is warm year-round, with temperatures ranging from 75-90°F (24-32°C). The dry season (November-April) offers the best beach conditions with minimal rain and comfortable humidity. Summer and fall bring warmer temperatures, afternoon rain showers, and occasional tropical storms, but lower prices and fewer tourists make it appealing for budget travelers.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Most Akumal vacation rentals require 3-7 night minimum stays. Weekly rentals offer the best value, especially during peak season (December-April). Properties book quickly for holidays and spring break, so reserve 3-6 months in advance for these dates. Last-minute deals are common in shoulder season (May-June, September-November).
          </p>
        </div>
      </div>
    </section>
  );
}
