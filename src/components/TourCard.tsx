import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { getRatingData } from "@/lib/ratings";
import { ShareButton } from "@/components/ShareButton";

interface TourCardProps {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
  description?: string;
  duration: string;
  rating: number;
  reviews: number;
  highlights?: string[];
  minPeople?: string;
  pricing: {
    shared?: {
      currentPrice: number;
    };
    individual?: {
      currentPrice: number;
    };
    currentPrice?: number;
  };
}

export function TourCard({
  id,
  image,
  title,
  subtitle,
  description,
  duration,
  rating,
  reviews,
  highlights,
  minPeople,
  pricing,
}: TourCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const sharedPrice = pricing.shared?.currentPrice;
  const singlePrice = pricing.individual?.currentPrice;
  const fromPrice = sharedPrice || pricing.currentPrice || 0;
  const hasSharedSingle = sharedPrice && singlePrice;
  
  const ratingData = useMemo(() => 
    getRatingData(`tour-${id}`, { rating, reviews }), 
    [id, rating, reviews]
  );

  return (
    <Link to={`/tours/${id}`} className="block h-full">
      <Card className="overflow-hidden rounded-[10px] cursor-pointer group h-full flex flex-col bg-white border border-[rgba(29,40,57,0.07)] shadow-[0_2px_12px_rgba(29,40,57,0.06)] transition-all duration-300 ease-out hover:-translate-y-[5px] hover:shadow-[0_16px_48px_rgba(29,40,57,0.13)]">
        <div className="relative h-[200px] overflow-hidden bg-muted rounded-t-[10px]">
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
            width={320}
            height={200}
            onLoad={() => setImageLoaded(true)}
            className={cn(
              "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
          />
        </div>
        
        <div className="p-5 space-y-2 flex-1 flex flex-col font-inter">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-inter font-semibold text-[15px] text-[#1d2839] line-clamp-2 leading-tight flex-1" style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px' }}>{title}</h3>
            <ShareButton
              title={title}
              url={`${typeof window !== 'undefined' ? window.location.origin : ''}/tours/${id}`}
              size="sm"
            />
          </div>
          
          {subtitle && (
            <p className="text-[13px] text-[#6b7280] line-clamp-2">{subtitle}</p>
          )}
          
          <div className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 fill-[#b8975a] text-[#b8975a]" />
            <span className="text-[13px] font-medium text-[#1d2839]">{ratingData.rating.toFixed(1)}</span>
            <span className="text-[13px] text-[#6b7280]">
              ({ratingData.reviews.toLocaleString()} reviews)
            </span>
          </div>

          <div className="text-[13px] text-[#6b7280]">{duration}</div>

          {highlights && highlights.length > 0 && (
            <ul className="space-y-0.5 py-1">
              {highlights.slice(0, 3).map((highlight, idx) => (
                <li key={idx} className="flex items-center gap-1.5 text-[13px] text-[#6b7280]">
                  <Check className="w-3 h-3 text-[#1d2839] flex-shrink-0" />
                  <span className="line-clamp-1">{highlight}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="pt-3 border-t border-[rgba(29,40,57,0.07)] mt-auto">
            <div className="flex items-baseline gap-1">
              <span className="text-[13px] text-[#6b7280]">From</span>
              <span className="font-inter font-bold text-[19px] text-[#1d2839]">${fromPrice}</span>
              <span className="text-[13px] text-[#6b7280]">USD</span>
              {minPeople && (
                <span className="text-[11px] text-[#6b7280] ml-1">({minPeople})</span>
              )}
            </div>
            {hasSharedSingle && (
              <div className="text-[11px] text-[#6b7280] mt-0.5">
                Shared: ${sharedPrice} | Single: ${singlePrice}
              </div>
            )}
          </div>

          <button 
            className="w-full mt-2 bg-[#1d2839] text-white rounded-[3px] font-inter font-semibold text-[13px] tracking-[0.08em] py-3 transition-all duration-[250ms] ease-out hover:shadow-[0_6px_20px_rgba(29,40,57,0.25)] hover:scale-[1.01]"
          >
            Book
          </button>
        </div>
      </Card>
    </Link>
  );
}
