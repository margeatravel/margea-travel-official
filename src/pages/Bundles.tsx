import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/components/LanguageToggle";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import bundlesHero from "@/assets/bundles-hero.jpg";
import bundleFamily from "@/assets/bundle-family-new.png";
import bundleCouples from "@/assets/bundle-couples.jpg";
// import bundleGroup from "@/assets/bundle-group-new.jpeg"; // Hidden while Villa Azanik is removed from the UI

const translations = {
  en: {
    heroTitle: "Your Riviera Maya Trip, Already Planned",
    heroSubtitle: "Not every trip to Mexico looks the same — and it shouldn't. Find your perfect bundle below.",
    duration: "Duration",
    startingFrom: "Starting from",
    questionsText: "Questions about this bundle?",
    textUs: "Email us",
    extraGuest: "Extra guest",
    perPerson: "person shared",
    bundles: [
      {
        tagline: "FAMILY BUNDLE",
        emoji: "🏖️",
        headline: "For the trip they'll ask you to repeat every year",
        property: "Bungalow Village 212 — Aldea Zama, Tulum",
        propertyDetails: "3 bedrooms · 6 guests · Private jacuzzi · Common pool",
        includes: [
          "4 nights at Bungalow Village 212 (private jacuzzi, holistic center)",
          "Akumal turtle snorkeling experience",
          "Private cenote guided visit",
          "Xcaret or Xel-Há full-day pass (choose one)",
          "Round-trip airport transportation",
          "24/7 concierge support",
        ],
        duration: "5 days / 4 nights",
        price: "$1,650 USD",
        priceNote: "For family of 4 · $412/person shared",
        extraNote: "Extra guest (5th-6th): +$280/person",
        cta: "Plan Our Family Trip",
        subject: "Family Bundle Inquiry",
        mailtoSubject: "Family Bundle Inquiry",
        mailtoBody: "Hi! I'm interested in the Family Bundle for the Riviera Maya. Please send me more information about availability and pricing.",
      },
      {
        tagline: "COUPLES BUNDLE",
        emoji: "🥂",
        headline: "For the trip that doesn't need a filter",
        property: "Ana y Jose Hotel & Beach Club — Tulum Beach",
        propertyDetails: "Oceanfront boutique · King bed · Private balcony",
        includes: [
          "3 nights at Ana y Jose Ocean View Room (rain shower, beach club)",
          "Private sunset catamaran (4 hours, champagne included)",
          "Romantic beachfront dinner setup",
          "Tulum ruins sunrise tour (early private access)",
          "Couples' spa treatment (60-min massage)",
          "Luxury round-trip airport transportation",
        ],
        duration: "4 days / 3 nights",
        price: "$2,650 USD",
        priceNote: "For 2 guests · $1,325/person",
        extraNote: null,
        cta: "Plan Our Getaway",
        subject: "Couples Bundle Inquiry",
        mailtoSubject: "Couples Bundle Inquiry",
        mailtoBody: "Hi! We'd like to plan a couples trip to the Riviera Maya. Please send me more information about availability and pricing.",
      },
      /* {
        tagline: "GROUP BUNDLE",
        emoji: "🎉",
        headline: "For the group chat that finally followed through",
        property: "Casa Azanik Oceanfront Villa — North Akumal Bay",
        propertyDetails: "5 bedrooms · Up to 20 guests · Private beach · Rooftop pool",
        includes: [
          "4 nights at Casa Azanik (oceanfront pool, rooftop plunge pool, BBQ)",
          "Private yacht full-day charter (8 hrs, open bar, chef on board)",
          "Cenote adventure tour (group)",
          "VIP night in Playa del Carmen (reserved table + bottle service)",
          "Snorkeling Adventure with Cenote Package",
          "Group luxury transportation throughout stay",
        ],
        duration: "5 days / 4 nights",
        price: "$10,950 USD",
        priceNote: "For 8 guests · $1,369/person shared",
        extraNote: "Extra guest (9th-20th): +$450/person",
        cta: "Plan Our Group Trip",
        subject: "Group Bundle Inquiry",
        mailtoSubject: "Group Bundle Inquiry",
        mailtoBody: "Hi! We want to plan a group trip to the Riviera Maya. Please send me more information about availability and pricing.",
      }, */
    ],
  },
  es: {
    heroTitle: "Tu viaje a la Riviera Maya, ya planeado",
    heroSubtitle: "No todos los viajes a México se ven igual — y no deberían. Encuentra tu paquete perfecto abajo.",
    duration: "Duración",
    startingFrom: "Desde",
    questionsText: "¿Preguntas sobre este paquete?",
    textUs: "Escríbenos por email",
    extraGuest: "Huésped extra",
    perPerson: "persona compartido",
    bundles: [
      {
        tagline: "PAQUETE FAMILIAR",
        emoji: "🏖️",
        headline: "Para el viaje que te pedirán repetir cada año",
        property: "Bungalow Village 212 — Aldea Zama, Tulum",
        propertyDetails: "3 recámaras · 6 huéspedes · Jacuzzi privado · Alberca común",
        includes: [
          "4 noches en Bungalow Village 212 (jacuzzi privado, centro holístico)",
          "Experiencia de snorkel con tortugas en Akumal",
          "Visita guiada a cenote privado",
          "Pase de día completo a Xcaret o Xel-Há (elige uno)",
          "Transporte aeropuerto ida y vuelta",
          "Soporte concierge 24/7",
        ],
        duration: "5 días / 4 noches",
        price: "$1,650 USD",
        priceNote: "Para familia de 4 · $412/persona compartido",
        extraNote: "Huésped extra (5to-6to): +$280/persona",
        cta: "Planear Nuestro Viaje Familiar",
        subject: "Consulta Paquete Familiar",
        mailtoSubject: "Consulta Paquete Familiar",
        mailtoBody: "¡Hola! Me interesa el Paquete Familiar para la Riviera Maya. Por favor envíenme más información sobre disponibilidad y precios.",
      },
      {
        tagline: "PAQUETE PAREJAS",
        emoji: "🥂",
        headline: "Para el viaje que no necesita filtro",
        property: "Ana y Jose Hotel & Beach Club — Tulum Beach",
        propertyDetails: "Boutique frente al mar · Cama king · Balcón privado",
        includes: [
          "3 noches en Ana y Jose Ocean View Room (lluvia tropical, beach club)",
          "Catamarán privado al atardecer (4 horas, champagne incluido)",
          "Cena romántica en la playa",
          "Tour al amanecer en ruinas de Tulum (acceso privado temprano)",
          "Tratamiento de spa en pareja (masaje de 60 min)",
          "Transporte de lujo aeropuerto ida y vuelta",
        ],
        duration: "4 días / 3 noches",
        price: "$2,650 USD",
        priceNote: "Para 2 huéspedes · $1,325/persona",
        extraNote: null,
        cta: "Planear Nuestra Escapada",
        subject: "Consulta Paquete Parejas",
        mailtoSubject: "Consulta Paquete Parejas",
        mailtoBody: "¡Hola! Nos gustaría planear un viaje de pareja a la Riviera Maya. Por favor envíenme más información sobre disponibilidad y precios.",
      },
      /* {
        tagline: "PAQUETE GRUPAL",
        emoji: "🎉",
        headline: "Para el grupo que por fin se animó",
        property: "Casa Azanik Oceanfront Villa — North Akumal Bay",
        propertyDetails: "5 recámaras · Hasta 20 huéspedes · Playa privada · Rooftop pool",
        includes: [
          "4 noches en Casa Azanik (alberca frente al mar, rooftop plunge pool, BBQ)",
          "Yate privado día completo (8 hrs, barra libre, chef a bordo)",
          "Tour de aventura en cenote (grupal)",
          "Noche VIP en Playa del Carmen (mesa reservada + servicio de botella)",
          "Aventura de Snorkel con Paquete de Cenote",
          "Transporte de lujo grupal durante toda la estancia",
        ],
        duration: "5 días / 4 noches",
        price: "$10,950 USD",
        priceNote: "Para 8 huéspedes · $1,369/persona compartido",
        extraNote: "Huésped extra (9no-20vo): +$450/persona",
        cta: "Planear Nuestro Viaje Grupal",
        subject: "Consulta Paquete Grupal",
        mailtoSubject: "Consulta Paquete Grupal",
        mailtoBody: "¡Hola! Queremos planear un viaje grupal a la Riviera Maya. Por favor envíenme más información sobre disponibilidad y precios.",
      }, */
    ],
  },
};

const bundleImages = [bundleFamily, bundleCouples];

export default function Bundles() {
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const t = translations[language];

  const handleCTA = (subject: string, bundleName: string) => {
    const message = language === "es"
      ? `Me interesa el ${bundleName}. Por favor envíenme más información sobre disponibilidad y precios.`
      : `I'm interested in the ${bundleName}. Please send me more information about availability and pricing.`;
    navigate(`/contact?subject=${encodeURIComponent(subject)}&message=${encodeURIComponent(message)}`);
  };

  return (
    <div className="min-h-screen bg-[#f7f6f3]">
      <Helmet>
        <title>Riviera Maya Vacation Bundles | Margea Travel</title>
        <meta name="description" content="Curated vacation packages for families, couples, and groups in Cancun, Tulum, and Akumal. Direct bookings with no platform fees." />
        <link rel="canonical" href="https://margea-direct-book.lovable.app/bundles" />
      </Helmet>

      <Navbar language={language} onLanguageChange={setLanguage} />

      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <img
          src={bundlesHero}
          alt="Turquoise Caribbean water"
          className="absolute inset-0 w-full h-full object-cover"
          width={1920}
          height={800}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto animate-fade-in">
          <h1 className="font-cormorant text-4xl md:text-5xl lg:text-6xl text-white font-normal mb-4">
            {t.heroTitle}
          </h1>
          <p className="font-inter text-base md:text-lg text-white/80 font-normal">
            {t.heroSubtitle}
          </p>
        </div>
      </section>

      {/* Bundle Cards */}
      <section className="max-w-[1200px] mx-auto px-4 md:px-6 py-[60px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {t.bundles.slice(0, 2).map((bundle, idx) => (
            <div
              key={idx}
              className="bg-white rounded-[8px] shadow-[0_2px_12px_rgba(0,0,0,0.08)] overflow-hidden transition-all duration-300 hover:translate-y-[-4px] hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)] flex flex-col"
            >
              {/* Image */}
              <div className="relative overflow-hidden aspect-video">
                <img
                  src={bundleImages[idx]}
                  alt={bundle.tagline}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                  width={1200}
                  height={675}
                />
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                {/* Tagline */}
                <span className="font-inter text-[11px] uppercase tracking-[0.2em] text-[#c9a96e] font-medium mb-2">
                  {bundle.tagline} {bundle.emoji}
                </span>

                {/* Headline */}
                <h2 className="font-cormorant text-[22px] md:text-[24px] text-[#1d2839] font-bold mb-4 leading-tight">
                  {bundle.headline}
                </h2>

                {/* Property */}
                <p className="font-inter text-[14px] text-[#1d2839] font-medium mb-1">
                  {bundle.property}
                </p>
                <p className="font-inter text-[12px] text-[#9aa5b4] mb-4">
                  {bundle.propertyDetails}
                </p>

                {/* Includes */}
                <ul className="space-y-2 mb-4">
                  {bundle.includes.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#16A34A] mt-0.5 flex-shrink-0" />
                      <span className="font-inter text-[13px] text-[#1d2839]/80">{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Duration */}
                <p className="font-inter text-[12px] text-[#9aa5b4] uppercase tracking-wider mb-4">
                  {t.duration}: {bundle.duration}
                </p>

                {/* Spacer */}
                <div className="mt-auto">
                  {/* Price */}
                  <div className="mb-4">
                    <p className="font-inter text-[11px] text-[#9aa5b4] uppercase tracking-wider mb-1">
                      {t.startingFrom}
                    </p>
                    <p className="font-cormorant text-[28px] text-[#1d2839] font-bold leading-tight">
                      {bundle.price}
                    </p>
                    <p className="font-inter text-[12px] text-[#9aa5b4] mt-1">
                      {bundle.priceNote}
                    </p>
                    {bundle.extraNote && (
                      <p className="font-inter text-[11px] text-[#9aa5b4] mt-0.5">
                        {bundle.extraNote}
                      </p>
                    )}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleCTA(bundle.subject, bundle.tagline)}
                    className="w-full py-3 px-6 bg-[#1d2839] text-white font-inter text-[14px] uppercase tracking-[0.1em] rounded-[50px] transition-all duration-300 hover:bg-[#c9a96e] mb-3"
                  >
                    {bundle.cta}
                  </button>

                  {/* Email link */}
                  <p className="text-center">
                    <span className="font-inter text-[12px] text-[#9aa5b4]">
                      {t.questionsText}{" "}
                    </span>
                    <a
                      href={`mailto:admin@margeatravel.com?subject=${encodeURIComponent(bundle.mailtoSubject)}&body=${encodeURIComponent(bundle.mailtoBody)}`}
                      className="font-inter text-[12px] text-[#c9a96e] underline hover:text-[#1d2839] transition-colors"
                    >
                      {t.textUs}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer language={language} />
    </div>
  );
}
