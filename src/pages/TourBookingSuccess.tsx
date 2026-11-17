import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/components/LanguageToggle";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  MessageCircle,
  CalendarPlus,
  ArrowLeft,
  Loader2,
  Ticket
} from "lucide-react";
import { format } from "date-fns";

interface BookingDetails {
  tourTitle: string;
  variantTitle: string;
  date: string;
  time: string;
  adults: number;
  children: number;
  total: number;
  currency: string;
}

export default function TourBookingSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      setIsLoading(false);
      return;
    }
    // Mock data - in production fetch from Stripe
    setTimeout(() => {
      setBookingDetails({
        tourTitle: "Tour Booking",
        variantTitle: "Standard",
        date: format(new Date(), "yyyy-MM-dd"),
        time: "09:00",
        adults: 2,
        children: 0,
        total: 200,
        currency: "USD",
      });
      setIsLoading(false);
    }, 500);
  }, [sessionId]);

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Hi! I just completed my tour booking (Session: ${sessionId?.slice(-8)}). I'd like to share my pickup/hotel details.`
    );
    window.open(`https://wa.me/529841234567?text=${message}`, "_blank");
  };

  const handleAddToCalendar = () => {
    if (!bookingDetails) return;
    const startDate = new Date(`${bookingDetails.date}T${bookingDetails.time}:00`);
    const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000);
    const event = {
      title: `${bookingDetails.tourTitle} - ${bookingDetails.variantTitle}`,
      start: startDate.toISOString().replace(/-|:|\.\d\d\d/g, ""),
      end: endDate.toISOString().replace(/-|:|\.\d\d\d/g, ""),
      description: `Tour booking for ${bookingDetails.adults} adult(s)`,
    };
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.start}/${event.end}&details=${encodeURIComponent(event.description)}`;
    window.open(googleCalendarUrl, "_blank");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar language={language} onLanguageChange={setLanguage} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading your booking details...</p>
          </div>
        </main>
        <Footer language={language} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary/5 to-background">
      <Navbar language={language} onLanguageChange={setLanguage} />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">
              Payment Received!
            </h1>
            <p className="text-muted-foreground">
              Your tour booking has been confirmed.
            </p>
          </div>

          {sessionId && (
            <Card className="relative overflow-hidden border-2 border-dashed border-primary/30 bg-card mb-6">
              <div className="px-6 py-4 bg-muted/50 border-b border-dashed border-primary/20">
                <div className="flex items-center gap-2 mb-1">
                  <Ticket className="w-5 h-5 text-primary" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Booking Confirmed
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Confirmation: #{sessionId.slice(-8).toUpperCase()}
                </p>
              </div>

              <div className="px-6 py-5">
                {bookingDetails ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold text-lg">{bookingDetails.tourTitle}</h3>
                      <p className="text-sm text-muted-foreground">{bookingDetails.variantTitle}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{format(new Date(bookingDetails.date), "MMM d, yyyy")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{bookingDetails.time}</span>
                      </div>
                      <div className="flex items-center gap-2 col-span-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>
                          {bookingDetails.adults} Adult{bookingDetails.adults !== 1 ? "s" : ""}
                          {bookingDetails.children > 0 && `, ${bookingDetails.children} Children`}
                        </span>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-dashed border-primary/20">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Total Paid</span>
                        <span className="text-xl font-bold text-primary">
                          ${bookingDetails.total} {bookingDetails.currency}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    Your booking has been confirmed.
                  </p>
                )}
              </div>
            </Card>
          )}

          <div className="space-y-3">
            <Button onClick={handleWhatsApp} className="w-full h-12 gap-2" size="lg">
              <MessageCircle className="w-5 h-5" />
              Message us your pickup details
            </Button>
            <Button onClick={handleAddToCalendar} variant="outline" className="w-full h-11 gap-2">
              <CalendarPlus className="w-5 h-5" />
              Add to Calendar
            </Button>
            <Button onClick={() => navigate("/tours")} variant="ghost" className="w-full gap-2">
              <ArrowLeft className="w-4 h-4" />
              Browse more tours
            </Button>
          </div>

          <div className="mt-8 p-4 bg-muted/50 rounded-lg text-center">
            <MapPin className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Please message us with your hotel name for pickup coordination.
            </p>
          </div>
        </div>
      </main>
      
      <Footer language={language} />
    </div>
  );
}
