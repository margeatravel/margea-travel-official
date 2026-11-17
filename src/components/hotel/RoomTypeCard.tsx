import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BedDouble, Users, AlertTriangle, Check } from "lucide-react";
import { useCurrency } from "@/hooks/use-currency";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { RoomTypeConfig } from "@/data/hotel-data";

interface RoomTypeCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  maxGuests: number;
  pricePerNight: number;
  amenities: string[];
  bedConfig: string;
  nights: number;
  availability: { available: number; urgency: boolean } | null;
  category: RoomTypeConfig["category"];
}

export function RoomTypeCard({
  id,
  title,
  description,
  image,
  maxGuests,
  pricePerNight,
  amenities,
  bedConfig,
  nights,
  availability,
  category,
}: RoomTypeCardProps) {
  const { formatPrice } = useCurrency();
  const [imageLoaded, setImageLoaded] = useState(false);
  const totalPrice = pricePerNight * nights;
  const isAvailable = availability ? availability.available > 0 : true;

  const categoryLabel =
    category === "villa" ? "Villa" : category === "suite" ? "Suite" : "Room";

  return (
    <Card
      className={cn(
        "overflow-hidden rounded-[12px] bg-card border border-[rgba(29,40,57,0.07)]",
        "shadow-[0_2px_12px_rgba(29,40,57,0.06)] transition-all duration-300",
        !isAvailable && "opacity-60"
      )}
    >
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="relative w-full md:w-[280px] h-[200px] md:h-auto flex-shrink-0 overflow-hidden bg-muted">
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-br from-muted to-muted/80 transition-opacity duration-300",
              imageLoaded ? "opacity-0" : "opacity-100"
            )}
          >
            <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
          <img
            src={image}
            alt={title}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-300",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
          />
          <Badge className="absolute top-3 left-3 bg-[#1d2839]/90 text-white border-0 rounded-[3px] text-[10px] tracking-[0.1em] uppercase px-2 py-1">
            {categoryLabel}
          </Badge>
          {availability?.urgency && (
            <Badge className="absolute bottom-3 left-3 bg-red-500/90 text-white border-0 rounded-[3px] text-[10px] tracking-[0.1em] uppercase px-2 py-1 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Only 1 left!
            </Badge>
          )}
        </div>

        {/* Content */}
        <CardContent className="flex-1 p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-inter font-semibold text-[17px] text-[#1d2839] mb-1">
              {title}
            </h3>
            <p className="text-[13px] text-muted-foreground font-inter mb-3 line-clamp-2">
              {description}
            </p>

            {/* Details row */}
            <div className="flex flex-wrap items-center gap-3 text-[12px] text-muted-foreground font-inter mb-3">
              <span className="flex items-center gap-1">
                <BedDouble className="h-3.5 w-3.5" />
                {bedConfig}
              </span>
              <span className="text-[rgba(29,40,57,0.15)]">|</span>
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                Up to {maxGuests} guests
              </span>
            </div>

            {/* Amenity chips */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {amenities.slice(0, 5).map((a) => (
                <span
                  key={a}
                  className="inline-flex items-center gap-1 text-[11px] text-muted-foreground bg-muted/60 rounded-full px-2.5 py-0.5 font-inter"
                >
                  <Check className="h-3 w-3 text-green-600" />
                  {a}
                </span>
              ))}
              {amenities.length > 5 && (
                <span className="text-[11px] text-muted-foreground font-inter px-1">
                  +{amenities.length - 5} more
                </span>
              )}
            </div>
          </div>

          {/* Price & CTA */}
          <div className="flex items-end justify-between gap-4 pt-2 border-t border-[rgba(29,40,57,0.06)]">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="font-inter font-bold text-[20px] text-[#1d2839]">
                  {formatPrice(pricePerNight)}
                </span>
                <span className="text-[12px] text-muted-foreground font-inter">
                  / night
                </span>
              </div>
              {nights > 1 && (
                <p className="text-[12px] text-muted-foreground font-inter">
                  {formatPrice(totalPrice)} total · {nights} nights
                </p>
              )}
              {availability && isAvailable && (
                <p className="text-[11px] text-green-700 font-inter mt-0.5">
                  {availability.available} {availability.available === 1 ? "unit" : "units"} available
                </p>
              )}
            </div>
            {isAvailable ? (
              <Link to={`/stays/${id}`}>
                <Button variant="navy" size="sm">
                  View & Book
                </Button>
              </Link>
            ) : (
              <Button variant="outline" size="sm" disabled>
                Sold Out
              </Button>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
