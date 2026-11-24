import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Settings2, DoorOpen, Snowflake } from "lucide-react";
import { YaabCar } from "@/data/yaab-cars-data";
import { useCurrency } from "@/hooks/use-currency";

interface CarCardProps {
  car: YaabCar;
  language: "en" | "es";
}

const translations = {
  en: {
    from: "From",
    perDay: "/ day",
    passengers: "passengers",
    automatic: "Automatic",
    doors: "doors",
    ac: "A/C",
    viewAndBook: "View & Book",
    depositNote: "Refundable deposit",
  },
  es: {
    from: "Desde",
    perDay: "/ día",
    passengers: "pasajeros",
    automatic: "Automática",
    doors: "puertas",
    ac: "A/C",
    viewAndBook: "Ver y reservar",
    depositNote: "Depósito reembolsable",
  },
};

export function CarCard({ car, language }: CarCardProps) {
  const { formatPrice } = useCurrency();
  const t = translations[language];
  const detailHref = `/activities/car-rentals/${car.slug}`;

  return (
    <div className="group bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-border flex flex-col h-full">
      {/* Image */}
      <Link to={detailHref} className="relative aspect-[16/10] overflow-hidden block">
        <img
          src={car.imageUrl}
          alt={`${car.name} ${car.trim} ${car.year}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground font-semibold text-xs">
          {car.year}
        </Badge>
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <Link to={detailHref}>
          <h3 className="text-lg font-bold text-foreground hover:text-primary transition-colors">
            {car.name} {car.trim}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mb-4 flex-1">
          {language === "es" ? car.descriptionEs : car.description}
        </p>

        {/* Specs */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            {car.passengers} {t.passengers}
          </span>
          <span className="flex items-center gap-1.5">
            <Settings2 className="w-4 h-4" />
            {car.transmission === "Automática" ? t.automatic : car.transmission}
          </span>
          <span className="flex items-center gap-1.5">
            <DoorOpen className="w-4 h-4" />
            {car.doors} {t.doors}
          </span>
          {car.airConditioning && (
            <span className="flex items-center gap-1.5">
              <Snowflake className="w-4 h-4" />
              {t.ac}
            </span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-sm text-muted-foreground">{t.from}</span>
          <span className="text-2xl font-bold text-primary">
            {formatPrice(car.pricePerDayMxn)}
          </span>
          <span className="text-muted-foreground text-sm">{t.perDay}</span>
        </div>
        {car.depositMxn != null && (
          <p className="text-xs text-muted-foreground mb-4">
            {t.depositNote}: {formatPrice(car.depositMxn)}
          </p>
        )}

        <Button asChild className="w-full mt-auto" size="lg">
          <Link to={detailHref}>{t.viewAndBook}</Link>
        </Button>
      </div>
    </div>
  );
}
