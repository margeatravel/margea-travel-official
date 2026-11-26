import { useParams, Link, useNavigate } from "react-router-dom";
import { ShareButton } from "@/components/ShareButton";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/LanguageToggle";
import { yachts, getYachtContent } from "@/data/yachts-data";
import { Users, Anchor, Calendar, MessageCircle, ArrowLeft, Check, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MemberCodeInput } from "@/components/MemberCodeInput";
import { MemberCode } from "@/config/member-codes";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const translations = {
  en: {
    backToYachts: "Back to Yachts",
    capacity: "Capacity",
    marina: "Marina",
    size: "Size",
    description: "Description",
    pricing: "Pricing",
    features: "Features Included",
    bookNow: "Book Now",
    sms: "SMS",
    checkAvailability: "Book",
    notFound: "Yacht not found",
    notFoundDescription: "The yacht you're looking for doesn't exist.",
    perHour: "per hour",
    minimum: "Minimum",
    hours: "hours",
    from: "From",
    notesTitle: "Good to know",
    notes: [
      "Extra passenger: $1,000 MXN per person, up to the yacht's maximum capacity.",
      "Special dates (Dec 24, Dec 31 and Jan 1): +$2,000 MXN.",
      "Pier tax: $150 MXN per person, not included in the yacht rate.",
      "Prices exclude 16% IVA (added for invoices).",
      "Rates valid from December 1, 2026.",
    ],
    durationLabel: "Duration",
  },
  es: {
    backToYachts: "Volver a Yates",
    capacity: "Capacidad",
    marina: "Marina",
    size: "Tamaño",
    description: "Descripción",
    pricing: "Precios",
    features: "Características Incluidas",
    bookNow: "Reservar Ahora",
    sms: "SMS",
    checkAvailability: "Reservar",
    notFound: "Yate no encontrado",
    notFoundDescription: "El yate que buscas no existe.",
    perHour: "por hora",
    minimum: "Mínimo",
    hours: "horas",
    from: "Desde",
    notesTitle: "Información importante",
    notes: [
      "Pasajero extra: $1,000 MXN por persona, hasta la capacidad máxima del yate.",
      "Fechas especiales (24 dic, 31 dic y 1 ene): +$2,000 MXN.",
      "Impuesto de muelle: $150 MXN por persona, no incluido en la tarifa del yate.",
      "Precios sin IVA (para factura se agrega 16% de IVA).",
      "Tarifas vigentes desde el 1 de diciembre de 2026.",
    ],
    durationLabel: "Duración",
  },
};

export default function YachtDetail() {
  const { id } = useParams();
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const t = translations[language];
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appliedMemberCode, setAppliedMemberCode] = useState<MemberCode | null>(null);
  const [bookingData, setBookingData] = useState({
    name: "",
    email: "",
    phone: "",
    requestedDate: "",
    guests: "",
    duration: "",
    specialRequests: "",
  });

  const handleMemberCodeApplied = (_discount: number, code: MemberCode | null) => {
    setAppliedMemberCode(code);
  };

  const yacht = yachts.find((y) => y.id === id);
  const yachtContent = yacht ? getYachtContent(yacht.id, language) : null;

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookingData.name || !bookingData.email) {
      toast.error(
        language === "en" 
          ? "Please fill in all required fields" 
          : "Por favor completa todos los campos requeridos"
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(bookingData.email)) {
      toast.error(
        language === "en" 
          ? "Please enter a valid email address" 
          : "Por favor ingresa un correo electrónico válido"
      );
      return;
    }

    const durationText = bookingData.duration
      ? `${bookingData.duration} ${language === "en" ? "hours" : "horas"}`
      : null;

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from("yacht_bookings")
        .insert({
          yacht_name: yacht?.name || "",
          yacht_size: yacht?.size || "",
          guest_name: bookingData.name.trim(),
          guest_email: bookingData.email.trim(),
          guest_phone: bookingData.phone?.trim() || null,
          requested_date: bookingData.requestedDate || null,
          guests: bookingData.guests ? parseInt(bookingData.guests) : null,
          duration: durationText,
          special_requests: bookingData.specialRequests?.trim() || null,
        })
        .select("confirmation_number")
        .single();

      if (error) throw error;

      // Send email notification
      try {
        await supabase.functions.invoke('send-yacht-booking-notification', {
          body: {
            yacht_name: yacht?.name || "",
            yacht_size: yacht?.size || "",
            guest_name: bookingData.name.trim(),
            guest_email: bookingData.email.trim(),
            guest_phone: bookingData.phone?.trim() || null,
            requested_date: bookingData.requestedDate || null,
            guests: bookingData.guests ? parseInt(bookingData.guests) : null,
            duration: durationText,
            special_requests: bookingData.specialRequests?.trim() || null,
            confirmation_number: data.confirmation_number,
            member_code: appliedMemberCode?.code || null
          }
        });
      } catch (emailError) {
        console.error("Error sending notification email:", emailError);
        // Don't fail the booking if email fails
      }

      setIsBookingDialogOpen(false);
      navigate(`/request-confirmation?ref=${data.confirmation_number}&type=yacht`);
      
    } catch (error) {
      console.error("Error submitting yacht booking:", error);
      toast.error(
        language === "en" 
          ? "There was an error submitting your booking. Please try again." 
          : "Hubo un error al enviar tu reserva. Por favor intenta de nuevo."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!yacht) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar language={language} onLanguageChange={setLanguage} />
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-4xl font-bold mb-4">{t.notFound}</h1>
          <p className="text-muted-foreground mb-8">{t.notFoundDescription}</p>
          <Link to="/yachts">
            <Button variant="navy">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t.backToYachts}
            </Button>
          </Link>
        </div>
        <Footer language={language} />
      </div>
    );
  }

  const smsNumber = "+5219983188395";
  const smsMessage = `Hola, me interesa el yate ${yacht.name} (${yacht.model} ${yacht.size})`;

  const selectedPricing =
    yacht.pricing.find((p) => String(p.hours) === bookingData.duration) || yacht.pricing[0];
  const selectedSubtotal = Number(selectedPricing.price.replace(/,/g, "")) || 1000;

  return (
    <div className="min-h-screen bg-background">
      <Navbar language={language} onLanguageChange={setLanguage} />

      {/* Hero Section with Carousel */}
      <section className="relative h-[60vh] min-h-[500px]">
        {yacht.images && yacht.images.length > 1 ? (
          <Carousel className="w-full h-full">
            <CarouselContent>
              {yacht.images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="relative h-[60vh] min-h-[500px]">
                    <img
                      src={image}
                      alt={`${yacht.name} - ${index + 1}`}
                      loading={index === 0 ? "eager" : "lazy"}
                      decoding="async"
                      fetchPriority={index === 0 ? "high" : "auto"}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        ) : (
          <>
            <img
              src={yacht.image}
              alt={yacht.name}
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </>
        )}
        
        <div className="absolute inset-0 flex items-end pointer-events-none">
          <div className="container mx-auto px-4 pb-12 pointer-events-auto">
            <Link to="/yachts" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t.backToYachts}
            </Link>
            
            <div className="flex items-start gap-3 mb-4">
              <h1 className="text-5xl md:text-6xl font-bold text-white flex-1">
                {yachtContent?.name}
              </h1>
              <ShareButton title={yachtContent?.name || 'Yacht'} variant="light" stopPropagation={false} />
            </div>
            
            <div className="flex flex-wrap gap-4 text-white/90">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-white/20 text-white backdrop-blur-sm">
                  {yacht.model} · {yacht.size}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>{yacht.capacity}–{yacht.maxCapacity} {language === "en" ? "people" : "personas"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Anchor className="w-5 h-5" />
                <span>{yacht.marina}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Description & Features */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4">{t.description}</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {yachtContent?.description}
                  </p>
                </CardContent>
              </Card>

              {/* Features */}
              {yachtContent?.features && yachtContent.features.length > 0 && (
                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold mb-6">{t.features}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {yachtContent.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="mt-1">
                            <Check className="w-5 h-5 text-primary" />
                          </div>
                          <span className="text-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Pricing Table */}
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6">{t.pricing}</h2>
                  <div className="space-y-4">
                    {yacht.pricing.map((price, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div>
                          <div className="font-semibold text-lg">
                            {price.hours} {t.hours}
                          </div>
                          {price.note && (
                            <div className="text-sm text-muted-foreground mt-1">
                              {price.note[language]}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">
                            ${price.price} {yacht.currency}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Good to know */}
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6">{t.notesTitle}</h2>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {t.notes.map((note, index) => (
                      <li key={index} className="flex gap-2">
                        <span aria-hidden>•</span>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Booking Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 border-primary/20 shadow-elegant">
                <CardContent className="p-8 space-y-6">
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">{t.from}</div>
                    <div className="text-3xl font-bold text-primary">
                      ${yacht.pricing[0].price} {yacht.currency}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {yacht.pricing[0].hours} {t.hours}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button 
                      variant="navy" 
                      size="lg" 
                      className="w-full"
                      onClick={() => setIsBookingDialogOpen(true)}
                    >
                      <Calendar className="w-5 h-5 mr-2" />
                      {t.bookNow}
                    </Button>

                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full"
                      onClick={() => {
                        window.location.href = `sms:${smsNumber}?body=${encodeURIComponent(smsMessage)}`;
                      }}
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      {t.sms}
                    </Button>

                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full"
                      asChild
                    >
                      <Link to="/contact">
                        <Calendar className="w-5 h-5 mr-2" />
                        {t.checkAvailability}
                      </Link>
                    </Button>
                  </div>

                  <div className="pt-6 border-t border-border space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Anchor className="w-4 h-4" />
                      <span>{yacht.marina}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{yacht.capacity}–{yacht.maxCapacity} {language === "en" ? "people" : "personas"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Dialog */}
      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {language === "en" ? "Book Your Yacht Experience" : "Reserva tu Experiencia en Yate"}
            </DialogTitle>
            <DialogDescription>
              {language === "en" 
                ? "Fill in your details and we'll contact you to confirm availability and finalize your booking." 
                : "Completa tus datos y nos pondremos en contacto para confirmar disponibilidad y finalizar tu reserva."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleBookingSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{language === "en" ? "Full Name" : "Nombre Completo"} *</Label>
              <Input
                id="name"
                value={bookingData.name}
                onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{language === "en" ? "Email" : "Correo Electrónico"} *</Label>
              <Input
                id="email"
                type="email"
                value={bookingData.email}
                onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{language === "en" ? "Phone" : "Teléfono"}</Label>
              <Input
                id="phone"
                type="tel"
                value={bookingData.phone}
                onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="requestedDate">{language === "en" ? "Preferred Date" : "Fecha Preferida"}</Label>
              <Input
                id="requestedDate"
                type="date"
                value={bookingData.requestedDate}
                onChange={(e) => setBookingData({ ...bookingData, requestedDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guests">{language === "en" ? "Number of Guests" : "Número de Huéspedes"}</Label>
              <Input
                id="guests"
                type="number"
                min="1"
                max={yacht.maxCapacity}
                value={bookingData.guests}
                onChange={(e) => setBookingData({ ...bookingData, guests: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">{language === "en" ? "Preferred Duration" : "Duración Preferida"}</Label>
              <select
                id="duration"
                value={bookingData.duration}
                onChange={(e) => setBookingData({ ...bookingData, duration: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">
                  {language === "en" ? "Select duration" : "Selecciona duración"}
                </option>
                {yacht.pricing.map((p) => (
                  <option key={p.hours} value={String(p.hours)}>
                    {p.hours} {t.hours} — ${p.price} {yacht.currency}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialRequests">{language === "en" ? "Special Requests" : "Solicitudes Especiales"}</Label>
              <Textarea
                id="specialRequests"
                rows={3}
                value={bookingData.specialRequests}
                onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
                placeholder={language === "en" 
                  ? "Any special requirements or preferences..." 
                  : "Cualquier requisito o preferencia especial..."}
              />
            </div>
            {/* Member Code */}
            <div className="border-t pt-4">
              <MemberCodeInput
                subtotal={selectedSubtotal}
                onDiscountApplied={handleMemberCodeApplied}
                language={language}
              />
              {appliedMemberCode && (
                <p className="text-xs text-muted-foreground mt-1">
                  {language === "en" 
                    ? "Member code will be applied when we confirm your booking." 
                    : "El código de miembro se aplicará cuando confirmemos tu reserva."}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {language === "en" ? "Submit Request" : "Enviar Solicitud"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Footer language={language} />
    </div>
  );
}
