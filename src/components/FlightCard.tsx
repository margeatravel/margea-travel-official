import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plane, Clock } from "lucide-react";
import type { FlightProduct } from "@/data/flights-data";
import { calculateFlightPricingFromMargeaPrice } from "@/lib/flight-pricing";
import { ShareButton } from "@/components/ShareButton";

interface FlightCardProps {
  flight: FlightProduct;
  onRequestAvailability: (flight: FlightProduct) => void;
  buttonText: string;
  language?: 'en' | 'es';
}

const translations = {
  en: {
    from: "From",
    minutes: "min flight",
    estimatedTotal: "Estimated total:",
    inclIva: "(incl. IVA)",
  },
  es: {
    from: "Desde",
    minutes: "min vuelo",
    estimatedTotal: "Total estimado:",
    inclIva: "(incl. IVA)",
  },
};

export function FlightCard({ flight, onRequestAvailability, buttonText, language = 'en' }: FlightCardProps) {
  const pricing = calculateFlightPricingFromMargeaPrice(flight.margea_price_usd);
  const t = translations[language];
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-card">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
            <Plane className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-lg font-semibold text-foreground mb-1 flex-1">
                {flight.route_name}
              </h3>
              <ShareButton title={flight.route_name} size="sm" stopPropagation={false} />
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              {flight.operator_hint}
            </p>
            <div className="flex items-center gap-4">
              <p className="text-sm text-muted-foreground">
                {flight.aircraft}
              </p>
              {flight.flight_time_minutes && (
                <div className="flex items-center gap-1 text-sm text-primary font-medium">
                  <Clock className="w-4 h-4" />
                  <span>{flight.flight_time_minutes} {t.minutes}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="text-xl font-bold text-primary">
                {t.from} ${pricing.subtotal_usd.toLocaleString()} USD
              </p>
              <p className="text-xs text-muted-foreground">+ IVA (16%)</p>
              <p className="text-sm text-foreground/80 mt-1">
                {t.estimatedTotal} <span className="font-medium">${pricing.total_usd.toLocaleString()} USD</span>
                <span className="text-xs text-muted-foreground ml-1">{t.inclIva}</span>
              </p>
            </div>
            <Button 
              onClick={() => onRequestAvailability(flight)}
              size="sm"
              className="shrink-0"
            >
              {buttonText}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
