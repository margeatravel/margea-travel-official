import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { YachtCard } from "@/components/YachtCard";
import { useLanguage } from "@/components/LanguageToggle";
import { yachts } from "@/data/yachts-data";
import { ActivityHero } from "@/components/ActivityHero";
import { media } from "@/lib/media";

const translations = {
  en: {
    title: "Luxury Yacht Charter",
    subtitle: "Discover our exclusive fleet of yachts in Cancún and Riviera Maya",
    notesTitle: "Good to know",
    notes: [
      "Extra passenger: $1,000 MXN per person, up to the yacht's maximum capacity.",
      "Special dates (Dec 24, Dec 31 and Jan 1): +$2,000 MXN.",
      "Pier tax: $150 MXN per person, not included in the yacht rate.",
      "Prices exclude 16% IVA (added for invoices).",
      "Rates valid from December 1, 2026.",
    ],
  },
  es: {
    title: "Renta de Yates de Lujo",
    subtitle: "Descubre nuestra flota exclusiva de yates en Cancún y Riviera Maya",
    notesTitle: "Información importante",
    notes: [
      "Pasajero extra: $1,000 MXN por persona, hasta la capacidad máxima del yate.",
      "Fechas especiales (24 dic, 31 dic y 1 ene): +$2,000 MXN.",
      "Impuesto de muelle: $150 MXN por persona, no incluido en la tarifa del yate.",
      "Precios sin IVA (para factura se agrega 16% de IVA).",
      "Tarifas vigentes desde el 1 de diciembre de 2026.",
    ],
  },
};

export default function Yachts() {
  const { language, setLanguage } = useLanguage();
  const t = translations[language];

  return (
    <div className="min-h-screen bg-background">
      <Navbar language={language} onLanguageChange={setLanguage} />
      
      <ActivityHero
        title={t.title}
        subtitle={t.subtitle}
        backgroundImage={media("/yacht-images/yacht-hero.jpg")}
      />
      
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {yachts.map((yacht) => (
              <YachtCard
                key={yacht.id}
                id={yacht.id}
                name={yacht.name}
                model={yacht.model}
                marina={yacht.marina}
                size={yacht.size}
                capacity={yacht.capacity}
                maxCapacity={yacht.maxCapacity}
                image={yacht.image}
                pricing={yacht.pricing}
                currency={yacht.currency}
              />
            ))}
          </div>

          <div className="mt-12 max-w-3xl mx-auto rounded-lg bg-white border border-border p-6">
            <h2 className="text-lg font-bold mb-3">{t.notesTitle}</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {t.notes.map((note, i) => (
                <li key={i} className="flex gap-2">
                  <span aria-hidden>•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Footer language={language} />
    </div>
  );
}
