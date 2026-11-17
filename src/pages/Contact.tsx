import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/components/LanguageToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail, Phone, MapPin, Send, Instagram } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

import { getWhatsAppUrl } from "@/lib/whatsapp";

const translations = {
  en: {
    title: "Contact Us",
    subtitle: "Get in touch with our team",
    name: "Full Name",
    email: "Email Address",
    phone: "Phone Number",
    message: "Your Message",
    send: "Send Message",
    sending: "Sending...",
    success: "Message sent successfully!",
    successDesc: "We'll get back to you as soon as possible. Check your email for confirmation.",
    error: "Failed to send message",
    contactInfo: "Contact Information",
    emailLabel: "Email",
    phoneLabel: "Phone",
    addressLabel: "Address",
    caseNumber: "Your Case Number",
    questions: "Have questions? Contact us",
    backHome: "Back to Home",
  },
  es: {
    title: "Contáctanos",
    subtitle: "Ponte en contacto con nuestro equipo",
    name: "Nombre Completo",
    email: "Correo Electrónico",
    phone: "Teléfono",
    message: "Tu Mensaje",
    send: "Enviar Mensaje",
    sending: "Enviando...",
    success: "¡Mensaje enviado con éxito!",
    successDesc: "Nos pondremos en contacto contigo lo antes posible. Revisa tu correo para la confirmación.",
    error: "Error al enviar el mensaje",
    contactInfo: "Información de Contacto",
    emailLabel: "Email",
    phoneLabel: "Teléfono",
    addressLabel: "Dirección",
    caseNumber: "Su Número de Caso",
    questions: "¿Tienes preguntas? Contáctanos",
    backHome: "Volver al Inicio",
  },
};

const generateCaseNumber = () => {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `MAR-CT-${randomNum}`;
};

export default function Contact() {
  const { language, setLanguage } = useLanguage();
  const t = translations[language];
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCaseNumber, setSubmittedCaseNumber] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const caseNumber = generateCaseNumber();

    try {
      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          ...formData,
          caseNumber,
        }
      });

      if (error) throw error;

      setSubmittedCaseNumber(caseNumber);
      
      toast({
        title: t.success,
        description: t.successDesc,
      });
    } catch (error) {
      console.error('Error sending contact email:', error);
      toast({
        title: t.error,
        description: error instanceof Error ? error.message : 'Please try again later',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Show success state with case number
  if (submittedCaseNumber) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar language={language} onLanguageChange={setLanguage} />
        
        <main className="flex-1 pt-24 pb-16 px-5 md:px-4">
          <div className="max-w-lg mx-auto">
            <Card className="text-center rounded-[10px] border border-[rgba(29,40,57,0.07)]">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-[#1d2839]/10 rounded-full flex items-center justify-center mb-4">
                  <Mail className="h-8 w-8 text-[#1d2839]" />
                </div>
                <CardTitle className="font-cormorant font-light text-[30px] text-[#1d2839]">{t.success}</CardTitle>
                <CardDescription className="text-[15px] text-[#6b7280] font-inter">{t.successDesc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-[#1d2839]/5 border-2 border-[#1d2839] rounded-[10px] p-6">
                  <p className="text-[13px] text-[#6b7280] font-inter mb-2">{t.caseNumber}</p>
                  <p className="text-3xl font-bold text-[#1d2839] font-inter">{submittedCaseNumber}</p>
                </div>

                <div className="space-y-3 text-[13px] text-[#6b7280] font-inter">
                  <p>{t.questions}</p>
                  <div className="flex items-center justify-center gap-2">
                    <Mail className="h-4 w-4" />
                    <a href="mailto:admin@margeatravel.com" className="text-[#1d2839] hover:text-[#b8975a] transition-colors duration-200">
                      admin@margeatravel.com
                    </a>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-4">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <a href="tel:+529982334867" className="text-[#1d2839] hover:text-[#b8975a] transition-colors duration-200" aria-label="Call Margea: +52 998 233 4867">+52 998 233 4867</a>
                    </div>
                    <a href={getWhatsAppUrl(language)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#1d2839] hover:text-[#b8975a] transition-colors duration-200" aria-label="WhatsApp Margea">
                      <WhatsAppIcon size={16} />
                      WhatsApp
                    </a>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Instagram className="h-4 w-4" />
                    <a href="https://www.instagram.com/margeatravel/" target="_blank" rel="noopener noreferrer" className="text-[#1d2839] hover:text-[#b8975a] transition-colors duration-200">@margeatravel</a>
                  </div>
                </div>

                <Button onClick={() => navigate("/")} className="w-full">
                  {t.backHome}
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>

        <Footer language={language} />
      </div>
    );
  }

  const inputClasses = "w-full font-inter text-[14px] py-3 px-4 rounded-[4px] border-[1.5px] border-[rgba(29,40,57,0.15)] bg-white text-[#1d2839] placeholder:text-[#9aa5b4] outline-none focus:border-[#1d2839] transition-colors duration-200";
  const labelClasses = "block font-inter font-medium text-[13px] text-[#1d2839] mb-[6px]";

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Contact Margea | Riviera Maya Travel & Concierge"
        description="Reach Margea Travel by WhatsApp, phone or email. 24/7 concierge for vacation rentals, tours and transportation in the Riviera Maya."
        path="/contact"
      />
      <Navbar language={language} onLanguageChange={setLanguage} />
      
      {/* Navy Hero Banner */}
      <section className="relative flex items-center justify-center overflow-hidden" style={{ height: '280px', paddingTop: '70px', backgroundColor: '#1d2839' }}>
        <div className="relative z-10 text-center px-4">
          <h1 className="font-cormorant text-[38px] md:text-[52px] leading-[1.15]" style={{ color: '#ffffff', fontWeight: 300 }}>{t.title}</h1>
          <p className="font-inter text-[16px] mt-2" style={{ color: 'rgba(255,255,255,0.75)' }}>{t.subtitle}</p>
        </div>
      </section>

      <section className="py-16 md:py-24 px-5 md:px-4">
        <div className="max-w-[1280px] mx-auto">

          <div className="grid lg:grid-cols-2 gap-8 max-w-[1080px] mx-auto">
            {/* Contact Form */}
            <div className="bg-white rounded-[10px] border border-[rgba(29,40,57,0.07)] p-8">
              <h2 className="font-cormorant font-light text-[26px] text-[#1d2839] mb-6">{t.send}</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className={labelClasses}>{t.name} *</label>
                  <input id="name" required value={formData.name} onChange={(e) => handleChange("name", e.target.value)} className={inputClasses} />
                </div>
                <div>
                  <label htmlFor="email" className={labelClasses}>{t.email} *</label>
                  <input id="email" type="email" required value={formData.email} onChange={(e) => handleChange("email", e.target.value)} className={inputClasses} />
                </div>
                <div>
                  <label htmlFor="phone" className={labelClasses}>{t.phone}</label>
                  <input id="phone" type="tel" value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} className={inputClasses} />
                </div>
                <div>
                  <label htmlFor="message" className={labelClasses}>{t.message} *</label>
                  <textarea id="message" required rows={5} value={formData.message} onChange={(e) => handleChange("message", e.target.value)} className={`${inputClasses} resize-none`} />
                </div>
                <Button type="submit" className="w-full gap-2" size="lg" disabled={isSubmitting}>
                  <Send className="h-4 w-4" />
                  {isSubmitting ? t.sending : t.send}
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="bg-[#f7f6f3] rounded-[10px] border border-[rgba(29,40,57,0.07)] p-8">
              <h2 className="font-cormorant font-light text-[26px] text-[#1d2839] mb-6">{t.contactInfo}</h2>
              <div className="space-y-6">
                {[
                  { icon: Mail, label: t.emailLabel, content: <a href="mailto:admin@margeatravel.com" className="text-[#6b7280] hover:text-[#b8975a] transition-colors duration-200 font-inter text-[14px]">admin@margeatravel.com</a> },
                  { icon: Phone, label: t.phoneLabel, content: (
                    <div className="flex flex-col gap-1">
                      <a href="tel:+529982334867" className="text-[#6b7280] hover:text-[#b8975a] transition-colors duration-200 font-inter text-[14px]" aria-label="Call Margea: +52 998 233 4867">+52 998 233 4867</a>
                      <a href={getWhatsAppUrl(language)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[#6b7280] hover:text-[#b8975a] transition-colors duration-200 font-inter text-[13px]" aria-label="WhatsApp Margea"><WhatsAppIcon size={16} />WhatsApp</a>
                    </div>
                  )},
                  { icon: MapPin, label: t.addressLabel, content: <p className="text-[#6b7280] font-inter text-[14px]">Cancun<br />Quintana Roo, México</p> },
                  { icon: Instagram, label: "Instagram", content: <a href="https://www.instagram.com/margeatravel/" target="_blank" rel="noopener noreferrer" className="text-[#6b7280] hover:text-[#b8975a] transition-colors duration-200 font-inter text-[14px]">@margeatravel</a> },
                ].map(({ icon: Icon, label, content }, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-[#1d2839]/70" />
                    </div>
                    <div>
                      <h3 className="font-inter font-medium text-[13px] text-[#1d2839] mb-1">{label}</h3>
                      {content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer language={language} />
    </div>
  );
}
