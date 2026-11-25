import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { media } from "@/lib/media";

interface DestinationLinksProps {
  language: "en" | "es";
  excludeCurrent?: string;
}

const translations = {
  en: {
    title: "Explore More Riviera Maya Destinations",
    explore: "Explore",
    akumal: "Akumal Vacation Rentals",
    akumalDesc: "Swim with sea turtles",
    tulum: "Tulum Vacation Rentals",
    tulumDesc: "Beach clubs and Mayan ruins",
    playaDelCarmen: "Playa del Carmen Rentals",
    playaDelCarmenDesc: "Vibrant Fifth Avenue nightlife",
    cancun: "Cancun Rentals",
    cancunDesc: "World-famous beaches and resorts",
    puertoMorelos: "Puerto Morelos Rentals",
    puertoMorelosDesc: "Hidden gem with reef snorkeling",
    islaMujeres: "Isla Mujeres Rentals",
    islaMujeresDesc: "Caribbean island paradise",
    allStays: "View All Stays",
    allStaysDesc: "Browse our complete collection",
  },
  es: {
    title: "Explora Más Destinos de la Riviera Maya",
    explore: "Explorar",
    akumal: "Alquileres en Akumal",
    akumalDesc: "Nada con tortugas marinas",
    tulum: "Alquileres en Tulum",
    tulumDesc: "Beach clubs y ruinas mayas",
    playaDelCarmen: "Alquileres en Playa del Carmen",
    playaDelCarmenDesc: "Vida nocturna en la Quinta Avenida",
    cancun: "Alquileres en Cancún",
    cancunDesc: "Playas y resorts de fama mundial",
    puertoMorelos: "Alquileres en Puerto Morelos",
    puertoMorelosDesc: "Joya escondida con snorkel en arrecife",
    islaMujeres: "Alquileres en Isla Mujeres",
    islaMujeresDesc: "Paraíso isleño del Caribe",
    allStays: "Ver Todos los Alojamientos",
    allStaysDesc: "Explora nuestra colección completa",
  },
};

const destinations = [
  { id: "akumal", href: "/stays/akumal", titleKey: "akumal" as const, descKey: "akumalDesc" as const, image: media("/property-images/akumal-u7-1.jpg") },
  { id: "tulum", href: "/stays/tulum", titleKey: "tulum" as const, descKey: "tulumDesc" as const, image: media("/property-images/tulum-1.jpg") },
  { id: "playa-del-carmen", href: "/stays/playa-del-carmen", titleKey: "playaDelCarmen" as const, descKey: "playaDelCarmenDesc" as const, image: media("/property-images/nickprice-1.jpg") },
  { id: "cancun", href: "/stays/cancun", titleKey: "cancun" as const, descKey: "cancunDesc" as const, image: media("/property-images/cancun-estate-1.jpg") },
  { id: "puerto-morelos", href: "/stays/puerto-morelos", titleKey: "puertoMorelos" as const, descKey: "puertoMorelosDesc" as const, image: media("/property-images/puerto-morelos-1.jpg") },
  { id: "isla-mujeres", href: "/stays/isla-mujeres", titleKey: "islaMujeres" as const, descKey: "islaMujeresDesc" as const, image: media("/property-images/isla-mujeres-1.jpg") },
  { id: "all", href: "/stays", titleKey: "allStays" as const, descKey: "allStaysDesc" as const, image: media("/property-images/cancun-estate-1.jpg") },
];

export function DestinationLinks({ language, excludeCurrent }: DestinationLinksProps) {
  const t = translations[language];
  const displayDestinations = destinations.filter(d => d.id !== excludeCurrent).slice(0, 4);

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">{t.title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {displayDestinations.map((dest) => (
            <Link key={dest.id} to={dest.href} className="group">
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full border-border">
                <div className="relative h-40 overflow-hidden">
                  <img src={dest.image} alt={t[dest.titleKey]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" decoding="async" width={320} height={160} />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold mb-1 group-hover:text-primary transition-colors">{t[dest.titleKey]}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{t[dest.descKey]}</p>
                  <Button variant="outline" size="sm" className="w-full gap-2">{t.explore}<ArrowRight className="h-4 w-4" /></Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
