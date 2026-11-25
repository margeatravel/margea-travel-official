import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/components/LanguageToggle";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { UtensilsCrossed, Music, Car, Sparkles, Phone, Mail, Instagram, Calendar, Users, ClipboardList, Loader2, ChefHat, Heart, PartyPopper, HandHeart } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";
import { ActivityHero } from "@/components/ActivityHero";

import { getWhatsAppUrl } from "@/lib/whatsapp";
import { media } from "@/lib/media";

const translations = {
  en: {
    title: "Concierge Services",
    subtitle: "Elevate your Riviera Maya experience with our premium concierge services",
    description: "Let us handle the details while you enjoy paradise. Our local expertise ensures exclusive access to the best experiences in the region.",
    tabConcierge: "Concierge Services",
    tabCustomPackage: "Custom Package",
    restaurantTitle: "Restaurant Reservations",
    restaurantDesc: "Access to the finest dining establishments in Riviera Maya, including exclusive tables at top-rated restaurants.",
    nightclubTitle: "Nightclub Access",
    nightclubDesc: "VIP entry and premium table reservations at the hottest nightclubs in Cancún and Playa del Carmen.",
    carRentalTitle: "Car Rental",
    carRentalDesc: "Luxury and standard vehicle rentals with flexible pickup options and competitive rates.",
    customTitle: "Personalized Services",
    customDesc: "Private chefs, spa treatments, yacht charters, and any special request to make your stay unforgettable.",
    personalChefTitle: "Personal Chef",
    personalChefDesc: "Gourmet private dining experiences prepared by expert chefs in your villa.",
    massageTitle: "Masseuse / In-Home Massage",
    massageDesc: "Professional spa treatments and relaxing massages delivered to your accommodation.",
    weddingsTitle: "Weddings & Proposals",
    weddingsDesc: "Romantic ceremonies and unforgettable proposals in stunning beachfront settings.",
    eventsTitle: "Bachelor & Bachelorette Events",
    eventsDesc: "Celebrate in style with curated party packages and exclusive venue access.",
    contactUs: "Contact Us",
    bookNow: "Book Service",
    bookService: "Book",
    formTitle: "Book Service",
    name: "Full Name",
    email: "Email Address",
    phone: "Phone Number",
    preferredDate: "Preferred Date",
    endDate: "End Date",
    endDateHelper: "Leave empty for same-day rental",
    endDateError: "End date cannot be before preferred date",
    guests: "Number of Guests",
    specialRequests: "Special Requests",
    submit: "Submit Request",
    submitting: "Submitting...",
    success: "Request submitted successfully!",
    successDesc: "We'll contact you soon to confirm your service.",
    error: "Failed to submit request",
    caseNumber: "Your Case Number",
    questions: "Have questions? Contact us",
    backToServices: "Back to Services",
    ctaTitle: "Ready to Elevate Your Stay?",
    ctaDesc: "Our concierge team is available 24/7 to assist with any request",
    // Custom Package translations
    packageTitle: "Customize Your Package",
    packageSubtitle: "Tell us about your dream vacation and we'll create the perfect package for you",
    personalInfo: "Personal Information",
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
    additionalInfo: "Additional Information",
    submitButton: "Send Request",
    contactButton: "Contact Us",
  },
  es: {
    title: "Servicios de Concierge",
    subtitle: "Eleva tu experiencia en Riviera Maya con nuestros servicios premium de concierge",
    description: "Permítenos encargarnos de los detalles mientras disfrutas del paraíso. Nuestra experiencia local garantiza acceso exclusivo a las mejores experiencias de la región.",
    tabConcierge: "Servicios Concierge",
    tabCustomPackage: "Paquete Personalizado",
    restaurantTitle: "Reservas en Restaurantes",
    restaurantDesc: "Acceso a los mejores establecimientos gastronómicos de Riviera Maya, incluyendo mesas exclusivas en restaurantes de primera categoría.",
    nightclubTitle: "Acceso a Nightclubs",
    nightclubDesc: "Entrada VIP y reservas de mesas premium en los nightclubs más exclusivos de Cancún y Playa del Carmen.",
    carRentalTitle: "Renta de Coches",
    carRentalDesc: "Renta de vehículos de lujo y estándar con opciones flexibles de recogida y tarifas competitivas.",
    customTitle: "Servicios Personalizados",
    customDesc: "Chefs privados, tratamientos de spa, charters de yates y cualquier solicitud especial para hacer tu estancia inolvidable.",
    personalChefTitle: "Chef Privado",
    personalChefDesc: "Experiencias gastronómicas gourmet preparadas por chefs expertos en tu villa.",
    massageTitle: "Masajista / Masaje a Domicilio",
    massageDesc: "Tratamientos de spa profesionales y masajes relajantes en tu alojamiento.",
    weddingsTitle: "Bodas y Propuestas",
    weddingsDesc: "Ceremonias románticas y propuestas inolvidables en impresionantes escenarios frente al mar.",
    eventsTitle: "Despedidas de Soltero/a",
    eventsDesc: "Celebra con estilo con paquetes de fiesta curados y acceso exclusivo a venues.",
    contactUs: "Contáctanos",
    bookNow: "Reservar Servicio",
    bookService: "Reservar",
    formTitle: "Reservar Servicio",
    name: "Nombre Completo",
    email: "Correo Electrónico",
    phone: "Teléfono",
    preferredDate: "Fecha Preferida",
    endDate: "Fecha de Fin",
    endDateHelper: "Dejar vacío para renta de un día",
    endDateError: "La fecha de fin no puede ser antes de la fecha preferida",
    guests: "Número de Invitados",
    specialRequests: "Solicitudes Especiales",
    submit: "Enviar Solicitud",
    submitting: "Enviando...",
    success: "¡Solicitud enviada con éxito!",
    successDesc: "Nos contactaremos pronto para confirmar su servicio.",
    error: "Error al enviar la solicitud",
    caseNumber: "Su Número de Caso",
    questions: "¿Tienes preguntas? Contáctanos",
    backToServices: "Volver a Servicios",
    ctaTitle: "¿Listo para Elevar tu Estancia?",
    ctaDesc: "Nuestro equipo de concierge está disponible 24/7 para asistir con cualquier solicitud",
    // Custom Package translations
    packageTitle: "Personaliza tu Paquete",
    packageSubtitle: "Cuéntanos sobre tus vacaciones soñadas y crearemos el paquete perfecto para ti",
    personalInfo: "Información Personal",
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
    additionalInfo: "Información Adicional",
    submitButton: "Enviar Solicitud",
    contactButton: "Contáctanos",
  },
};

// Generate a random case number like MAR-CS-XXXXX
const generateCaseNumber = () => {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `MAR-CS-${randomNum}`;
};

export default function Concierge() {
  const { language, setLanguage } = useLanguage();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const t = translations[language];

  // Determine initial tab based on hash
  const getInitialTab = () => {
    if (location.hash === '#custom-package') return 'custom-package';
    return 'concierge';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCaseNumber, setSubmittedCaseNumber] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    preferredDate: "",
    endDate: "",
    guests: "",
    specialRequests: "",
  });
  const [endDateError, setEndDateError] = useState(false);

  // Custom Package state
  const [isPackageSubmitting, setIsPackageSubmitting] = useState(false);
  const [budget, setBudget] = useState([10000]);
  const [interests, setInterests] = useState({
    stay: false,
    tour: false,
    yacht: false,
    dining: false,
    nightlife: false,
    wellness: false,
  });
  const [packageFormData, setPackageFormData] = useState({
    name: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    guests: "2",
    specialRequests: "",
  });

  // Update hash when tab changes
  useEffect(() => {
    if (activeTab === 'custom-package') {
      window.history.replaceState(null, '', '#custom-package');
    } else {
      window.history.replaceState(null, '', location.pathname);
    }
  }, [activeTab, location.pathname]);

  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#custom-package') {
        setActiveTab('custom-package');
      } else {
        setActiveTab('concierge');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const services = [
    {
      icon: ChefHat,
      title: t.personalChefTitle,
      description: t.personalChefDesc,
      image: media("/concierge-images/personal-chef.jpg"),
    },
    {
      icon: HandHeart,
      title: t.massageTitle,
      description: t.massageDesc,
      image: media("/concierge-images/massage-spa.jpg"),
    },
    {
      icon: Heart,
      title: t.weddingsTitle,
      description: t.weddingsDesc,
      image: media("/concierge-images/weddings-proposals.jpg"),
    },
    {
      icon: PartyPopper,
      title: t.eventsTitle,
      description: t.eventsDesc,
      image: media("/concierge-images/bachelor-events.jpg"),
    },
    {
      icon: UtensilsCrossed,
      title: t.restaurantTitle,
      description: t.restaurantDesc,
      image: media("/concierge-images/restaurant.jpg"),
    },
    {
      icon: Music,
      title: t.nightclubTitle,
      description: t.nightclubDesc,
      image: media("/concierge-images/nightclub-mandala.jpg"),
    },
    {
      icon: Car,
      title: t.carRentalTitle,
      description: t.carRentalDesc,
      image: media("/concierge-images/car-rental.jpg"),
    },
  ];

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Validate end date when either date changes
    if (field === "endDate" && formData.preferredDate && value) {
      setEndDateError(new Date(value) < new Date(formData.preferredDate));
    } else if (field === "preferredDate" && formData.endDate && value) {
      setEndDateError(new Date(formData.endDate) < new Date(value));
    } else if (field === "endDate" && !value) {
      setEndDateError(false);
    }
  };

  const resetForm = () => {
    setFormData({
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      preferredDate: "",
      endDate: "",
      guests: "",
      specialRequests: "",
    });
    setSubmittedCaseNumber(null);
    setEndDateError(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    setIsSubmitting(true);
    const caseNumber = generateCaseNumber();

    try {
      // Insert into database
      const { error: dbError } = await supabase.from("concierge_requests").insert({
        case_number: caseNumber,
        service_type: selectedService,
        contact_name: formData.contactName,
        contact_email: formData.contactEmail,
        contact_phone: formData.contactPhone || null,
        preferred_date: formData.preferredDate || null,
        guests: formData.guests ? parseInt(formData.guests) : null,
        special_requests: formData.specialRequests || null,
      });

      if (dbError) throw dbError;

      // Send email notifications
      const { error: emailError } = await supabase.functions.invoke(
        "send-concierge-notification",
        {
          body: {
            caseNumber,
            serviceType: selectedService,
            contactName: formData.contactName,
            contactEmail: formData.contactEmail,
            contactPhone: formData.contactPhone || null,
            preferredDate: formData.preferredDate || null,
            endDate: formData.endDate || null,
            guests: formData.guests ? parseInt(formData.guests) : null,
            specialRequests: formData.specialRequests || null,
          },
        }
      );

      if (emailError) {
        console.error("Email notification error:", emailError);
      }

      setSubmittedCaseNumber(caseNumber);

      toast({
        title: t.success,
        description: t.successDesc,
      });
    } catch (error: any) {
      console.error("Submission error:", error);
      toast({
        title: t.error,
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeDialog = () => {
    setSelectedService(null);
    resetForm();
  };

  // Custom Package form submission
  const handlePackageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!packageFormData.name || !packageFormData.email) {
      sonnerToast.error(language === "en" ? "Please fill in all required fields" : "Por favor completa todos los campos requeridos");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(packageFormData.email)) {
      sonnerToast.error(language === "en" ? "Please enter a valid email address" : "Por favor ingresa un correo electrónico válido");
      return;
    }

    setIsPackageSubmitting(true);

    try {
      // Insert into Supabase
      const { data, error } = await supabase
        .from("custom_packages")
        .insert({
          name: packageFormData.name.trim(),
          email: packageFormData.email.trim(),
          phone: packageFormData.phone?.trim() || null,
          budget: budget[0],
          interests: interests,
          check_in: packageFormData.checkIn || null,
          check_out: packageFormData.checkOut || null,
          guests: parseInt(packageFormData.guests),
          special_requests: packageFormData.specialRequests?.trim() || null,
        })
        .select("confirmation_number")
        .single();

      if (error) throw error;

      // Send email notification
      try {
        await supabase.functions.invoke('send-custom-package-notification', {
          body: {
            name: packageFormData.name.trim(),
            email: packageFormData.email.trim(),
            phone: packageFormData.phone?.trim() || null,
            budget: budget[0],
            interests: interests,
            check_in: packageFormData.checkIn || null,
            check_out: packageFormData.checkOut || null,
            guests: parseInt(packageFormData.guests),
            special_requests: packageFormData.specialRequests?.trim() || null,
            confirmation_number: data.confirmation_number
          }
        });
      } catch (emailError) {
        console.error("Error sending notification email:", emailError);
      }

      // Redirect to confirmation page with confirmation number
      navigate(`/request-confirmation?ref=${data.confirmation_number}&type=package`);
      
    } catch (error) {
      console.error("Error submitting package request:", error);
      sonnerToast.error(
        language === "en" 
          ? "There was an error submitting your request. Please try again." 
          : "Hubo un error al enviar tu solicitud. Por favor intenta de nuevo."
      );
    } finally {
      setIsPackageSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar language={language} onLanguageChange={setLanguage} />
      
      <ActivityHero
        title={t.title}
        subtitle={t.subtitle}
        backgroundImage={media("/yacht-images/yacht-1.jpg")}
      >
        <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto">
          {t.description}
        </p>
      </ActivityHero>

      {/* Tab Selector */}
      <section className="py-8 bg-background">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="concierge" className="flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">{t.tabConcierge}</span>
                <span className="sm:hidden">{language === 'en' ? 'Concierge' : 'Concierge'}</span>
              </TabsTrigger>
              <TabsTrigger value="custom-package" className="flex items-center justify-center gap-2">
                <ClipboardList className="w-4 h-4" />
                <span className="hidden sm:inline">{t.tabCustomPackage}</span>
                <span className="sm:hidden">{language === 'en' ? 'Package' : 'Paquete'}</span>
              </TabsTrigger>
            </TabsList>

            {/* Concierge Services Tab Content */}
            <TabsContent value="concierge" className="mt-0">
              <div className="py-16 md:py-20">
                <div className="max-w-[1280px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 px-5 md:px-4">
                  {services.map((service, index) => {
                    const Icon = service.icon;
                    return (
                      <div
                        key={index}
                        className="group relative rounded-[12px] overflow-hidden cursor-pointer"
                        style={{ border: '1px solid rgba(29,40,57,0.08)' }}
                        onClick={() => setSelectedService(service.title)}
                      >
                        {/* Image */}
                        <div className="relative h-56 overflow-hidden">
                          <img
                            src={service.image}
                            alt={service.title}
                            loading="lazy"
                            decoding="async"
                            width={480}
                            height={224}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                        </div>

                        {/* Content */}
                        <div className="p-5 bg-white">
                          <div className="flex items-center gap-3 mb-2.5">
                            <div className="w-9 h-9 rounded-full bg-[#1d2839] flex items-center justify-center flex-shrink-0">
                              <Icon className="h-4 w-4 text-white" />
                            </div>
                            <h3 className="font-inter font-semibold text-[15px] text-[#1d2839] leading-tight">{service.title}</h3>
                          </div>
                          <p className="text-[#6b7280] text-[13px] font-inter leading-[1.6] mb-4 line-clamp-2">
                            {service.description}
                          </p>
                          <button
                            className="font-inter font-medium text-[13px] text-[#1d2839] hover:text-[#b8975a] transition-colors duration-200 flex items-center gap-1"
                          >
                            {t.bookNow} →
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* CTA Section */}
                <div className="max-w-4xl mx-auto mt-16 text-center">
                  <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                    <CardContent className="p-8 md:p-12">
                      <Phone className="h-12 w-12 text-primary mx-auto mb-4" />
                      <h3 className="text-2xl md:text-3xl font-bold mb-4">
                        {t.ctaTitle}
                      </h3>
                      <p className="text-muted-foreground mb-6 text-lg">
                        {t.ctaDesc}
                      </p>
                      <div className="flex flex-wrap justify-center gap-4 text-sm">
                        <a href="mailto:admin@margeatravel.com" className="flex items-center gap-2 text-primary hover:underline">
                          <Mail className="h-4 w-4" />
                          admin@margeatravel.com
                        </a>
                        <a 
                          href="tel:+529982334867" 
                          className="flex items-center gap-2 text-primary hover:underline"
                          aria-label="Call Margea: +52 998 233 4867"
                        >
                          <Phone className="h-4 w-4" />
                          +52 998 233 4867
                        </a>
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
                        <a 
                          href="https://www.instagram.com/margeatravel/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-primary hover:underline"
                        >
                          <Instagram className="h-4 w-4" />
                          @margeatravel
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Custom Package Tab Content */}
            <TabsContent value="custom-package" className="mt-0">
              <div className="py-12">
                <div className="max-w-4xl mx-auto text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    {t.packageTitle}
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    {t.packageSubtitle}
                  </p>
                </div>

                <Card className="max-w-4xl mx-auto border-border shadow-xl">
                  <CardContent className="p-8 md:p-12">
                    <form onSubmit={handlePackageSubmit} className="space-y-8">
                      {/* Personal Information */}
                      <div>
                        <h2 className="text-2xl font-bold mb-6 text-primary">{t.personalInfo}</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="pkg-name">{t.name} *</Label>
                            <Input
                              id="pkg-name"
                              value={packageFormData.name}
                              onChange={(e) => setPackageFormData({ ...packageFormData, name: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="pkg-email">{t.email} *</Label>
                            <Input
                              id="pkg-email"
                              type="email"
                              value={packageFormData.email}
                              onChange={(e) => setPackageFormData({ ...packageFormData, email: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="pkg-phone">{t.phone}</Label>
                            <Input
                              id="pkg-phone"
                              type="tel"
                              value={packageFormData.phone}
                              onChange={(e) => setPackageFormData({ ...packageFormData, phone: e.target.value })}
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
                                id={`pkg-${interest.key}`}
                                checked={interests[interest.key as keyof typeof interests]}
                                onCheckedChange={(checked) =>
                                  setInterests({ ...interests, [interest.key]: checked })
                                }
                              />
                              <label
                                htmlFor={`pkg-${interest.key}`}
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
                            <Label htmlFor="pkg-checkIn">{t.checkIn}</Label>
                            <Input
                              id="pkg-checkIn"
                              type="date"
                              value={packageFormData.checkIn}
                              onChange={(e) => setPackageFormData({ ...packageFormData, checkIn: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="pkg-checkOut">{t.checkOut}</Label>
                            <Input
                              id="pkg-checkOut"
                              type="date"
                              value={packageFormData.checkOut}
                              onChange={(e) => setPackageFormData({ ...packageFormData, checkOut: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="pkg-guests">{t.guests}</Label>
                            <Input
                              id="pkg-guests"
                              type="number"
                              min="1"
                              value={packageFormData.guests}
                              onChange={(e) => setPackageFormData({ ...packageFormData, guests: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Additional Information */}
                      <div>
                        <h2 className="text-2xl font-bold mb-6 text-primary">{t.additionalInfo}</h2>
                        <div className="space-y-2">
                          <Label htmlFor="pkg-specialRequests">{t.specialRequests}</Label>
                          <Textarea
                            id="pkg-specialRequests"
                            rows={5}
                            value={packageFormData.specialRequests}
                            onChange={(e) => setPackageFormData({ ...packageFormData, specialRequests: e.target.value })}
                            placeholder={language === "en" 
                              ? "Tell us about any special requirements, dietary restrictions, celebration plans, or specific experiences you're looking for..."
                              : "Cuéntanos sobre requisitos especiales, restricciones dietéticas, planes de celebración o experiencias específicas que estés buscando..."
                            }
                          />
                        </div>
                      </div>

                      {/* Submit Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Button type="submit" size="lg" variant="hero" className="flex-1" disabled={isPackageSubmitting}>
                          {isPackageSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
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
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Booking Dialog */}
      <Dialog open={!!selectedService} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          {submittedCaseNumber ? (
            // Success State
            <div className="text-center py-4">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <DialogHeader>
                <DialogTitle className="text-2xl text-primary">{t.success}</DialogTitle>
                <DialogDescription className="text-base">{t.successDesc}</DialogDescription>
              </DialogHeader>
              
              <div className="bg-primary/5 border-2 border-primary rounded-lg p-6 my-6">
                <p className="text-sm text-muted-foreground mb-2">{t.caseNumber}</p>
                <p className="text-3xl font-bold text-primary">{submittedCaseNumber}</p>
              </div>

              <div className="space-y-3 text-sm text-muted-foreground mb-6">
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

              <Button onClick={closeDialog} className="w-full">
                {t.backToServices}
              </Button>
            </div>
          ) : (
            // Form State
            <>
              <DialogHeader>
                <DialogTitle>{t.bookService}: {selectedService}</DialogTitle>
                <DialogDescription>
                  {t.questions}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="preferredDate" className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {t.preferredDate}
                    </Label>
                    <Input
                      id="preferredDate"
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => handleChange("preferredDate", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate" className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {t.endDate}
                    </Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleChange("endDate", e.target.value)}
                      className={endDateError ? "border-destructive" : ""}
                    />
                    {endDateError ? (
                      <p className="text-xs text-destructive">{t.endDateError}</p>
                    ) : (
                      <p className="text-xs text-muted-foreground">{t.endDateHelper}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guests" className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {t.guests}
                  </Label>
                  <Input
                    id="guests"
                    type="number"
                    min="1"
                    value={formData.guests}
                    onChange={(e) => handleChange("guests", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialRequests">{t.specialRequests}</Label>
                  <Textarea
                    id="specialRequests"
                    rows={3}
                    value={formData.specialRequests}
                    onChange={(e) => handleChange("specialRequests", e.target.value)}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? t.submitting : t.submit}
                </Button>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer language={language} />
    </div>
  );
}
