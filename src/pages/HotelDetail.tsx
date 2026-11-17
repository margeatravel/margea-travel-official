import { useEffect, useState, useMemo, useCallback } from "react";
import { ShareButton } from "@/components/ShareButton";
import { useParams, Link } from "react-router-dom";
import { useLanguage } from "@/components/LanguageToggle";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/hooks/use-currency";

import { HotelSearchModule } from "@/components/hotel/HotelSearchModule";
import { RoomTypeCard } from "@/components/hotel/RoomTypeCard";
import {
  ROOM_TYPE_CONFIG,
  simulateAvailability,
  calculateNights,
  type RoomCategory,
} from "@/data/hotel-data";
import {
  MapPin,
  ChevronLeft,
  Star,
  Hotel,
  Waves,
  UtensilsCrossed,
  Sparkles,
} from "lucide-react";
import { getRatingData } from "@/lib/ratings";

interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  property_type: string;
  price_per_night: number;
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  minimum_nights: number;
  amenities: string[];
  image_urls: string[];
  unit_type: string | null;
  beds: number | null;
  special_features: string[] | null;
}

const HOTEL_HIGHLIGHTS = [
  { icon: Waves, label: "Private Beach Club" },
  { icon: UtensilsCrossed, label: "Gourmet Restaurant" },
  { icon: Sparkles, label: "Spa & Wellness" },
  { icon: Hotel, label: "Boutique Hotel" },
];

export default function HotelDetail() {
  const { id } = useParams();
  const { language, setLanguage } = useLanguage();
  const { formatPrice } = useCurrency();
  const [hotel, setHotel] = useState<Property | null>(null);
  const [rooms, setRooms] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);

  // Search state
  const [searchDone, setSearchDone] = useState(false);
  const [searchParams, setSearchParams] = useState<{
    checkIn: string;
    checkOut: string;
    guests: number;
  } | null>(null);
  const [activeCategory, setActiveCategory] = useState<RoomCategory>("all");

  const HERO_IMAGES = [
    "/hotel-images/anayiose-hero-1.jpeg",
    "/hotel-images/anayiose-hero-2.jpeg",
    "/hotel-images/anayiose-hero-3.jpeg",
  ];

  // Preload hero images
  useEffect(() => {
    HERO_IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Autoplay carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchHotel();
  }, [id]);

  const fetchHotel = async () => {
    try {
      const { data: hotelData, error: hotelError } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (hotelError) throw hotelError;
      if (!hotelData) return;

      setHotel(hotelData as Property);

      const { data: roomsData, error: roomsError } = await supabase
        .from("properties")
        .select("*")
        .eq("parent_property_id", id)
        .eq("available", true)
        .order("price_per_night", { ascending: true });

      if (roomsError) throw roomsError;
      setRooms((roomsData as Property[]) || []);
    } catch (error) {
      console.error("Error loading hotel:", error);
    } finally {
      setLoading(false);
    }
  };

  const ratingData = useMemo(
    () => getRatingData(id || "", {}),
    [id]
  );

  const lowestPrice = useMemo(() => {
    if (rooms.length === 0) return 0;
    return Math.min(...rooms.map((r) => Number(r.price_per_night)));
  }, [rooms]);

  const handleSearch = useCallback(
    (checkIn: string, checkOut: string, guests: number) => {
      setSearchParams({ checkIn, checkOut, guests });
      setSearchDone(true);
      setActiveCategory("all");
      // Scroll to results
      setTimeout(() => {
        document
          .getElementById("room-results")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    },
    []
  );

  const filteredRooms = useMemo(() => {
    let filtered = rooms;

    // Filter by guest count
    if (searchParams) {
      filtered = filtered.filter(
        (r) => r.max_guests >= searchParams.guests
      );
    }

    // Filter by category
    if (activeCategory !== "all") {
      filtered = filtered.filter((r) => {
        const config = ROOM_TYPE_CONFIG[r.title];
        return config?.category === activeCategory;
      });
    }

    return filtered;
  }, [rooms, searchParams, activeCategory]);

  const nights = searchParams
    ? calculateNights(searchParams.checkIn, searchParams.checkOut)
    : 1;

  const categories: { key: RoomCategory; label: string }[] = [
    { key: "all", label: "All" },
    { key: "room", label: "Rooms" },
    { key: "suite", label: "Suites" },
    { key: "villa", label: "Villas" },
  ];


  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar language={language} onLanguageChange={setLanguage} />
        <div className="flex-1 container mx-auto px-4 py-16 space-y-8">
          <Skeleton className="h-[400px] w-full rounded-[12px]" />
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-6 w-1/2" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-48 w-full rounded-[12px]" />
            ))}
          </div>
        </div>
        <Footer language={language} />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar language={language} onLanguageChange={setLanguage} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Hotel Not Found</h1>
            <Link to="/stays">
              <button className="px-6 py-3 bg-[#1d2839] text-white rounded-[50px] font-inter text-[13px] tracking-[0.08em]">
                Back to Stays
              </button>
            </Link>
          </div>
        </main>
        <Footer language={language} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <title>{hotel.title} — Luxury Boutique Hotel in Tulum | Margea</title>
      <meta
        name="description"
        content={`Book ${hotel.title} direct. Beachfront boutique hotel in Tulum with private beach club, spa, and gourmet dining. No platform fees.`}
      />

      <Navbar language={language} onLanguageChange={setLanguage} />

      {/* Hero Carousel */}
      <section className="relative h-[55vh] min-h-[420px] flex items-end overflow-hidden">
        {HERO_IMAGES.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out"
            style={{
              backgroundImage: `url('${src}')`,
              opacity: i === heroIndex ? 1 : 0,
            }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />

        {/* Hotel info overlay */}
        <div className="relative z-20 w-full px-4 pb-8">
          <div className="container mx-auto">
            <Badge className="mb-3 bg-white/20 backdrop-blur-sm border-white/30 text-white text-[10px] tracking-[0.12em] uppercase rounded-[3px]">
              Boutique Hotel
            </Badge>
            <div className="flex items-start gap-3 mb-2">
              <h1
                className="text-3xl md:text-5xl text-white flex-1"
                style={{ fontWeight: 400, textShadow: "0 2px 12px rgba(0,0,0,0.45)" }}
              >
                {hotel.title}
              </h1>
              <ShareButton title={hotel.title} variant="light" stopPropagation={false} />
            </div>
            <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm font-inter">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {hotel.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-[#b8975a] text-[#b8975a]" />
                {ratingData.rating.toFixed(1)} ({ratingData.reviews} reviews)
              </span>
              {lowestPrice > 0 && (
                <span className="text-white/80">
                  From{" "}
                  <span className="font-semibold text-white">
                    {formatPrice(lowestPrice)}
                  </span>{" "}
                  / night
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1 container mx-auto px-4 sm:px-6">
        {/* Back link */}
        <Link
          to="/stays"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mt-6 mb-6 transition-colors text-[13px] font-inter"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to properties
        </Link>

        {/* Highlights strip */}
        <div className="flex flex-wrap gap-3 mb-8">
          {HOTEL_HIGHLIGHTS.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 bg-muted/50 rounded-full px-4 py-2 text-[12px] font-inter text-[#1d2839]"
            >
              <Icon className="h-4 w-4 text-[#b8975a]" />
              {label}
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="max-w-3xl mb-10">
          <p className="text-muted-foreground leading-relaxed font-inter text-[15px]">
            {hotel.description}
          </p>
        </div>

        {/* Amenities */}
        {hotel.amenities && hotel.amenities.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-[#1d2839] font-inter">
              Hotel Amenities
            </h2>
            <div className="flex flex-wrap gap-2">
              {hotel.amenities.map((amenity) => (
                <Badge
                  key={amenity}
                  variant="secondary"
                  className="px-3 py-1.5 text-[12px] font-inter font-normal rounded-full"
                >
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Search Module */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-[#1d2839] font-inter">
            Check Availability
          </h2>
          <HotelSearchModule onSearch={handleSearch} />
        </div>

        {/* Room Results */}
        <div id="room-results" className="pb-16">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-xl font-semibold text-[#1d2839] font-inter">
              {searchDone
                ? `${filteredRooms.length} room${filteredRooms.length !== 1 ? "s" : ""} available`
                : `${rooms.length} Room Types`}
            </h2>

            {/* Category filter */}
            <div className="flex gap-2">
              {categories.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-[12px] font-inter font-medium transition-all",
                    activeCategory === key
                      ? "bg-[#1d2839] text-white shadow-md"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Room Cards */}
          <div className="space-y-4">
            {filteredRooms.map((room) => {
              const config = ROOM_TYPE_CONFIG[room.title];
              const availability =
                searchDone && searchParams
                  ? simulateAvailability(
                      room.title,
                      searchParams.checkIn,
                      searchParams.checkOut
                    )
                  : null;

              return (
                <RoomTypeCard
                  key={room.id}
                  id={room.id}
                  title={room.title}
                  description={room.description}
                  image={room.image_urls?.[0] || ""}
                  maxGuests={room.max_guests}
                  pricePerNight={Number(room.price_per_night)}
                  amenities={room.amenities || []}
                  bedConfig={config?.bedConfig || `${room.beds || 1} Bed(s)`}
                  nights={nights}
                  availability={availability}
                  category={config?.category || "room"}
                />
              );
            })}
          </div>

          {filteredRooms.length === 0 && searchDone && (
            <div className="text-center py-12">
              <p className="text-muted-foreground font-inter text-lg mb-2">
                No rooms available for your search
              </p>
              <p className="text-muted-foreground font-inter text-sm">
                Try different dates or fewer guests
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer language={language} />
    </div>
  );
}
