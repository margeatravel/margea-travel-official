import { useState } from "react";
import { Language } from "@/components/LanguageToggle";

const translations = {
  en: {
    eyebrow: "FAQ",
    title: "Everything you want to know before getting started.",
    faqs: [
      { question: "Can I use my property whenever I want?", answer: "Yes. You're the owner. You block the dates you need and your property is reserved for you. We just ask for reasonable advance notice to coordinate operations." },
      { question: "What happens if a guest causes damage?", answer: "We do a documented inspection before and after every stay. Damages are reported immediately and handled with the guest before releasing the security deposit. Your property is always protected." },
      { question: "When and how do I receive my money?", answer: "On the first business day of each month you receive your detailed report followed by your transfer. You always know exactly what came in, what was spent on operations, and what's yours." },
      { question: "Do I have visibility into what happens at my property?", answer: "Yes. You receive monthly reports with income, occupancy, expenses and guest ratings. And if you need to know something at any time, you have direct contact with your account manager — not a chatbot, a real person." },
      { question: "How much does Margea charge?", answer: "We work with a management fee on the income generated — no fixed payments, no surprises. We only earn when you earn. Contact us for your personalized quote." },
    ],
  },
  es: {
    eyebrow: "PREGUNTAS FRECUENTES",
    title: "Todo lo que quieres saber antes de empezar.",
    faqs: [
      { question: "¿Puedo usar mi propiedad cuando yo quiera?", answer: "Sí. Tú eres el dueño. Bloqueas las fechas que necesites y tu propiedad queda reservada para ti. Solo te pedimos aviso con tiempo razonable para coordinar la operación." },
      { question: "¿Qué pasa si un huésped daña algo?", answer: "Hacemos inspección documentada antes y después de cada estancia. Los daños se reportan de inmediato y se gestionan con el huésped antes de liberar el depósito de seguridad. Tu propiedad siempre está protegida." },
      { question: "¿Cuándo y cómo recibo mi dinero?", answer: "El primer día hábil de cada mes recibes tu reporte detallado seguido de tu transferencia. Siempre sabes exactamente qué entró, qué se gastó en operación y cuánto es tuyo." },
      { question: "¿Tengo visibilidad de lo que pasa en mi propiedad?", answer: "Sí. Recibes reportes mensuales con ingresos, ocupación, gastos y calificaciones. Y si necesitas saber algo en cualquier momento, tienes contacto directo con tu account manager — no un chatbot, una persona real." },
      { question: "¿Cuánto cobra Margea?", answer: "Trabajamos con una tarifa de gestión sobre los ingresos generados — sin pagos fijos, sin sorpresas. Solo ganamos cuando tú ganas. Escríbenos para tu cotización personalizada según tu propiedad." },
    ],
  },
};

interface FAQSectionProps {
  language: Language;
}

export default function FAQSection({ language }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState(0);
  const t = translations[language];

  return (
    <section style={{ background: "#f5f5f3", padding: "100px 24px" }}>
      <div style={{ maxWidth: 740, margin: "0 auto" }}>
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
            fontSize: "clamp(28px, 5vw, 40px)",
            color: "#1d2839",
            fontWeight: 400,
            marginBottom: 56,
          }}
        >
          {t.title}
        </h2>

        <div>
          {t.faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                style={{
                  borderBottom: "1px solid #e5e7eb",
                  padding: "24px 0",
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  className="flex items-center justify-between w-full text-left"
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  <span
                    className="font-inter"
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: "#1d2839",
                      paddingRight: 16,
                    }}
                  >
                    {faq.question}
                  </span>
                  <span
                    style={{
                      fontSize: 22,
                      color: "#c9a96e",
                      transition: "transform 0.3s ease",
                      transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                      flexShrink: 0,
                      lineHeight: 1,
                    }}
                  >
                    +
                  </span>
                </button>
                <div
                  style={{
                    overflow: "hidden",
                    maxHeight: isOpen ? 300 : 0,
                    transition: "max-height 0.3s ease",
                  }}
                >
                  <p
                    className="font-inter"
                    style={{
                      fontSize: 15,
                      color: "#6b7280",
                      lineHeight: 1.75,
                      paddingTop: 12,
                      paddingBottom: 4,
                      margin: 0,
                    }}
                  >
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
