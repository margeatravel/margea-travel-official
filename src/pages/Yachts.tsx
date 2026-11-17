import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { YachtCard } from "@/components/YachtCard";
import { useLanguage } from "@/components/LanguageToggle";
import { yachts } from "@/data/yachts-data";
import { ActivityHero } from "@/components/ActivityHero";

const translations = {
  en: {
    title: "Luxury Yacht Charter",
    subtitle: "Discover our exclusive fleet of yachts in Cancún and Riviera Maya",
  },
  es: {
    title: "Renta de Yates de Lujo",
    subtitle: "Descubre nuestra flota exclusiva de yates en Cancún y Riviera Maya",
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
        backgroundImage="/yacht-images/yacht-hero.jpg"
      />
      
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {yachts.map((yacht) => (
              <YachtCard
                key={yacht.id}
                id={yacht.id}
                name={yacht.name}
                marina={yacht.marina}
                size={yacht.size}
                capacity={yacht.capacity}
                image={yacht.image}
                pricing={yacht.pricing}
                currency={yacht.currency}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer language={language} />
    </div>
  );
}
