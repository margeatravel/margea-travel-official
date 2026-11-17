import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, MapPin, Calendar, Users, Plane } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface BookingDetails {
  full_name: string;
  from: string;
  to: string;
  date: string;
  time: string;
  passengers: string;
  airline: string;
  flight_number: string;
  trip_type: string;
  return_date?: string;
  return_time?: string;
  total_price_mxn: string;
}

const TransportationSuccess = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'es'>('en');

  useEffect(() => {
    document.title = "Payment Confirmed | Margea Transportation";

    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      setError("No session ID provided");
      setLoading(false);
      return;
    }

    const confirmPayment = async () => {
      try {
        const { data, error: fnError } = await supabase.functions.invoke(
          "confirm-transportation-payment",
          { body: { session_id: sessionId } }
        );

        if (fnError) throw fnError;
        if (data.error) throw new Error(data.error);

        setBooking(data.booking);
      } catch (err: any) {
        console.error("Error confirming payment:", err);
        setError(err.message || "Failed to confirm payment");
      } finally {
        setLoading(false);
      }
    };

    confirmPayment();
  }, [searchParams]);

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("es-MX").format(parseInt(price || "0"));
  };

  const t = {
    en: {
      title: "Payment Confirmed!",
      subtitle: "Your transportation has been booked successfully.",
      whatsappNote: "We will confirm your driver details via WhatsApp shortly.",
      bookingDetails: "Booking Details",
      route: "Route",
      dateTime: "Date & Time",
      passengers: "Passengers",
      flight: "Flight Info",
      returnTrip: "Return Trip",
      amount: "Amount Paid",
      backHome: "Return to Transportation",
      errorTitle: "Something went wrong",
    },
    es: {
      title: "¡Pago Confirmado!",
      subtitle: "Tu transporte ha sido reservado exitosamente.",
      whatsappNote: "Confirmaremos los detalles de tu conductor por WhatsApp pronto.",
      bookingDetails: "Detalles de la Reserva",
      route: "Ruta",
      dateTime: "Fecha y Hora",
      passengers: "Pasajeros",
      flight: "Info de Vuelo",
      returnTrip: "Viaje de Regreso",
      amount: "Monto Pagado",
      backHome: "Volver a Transporte",
      errorTitle: "Algo salió mal",
    },
  };

  const text = t[language];

  return (
    <div className="min-h-screen bg-background">
      <Navbar language={language} onLanguageChange={setLanguage} />

      <div className="container mx-auto px-4 py-24 min-h-[70vh] flex items-center justify-center">
        {loading ? (
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Confirming your payment...</p>
          </div>
        ) : error ? (
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">⚠️</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-4">{text.errorTitle}</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Link to="/activities/transportation">
              <Button>{text.backHome}</Button>
            </Link>
          </div>
        ) : booking ? (
          <div className="max-w-lg w-full">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{text.title}</h1>
              <p className="text-muted-foreground">{text.subtitle}</p>
            </div>

            <div className="bg-muted/30 rounded-xl p-6 space-y-4">
              <h2 className="font-semibold text-lg text-foreground mb-4">{text.bookingDetails}</h2>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">{text.route}</p>
                  <p className="font-medium text-foreground">
                    {booking.from} → {booking.to}
                  </p>
                  {booking.trip_type === "round_trip" && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded mt-1 inline-block">
                      Round Trip
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">{text.dateTime}</p>
                  <p className="font-medium text-foreground">
                    {booking.date} at {booking.time}
                  </p>
                </div>
              </div>

              {booking.trip_type === "round_trip" && booking.return_date && (
                <div className="flex items-start gap-3 pl-8">
                  <div>
                    <p className="text-sm text-muted-foreground">{text.returnTrip}</p>
                    <p className="font-medium text-foreground">
                      {booking.return_date} at {booking.return_time}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">{text.passengers}</p>
                  <p className="font-medium text-foreground">{booking.passengers}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Plane className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">{text.flight}</p>
                  <p className="font-medium text-foreground">
                    {booking.airline} - {booking.flight_number}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{text.amount}</span>
                  <span className="text-2xl font-bold text-primary">
                    ${formatPrice(booking.total_price_mxn)} MXN
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-800 text-sm text-center">
                📱 {text.whatsappNote}
              </p>
            </div>

            <div className="mt-8 text-center">
              <Link to="/activities/transportation">
                <Button variant="outline">{text.backHome}</Button>
              </Link>
            </div>
          </div>
        ) : null}
      </div>

      <Footer language={language} />
    </div>
  );
};

export default TransportationSuccess;
