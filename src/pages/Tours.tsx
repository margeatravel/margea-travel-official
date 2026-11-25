import { SEO } from "@/components/SEO";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { TourCard } from "@/components/TourCard";
import { useLanguage } from "@/components/LanguageToggle";
import { ActivityHero } from "@/components/ActivityHero";
import { chichenItzaTour, getTotalReviews } from "@/data/chichenItzaTour";
import { akumalTour } from "@/data/akumalTour";
import { dolphinTour, getTotalReviews as getDolphinTotalReviews, getBestRating as getDolphinBestRating } from "@/data/dolphinTour";
import { getFromPrice, getCardPricing } from "@/data/toursPricing";
import { whaleSharkCover } from "@/data/whaleSharkImages";
import { media } from "@/lib/media";

const translations = {
  en: {
    title: "Tours & Activities",
    subtitle: "Explore the best experiences in Riviera Maya",
    packagesSection: "Packages",
    toursSection: "Tours",
  },
  es: {
    title: "Tours y Actividades",
    subtitle: "Explora las mejores experiencias en Riviera Maya",
    packagesSection: "Paquetes",
    toursSection: "Tours",
  },
};

const tours = [
  {
    id: "extreme-adventuring",
    image: media("/tour-images/extreme-adventuring-cover.jpg"),
    title: "Extreme Adventuring",
    subtitle: "ATV, Zipline, Cenote and Mayan Show",
    duration: "4 hours",
    rating: 5.0,
    reviews: 3692,
    highlights: ["ATV ride", "5 ziplines circuit", "Natural open cenote", "Tequila tasting"],
    pricing: getCardPricing("extreme-adventuring"),
  },
  {
    id: "extreme-horseback-riding",
    image: media("/tour-images/horseback-cover.jpg"),
    title: "Extreme Horseback Riding",
    subtitle: "Horseback and ATV circuit, Zipline, cenote and Mayan show",
    duration: "4 hours",
    rating: 4.6,
    reviews: 1483,
    highlights: ["ATV ride", "Horseback ride", "5 ziplines circuit", "Natural open cenote"],
    pricing: getCardPricing("extreme-horseback-riding"),
  },
  {
    id: "private-snorkeling",
    image: media("/tour-images/snorkeling-2.png"),
    title: "Private Snorkeling",
    subtitle: "Private boat ride & Snorkeling in Puerto Morelos",
    duration: "4 hours",
    rating: 4.8,
    reviews: 892,
    minPeople: "Min. 6 people",
    highlights: ["Unlimited drinks onboard", "Private boat for group", "Fresh ceviche served", "Priority check-in"],
    pricing: { currentPrice: getFromPrice("private-snorkeling") },
  },
  {
    id: "snorkeling-adventure",
    image: media("/tour-images/snorkeling-adventure-cover.jpg"),
    title: "Snorkeling Adventure",
    subtitle: "Snorkel the biggest reef in 'The Americas'",
    duration: "4 hours",
    rating: 4.7,
    reviews: 1057,
    highlights: ["Snorkel in reef", "Snack beachside", "Puerto Morelos tour", "Tequila tasting"],
    pricing: { currentPrice: getFromPrice("snorkeling-adventure") },
  },
  {
    id: "cenote-adventuring",
    image: media("/tour-images/cenote-1.png"),
    title: "Cenote Adventuring",
    subtitle: "3 cenote boutique experience, Mayan show with snack",
    duration: "4 hours",
    rating: 4.5,
    reviews: 1982,
    highlights: ["Cenote with waterfall", "Cenote with cavern", "Cenote with zipline", "Tequila tasting"],
    pricing: { currentPrice: getFromPrice("cenote-adventuring") },
  },
  {
    id: "city-taco-tour",
    image: media("/tour-images/taco-tour-cover.jpg"),
    title: "Beach Taco Tour",
    subtitle: "Beachside tacos & town tour with tequila tasting (From Cancun)",
    duration: "4 hours",
    rating: 4.5,
    reviews: 1548,
    highlights: ["3 taco spots", "Puerto Morelos stroll", "Ice cream stop", "Tequila tasting"],
    pricing: { currentPrice: getFromPrice("city-taco-tour") },
  },
];

// Chichen Itza tour card data - derived from single source of truth
const chichenItzaCard = {
  id: chichenItzaTour.slug,
  image: media("/tour-images/chichen-itza-pyramid.jpg"),
  title: chichenItzaTour.title,
  subtitle: "Visit one of the New 7 Wonders of the World",
  duration: chichenItzaTour.duration,
  rating: chichenItzaTour.rating,
  reviews: getTotalReviews(),
  highlights: [
    "Chichen Itza guided tour",
    "Cenote visit & swimming",
    "Visit to Valladolid",
    "Luxury air-conditioned bus",
  ],
  pricing: {
    currentPrice: getFromPrice("chichen-itza"),
  },
};

// Akumal tour card data - derived from single source of truth
const akumalCard = {
  id: akumalTour.slug,
  image: media("/tour-images/akumal-turtle-cover.jpg"),
  title: akumalTour.title,
  subtitle: "Swim with sea turtles in their natural habitat",
  duration: "4 hours",
  rating: akumalTour.rating,
  reviews: akumalTour.reviewsCount,
  highlights: [
    "Snorkel with sea turtles",
    "Professional equipment included",
    "Round-trip transportation",
    "Expert guides",
  ],
  pricing: {
    currentPrice: getFromPrice("akumal-sea-turtle"),
  },
};

// Dolphin tour card data - derived from single source of truth
const dolphinCard = {
  id: dolphinTour.slug,
  image: dolphinTour.cardImage,
  title: dolphinTour.title,
  subtitle: "Interactive dolphin experience in crystal clear waters",
  duration: "2-4 hours",
  rating: getDolphinBestRating(),
  reviews: getDolphinTotalReviews(),
  highlights: [
    "Swim with dolphins",
    "Free Wi-Fi & showers",
    "Lockers included",
    "Two locations available",
  ],
  pricing: {
    currentPrice: getFromPrice("dolphin-swim-experience"),
  },
};

// Wave Runner card
const waveRunnerCard = {
  id: "wave-runner",
  image: media("/tour-images/wave-runner-1.jpeg"),
  title: "Puerto Maya Wave Runner",
  subtitle: "Adrenaline ride across the Nichupté Lagoon",
  duration: "30 min – 1 hour",
  rating: 4.7,
  reviews: 1245,
  highlights: ["Single or double wave runner", "Expert safety briefing", "Nichupté Lagoon mangroves", "Marina facilities included"],
  pricing: {
    currentPrice: getFromPrice("wave-runner"),
  },
};

// Mayan Jungle Tour card
const mayanJungleCard = {
  id: "mayan-jungle-tour",
  image: media("/tour-images/mayan-jungle-tour-1.jpeg"),
  title: "Mayan Jungle Tour",
  subtitle: "Speed boat, snorkeling & sacred Mayan ceremony",
  duration: "3 hours",
  rating: 4.6,
  reviews: 1832,
  highlights: ["Drive your own speed boat", "Snorkel Punta Nizuc Reef", "Mayan ceremony experience", "Traditional Mayan meal"],
  pricing: {
    currentPrice: getFromPrice("mayan-jungle-tour"),
  },
};

// Whale Shark card (seasonal: May–September)
const whaleSharkCard = {
  id: "whale-shark-snorkeling",
  image: whaleSharkCover,
  title: "Whale Shark Snorkeling Adventure",
  subtitle: "Swim with the gentle giants of the Caribbean (May–September)",
  duration: "7-8 hours",
  rating: 4.9,
  reviews: 742,
  highlights: ["Swim with whale sharks", "Certified bilingual guides", "Extra snorkeling stop", "Ceviche & drinks on board"],
  pricing: { currentPrice: getFromPrice("whale-shark-snorkeling") },
};

const packages = [
  {
    id: "extreme-snorkeling-package",
    image: media("/tour-images/extreme-combo-1.png"),
    title: "Extreme Adventuring + Snorkeling Adventure Package",
    subtitle: "Extreme Adventuring Package",
    duration: "8 hours",
    rating: 4.8,
    reviews: 892,
    highlights: ["ATV jungle adventure", "Caribbean snorkeling", "Cenote visit", "Mayan show"],
    pricing: getCardPricing("extreme-snorkeling-package"),
  },
  {
    id: "full-experience-two-days",
    image: media("/tour-images/extreme-adventuring-1.png"),
    title: "Full Experience Adventure Two Days ATV Package",
    subtitle: "Extreme Adventuring Package",
    duration: "2 days",
    rating: 4.9,
    reviews: 634,
    highlights: ["2 full days of adventure", "Multiple cenotes", "Zipline circuits", "Mayan show"],
    pricing: getCardPricing("full-experience-two-days"),
  },
  {
    id: "snorkeling-cenote-package",
    image: media("/tour-images/snorkeling-2.png"),
    title: "Snorkeling Adventure with Cenote Adventure Package",
    subtitle: "Extreme Adventuring Package",
    duration: "6 hours",
    rating: 4.7,
    reviews: 1124,
    highlights: ["Great Maya Reef snorkel", "3 private cenotes", "Beachside snack", "Tequila tasting"],
    pricing: { currentPrice: getFromPrice("snorkeling-cenote-package") },
  },
];

export default function Tours() {
  const { language, setLanguage } = useLanguage();
  const t = translations[language];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Riviera Maya Tours & Excursions | Margea"
        description="Chichén Itzá, cenotes, sea turtles, snorkeling and more. Curated Riviera Maya tours and excursions with instant confirmation."
        path="/tours"
      />
      <Navbar language={language} onLanguageChange={setLanguage} />
      
      <ActivityHero
        title={t.title}
        subtitle={t.subtitle}
        backgroundImage={media("/tour-images/snorkeling-reef-hero.jpg")}
      />

      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 space-y-12">
          {/* Packages Section */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">{t.packagesSection}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {packages.map((pkg) => (
                <TourCard key={pkg.id} {...pkg} />
              ))}
            </div>
          </div>

          {/* Tours Section */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">{t.toursSection}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <TourCard {...chichenItzaCard} />
              <TourCard {...whaleSharkCard} />
              <TourCard {...akumalCard} />
              <TourCard {...dolphinCard} />
              {tours.map((tour) => (
                <TourCard key={tour.id} {...tour} />
              ))}
              <TourCard {...waveRunnerCard} />
              <TourCard {...mayanJungleCard} />
            </div>
          </div>
        </div>
      </section>

      <Footer language={language} />
    </div>
  );
}
