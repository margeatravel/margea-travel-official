import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Search, Users } from "lucide-react";

interface HotelSearchModuleProps {
  onSearch: (checkIn: string, checkOut: string, guests: number) => void;
  loading?: boolean;
}

export function HotelSearchModule({ onSearch, loading }: HotelSearchModuleProps) {
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [guests, setGuests] = useState(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkIn && checkOut && new Date(checkOut) > new Date(checkIn)) {
      onSearch(checkIn, checkOut, guests);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card border border-[rgba(29,40,57,0.08)] rounded-[12px] shadow-[0_4px_24px_rgba(29,40,57,0.08)] p-5 md:p-6"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Check-in */}
        <div className="space-y-1.5">
          <label className="text-[12px] font-inter font-medium tracking-[0.08em] uppercase text-muted-foreground flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            Check-in
          </label>
          <Input
            type="date"
            value={checkIn}
            min={today}
            onChange={(e) => {
              setCheckIn(e.target.value);
              if (e.target.value >= checkOut) {
                const next = new Date(e.target.value);
                next.setDate(next.getDate() + 1);
                setCheckOut(next.toISOString().split("T")[0]);
              }
            }}
            className="font-inter"
          />
        </div>

        {/* Check-out */}
        <div className="space-y-1.5">
          <label className="text-[12px] font-inter font-medium tracking-[0.08em] uppercase text-muted-foreground flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            Check-out
          </label>
          <Input
            type="date"
            value={checkOut}
            min={checkIn || today}
            onChange={(e) => setCheckOut(e.target.value)}
            className="font-inter"
          />
        </div>

        {/* Guests */}
        <div className="space-y-1.5">
          <label className="text-[12px] font-inter font-medium tracking-[0.08em] uppercase text-muted-foreground flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            Guests
          </label>
          <Input
            type="number"
            min={1}
            max={10}
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="font-inter"
          />
        </div>

        {/* Search button */}
        <div className="flex items-end">
          <Button type="submit" variant="navy" className="w-full h-10 gap-2" disabled={loading}>
            <Search className="h-4 w-4" />
            Search Availability
          </Button>
        </div>
      </div>
    </form>
  );
}
