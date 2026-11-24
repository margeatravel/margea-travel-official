import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CheckCircle2, Loader2, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCurrency } from "@/hooks/use-currency";

interface Confirmation {
  confirmationNumber: string;
  carName: string;
  pickupDate: string;
  returnDate: string;
  totalDays: number;
  totalMxn: number;
  depositPaidMxn: number;
  balanceDueMxn: number;
  status: string;
}

const translations = {
  en: {
    confirming: "Confirming your rental...",
    title: "Deposit received!",
    subtitle:
      "Your 50% deposit is paid. We are confirming availability with YAAB and will email you within 24 hours with the final confirmation. If no car is available, your deposit is refunded in full.",
    reference: "Booking Reference",
    saveReference: "Please save this reference number for your records.",
    car: "Car",
    dates: "Dates",
    days: "days",
    total: "Rental total",
    depositPaid: "Deposit paid (50%)",
    balanceDue: "Balance due on delivery (50%)",
    balanceNote: "Cash or bank transfer to YAAB when you receive the car.",
    pending: "Status: pending YAAB confirmation",
    home: "Return to Home",
    browseCars: "Browse cars",
    errorTitle: "There was an error confirming your rental.",
    errorText: "Please contact support with your payment confirmation.",
    noSession: "No payment session found",
    confirmError: "Failed to confirm rental. Please contact support.",
  },
  es: {
    confirming: "Confirmando tu renta...",
    title: "¡Anticipo recibido!",
    subtitle:
      "Tu anticipo del 50% está pagado. Estamos confirmando la disponibilidad con YAAB y te escribiremos en menos de 24 horas con la confirmación final. Si no hay auto disponible, se te reembolsa el anticipo completo.",
    reference: "Número de referencia",
    saveReference: "Guarda este número para cualquier consulta sobre tu renta.",
    car: "Auto",
    dates: "Fechas",
    days: "días",
    total: "Total de la renta",
    depositPaid: "Anticipo pagado (50%)",
    balanceDue: "Saldo a la entrega (50%)",
    balanceNote: "Efectivo o transferencia a YAAB al recibir el auto.",
    pending: "Estado: pendiente de confirmación de YAAB",
    home: "Volver al inicio",
    browseCars: "Ver autos",
    errorTitle: "Hubo un error al confirmar tu renta.",
    errorText: "Contacta a soporte con tu comprobante de pago.",
    noSession: "No se encontró la sesión de pago",
    confirmError: "No se pudo confirmar la renta. Contacta a soporte.",
  },
};

export default function CarRentalBookingSuccess() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [language, setLanguage] = useState<"en" | "es">("en");
  const { formatPrice } = useCurrency();
  const sessionId = searchParams.get("session_id");
  const t = translations[language];

  useEffect(() => {
    const confirmPayment = async () => {
      if (!sessionId) {
        toast.error(t.noSession);
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase.functions.invoke(
          "confirm-car-rental-payment",
          { body: { sessionId } }
        );
        if (error) throw error;
        if (data?.error) throw new Error(data.error);
        setConfirmation({
          confirmationNumber: data.confirmationNumber,
          carName: data.carName,
          pickupDate: data.pickupDate,
          returnDate: data.returnDate,
          totalDays: data.totalDays,
          totalMxn: data.totalMxn,
          depositPaidMxn: data.depositPaidMxn,
          balanceDueMxn: data.balanceDueMxn,
          status: data.status,
        });
      } catch (error: unknown) {
        console.error("Error confirming car rental payment:", error);
        toast.error(t.confirmError);
      } finally {
        setLoading(false);
      }
    };
    confirmPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                <p className="text-lg text-muted-foreground">{t.confirming}</p>
              </CardContent>
            </Card>
          ) : confirmation ? (
            <Card>
              <CardHeader className="text-center">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <CardTitle className="text-3xl">{t.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-center">
                <p className="text-muted-foreground">{t.subtitle}</p>
                <div className="bg-secondary/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">{t.reference}</p>
                  <p className="text-2xl font-bold text-primary">
                    {confirmation.confirmationNumber}
                  </p>
                </div>
                <div className="text-left bg-muted/30 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t.car}</span>
                    <span className="font-semibold">{confirmation.carName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t.dates}</span>
                    <span className="font-semibold">
                      {confirmation.pickupDate} → {confirmation.returnDate} (
                      {confirmation.totalDays} {t.days})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t.total}</span>
                    <span className="font-semibold">{formatPrice(confirmation.totalMxn)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t.depositPaid}</span>
                    <span className="font-semibold text-primary">
                      {formatPrice(confirmation.depositPaidMxn)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t.balanceDue}</span>
                    <span className="font-semibold">
                      {formatPrice(confirmation.balanceDueMxn)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{t.balanceNote}</p>
                </div>
                <p className="text-sm text-amber-600 flex items-center justify-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {t.pending}
                </p>
                <p className="text-sm text-muted-foreground">{t.saveReference}</p>
                <div className="pt-4 flex gap-3 justify-center flex-wrap">
                  <Button asChild size="lg">
                    <Link to="/">{t.home}</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link to="/activities/car-rentals">{t.browseCars}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-lg text-destructive mb-4">{t.errorTitle}</p>
                <p className="text-muted-foreground mb-6">{t.errorText}</p>
                <Button asChild>
                  <Link to="/">{t.home}</Link>
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
