import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { media } from "@/lib/media";

interface DestinationsSectionProps {
  language: "en" | "es";
}

const translations = {
  en: {
    title: "Browse Vacation Rentals by Destination",
    viewProperties: "View Properties",
    notifyMe: "Notify Me",
    comingSoon: "Coming Soon",
    mostPopular: "MOST POPULAR",
  },
  es: {
    title: "Explora Alquileres por Destino",
    viewProperties: "Ver Propiedades",
    notifyMe: "Notificarme",
    comingSoon: "Próximamente",
    mostPopular: "MÁS POPULAR",
  },
};

const destinations = [
  { id: "akumal", name: "Akumal", desc: "Swim with sea turtles", descEs: "Nada con tortugas marinas", href: "/stays/akumal", image: media("/property-images/akumal-u7-1.jpg"), available: true },
  { id: "tulum", name: "Tulum", desc: "Beach clubs & ruins", descEs: "Beach clubs y ruinas", href: "/stays/tulum", image: media("/property-images/tulum-1.jpg"), available: true },
  { id: "playa", name: "Playa del Carmen", desc: "Fifth Avenue nightlife", descEs: "Vida nocturna en 5ta", href: "/stays/playa-del-carmen", image: media("/property-images/nickprice-1.jpg"), available: true },
  { id: "cancun", name: "Cancun", desc: "World-famous beaches", descEs: "Playas famosas mundiales", href: "/stays/cancun", image: media("/property-images/cancun-estate-1.jpg"), available: true },
  { id: "puerto-morelos", name: "Puerto Morelos", desc: "Hidden gem charm", descEs: "Encanto escondido", href: "/stays/puerto-morelos", image: media("/property-images/puerto-morelos-1.jpg"), available: true },
  { id: "isla-mujeres", name: "Isla Mujeres", desc: "Island paradise", descEs: "Paraíso isleño", href: "/stays/isla-mujeres", image: media("/property-images/isla-mujeres-1.jpg"), available: true },
];

export function DestinationsGridSection({ language }: DestinationsSectionProps) {
  const t = translations[language];

  return (
    <section className="py-12 bg-muted/50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">{t.title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {destinations.map((dest) => (
            <Link key={dest.id} to={dest.href} className="group">
              <Card className={`overflow-hidden hover:shadow-xl transition-all duration-300 h-full border-border ${dest.id === 'akumal' ? 'ring-2 ring-primary' : ''}`}>
                <div className="relative h-32 overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                  {dest.id === "akumal" && (
                    <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px]">
                      {t.mostPopular}
                    </Badge>
                  )}
                </div>
                <CardContent className="p-3">
                  <h3 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors">{dest.name}</h3>
                  <p className="text-muted-foreground text-xs mb-2">{language === 'es' ? dest.descEs : dest.desc}</p>
                  <Button variant={dest.available ? "default" : "outline"} size="sm" className="w-full text-xs gap-1">
                    {dest.available ? t.viewProperties : t.notifyMe}
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
