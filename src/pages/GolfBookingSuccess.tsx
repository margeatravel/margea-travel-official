import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CheckCircle, Calendar, MapPin, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type Language = "en" | "es";

const GolfBookingSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [language, setLanguage] = useState<Language>("en");
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    document.title = "Tee Time Confirmed | Margea Golf";

    const saveBooking = async () => {
      if (!sessionId) {
        setLoading(false);
        return;
      }

      try {
        // Verify and save via edge function
        const { data, error } = await supabase.functions.invoke("verify-golf-booking", {
          body: { sessionId },
        });

        if (error) throw error;
        setBooking(data);
      } catch (err) {
        console.error("Error verifying golf booking:", err);
      } finally {
        setLoading(false);
      }
    };

    saveBooking();
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar language={language} onLanguageChange={setLanguage} />

      <div className="container mx-auto px-4 py-20 md:py-28">
        <div className="max-w-lg mx-auto text-center">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Tee Time Confirmed!
          </h1>
          <p className="text-muted-foreground mb-8">
            Your golf reservation has been confirmed and payment processed successfully.
          </p>

          {booking && (
            <div className="bg-card border border-border rounded-2xl p-6 text-left space-y-4 mb-8">
              <div className="text-center border-b border-border pb-4">
                <p className="text-xs text-muted-foreground">Confirmation Number</p>
                <p className="text-2xl font-bold text-primary">{booking.confirmationNumber}</p>
              </div>

              <div className="space-y-3">
                {booking.courseName && (
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-foreground">{booking.courseName}</span>
                  </div>
                )}
                {booking.preferredDate && (
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-foreground">{booking.preferredDate}</span>
                  </div>
                )}
                {booking.preferredTime && (
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-foreground">{booking.preferredTime}</span>
                  </div>
                )}
                {booking.numberOfPlayers && (
                  <div className="flex items-center gap-3 text-sm">
                    <Users className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-foreground">{booking.numberOfPlayers} Player{booking.numberOfPlayers > 1 ? "s" : ""}</span>
                  </div>
                )}
              </div>

              {booking.totalPrice && (
                <div className="border-t border-border pt-3 flex justify-between font-semibold">
                  <span>Total Paid</span>
                  <span className="text-primary">${booking.totalPrice} USD</span>
                </div>
              )}
            </div>
          )}

          {!loading && !booking && (
            <div className="bg-card border border-border rounded-2xl p-6 mb-8">
              <p className="text-muted-foreground">
                Your payment was successful! A confirmation email will be sent shortly.
              </p>
            </div>
          )}

          <p className="text-sm text-muted-foreground mb-6">
            A confirmation email has been sent to your inbox. Follow us{" "}
            <a
              href="https://www.instagram.com/margeatravel/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              @margeatravel
            </a>
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => navigate("/activities/golf")}>
              Browse More Courses
            </Button>
            <Button variant="outline" onClick={() => navigate("/")}>
              Back to Home
            </Button>
          </div>
        </div>
      </div>

      <Footer language={language} />
    </div>
  );
};

export default GolfBookingSuccess;
