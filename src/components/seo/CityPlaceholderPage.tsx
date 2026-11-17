import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/components/LanguageToggle";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CityPlaceholderProps {
  cityName: string;
  citySlug: string;
}

const translations = {
  en: {
    titleSuffix: "Vacation Rentals - Coming Soon",
    subtitle: "We're curating the best vacation rentals in",
    checkBack: "Check back soon!",
    exploreTitle: "Explore Other Destinations",
    exploreText: "While we finalize our listings, explore our professionally managed vacation rentals in these destinations. We already manage properties across the Riviera Maya with local support and concierge services.",
    explore: "Explore",
    akumal: "Akumal",
    akumalDesc: "Swim with sea turtles",
    tulum: "Tulum",
    tulumDesc: "Beach clubs and Mayan ruins",
    playaDelCarmen: "Playa del Carmen",
    playaDelCarmenDesc: "Vibrant Fifth Avenue nightlife",
    cancun: "Cancun",
    cancunDesc: "World-famous beaches",
    puertoMorelos: "Puerto Morelos",
    puertoMorelosDesc: "Hidden gem fishing village",
    islaMujeres: "Isla Mujeres",
    islaMujeresDesc: "Caribbean island paradise",
    allStays: "View All Stays",
    allStaysDesc: "Browse our complete collection",
  },
  es: {
    titleSuffix: "Alquileres Vacacionales - Próximamente",
    subtitle: "Estamos seleccionando los mejores alquileres vacacionales en",
    checkBack: "¡Vuelve pronto!",
    exploreTitle: "Explora Otros Destinos",
    exploreText: "Mientras finalizamos nuestros listados, explora nuestros alquileres vacacionales administrados profesionalmente en estos destinos. Ya administramos propiedades en toda la Riviera Maya con soporte local y servicios de concierge.",
    explore: "Explorar",
    akumal: "Akumal",
    akumalDesc: "Nada con tortugas marinas",
    tulum: "Tulum",
    tulumDesc: "Beach clubs y ruinas mayas",
    playaDelCarmen: "Playa del Carmen",
    playaDelCarmenDesc: "Vida nocturna en la Quinta Avenida",
    cancun: "Cancún",
    cancunDesc: "Playas de fama mundial",
    puertoMorelos: "Puerto Morelos",
    puertoMorelosDesc: "Pueblo pesquero encantador",
    islaMujeres: "Isla Mujeres",
    islaMujeresDesc: "Paraíso isleño caribeño",
    allStays: "Ver Todos los Alojamientos",
    allStaysDesc: "Explora nuestra colección completa",
  },
};

const destinationImages: Record<string, string> = {
  akumal: "/property-images/akumal-u7-1.jpg",
  tulum: "/property-images/tulum-1.jpg",
  "playa-del-carmen": "/property-images/nickprice-1.jpg",
  cancun: "/property-images/cancun-estate-1.jpg",
  "puerto-morelos": "/property-images/puerto-morelos-1.jpg",
  "isla-mujeres": "/property-images/isla-mujeres-1.jpg",
};

export function CityPlaceholderPage({ cityName, citySlug }: CityPlaceholderProps) {
  const { language, setLanguage } = useLanguage();
  const t = translations[language];

  const destinations = [
    { id: "akumal", href: "/stays/akumal", titleKey: "akumal" as const, descKey: "akumalDesc" as const },
    { id: "tulum", href: "/stays/tulum", titleKey: "tulum" as const, descKey: "tulumDesc" as const },
    { id: "playa-del-carmen", href: "/stays/playa-del-carmen", titleKey: "playaDelCarmen" as const, descKey: "playaDelCarmenDesc" as const },
    { id: "cancun", href: "/stays/cancun", titleKey: "cancun" as const, descKey: "cancunDesc" as const },
    { id: "puerto-morelos", href: "/stays/puerto-morelos", titleKey: "puertoMorelos" as const, descKey: "puertoMorelosDesc" as const },
    { id: "isla-mujeres", href: "/stays/isla-mujeres", titleKey: "islaMujeres" as const, descKey: "islaMujeresDesc" as const },
    { id: "all", href: "/stays", titleKey: "allStays" as const, descKey: "allStaysDesc" as const },
  ].filter(d => d.id !== citySlug);

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${cityName} Vacation Rentals`,
    "description": `Coming soon - professionally managed vacation rentals in ${cityName}`,
    "url": `https://margeatravel.com/stays/${citySlug}`
  };

  return (
    <div className="min-h-screen bg-background">
      <title>{cityName} Vacation Rentals Coming Soon | Margea</title>
      <meta name="description" content={`${cityName} vacation rentals coming soon. Browse our current Riviera Maya properties with local management and concierge support.`} />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />
      
      <Navbar language={language} onLanguageChange={setLanguage} />
      
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${destinationImages[citySlug] || destinationImages.akumal}')` }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            {cityName} {t.titleSuffix}
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            {t.subtitle} {cityName}. {t.checkBack}
          </p>
        </div>
      </section>

      {/* Explore Other Destinations */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
            {t.exploreTitle}
          </h2>
          <p className="text-muted-foreground text-center max-w-3xl mx-auto mb-12">
            {t.exploreText.replace("[City Name]", cityName)}
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {destinations.map((dest) => (
              <Link key={dest.id} to={dest.href} className="group">
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full border-border">
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={destinationImages[dest.id] || destinationImages.akumal}
                      alt={t[dest.titleKey]}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                    {dest.id === "akumal" && (
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                        Available Now
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold mb-1 group-hover:text-primary transition-colors">
                      {t[dest.titleKey]}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-3">
                      {t[dest.descKey]}
                    </p>
                    <Button variant="outline" size="sm" className="w-full gap-2">
                      {t.explore}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer language={language} />
    </div>
  );
}
