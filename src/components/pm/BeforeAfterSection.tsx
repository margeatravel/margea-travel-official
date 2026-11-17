import { Link } from "react-router-dom";
import { Language } from "@/components/LanguageToggle";

const translations = {
  en: {
    leftEyebrow: "WITHOUT PROFESSIONAL MANAGEMENT",
    leftTitle: "Managing alone",
    withoutItems: [
      "Average occupancy: 45–55%",
      "Between 15–20 hours of your time per week",
      "Fixed pricing with no market optimization",
      "No clear income report",
      "You handling emergencies at any hour",
    ],
    rightEyebrow: "WITH MARGEA",
    rightTitle: "Professional management",
    withItems: [
      "Average occupancy: 85–92%",
      "Your time dedicated: 0 hours",
      "Dynamic pricing updated daily",
      "Detailed monthly report + on-time deposit",
      "Margea available 24/7 — you sleep peacefully",
    ],
    button: "I want Margea to manage my property →",
  },
  es: {
    leftEyebrow: "SIN GESTIÓN PROFESIONAL",
    leftTitle: "Administrando solo",
    withoutItems: [
      "Ocupación promedio: 45–55%",
      "Entre 15 y 20 horas semanales de tu tiempo",
      "Precios fijos sin optimización de mercado",
      "Sin reporte claro de ingresos",
      "Tú respondiendo emergencias a cualquier hora",
    ],
    rightEyebrow: "CON MARGEA",
    rightTitle: "Gestión profesional",
    withItems: [
      "Ocupación promedio: 85–92%",
      "Tu tiempo dedicado: 0 horas",
      "Precios dinámicos actualizados diariamente",
      "Reporte mensual detallado + depósito puntual",
      "Margea 24/7 — tú duermes tranquilo",
    ],
    button: "Quiero que Margea administre mi propiedad →",
  },
};

function XIcon() {
  return (
    <div
      className="flex items-center justify-center shrink-0"
      style={{ width: 20, height: 20, borderRadius: "50%", background: "#c0392b" }}
    >
      <span style={{ color: "#fff", fontSize: 12, fontWeight: 700, lineHeight: 1 }}>✕</span>
    </div>
  );
}

function CheckIcon() {
  return (
    <div
      className="flex items-center justify-center shrink-0"
      style={{ width: 20, height: 20, borderRadius: "50%", background: "#c9a96e" }}
    >
      <span style={{ color: "#1d2839", fontSize: 12, fontWeight: 700, lineHeight: 1 }}>✓</span>
    </div>
  );
}

interface BeforeAfterSectionProps {
  language: Language;
}

export default function BeforeAfterSection({ language }: BeforeAfterSectionProps) {
  const t = translations[language];

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2" style={{ minHeight: 540 }}>
        {/* Without Margea */}
        <div
          className="flex flex-col justify-center"
          style={{ background: "#f5f5f3", padding: "80px 60px" }}
        >
          <style>{`
            @media (max-width: 768px) {
              .ba-col { padding: 48px 32px !important; }
            }
          `}</style>
          <div className="ba-col" style={{ padding: 0 }}>
            <p
              className="font-inter"
              style={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.25em",
                color: "#c0392b",
                marginBottom: 12,
              }}
            >
              {t.leftEyebrow}
            </p>
            <h3
              className="font-cormorant"
              style={{
                fontSize: "clamp(28px, 4vw, 38px)",
                color: "#1d2839",
                fontWeight: 400,
                marginBottom: 40,
              }}
            >
              {t.leftTitle}
            </h3>
            <div className="flex flex-col" style={{ gap: 20 }}>
              {t.withoutItems.map((item) => (
                <div key={item} className="flex items-start" style={{ gap: 16 }}>
                  <XIcon />
                  <span
                    className="font-inter"
                    style={{ fontSize: 15, color: "#4b5563", lineHeight: 1.5 }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* With Margea */}
        <div
          className="flex flex-col justify-center"
          style={{ background: "#1d2839", padding: "80px 60px" }}
        >
          <div className="ba-col" style={{ padding: 0 }}>
            <p
              className="font-inter"
              style={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.25em",
                color: "#c9a96e",
                marginBottom: 12,
              }}
            >
              {t.rightEyebrow}
            </p>
            <h3
              className="font-cormorant"
              style={{
                fontSize: "clamp(28px, 4vw, 38px)",
                color: "#ffffff",
                fontWeight: 400,
                marginBottom: 40,
              }}
            >
              {t.rightTitle}
            </h3>
            <div className="flex flex-col" style={{ gap: 20 }}>
              {t.withItems.map((item) => (
                <div key={item} className="flex items-start" style={{ gap: 16 }}>
                  <CheckIcon />
                  <span
                    className="font-inter"
                    style={{ fontSize: 15, color: "#ffffff", lineHeight: 1.5 }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 48 }}>
              <Link to="/property-request">
                <button
                  className="font-inter"
                  style={{
                    background: "#c9a96e",
                    color: "#1d2839",
                    fontSize: 14,
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    padding: "16px 32px",
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
                  {t.button}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
