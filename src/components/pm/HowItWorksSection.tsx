import { MessageSquare, Camera, CalendarCheck } from "lucide-react";
import { Language } from "@/components/LanguageToggle";

const translations = {
  en: {
    eyebrow: "THE PROCESS",
    title: "From signing to income, without complications.",
    subtitle: "We handle everything. You just collect.",
    steps: [
      { title: "We evaluate your property", description: "Free, no-commitment analysis: location, current condition, and rental potential. One call is enough." },
      { title: "We optimize it for rental", description: "Professional photography, high-impact listing, dynamic pricing and presence across multiple platforms." },
      { title: "You collect. We work.", description: "Detailed monthly report, on-time deposit and direct access to your account manager at any time." },
    ],
  },
  es: {
    eyebrow: "EL PROCESO",
    title: "De la firma a los ingresos, sin complicaciones.",
    subtitle: "Nos encargamos de todo. Tú solo cobras.",
    steps: [
      { title: "Evaluamos tu propiedad", description: "Análisis gratuito sin compromiso: ubicación, estado actual y potencial de renta. Una llamada es suficiente." },
      { title: "La optimizamos para rentar", description: "Fotografía profesional, descripción de alto impacto, precios dinámicos y presencia en múltiples plataformas." },
      { title: "Tú cobras. Nosotros trabajamos.", description: "Reporte mensual detallado, depósito puntual y acceso directo a tu account manager en cualquier momento." },
    ],
  },
};

const icons = [MessageSquare, Camera, CalendarCheck];
const nums = ["01", "02", "03"];

interface HowItWorksSectionProps {
  language: Language;
}

export default function HowItWorksSection({ language }: HowItWorksSectionProps) {
  const t = translations[language];

  return (
    <section className="bg-white" style={{ padding: "100px 24px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <p
          className="font-inter text-center"
          style={{
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            color: "#c9a96e",
            marginBottom: 16,
          }}
        >
          {t.eyebrow}
        </p>

        <h2
          className="font-cormorant text-center"
          style={{
            fontSize: "clamp(30px, 5vw, 44px)",
            color: "#1d2839",
            fontWeight: 400,
            marginBottom: 12,
          }}
        >
          {t.title}
        </h2>

        <p
          className="font-inter text-center"
          style={{
            fontSize: 16,
            color: "#6b7280",
            marginBottom: 72,
          }}
        >
          {t.subtitle}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 relative" style={{ gap: 0 }}>
          <div
            className="hidden md:block absolute"
            style={{
              top: 80,
              left: "calc(33.33% + 20px)",
              right: "calc(33.33% + 20px)",
              height: 1,
              background: "#c9a96e",
            }}
          />

          {t.steps.map((step, i) => {
            const Icon = icons[i];
            return (
              <div
                key={i}
                className="flex flex-col items-center md:items-center text-center md:text-center"
                style={{ padding: "0 20px", marginBottom: 40 }}
              >
                <span
                  className="font-cormorant"
                  style={{
                    fontSize: 72,
                    color: "#c9a96e",
                    opacity: 0.4,
                    lineHeight: 1,
                    marginBottom: 16,
                  }}
                >
                  {nums[i]}
                </span>

                <Icon
                  size={28}
                  style={{ color: "#1d2839", marginBottom: 16 }}
                  strokeWidth={1.5}
                />

                <h3
                  className="font-inter"
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#1d2839",
                    marginBottom: 10,
                  }}
                >
                  {step.title}
                </h3>

                <p
                  className="font-inter"
                  style={{
                    fontSize: 14,
                    color: "#6b7280",
                    lineHeight: 1.7,
                    maxWidth: 260,
                    margin: "0 auto",
                  }}
                >
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
