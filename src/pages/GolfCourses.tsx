import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ActivityHero } from "@/components/ActivityHero";
import { GolfCourseCard } from "@/components/GolfCourseCard";
import { golfCourses } from "@/data/golf-courses-data";
import { Mail, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { Button } from "@/components/ui/button";
import { Shield, Star, Clock, Users } from "lucide-react";

import { getWhatsAppUrl } from "@/lib/whatsapp";

type Language = "en" | "es";

const GolfCourses = () => {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    document.title =
      "Premier Golf Courses | Margea – Cancun & Riviera Maya";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "Exclusive access to the 9 most prestigious golf courses in Cancun and Riviera Maya. Preferred rates, priority tee times, and concierge coordination by Margea."
      );
    }
  }, []);

  const advantages = [
    {
      icon: Star,
      title: "Exclusive Agency Discounts",
      desc: "Preferred rates not available to the general public.",
    },
    {
      icon: Users,
      title: "Long-Standing Partnerships",
      desc: "Years of trusted relationships with every club in the region.",
    },
    {
      icon: Clock,
      title: "Priority Tee Times",
      desc: "First-access scheduling, even during peak season.",
    },
    {
      icon: Shield,
      title: "Concierge Coordination",
      desc: "From transportation to equipment — we handle every detail.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar language={language} onLanguageChange={setLanguage} />

      <ActivityHero
        title="Premier Golf Experiences in Cancun & Riviera Maya"
        subtitle="Exclusive access to championship courses with preferred rates and concierge coordination."
        backgroundImage="/golf-images/golf-hero.jpg"
        className="min-h-[36vh]"
      />

      <section className="py-6 bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {advantages.map((a) => (
              <div key={a.title} className="flex items-center gap-2 justify-center">
                <a.icon className="w-4 h-4 text-primary shrink-0" />
                <span className="text-xs text-muted-foreground">{a.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground text-center mb-8">
            Featured Courses
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {golfCourses.map((course, i) => (
              <GolfCourseCard
                key={course.id}
                course={course}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Contact Us
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
              <Button variant="outline" asChild>
                <a href="mailto:admin@margeatravel.com" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  admin@margeatravel.com
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="tel:+529982334867" className="flex items-center gap-2" aria-label="Call Margea: +52 998 233 4867">
                  <Phone className="w-4 h-4" />
                  +52 998 233 4867
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href={getWhatsAppUrl(language)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2" aria-label="WhatsApp Margea">
                  <WhatsAppIcon size={16} />
                  WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer language={language} />
    </div>
  );
};

export default GolfCourses;
