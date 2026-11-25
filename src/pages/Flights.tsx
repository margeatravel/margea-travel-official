import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FlightCard } from "@/components/FlightCard";
import { FlightRequestForm } from "@/components/FlightRequestForm";
import { FlightPickerModal } from "@/components/FlightPickerModal";
import { AircraftInfoCard } from "@/components/AircraftInfoCard";
import { FlightTimesSection } from "@/components/FlightTimesSection";
import { DestinationsSection } from "@/components/DestinationsSection";
import { FlightGallery } from "@/components/FlightGallery";
import { CharterFlightNavigation } from "@/components/CharterFlightNavigation";
import { flights, scenicFlights, aircraftSpecs, type FlightProduct } from "@/data/flights-data";
import { Plane, Palmtree } from "lucide-react";
import { ActivityHero } from "@/components/ActivityHero";
import { media } from "@/lib/media";

type Language = 'en' | 'es';

const translations = {
  en: {
    heroTitle: "Margea Flights",
    heroSubtitle: "Private and scenic flights across the Riviera Maya.",
    tabCharter: "Charter",
    tabScenic: "Scenic Flights",
    cessnaTitle: "Cessna 206",
    cessnaSubtitle: "Up to 5 passengers",
    kodiakTitle: "Kodiak 100",
    kodiakSubtitle: "Up to 9 passengers",
    piperTitle: "Piper Seneca",
    piperSubtitle: "Up to 5 passengers",
    requestAvailability: "Request Availability",
    disclaimer: "Prices shown are estimates in USD. TAX and any applicable airport/handling fees may apply. Final confirmation depends on availability.",
    operatedBy: "Flights operated by Vuelatour.",
    ourAircraft: "Our Aircraft",
    ourAircraftSubtitle: "Modern, well-maintained aircraft for your comfort and safety",
  },
  es: {
    heroTitle: "Vuelos Margea",
    heroSubtitle: "Vuelos privados y escénicos por toda la Riviera Maya.",
    tabCharter: "Charter",
    tabScenic: "Vuelos Escénicos",
    cessnaTitle: "Cessna 206",
    cessnaSubtitle: "Hasta 5 pasajeros",
    kodiakTitle: "Kodiak 100",
    kodiakSubtitle: "Hasta 9 pasajeros",
    piperTitle: "Piper Seneca",
    piperSubtitle: "Hasta 5 pasajeros",
    requestAvailability: "Solicitar Disponibilidad",
    disclaimer: "Los precios mostrados son estimados en USD. Impuestos y tarifas de aeropuerto/manejo pueden aplicar. La confirmación final depende de la disponibilidad.",
    operatedBy: "Vuelos operados por Vuelatour.",
    ourAircraft: "Nuestras Aeronaves",
    ourAircraftSubtitle: "Aeronaves modernas y bien mantenidas para su comodidad y seguridad",
  },
};

const Flights = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [selectedFlight, setSelectedFlight] = useState<FlightProduct | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [preselectedAircraft, setPreselectedAircraft] = useState<'cessna' | 'kodiak' | 'piper'>('cessna');
  const t = translations[language];

  // SEO
  useEffect(() => {
    document.title = "Margea Flights | Private & Scenic Flights in Riviera Maya";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Book private and scenic flights across the Riviera Maya. Fly to Cozumel, Holbox, Chichen Itza, Tulum and more. Premium aircraft including Cessna 206 and Kodiak.');
    }
  }, []);

  const handleRequestAvailability = (flight: FlightProduct) => {
    setSelectedFlight(flight);
    setFormOpen(true);
  };

  const handleOpenPicker = (aircraft: 'cessna' | 'kodiak' | 'piper') => {
    setPreselectedAircraft(aircraft);
    setPickerOpen(true);
  };

  // Group flights by aircraft
  const cessnaFlights = flights.filter(f => f.aircraft.includes('Cessna'));
  const kodiakFlights = flights.filter(f => f.aircraft.includes('Kodiak'));
  const piperFlights = flights.filter(f => f.aircraft.includes('Piper'));
  const cessnaScenic = scenicFlights.filter(f => f.aircraft.includes('Cessna'));
  const kodiakScenic = scenicFlights.filter(f => f.aircraft.includes('Kodiak'));
  const piperScenic = scenicFlights.filter(f => f.aircraft.includes('Piper'));

  const renderScenicFlightGroup = (
    flightList: FlightProduct[],
    title: string,
    subtitle: string
  ) => (
    <div className="mb-10">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {flightList.map((flight) => (
          <FlightCard
            key={flight.id}
            flight={flight}
            onRequestAvailability={handleRequestAvailability}
            buttonText={t.requestAvailability}
            language={language}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar language={language} onLanguageChange={setLanguage} />
      
      <ActivityHero
        title={t.heroTitle}
        subtitle={t.heroSubtitle}
        backgroundImage={media("/flight-images/flights-hero.jpg")}
      />

      {/* Our Aircraft Section */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              {t.ourAircraft}
            </h2>
            <p className="text-muted-foreground">{t.ourAircraftSubtitle}</p>
          </div>
          
          <div className="grid gap-8 max-w-5xl mx-auto">
            <AircraftInfoCard
              aircraft={aircraftSpecs['Cessna 206']}
              language={language}
              imageUrl={media("/flight-images/cessna-interior.jpg")}
              onBookFlight={() => handleOpenPicker('cessna')}
            />
            <AircraftInfoCard
              aircraft={aircraftSpecs['Kodiak']}
              language={language}
              imageUrl={media("/flight-images/kodiak-interior.jpg")}
              onBookFlight={() => handleOpenPicker('kodiak')}
            />
            <AircraftInfoCard
              aircraft={aircraftSpecs['Piper Seneca']}
              language={language}
              imageUrl={media("/flight-images/piper-seneca-cabin.jpg")}
              onBookFlight={() => handleOpenPicker('piper')}
            />
          </div>
        </div>
      </section>

      {/* Flight Times Section */}
      <FlightTimesSection language={language} />

      {/* Flight Gallery */}
      <FlightGallery language={language} />

      {/* Destinations Section */}
      <DestinationsSection language={language} />

      {/* Tabs Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="charter" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
              <TabsTrigger value="charter" className="flex items-center justify-center gap-2">
                <Plane className="w-4 h-4" />
                <span>{t.tabCharter}</span>
              </TabsTrigger>
              <TabsTrigger value="scenic" className="flex items-center justify-center gap-2">
                <Palmtree className="w-4 h-4" />
                <span>{t.tabScenic}</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="charter">
              <CharterFlightNavigation
                cessnaFlights={cessnaFlights}
                kodiakFlights={kodiakFlights}
                piperFlights={piperFlights}
                onRequestAvailability={handleRequestAvailability}
                buttonText={t.requestAvailability}
                language={language}
                cessnaTitle={t.cessnaTitle}
                cessnaSubtitle={t.cessnaSubtitle}
                kodiakTitle={t.kodiakTitle}
                kodiakSubtitle={t.kodiakSubtitle}
                piperTitle={t.piperTitle}
                piperSubtitle={t.piperSubtitle}
              />
            </TabsContent>
            
            <TabsContent value="scenic">
              {renderScenicFlightGroup(cessnaScenic, t.cessnaTitle, t.cessnaSubtitle)}
              {renderScenicFlightGroup(kodiakScenic, t.kodiakTitle, t.kodiakSubtitle)}
              {renderScenicFlightGroup(piperScenic, t.piperTitle, t.piperSubtitle)}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm text-muted-foreground">
              {t.disclaimer}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {t.operatedBy}
            </p>
          </div>
        </div>
      </section>

      <Footer language={language} />

      {/* Request Form Modal (for flight cards) */}
      <FlightRequestForm
        open={formOpen}
        onOpenChange={setFormOpen}
        selectedFlight={selectedFlight}
        language={language}
      />

      {/* Flight Picker Modal (for aircraft cards) */}
      <FlightPickerModal
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        preselectedAircraft={preselectedAircraft}
        source="aircraft_front"
        language={language}
      />
    </div>
  );
};

export default Flights;
