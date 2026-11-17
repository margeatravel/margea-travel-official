import { useState, useEffect } from "react";
import { MapPin, Calendar as CalendarIcon, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Language } from "./LanguageToggle";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { DateRange } from "react-day-picker";

export interface SearchFilters {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

interface HeroSearchProps {
  language: Language;
  onSearch?: (filters: SearchFilters) => void;
}

const translations = {
  en: {
    placeholder: "Select destination",
    checkIn: "Check-in",
    checkOut: "Check-out",
    guests: "Guests",
    search: "Search",
    akumal: "Akumal",
    playaDelCarmen: "Playa del Carmen",
    cancun: "Cancún",
    tulum: "Tulum",
    puertoMorelos: "Puerto Morelos",
    islaMujeres: "Isla Mujeres",
  },
  es: {
    placeholder: "Selecciona destino",
    checkIn: "Entrada",
    checkOut: "Salida",
    guests: "Huéspedes",
    search: "Buscar",
    akumal: "Akumal",
    playaDelCarmen: "Playa del Carmen",
    cancun: "Cancún",
    tulum: "Tulum",
    puertoMorelos: "Puerto Morelos",
    islaMujeres: "Isla Mujeres",
  },
};

export function HeroSearch({ language, onSearch }: HeroSearchProps) {
  const t = translations[language];
  const [destination, setDestination] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState(2);

  const handleSearch = () => {
    if (onSearch) {
      onSearch({
        destination,
        checkIn: dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : "",
        checkOut: dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : "",
        guests,
      });
    }
  };

  return (
    <div
      className="rounded-[16px] p-[10px]"
      style={{
        background: "rgba(255,255,255,0.18)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.35)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.25)",
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_1px_1fr_1px_1fr_1px_auto] gap-0 items-center">
        {/* Destination */}
        <div className="relative px-3 py-2">
          <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/70 z-10 pointer-events-none" />
          <Select value={destination} onValueChange={setDestination}>
            <SelectTrigger className="h-10 pl-8 text-sm rounded-[4px] font-inter bg-transparent border-0 text-white placeholder:text-white/55 focus:ring-0 focus:ring-offset-0 [&>svg]:text-white/70 hover:bg-white/[0.22] hover:border-white/[0.45] focus:bg-white/[0.25] focus:border-white/[0.6] transition-all duration-200 ease-out">
              <SelectValue placeholder={t.placeholder} />
            </SelectTrigger>
            <SelectContent className="rounded-[8px]">
              <SelectItem value="akumal">{t.akumal}</SelectItem>
              <SelectItem value="playa-del-carmen">{t.playaDelCarmen}</SelectItem>
              <SelectItem value="cancun">{t.cancun}</SelectItem>
              <SelectItem value="tulum">{t.tulum}</SelectItem>
              <SelectItem value="puerto-morelos">{t.puertoMorelos}</SelectItem>
              <SelectItem value="isla-mujeres">{t.islaMujeres}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Separator */}
        <div className="hidden lg:block w-px h-8 bg-white/[0.18]" />

        {/* Check-in & Check-out */}
        <div className="relative px-3 py-2">
          <CalendarIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/70 z-10 pointer-events-none" />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "h-10 w-full justify-start text-left font-normal pl-8 text-sm rounded-[4px] font-inter bg-transparent border-0 text-white hover:bg-white/[0.22] hover:text-white hover:border-white/[0.45] focus:bg-white/[0.25] focus:border-white/[0.6] transition-all duration-200 ease-out",
                  !dateRange && "text-white/55"
                )}
              >
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd")}
                    </>
                  ) : (
                    format(dateRange.from, "MMM dd, yyyy")
                  )
                ) : (
                  <span>{t.checkIn} - {t.checkOut}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 rounded-[8px]" align="start">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Separator */}
        <div className="hidden lg:block w-px h-8 bg-white/[0.18]" />

        {/* Guests */}
        <div className="relative px-3 py-2">
          <Users className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/70" />
          <input
            type="number"
            min="1"
            placeholder={t.guests}
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value))}
            className="h-10 w-full pl-8 pr-3 text-sm rounded-[4px] font-inter bg-transparent border-0 text-white placeholder:text-white/55 outline-none focus:ring-0 hover:bg-white/[0.22] focus:bg-white/[0.25] transition-all duration-200 ease-out [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>

        {/* Separator */}
        <div className="hidden lg:block w-px h-8 bg-white/[0.18]" />

        {/* Search Button */}
        <div className="px-2 py-2">
          <Button
            onClick={handleSearch}
            className="h-11 w-full lg:w-auto px-9 py-[13px] rounded-[50px] font-cormorant font-normal text-[16px] tracking-[0.08em] text-white hover:scale-100 hover:shadow-none transition-all duration-200 ease-out"
            style={{
              background: "rgba(255,255,255,0.25)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.45)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3)",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.38)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.25)"; }}
          >
            {t.search}
          </Button>
        </div>
      </div>
    </div>
  );
}
