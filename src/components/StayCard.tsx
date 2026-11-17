import { Star, MapPin, BedDouble } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { useCurrency } from "@/hooks/use-currency";
import { cn } from "@/lib/utils";
import { getRatingData } from "@/lib/ratings";
import { ShareButton } from "@/components/ShareButton";

interface StayCardProps {
  id: string;
  image: string;
  title: string;
  location: string;
  bedrooms: number;
  guests: number;
  pricePerNight: number;
  rating?: number;
  reviews?: number;
  featured?: boolean;
  isDevelopment?: boolean;
  isHotel?: boolean;
  isPremium?: boolean;
}

export function StayCard({
  id,
  image,
  title,
  location,
  bedrooms,
  guests,
  pricePerNight,
  rating,
  reviews,
  featured,
  isDevelopment,
  isHotel,
  isPremium,
}: StayCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { formatPrice } = useCurrency();
  
  const ratingData = useMemo(() => 
    getRatingData(id, { rating, reviews }), 
    [id, rating, reviews]
  );
  return (
    <Link to={isHotel ? `/hotel/${id}` : isDevelopment ? `/development/${id}` : `/stays/${id}`}>
      <Card className={cn(
        "overflow-hidden rounded-[10px] cursor-pointer h-full bg-white group",
        "border border-[rgba(29,40,57,0.07)] shadow-[0_2px_12px_rgba(29,40,57,0.06)]",
        "transition-all duration-300 ease-out hover:-translate-y-[5px] hover:shadow-[0_16px_48px_rgba(29,40,57,0.13)]",
        isPremium && "ring-2 ring-secondary/60 shadow-md"
      )}>
        <div className="relative h-[220px] overflow-hidden bg-muted rounded-t-[10px]">
          {/* Shimmer placeholder */}
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
            decoding="async"
            width={400}
            height={220}
            onLoad={() => setImageLoaded(true)}
            className={cn(
              "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
          />
          {isPremium && (
            <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground font-semibold shadow-md rounded-[3px] text-[10px] tracking-[0.1em] uppercase px-[9px] py-1">
              ✦ Premium
            </Badge>
          )}
          {featured && !isPremium && (
            <Badge className="absolute top-3 left-3 bg-[#1d2839] text-white font-semibold rounded-[3px] text-[10px] tracking-[0.1em] uppercase px-[9px] py-1 border-0">
              Featured
            </Badge>
          )}
          <div className="absolute top-3 right-3 bg-white rounded-[3px] px-[9px] py-1 flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-[#b8975a] text-[#b8975a]" />
            <span className="font-inter font-semibold text-[#1d2839] text-[12px]">{ratingData.rating.toFixed(1)}</span>
            <span className="text-[11px] text-[#6b7280] font-inter">({ratingData.reviews.toLocaleString()})</span>
          </div>
        </div>
        <CardContent className="px-5 pt-[18px] pb-5">
          <div className="flex items-start justify-between gap-2 mb-[6px]">
            <h3 className="font-inter font-semibold text-[15px] text-[#1d2839] line-clamp-1 flex-1" style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px' }}>
              {title}
            </h3>
            <ShareButton
              title={title}
              url={`${typeof window !== 'undefined' ? window.location.origin : ''}${isHotel ? `/hotel/${id}` : isDevelopment ? `/development/${id}` : `/stays/${id}`}`}
              size="sm"
            />
          </div>
          <div className="flex items-center gap-2 text-[13px] text-[#6b7280] mb-2 font-inter">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="line-clamp-1">{location}</span>
          </div>
          {(isDevelopment || isHotel) ? (
            <div className="text-[13px] text-[#6b7280] font-inter">
              <span className="font-medium text-[#1d2839]">{isHotel ? 'Boutique Hotel' : 'Hotel & Villas'}</span>
              <span className="mx-2">•</span>
              <span>{isHotel ? 'View rooms' : 'View units'}</span>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4 text-[13px] text-[#6b7280] mb-3 font-inter">
                <div className="flex items-center gap-1">
                  <BedDouble className="h-4 w-4" />
                  <span>{bedrooms} bedrooms</span>
                </div>
                <span>•</span>
                <span>{guests} guests</span>
              </div>
              <div className="flex items-baseline gap-1 mt-3">
                {pricePerNight > 0 ? (
                  <>
                    <span className="font-inter font-bold text-[19px] text-[#1d2839]">{formatPrice(pricePerNight)}</span>
                    <span className="text-[13px] text-[#9aa5b4] font-inter font-normal">/ night</span>
                  </>
                ) : (
                  <span className="font-inter font-semibold text-[16px] text-[#1d2839]">Consultar tarifa</span>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
