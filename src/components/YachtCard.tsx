import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Anchor } from "lucide-react";
import { useLanguage } from "@/components/LanguageToggle";
import { getYachtContent } from "@/data/yachts-data";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ShareButton } from "@/components/ShareButton";

interface YachtCardProps {
  id: string;
  name: string;
  marina: string;
  size: string;
  capacity: number;
  image: string;
  pricing: { duration: string; price: string }[];
  currency: "MXN" | "USD";
}

export function YachtCard({
  id,
  name,
  marina,
  size,
  capacity,
  image,
  pricing,
  currency,
}: YachtCardProps) {
  const { language } = useLanguage();
  const [imageLoaded, setImageLoaded] = useState(false);
  const yachtContent = getYachtContent(id, language);
  const startingPrice = pricing[0];
  
  const capacityText = language === "en" ? "Up to" : "Hasta";
  const peopleText = language === "en" ? "people" : "personas";

  return (
    <Link to={`/yachts/${id}`}>
      <Card className="group overflow-hidden rounded-[10px] bg-white border border-[rgba(29,40,57,0.07)] shadow-[0_2px_12px_rgba(29,40,57,0.06)] transition-all duration-300 ease-out hover:shadow-[0_16px_48px_rgba(29,40,57,0.13)] h-full hover:-translate-y-[5px]">
        <div className="relative h-[280px] overflow-hidden bg-muted rounded-t-[10px]">
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
            alt={name}
            loading="lazy"
            decoding="async"
            width={680}
            height={280}
            onLoad={() => setImageLoaded(true)}
            className={cn(
              "w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute top-4 left-4">
            <Badge className="bg-[#1d2839] text-white font-semibold border-0 rounded-[3px] text-[10px] tracking-[0.1em] uppercase px-[9px] py-1">
              {size}
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-cormorant font-normal text-2xl text-[#1d2839] group-hover:text-[#b8975a] transition-colors duration-200 flex-1">
              {yachtContent.name}
            </h3>
            <ShareButton
              title={yachtContent.name}
              url={`${typeof window !== 'undefined' ? window.location.origin : ''}/yachts/${id}`}
              size="sm"
            />
          </div>
          
          <div className="flex items-center gap-2 text-[#6b7280] mb-4 font-inter">
            <Anchor className="w-4 h-4" />
            <span className="text-[13px]">{marina}</span>
          </div>

          <div className="flex items-center gap-2 text-[#6b7280] mb-4 font-inter">
            <Users className="w-4 h-4" />
            <span className="text-[13px]">{capacityText} {capacity} {peopleText}</span>
          </div>

          <div className="pt-4 border-t border-[rgba(29,40,57,0.07)]">
            <div className="text-[13px] text-[#6b7280] font-inter">Desde</div>
            <div className="font-inter font-bold text-[19px] text-[#1d2839]">
              ${startingPrice.price} {currency}
            </div>
            <div className="text-[13px] text-[#6b7280] font-inter">{startingPrice.duration}</div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
