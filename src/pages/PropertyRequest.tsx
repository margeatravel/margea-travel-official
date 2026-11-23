import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Turnstile, { TurnstileHandle } from "@/components/Turnstile";
import { Language } from "@/components/LanguageToggle";
import { Home, Mail, Phone, MapPin, DollarSign, Users, Bath, Bed, Instagram } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { getWhatsAppUrl } from "@/lib/whatsapp";

const translations = {
  en: {
    title: "Submit Your Property",
    subtitle: "Fill out the form below and our team will review your submission",
    contactInfo: "Contact Information",
    propertyInfo: "Property Information",
    name: "Full Name",
    email: "Email Address",
    phone: "Phone Number",
    propertyTitle: "Property Title",
    description: "Property Description",
    location: "Location",
    propertyType: "Property Type",
    bedrooms: "Number of Bedrooms",
    bathrooms: "Number of Bathrooms",
    maxGuests: "Maximum Guests",
    pricePerNight: "Price Per Night (USD)",
    amenities: "Amenities (comma separated)",
    additionalInfo: "Additional Information (Optional)",
    submit: "Submit Request",
    submitting: "Submitting...",
    success: "Request submitted successfully!",
    successDesc: "We'll review your property and contact you soon. Check your email for confirmation.",
    error: "Failed to submit request",
    verificationPending: "Security check not ready yet — please wait a moment and try again.",
    villa: "Villa",
    condo: "Condo",
    apartment: "Apartment",
    house: "House",
    caseNumber: "Your Case Number",
    followUs: "Follow us on Instagram",
    questions: "Have questions? Contact us",
  },
  es: {
    title: "Enviar Tu Propiedad",
    subtitle: "Complete el formulario y nuestro equipo revisará su solicitud",
    contactInfo: "Información de Contacto",
    propertyInfo: "Información de la Propiedad",
    name: "Nombre Completo",
    email: "Correo Electrónico",
    phone: "Teléfono",
    propertyTitle: "Título de la Propiedad",
    description: "Descripción de la Propiedad",
    location: "Ubicación",
    propertyType: "Tipo de Propiedad",
    bedrooms: "Número de Habitaciones",
    bathrooms: "Número de Baños",
    maxGuests: "Huéspedes Máximos",
    pricePerNight: "Precio por Noche (USD)",
    amenities: "Comodidades (separadas por comas)",
    additionalInfo: "Información Adicional (Opcional)",
    submit: "Enviar Solicitud",
    submitting: "Enviando...",
    success: "¡Solicitud enviada con éxito!",
    successDesc: "Revisaremos su propiedad y nos contactaremos pronto. Revise su correo para la confirmación.",
    error: "Error al enviar la solicitud",
    verificationPending: "La verificación de seguridad aún no está lista, espera un momento e inténtalo de nuevo.",
    villa: "Villa",
    condo: "Condominio",
    apartment: "Apartamento",
    house: "Casa",
    caseNumber: "Su Número de Caso",
    followUs: "Síguenos en Instagram",
    questions: "¿Tienes preguntas? Contáctanos",
  },
};

// Generate a random case number like MAR-PR-XXXXX
const generateCaseNumber = () => {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `MAR-PR-${randomNum}`;
};

export default function PropertyRequest() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [language, setLanguage] = useState<Language>("en");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCaseNumber, setSubmittedCaseNumber] = useState<string | null>(null);
  const t = translations[language];

  // Anti-bot: Cloudflare Turnstile (managed mode) + honeypot.
  // The widget only renders when VITE_TURNSTILE_SITE_KEY is set; until then
  // the form submits without a token and the edge function allows it
  // (transition mode). The honeypot field is visually hidden — real users
  // never fill it, bots often do.
  const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as
    | string
    | undefined;
  const turnstileRef = useRef<TurnstileHandle>(null);
  const [honeypot, setHoneypot] = useState("");

  const [formData, setFormData] = useState({
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    propertyTitle: "",
    propertyDescription: "",
    location: "",
    propertyType: "condo",
    bedrooms: "",
    bathrooms: "",
    maxGuests: "",
    pricePerNight: "",
    amenities: "",
    additionalInfo: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const caseNumber = generateCaseNumber();

    // Honeypot filled = bot. Pretend success (same thank-you redirect) but
    // store nothing and send no email.
    if (honeypot.trim() !== "") {
      console.warn("Property request blocked: honeypot field was filled (bot).");
      setIsSubmitting(false);
      navigate(`/thank-you?case=${caseNumber}`);
      return;
    }

    // When Turnstile is configured, require a token before touching the
    // database — otherwise bots would still land junk rows in
    // property_requests even though the email gets rejected server-side.
    const turnstileToken = turnstileRef.current?.getToken() ?? null;
    if (turnstileSiteKey && !turnstileToken) {
      toast({
        title: t.error,
        description: t.verificationPending,
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const amenitiesArray = formData.amenities
        .split(",")
        .map((a) => a.trim())
        .filter((a) => a.length > 0);

      // Insert into database
      const { error: dbError } = await supabase.from("property_requests").insert({
        contact_name: formData.contactName,
        contact_email: formData.contactEmail,
        contact_phone: formData.contactPhone || null,
        property_title: formData.propertyTitle,
        property_description: formData.propertyDescription,
        location: formData.location,
        property_type: formData.propertyType,
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        max_guests: parseInt(formData.maxGuests),
        price_per_night: parseFloat(formData.pricePerNight),
        amenities: amenitiesArray,
        additional_info: formData.additionalInfo || null,
      });

      if (dbError) throw dbError;

      // Send email notifications
      const { error: emailError } = await supabase.functions.invoke(
        "send-property-request-notification",
        {
          body: {
            caseNumber,
            contactName: formData.contactName,
            contactEmail: formData.contactEmail,
            contactPhone: formData.contactPhone || null,
            propertyTitle: formData.propertyTitle,
            propertyDescription: formData.propertyDescription,
            location: formData.location,
            propertyType: formData.propertyType,
            bedrooms: parseInt(formData.bedrooms),
            bathrooms: parseInt(formData.bathrooms),
            maxGuests: parseInt(formData.maxGuests),
            pricePerNight: parseFloat(formData.pricePerNight),
            amenities: amenitiesArray,
            additionalInfo: formData.additionalInfo || null,
            turnstileToken,
            honeypot,
          },
        }
      );

      if (emailError) {
        console.error("Email notification error:", emailError);
        // Don't fail the submission if email fails
      }

      toast({
        title: t.success,
        description: t.successDesc,
      });

      // Redirect to thank you page with case number for conversion tracking
      navigate(`/thank-you?case=${caseNumber}`);

    } catch (error: any) {
      toast({
        title: t.error,
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      // Fresh Turnstile token for the next submit.
      turnstileRef.current?.reset();
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Show success state with case number
  if (submittedCaseNumber) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar language={language} onLanguageChange={setLanguage} />
        
        <main className="flex-1 pt-24 pb-16 px-4">
          <div className="container mx-auto max-w-lg">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Home className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl text-primary">{t.success}</CardTitle>
                <CardDescription className="text-base">{t.successDesc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-primary/5 border-2 border-primary rounded-lg p-6">
                  <p className="text-sm text-muted-foreground mb-2">{t.caseNumber}</p>
                  <p className="text-3xl font-bold text-primary">{submittedCaseNumber}</p>
                </div>

                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>{t.questions}</p>
                  <div className="flex items-center justify-center gap-2">
                    <Mail className="h-4 w-4" />
                    <a href="mailto:admin@margeatravel.com" className="text-primary hover:underline">
                      admin@margeatravel.com
                    </a>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-4">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <a 
                        href="tel:+529982334867" 
                        className="text-primary hover:underline"
                        aria-label="Call Margea: +52 998 233 4867"
                      >
                        +52 998 233 4867
                      </a>
                    </div>
                    <a 
                      href={getWhatsAppUrl(language)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary hover:underline"
                      aria-label="WhatsApp Margea: +52 998 233 4867"
                    >
                      <WhatsAppIcon size={16} />
                      WhatsApp
                    </a>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Instagram className="h-4 w-4" />
                    <a 
                      href="https://www.instagram.com/margeatravel/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      @margeatravel
                    </a>
                  </div>
                </div>

                <Button onClick={() => navigate("/")} className="w-full">
                  {language === "en" ? "Back to Home" : "Volver al Inicio"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>

        <Footer language={language} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar language={language} onLanguageChange={setLanguage} />
      
      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">{t.title}</CardTitle>
              <CardDescription className="text-base">{t.subtitle}</CardDescription>
              
              {/* Contact info banner */}
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">{t.questions}</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <a href="mailto:admin@margeatravel.com" className="flex items-center gap-1 text-primary hover:underline">
                    <Mail className="h-4 w-4" />
                    admin@margeatravel.com
                  </a>
                  <a 
                    href="tel:+529982334867" 
                    className="flex items-center gap-1 text-primary hover:underline"
                    aria-label="Call Margea: +52 998 233 4867"
                  >
                    <Phone className="h-4 w-4" />
                    +52 998 233 4867
                  </a>
                  <a 
                    href={getWhatsAppUrl(language)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-primary hover:underline"
                    aria-label="WhatsApp Margea: +52 998 233 4867"
                  >
                    <WhatsAppIcon size={16} />
                    WhatsApp
                  </a>
                  <a 
                    href="https://www.instagram.com/margeatravel/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    <Instagram className="h-4 w-4" />
                    @margeatravel
                  </a>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    {t.contactInfo}
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contactName">{t.name} *</Label>
                    <Input
                      id="contactName"
                      required
                      value={formData.contactName}
                      onChange={(e) => handleChange("contactName", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">{t.email} *</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      required
                      value={formData.contactEmail}
                      onChange={(e) => handleChange("contactEmail", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">{t.phone}</Label>
                    <Input
                      id="contactPhone"
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) => handleChange("contactPhone", e.target.value)}
                    />
                  </div>
                </div>

                {/* Property Information */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    {t.propertyInfo}
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="propertyTitle">{t.propertyTitle} *</Label>
                    <Input
                      id="propertyTitle"
                      required
                      value={formData.propertyTitle}
                      onChange={(e) => handleChange("propertyTitle", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="propertyDescription">{t.description} *</Label>
                    <Textarea
                      id="propertyDescription"
                      required
                      rows={4}
                      value={formData.propertyDescription}
                      onChange={(e) => handleChange("propertyDescription", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">
                      <MapPin className="h-4 w-4 inline mr-1" />
                      {t.location} *
                    </Label>
                    <Input
                      id="location"
                      required
                      value={formData.location}
                      onChange={(e) => handleChange("location", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="propertyType">{t.propertyType} *</Label>
                    <Select
                      value={formData.propertyType}
                      onValueChange={(value) => handleChange("propertyType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="villa">{t.villa}</SelectItem>
                        <SelectItem value="condo">{t.condo}</SelectItem>
                        <SelectItem value="apartment">{t.apartment}</SelectItem>
                        <SelectItem value="house">{t.house}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bedrooms">
                        <Bed className="h-4 w-4 inline mr-1" />
                        {t.bedrooms} *
                      </Label>
                      <Input
                        id="bedrooms"
                        type="number"
                        min="1"
                        required
                        value={formData.bedrooms}
                        onChange={(e) => handleChange("bedrooms", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bathrooms">
                        <Bath className="h-4 w-4 inline mr-1" />
                        {t.bathrooms} *
                      </Label>
                      <Input
                        id="bathrooms"
                        type="number"
                        min="1"
                        required
                        value={formData.bathrooms}
                        onChange={(e) => handleChange("bathrooms", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="maxGuests">
                        <Users className="h-4 w-4 inline mr-1" />
                        {t.maxGuests} *
                      </Label>
                      <Input
                        id="maxGuests"
                        type="number"
                        min="1"
                        required
                        value={formData.maxGuests}
                        onChange={(e) => handleChange("maxGuests", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pricePerNight">
                        <DollarSign className="h-4 w-4 inline mr-1" />
                        {t.pricePerNight} *
                      </Label>
                      <Input
                        id="pricePerNight"
                        type="number"
                        min="1"
                        step="0.01"
                        required
                        value={formData.pricePerNight}
                        onChange={(e) => handleChange("pricePerNight", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amenities">{t.amenities}</Label>
                    <Input
                      id="amenities"
                      placeholder="WiFi, Pool, Air Conditioning, Kitchen"
                      value={formData.amenities}
                      onChange={(e) => handleChange("amenities", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additionalInfo">{t.additionalInfo}</Label>
                    <Textarea
                      id="additionalInfo"
                      rows={3}
                      value={formData.additionalInfo}
                      onChange={(e) => handleChange("additionalInfo", e.target.value)}
                    />
                  </div>
                </div>

                {/* Honeypot: hidden from real users (CSS), bots often fill it.
                    A filled value aborts the submission before any insert. */}
                <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", top: "auto", width: "1px", height: "1px", overflow: "hidden" }}>
                  <label htmlFor="website">Website</label>
                  <input id="website" name="website" type="text" autoComplete="off" tabIndex={-1} value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
                </div>
                {turnstileSiteKey ? (
                  <Turnstile ref={turnstileRef} siteKey={turnstileSiteKey} action="property-request" />
                ) : null}
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t.submitting : t.submit}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer language={language} />
    </div>
  );
}
