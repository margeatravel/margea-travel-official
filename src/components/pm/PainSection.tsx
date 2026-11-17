import { Calendar, Clock, TrendingDown, EyeOff } from "lucide-react";
import { Language } from "@/components/LanguageToggle";

const translations = {
  en: {
    eyebrow: "DOES THIS SOUND FAMILIAR?",
    title: "Most property owners are leaving money on the table without knowing it.",
    cards: [
      { title: "Empty Seasons", description: "Your property loses occupancy while you can't manage it from afar." },
      { title: "Never-Ending Operations", description: "Guest messages, cleaning, maintenance — it all falls on you." },
      { title: "Static Pricing", description: "Without dynamic rate adjustments, you lose revenue every week." },
      { title: "Zero Visibility", description: "You don't know exactly how much your property earns or why." },
    ],
  },
  es: {
    eyebrow: "¿TE SUENA FAMILIAR?",
    title: "La mayoría de los propietarios están dejando dinero sobre la mesa sin saberlo.",
    cards: [
      { title: "Temporadas vacías", description: "Tu propiedad pierde ocupación mientras tú no puedes atenderla." },
      { title: "Operación que no para", description: "Mensajes de huéspedes, limpieza, mantenimiento — todo cae sobre ti." },
      { title: "Precios estáticos", description: "Sin ajuste dinámico de tarifas, pierdes ingresos cada semana." },
      { title: "Cero visibilidad", description: "No sabes exactamente cuánto genera tu propiedad ni por qué." },
    ],
  },
};

const icons = [Calendar, Clock, TrendingDown, EyeOff];

interface PainSectionProps {
  language: Language;
}

export default function PainSection({ language }: PainSectionProps) {
  const t = translations[language];

  return (
    <section className="bg-white" style={{ padding: "100px 24px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
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
            fontSize: "clamp(32px, 5vw, 48px)",
            color: "#1d2839",
            fontWeight: 400,
            lineHeight: 1.15,
            marginBottom: 60,
          }}
        >
          {t.title}
        </h2>

        <div
          className="grid gap-6"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}
        >
          {t.cards.map((card, i) => {
            const Icon = icons[i];
            return (
              <div
                key={card.title}
                style={{
                  background: "#1d2839",
                  borderRadius: 16,
                  padding: 36,
                }}
              >
                <Icon
                  size={24}
                  style={{ color: "#c9a96e", marginBottom: 16 }}
                  strokeWidth={1.5}
                />
                <h3
                  className="font-inter"
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#ffffff",
                    marginBottom: 8,
                  }}
                >
                  {card.title}
                </h3>
                <p
                  className="font-inter"
                  style={{
                    fontSize: 14,
                    color: "rgba(255,255,255,0.7)",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
