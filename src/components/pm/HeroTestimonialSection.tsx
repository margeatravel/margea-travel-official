import { Language } from "@/components/LanguageToggle";
import { media } from "@/lib/media";

const translations = {
  en: {
    quote: "Margea increased our occupancy from 45% to 87% in less than 6 months. I don't have to worry about anything — I get my report, I get my money, and I know my property is in the best hands.",
    name: "M.G. — Beachfront Villa, Akumal",
    stats: [
      { value: "+42%", label: "REVENUE INCREASE" },
      { value: "6 months", label: "TIME TO SEE RESULTS" },
      { value: "0 hours", label: "OWNER'S TIME" },
    ],
  },
  es: {
    quote: "Margea aumentó nuestra ocupación de 45% a 87% en menos de 6 meses. No tengo que preocuparme por nada — recibo mi reporte, recibo mi dinero, y sé que mi propiedad está en las mejores manos.",
    name: "M.G. — Villa Frente al Mar, Akumal",
    stats: [
      { value: "+42%", label: "INCREMENTO DE INGRESOS" },
      { value: "6 meses", label: "TIEMPO PARA VER RESULTADOS" },
      { value: "0 horas", label: "TIEMPO DEL PROPIETARIO" },
    ],
  },
};

interface HeroTestimonialSectionProps {
  language: Language;
}

export default function HeroTestimonialSection({ language }: HeroTestimonialSectionProps) {
  const t = translations[language];

  return (
    <section
      className="relative w-full flex items-center justify-center"
      style={{ minHeight: 520 }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url(media('/property-images/akumal-u7-1.jpg'))",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "rgba(29,40,57,0.78)" }}
      />

      <div
        className="relative z-10 text-center"
        style={{ padding: "80px 40px", maxWidth: 800, margin: "0 auto" }}
      >
        <span
          className="font-cormorant absolute select-none pointer-events-none"
          style={{
            fontSize: 200,
            color: "#c9a96e",
            opacity: 0.25,
            top: 20,
            left: 20,
            lineHeight: 1,
          }}
          aria-hidden="true"
        >
          "
        </span>

        <p
          className="font-cormorant relative z-10"
          style={{
            fontSize: "clamp(20px, 3vw, 26px)",
            color: "#ffffff",
            lineHeight: 1.65,
            maxWidth: 720,
            margin: "0 auto",
          }}
        >
          {t.quote}
        </p>

        <div
          style={{
            marginTop: 28,
            fontSize: 18,
            color: "#c9a96e",
            letterSpacing: 4,
          }}
        >
          ★★★★★
        </div>

        <p
          className="font-inter"
          style={{
            fontSize: 13,
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            color: "rgba(255,255,255,0.7)",
            marginTop: 8,
          }}
        >
          {t.name}
        </p>

        <div
          className="flex items-center justify-center flex-wrap"
          style={{ marginTop: 56, gap: 0 }}
        >
          {t.stats.map((stat, i) => (
            <div key={stat.label} className="flex items-center">
              {i > 0 && (
                <div
                  style={{
                    width: 1,
                    height: 48,
                    background: "#c9a96e",
                    margin: "0 32px",
                  }}
                />
              )}
              <div className="text-center">
                <div
                  className="font-cormorant"
                  style={{ fontSize: 40, color: "#c9a96e", lineHeight: 1 }}
                >
                  {stat.value}
                </div>
                <p
                  className="font-inter"
                  style={{
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    color: "rgba(255,255,255,0.6)",
                    marginTop: 6,
                  }}
                >
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
