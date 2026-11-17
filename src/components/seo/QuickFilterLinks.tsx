import { Link } from "react-router-dom";
import { Waves, Droplets, Handshake, PawPrint, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface QuickFilterLinksProps {
  language: "en" | "es";
  currentPage?: string;
}

const translations = {
  en: {
    title: "Browse Akumal Rentals by Type",
    oceanfront: "Oceanfront Rentals",
    oceanfrontText: "Wake up to Caribbean views",
    oceanfrontBtn: "View Oceanfront",
    pool: "Rentals with Pool",
    poolText: "Private pools and sun decks",
    poolBtn: "View Properties",
    byOwner: "By Owner Direct",
    byOwnerText: "Book directly, save on fees",
    byOwnerBtn: "View Properties",
    petFriendly: "Pet-Friendly",
    petFriendlyText: "Bring your furry friends",
    petFriendlyBtn: "View Properties",
    longTerm: "Long-Term Rentals",
    longTermText: "Monthly rates available",
    longTermBtn: "View Properties",
    allAkumal: "All Akumal Properties",
    allAkumalText: "Browse all rentals",
    allAkumalBtn: "View All",
  },
  es: {
    title: "Explora Alquileres en Akumal por Tipo",
    oceanfront: "Frente al Mar",
    oceanfrontText: "Despierta con vistas al Caribe",
    oceanfrontBtn: "Ver Propiedades",
    pool: "Con Piscina",
    poolText: "Piscinas privadas y terrazas",
    poolBtn: "Ver Propiedades",
    byOwner: "Directo del Propietario",
    byOwnerText: "Reserva directo, ahorra en comisiones",
    byOwnerBtn: "Ver Propiedades",
    petFriendly: "Pet-Friendly",
    petFriendlyText: "Trae a tus mascotas",
    petFriendlyBtn: "Ver Propiedades",
    longTerm: "Alquiler a Largo Plazo",
    longTermText: "Tarifas mensuales disponibles",
    longTermBtn: "Ver Propiedades",
    allAkumal: "Todas las Propiedades",
    allAkumalText: "Ver todos los alquileres",
    allAkumalBtn: "Ver Todo",
  },
};

const filterCards = [
  {
    id: "oceanfront",
    href: "/stays/akumal/oceanfront",
    icon: Waves,
    titleKey: "oceanfront" as const,
    textKey: "oceanfrontText" as const,
    btnKey: "oceanfrontBtn" as const,
  },
  {
    id: "with-pool",
    href: "/stays/akumal/with-pool",
    icon: Droplets,
    titleKey: "pool" as const,
    textKey: "poolText" as const,
    btnKey: "poolBtn" as const,
  },
  {
    id: "by-owner",
    href: "/stays/akumal/by-owner",
    icon: Handshake,
    titleKey: "byOwner" as const,
    textKey: "byOwnerText" as const,
    btnKey: "byOwnerBtn" as const,
  },
  {
    id: "pet-friendly",
    href: "/stays/akumal/pet-friendly",
    icon: PawPrint,
    titleKey: "petFriendly" as const,
    textKey: "petFriendlyText" as const,
    btnKey: "petFriendlyBtn" as const,
  },
  {
    id: "long-term",
    href: "/stays/akumal/long-term",
    icon: Calendar,
    titleKey: "longTerm" as const,
    textKey: "longTermText" as const,
    btnKey: "longTermBtn" as const,
  },
];

export function QuickFilterLinks({ language, currentPage }: QuickFilterLinksProps) {
  const t = translations[language];

  // Filter out current page and optionally add "All Akumal" link
  const displayCards = filterCards.filter(card => card.id !== currentPage);
  
  // If on a subpage, add link back to main Akumal page
  const showAllAkumalLink = currentPage && currentPage !== "akumal";

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          {t.title}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
          {showAllAkumalLink && (
            <Card className="group hover:shadow-lg transition-all duration-300 border-border">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Waves className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold mb-2">{t.allAkumal}</h3>
                <p className="text-muted-foreground text-sm mb-4">{t.allAkumalText}</p>
                <Link to="/stays/akumal">
                  <Button variant="outline" size="sm" className="w-full">
                    {t.allAkumalBtn}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
          {displayCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card key={card.id} className="group hover:shadow-lg transition-all duration-300 border-border">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-bold mb-2">{t[card.titleKey]}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{t[card.textKey]}</p>
                  <Link to={card.href}>
                    <Button variant="outline" size="sm" className="w-full">
                      {t[card.btnKey]}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
