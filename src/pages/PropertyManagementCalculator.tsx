import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/components/LanguageToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const areas = [
  { value: "akumal", label: "Akumal", multiplier: 1.0 },
  { value: "playa-del-carmen", label: "Playa del Carmen", multiplier: 1.15 },
  { value: "tulum", label: "Tulum", multiplier: 1.2 },
  { value: "cancun", label: "Cancún", multiplier: 0.95 },
  { value: "puerto-morelos", label: "Puerto Morelos", multiplier: 0.9 },
  { value: "mayakoba", label: "Mayakoba", multiplier: 1.3 },
];

export default function PropertyManagementCalculator() {
  const { language, setLanguage } = useLanguage();
  const [selectedArea, setSelectedArea] = useState("akumal");
  const [bedrooms, setBedrooms] = useState("2");
  const [propertyType, setPropertyType] = useState<"villa" | "apartment">("apartment");

  const baseRatePerBedroom = 85;
  const areaMultiplier = areas.find(a => a.value === selectedArea)?.multiplier || 1;
  const typeMultiplier = propertyType === "villa" ? 1.25 : 1;
  const bedroomCount = parseInt(bedrooms) || 2;

  const adr = Math.round(baseRatePerBedroom * bedroomCount * areaMultiplier * typeMultiplier);
  const occupancy = 75;
  const annualGross = Math.round(adr * 365 * (occupancy / 100));
  const managementFee = Math.round(annualGross * 0.20);
  const monthlyOperational = propertyType === "villa" ? 800 + (bedroomCount * 150) : 400 + (bedroomCount * 100);
  const annualOperational = monthlyOperational * 12;
  const netIncome = annualGross - managementFee - annualOperational;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  useEffect(() => {
    document.title = "Revenue Calculator | Margea Property Management";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar language={language} onLanguageChange={setLanguage} />

      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-[#f7f6f3]">
        <div className="max-w-[1280px] mx-auto px-5 md:px-4">
          <div className="text-center mb-14">
            <span className="eyebrow block mb-3">Revenue Estimator</span>
            <h1 className="font-cormorant font-light text-[32px] md:text-[44px] text-[#1d2839]">
              Estimate Your Property's Earning Potential
            </h1>
          </div>
          <p className="text-[#6b7280] text-center mb-12 max-w-2xl mx-auto font-inter text-[15px]">
            Use our calculator to see how much your property could earn with Margea's professional management.
          </p>

          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Left card - Property Details */}
            <Card className="shadow-card">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Home className="h-5 w-5 text-primary" />
                  Describe Your Property
                </h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Area</label>
                    <Select value={selectedArea} onValueChange={setSelectedArea}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select area" />
                      </SelectTrigger>
                      <SelectContent>
                        {areas.map((area) => (
                          <SelectItem key={area.value} value={area.value}>
                            {area.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Bedrooms</label>
                    <Select value={bedrooms} onValueChange={setBedrooms}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select bedrooms" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? "Bedroom" : "Bedrooms"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground mt-2">
                      Estimated nightly rate: <span className="font-semibold text-primary">{formatCurrency(adr)}</span>
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Property Type</label>
                    <div className="flex gap-2">
                      <Button
                        variant={propertyType === "villa" ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => setPropertyType("villa")}
                      >
                        Villa
                      </Button>
                      <Button
                        variant={propertyType === "apartment" ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => setPropertyType("apartment")}
                      >
                        Apartment
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Right card - Projections */}
            <Card className="shadow-card">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Estimated Projections
                </h3>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-foreground">Average Daily Rate</p>
                    <p className="text-2xl font-bold text-primary">{formatCurrency(adr)}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-foreground">Average Occupancy</p>
                    <p className="text-2xl font-bold text-primary">{occupancy}%</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-muted-foreground">Annual Gross Revenue</span>
                    <span className="font-semibold">{formatCurrency(annualGross)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-muted-foreground flex items-center gap-2">
                      Management Fees (20%)
                      <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                        Limited Offer
                      </Badge>
                    </span>
                    <span className="font-semibold text-destructive">-{formatCurrency(managementFee)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-muted-foreground">Operational Expenses</span>
                    <span className="font-semibold text-destructive">-{formatCurrency(annualOperational)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 bg-primary/10 rounded-lg px-4 -mx-4">
                    <span className="font-bold text-foreground">Annual Net Income</span>
                    <span className="text-2xl font-bold text-primary">{formatCurrency(netIncome)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6 max-w-2xl mx-auto">
            *These projections are estimates based on market averages and may vary depending on property condition,
            location specifics, and seasonal factors. Contact us for a personalized assessment.
          </p>

          <div className="text-center mt-8">
            <Link to="/property-request">
              <Button variant="hero" size="lg">
                List Your Property
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer language={language} />
    </div>
  );
}
