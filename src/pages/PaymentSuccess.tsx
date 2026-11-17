import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [bookingReference, setBookingReference] = useState<string | null>(null);
  const [language, setLanguage] = useState<"en" | "es">("en");
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const confirmPayment = async () => {
      if (!sessionId) {
        toast.error("No payment session found");
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke(
          "confirm-booking-payment",
          {
            body: { sessionId },
          }
        );

        if (error) throw error;

        setBookingReference(data.bookingReference);
        toast.success("Booking confirmed! Check your email for details.");
      } catch (error: any) {
        console.error("Error confirming payment:", error);
        toast.error("Failed to confirm booking. Please contact support.");
      } finally {
        setLoading(false);
      }
    };

    confirmPayment();
  }, [sessionId]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar language={language} onLanguageChange={setLanguage} />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {loading ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary mb-4" />
                <p className="text-lg text-muted-foreground">
                  Confirming your booking...
                </p>
              </CardContent>
            </Card>
          ) : bookingReference ? (
            <Card>
              <CardHeader className="text-center">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <CardTitle className="text-3xl">Payment Successful!</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-center">
                <p className="text-lg">
                  Your booking has been confirmed. We've sent a confirmation
                  email with all the details.
                </p>
                <div className="bg-secondary/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">
                    Booking Reference
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    {bookingReference}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Please save this reference number for your records.
                </p>
                <div className="pt-4">
                  <Button asChild size="lg">
                    <Link to="/">Return to Home</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-lg text-destructive mb-4">
                  There was an error confirming your booking.
                </p>
                <p className="text-muted-foreground mb-6">
                  Please contact support with your payment confirmation.
                </p>
                <Button asChild>
                  <Link to="/">Return to Home</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer language={language} />
    </div>
  );
}
