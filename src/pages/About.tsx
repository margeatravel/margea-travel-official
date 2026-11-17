import { useState } from "react";
import { SEO } from "@/components/SEO";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/components/LanguageToggle";
import { Award, Shield, Heart, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import aboutHero from "@/assets/about-hero.jpg";
import aboutService from "@/assets/about-service.jpg";
import aboutCulture from "@/assets/about-culture.jpg";

const translations = {
  en: {
    title: "About Margea",
    subtitle: "Your trusted partner for unforgettable experiences in Riviera Maya",
    mainText: "We are a local agency with years of experience in the area. We know every special corner and are passionate about sharing them with you. We focus on giving you personalized service, with close and reliable attention, so you can enjoy your trip as if you were at home. Our goal is for you to experience authentic and memorable moments.",
    ourValues: "Our Values",
    excellence: "Excellence",
    excellenceDesc: "We strive for excellence in every property and service we offer.",
    trust: "Trust & Security",
    trustDesc: "Your safety and satisfaction are our top priorities.",
    passion: "Passion",
    passionDesc: "We're passionate about creating memorable experiences for our guests.",
    local: "Local Expertise",
    localDesc: "Deep knowledge of Riviera Maya to help you discover hidden gems.",
    whyChoose: "Why Choose Margea?",
    personalService: "Personalized Service",
    personalServiceDesc: "Close and reliable attention tailored to your needs",
    authentic: "Authentic Experiences",
    authenticDesc: "Discover the real Riviera Maya through local eyes",
  },
  es: {
    title: "Sobre Margea",
    subtitle: "Tu socio de confianza para experiencias inolvidables en Riviera Maya",
    mainText: "Somos una agencia local con años de experiencia en la zona. Conocemos cada rincón especial y nos apasiona compartirlos contigo. Nos enfocamos en brindarte un servicio personalizado, con atención cercana y confiable, para que disfrutes tu viaje como si estuvieras en casa. Nuestro objetivo es que vivas momentos auténticos y memorables.",
    ourValues: "Nuestros Valores",
    excellence: "Excelencia",
    excellenceDesc: "Nos esforzamos por la excelencia en cada propiedad y servicio que ofrecemos.",
    trust: "Confianza y Seguridad",
    trustDesc: "Tu seguridad y satisfacción son nuestras principales prioridades.",
    passion: "Pasión",
    passionDesc: "Nos apasiona crear experiencias memorables para nuestros huéspedes.",
    local: "Experiencia Local",
    localDesc: "Conocimiento profundo de Riviera Maya para ayudarte a descubrir joyas ocultas.",
    whyChoose: "¿Por qué elegir Margea?",
    personalService: "Servicio Personalizado",
    personalServiceDesc: "Atención cercana y confiable adaptada a tus necesidades",
    authentic: "Experiencias Auténticas",
    authenticDesc: "Descubre la verdadera Riviera Maya con ojos locales",
  },
};

export default function About() {
  const { language, setLanguage } = useLanguage();
  const t = translations[language];
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [serviceLoaded, setServiceLoaded] = useState(false);
  const [cultureLoaded, setCultureLoaded] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="About Margea | Riviera Maya Travel & Property Management"
        description="Margea is a Riviera Maya travel and property-management company offering direct vacation rentals, curated tours and 24/7 concierge."
        path="/about"
      />
      <Navbar language={language} onLanguageChange={setLanguage} />
      
      {/* Hero Section */}
      <section className="relative pt-16 min-h-[70vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-br from-muted to-muted/80 transition-opacity duration-500 z-10",
              heroLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
            )}
          >
            <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          </div>
          
          <img
            src={aboutHero}
            alt="Riviera Maya Beach"
            fetchPriority="high"
            loading="eager"
            onLoad={() => setHeroLoaded(true)}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-500",
              heroLoaded ? "opacity-100" : "opacity-0"
            )}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, rgba(29,40,57,0.55) 0%, rgba(29,40,57,0.35) 50%, rgba(29,40,57,0.65) 100%)' }} />
        </div>
        
        <div className="max-w-[1280px] mx-auto px-5 md:px-4 relative z-10 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-cormorant font-light text-[38px] md:text-[68px] text-white leading-[1.1] mb-6 animate-fade-in">
              {t.title}
            </h1>
            <p className="text-[17px] text-white/75 font-inter animate-slide-up">
              {t.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-[1280px] mx-auto px-5 md:px-4">
          {/* Quote / Manifesto - no card, just breathing text */}
          <div className="max-w-[680px] mx-auto mb-20 md:mb-24 py-8">
            <p className="font-cormorant font-light text-[22px] text-[#3d4a5c] leading-[1.8] text-center">
              {t.mainText}
            </p>
          </div>

          {/* Image Grid Section */}
          <div className="max-w-[1280px] mx-auto mb-20 md:mb-24">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="relative h-80 rounded-[10px] overflow-hidden group bg-muted">
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-br from-muted to-muted/80 transition-opacity duration-300 z-10",
                    serviceLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
                  )}
                >
                  <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>
                
                <img
                  src={aboutService}
                  alt="Personalized hospitality"
                  loading="lazy"
                  onLoad={() => setServiceLoaded(true)}
                  className={cn(
                    "w-full h-full object-cover group-hover:scale-105 transition-all duration-700",
                    serviceLoaded ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="absolute inset-0 z-20" style={{ background: 'linear-gradient(to top, rgba(29,40,57,0.8) 0%, transparent 60%)' }} />
                <div className="absolute inset-0 flex items-end z-30">
                  <div className="p-6 text-white">
                    <h2 className="font-cormorant font-normal text-[22px] text-white mb-2">{t.personalService}</h2>
                    <p className="font-inter text-[13px] text-white/75">{t.personalServiceDesc}</p>
                  </div>
                </div>
              </div>

              <div className="relative h-80 rounded-[10px] overflow-hidden group bg-muted">
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-br from-muted to-muted/80 transition-opacity duration-300 z-10",
                    cultureLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
                  )}
                >
                  <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>
                
                <img
                  src={aboutCulture}
                  alt="Authentic experiences"
                  loading="lazy"
                  onLoad={() => setCultureLoaded(true)}
                  className={cn(
                    "w-full h-full object-cover group-hover:scale-105 transition-all duration-700",
                    cultureLoaded ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="absolute inset-0 z-20" style={{ background: 'linear-gradient(to top, rgba(29,40,57,0.8) 0%, transparent 60%)' }} />
                <div className="absolute inset-0 flex items-end z-30">
                  <div className="p-6 text-white">
                    <h2 className="font-cormorant font-normal text-[22px] text-white mb-2">{t.authentic}</h2>
                    <p className="font-inter text-[13px] text-white/75">{t.authenticDesc}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="max-w-[1280px] mx-auto">
            <div className="text-center mb-14">
              <span className="eyebrow block mb-3">What We Stand For</span>
              <h2 className="font-cormorant font-light text-[32px] md:text-[44px] text-[#1d2839]">{t.ourValues}</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Award, title: t.excellence, desc: t.excellenceDesc },
                { icon: Shield, title: t.trust, desc: t.trustDesc },
                { icon: Heart, title: t.passion, desc: t.passionDesc },
                { icon: Globe, title: t.local, desc: t.localDesc },
              ].map(({ icon: Icon, title, desc }, i) => (
                <div key={i} className="bg-white border border-[rgba(29,40,57,0.07)] rounded-[10px] p-7 text-center shadow-[0_2px_12px_rgba(29,40,57,0.06)] transition-all duration-300 ease-out hover:-translate-y-[5px] hover:shadow-[0_16px_48px_rgba(29,40,57,0.13)]">
                  <Icon className="h-7 w-7 text-[#1d2839]/70 mb-4 mx-auto" />
                  <h3 className="font-inter font-semibold text-[15px] text-[#1d2839] mb-2" style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px' }}>{title}</h3>
                  <p className="text-[13px] text-[#6b7280] font-inter leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer language={language} />
    </div>
  );
}
