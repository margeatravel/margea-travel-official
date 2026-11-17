import { Link } from "react-router-dom";
import { Language } from "@/components/LanguageToggle";
import { getWhatsAppUrl } from "@/lib/whatsapp";

const translations = {
  en: {
    title: "How much can your property generate?",
    subtitle: "Tell us about it and we'll give you a free estimate in less than 24 hours.",
    button1: "I want to list my property",
    button2: "Message us on WhatsApp",
    fine: "No commitment. No cost. Just a conversation.",
  },
  es: {
    title: "¿Cuánto puede generar tu propiedad?",
    subtitle: "Cuéntanos sobre ella y te damos una estimación gratuita en menos de 24 horas.",
    button1: "Quiero listar mi propiedad",
    button2: "Escríbenos por WhatsApp",
    fine: "Sin compromiso. Sin costo. Solo una conversación.",
  },
};

interface FinalCTASectionProps {
  language: Language;
}

export default function FinalCTASection({ language }: FinalCTASectionProps) {
  const t = translations[language];

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "#1d2839", padding: "120px 24px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            rgba(255,255,255,0.04) 0px,
            rgba(255,255,255,0.04) 1px,
            transparent 1px,
            transparent 20px
          )`,
        }}
      />

      <div className="relative z-10 text-center" style={{ maxWidth: 600, margin: "0 auto" }}>
        <h2
          className="font-cormorant"
          style={{
            fontSize: "clamp(34px, 5vw, 52px)",
            color: "#ffffff",
            fontWeight: 400,
            lineHeight: 1.2,
            marginBottom: 20,
          }}
        >
          {t.title}
        </h2>

        <p
          className="font-inter"
          style={{
            fontSize: 16,
            color: "rgba(255,255,255,0.6)",
            marginBottom: 56,
          }}
        >
          {t.subtitle}
        </p>

        <div
          className="flex flex-col sm:flex-row items-center justify-center"
          style={{ gap: 16 }}
        >
          <Link to="/property-request">
            <button
              className="font-inter"
              style={{
                background: "#c9a96e",
                color: "#1d2839",
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: "0.06em",
                padding: "18px 40px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                transition: "filter 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.filter = "brightness(1.1)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.filter = "brightness(1)";
              }}
            >
              {t.button1}
            </button>
          </Link>

          <a
            href={getWhatsAppUrl(language)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button
              className="font-inter"
              style={{
                background: "transparent",
                color: "#ffffff",
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: "0.06em",
                padding: "18px 40px",
                borderRadius: 8,
                border: "1.5px solid rgba(255,255,255,0.4)",
                cursor: "pointer",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.borderColor = "rgba(255,255,255,1)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.4)";
              }}
            >
              {t.button2}
            </button>
          </a>
        </div>

        <p
          className="font-inter"
          style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.35)",
            letterSpacing: "0.05em",
            marginTop: 24,
          }}
        >
          {t.fine}
        </p>
      </div>
    </section>
  );
}
