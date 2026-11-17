import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/components/LanguageToggle";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const translations = {
  en: {
    title: "Customize Your Package",
    subtitle: "Tell us about your dream vacation and we'll create the perfect package for you",
    personalInfo: "Personal Information",
    name: "Full Name",
    email: "Email",
    phone: "Phone Number",
    preferences: "Your Preferences",
    budget: "Budget Range (USD)",
    interests: "Select Your Interests",
    stayInterest: "Luxury Accommodation",
    tourInterest: "Tours & Activities",
    yachtInterest: "Yacht Experiences",
    diningInterest: "Fine Dining",
    nightlifeInterest: "Nightlife & Entertainment",
    wellnessInterest: "Spa & Wellness",
    dates: "Travel Details",
    checkIn: "Check-in Date",
    checkOut: "Check-out Date",
    guests: "Number of Guests",
    additionalInfo: "Additional Information",
    specialRequests: "Special Requests or Preferences",
    submitButton: "Send Request",
    contactButton: "Contact Us",
    successMessage: "Request sent successfully! We'll contact you within 24 hours.",
  },
  es: {
    title: "Personaliza tu Paquete",
    subtitle: "Cuéntanos sobre tus vacaciones soñadas y crearemos el paquete perfecto para ti",
    personalInfo: "Información Personal",
    name: "Nombre Completo",
    email: "Correo Electrónico",
    phone: "Número de Teléfono",
    preferences: "Tus Preferencias",
    budget: "Rango de Presupuesto (USD)",
    interests: "Selecciona tus Intereses",
    stayInterest: "Alojamiento de Lujo",
    tourInterest: "Tours y Actividades",
    yachtInterest: "Experiencias en Yate",
    diningInterest: "Gastronomía Fina",
    nightlifeInterest: "Vida Nocturna y Entretenimiento",
    wellnessInterest: "Spa y Bienestar",
    dates: "Detalles del Viaje",
    checkIn: "Fecha de Entrada",
    checkOut: "Fecha de Salida",
    guests: "Número de Huéspedes",
    additionalInfo: "Información Adicional",
    specialRequests: "Solicitudes Especiales o Preferencias",
    submitButton: "Enviar Solicitud",
    contactButton: "Contáctanos",
    successMessage: "¡Solicitud enviada con éxito! Te contactaremos en las próximas 24 horas.",
  },
};

export default function CustomPackage() {
  const { language, setLanguage } = useLanguage();
  const t = translations[language];
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [budget, setBudget] = useState([10000]);
  const [interests, setInterests] = useState({
    stay: false,
    tour: false,
    yacht: false,
    dining: false,
    nightlife: false,
    wellness: false,
  });
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    guests: "2",
    specialRequests: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email) {
      toast.error(language === "en" ? "Please fill in all required fields" : "Por favor completa todos los campos requeridos");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error(language === "en" ? "Please enter a valid email address" : "Por favor ingresa un correo electrónico válido");
      return;
    }

    setIsSubmitting(true);

    try {
      // Insert into Supabase
      const { data, error } = await supabase
        .from("custom_packages")
        .insert({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone?.trim() || null,
          budget: budget[0],
          interests: interests,
          check_in: formData.checkIn || null,
          check_out: formData.checkOut || null,
          guests: parseInt(formData.guests),
          special_requests: formData.specialRequests?.trim() || null,
        })
        .select("confirmation_number")
        .single();

      if (error) throw error;

      // Send email notification
      try {
        await supabase.functions.invoke('send-custom-package-notification', {
          body: {
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone?.trim() || null,
            budget: budget[0],
            interests: interests,
            check_in: formData.checkIn || null,
            check_out: formData.checkOut || null,
            guests: parseInt(formData.guests),
            special_requests: formData.specialRequests?.trim() || null,
            confirmation_number: data.confirmation_number
          }
        });
      } catch (emailError) {
        console.error("Error sending notification email:", emailError);
        // Don't fail the submission if email fails
      }

      // Redirect to confirmation page with confirmation number
      navigate(`/request-confirmation?ref=${data.confirmation_number}&type=package`);
      
    } catch (error) {
      console.error("Error submitting package request:", error);
      toast.error(
        language === "en" 
          ? "There was an error submitting your request. Please try again." 
          : "Hubo un error al enviar tu solicitud. Por favor intenta de nuevo."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar language={language} onLanguageChange={setLanguage} />
      
      {/* Hero Section */}
      <section className="relative pt-16 min-h-[40vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="/yacht-images/yacht-hero-1.jpg"
            alt="Customize Your Package"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-overlay" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
              {t.title}
            </h1>
            <p className="text-lg md:text-xl text-white/95 animate-slide-up">
              {t.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto border-border shadow-xl">
            <CardContent className="p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-primary">{t.personalInfo}</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t.name} *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t.email} *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t.phone}</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-primary">{t.preferences}</h2>
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <Label>{t.budget}</Label>
                      <div className="pt-2">
                        <Slider
                          value={budget}
                          onValueChange={setBudget}
                          min={500}
                          max={100000}
                          step={500}
                          className="w-full"
                        />
                        <p className="text-sm text-muted-foreground mt-2 text-center font-semibold">
                          ${budget[0].toLocaleString()} USD
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interests */}
                <div>
                  <Label className="text-lg font-semibold mb-4 block">{t.interests}</Label>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { key: "stay", label: t.stayInterest },
                      { key: "tour", label: t.tourInterest },
                      { key: "yacht", label: t.yachtInterest },
                      { key: "dining", label: t.diningInterest },
                      { key: "nightlife", label: t.nightlifeInterest },
                      { key: "wellness", label: t.wellnessInterest },
                    ].map((interest) => (
                      <div key={interest.key} className="flex items-center space-x-2">
                        <Checkbox
                          id={interest.key}
                          checked={interests[interest.key as keyof typeof interests]}
                          onCheckedChange={(checked) =>
                            setInterests({ ...interests, [interest.key]: checked })
                          }
                        />
                        <label
                          htmlFor={interest.key}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {interest.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Travel Details */}
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-primary">{t.dates}</h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="checkIn">{t.checkIn}</Label>
                      <Input
                        id="checkIn"
                        type="date"
                        value={formData.checkIn}
                        onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="checkOut">{t.checkOut}</Label>
                      <Input
                        id="checkOut"
                        type="date"
                        value={formData.checkOut}
                        onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="guests">{t.guests}</Label>
                      <Input
                        id="guests"
                        type="number"
                        min="1"
                        value={formData.guests}
                        onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-primary">{t.additionalInfo}</h2>
                  <div className="space-y-2">
                    <Label htmlFor="specialRequests">{t.specialRequests}</Label>
                    <Textarea
                      id="specialRequests"
                      rows={5}
                      value={formData.specialRequests}
                      onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                      placeholder={language === "en" 
                        ? "Tell us about any special requirements, dietary restrictions, celebration plans, or specific experiences you're looking for..."
                        : "Cuéntanos sobre requisitos especiales, restricciones dietéticas, planes de celebración o experiencias específicas que estés buscando..."
                      }
                    />
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button type="submit" size="lg" variant="hero" className="flex-1" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {t.submitButton}
                  </Button>
                  <Button 
                    type="button" 
                    size="lg" 
                    variant="outline"
                    onClick={() => window.location.href = "/contact"}
                    className="flex-1"
                  >
                    {t.contactButton}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer language={language} />
    </div>
  );
}
