// Hero section with auto-scrolling gallery
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/components/LanguageToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { isPropertyHidden } from "@/config/hidden-properties";
import { Building2, Check, Star, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

import PainSection from "@/components/pm/PainSection";
import BeforeAfterSection from "@/components/pm/BeforeAfterSection";
import HowItWorksSection from "@/components/pm/HowItWorksSection";
import HeroTestimonialSection from "@/components/pm/HeroTestimonialSection";
import FAQSection from "@/components/pm/FAQSection";
import FinalCTASection from "@/components/pm/FinalCTASection";
import { media } from "@/lib/media";

// Service features
const serviceFeatures = [
  "Professional photography and listing optimization",
  "Dynamic pricing strategy and revenue management",
  "24/7 guest communication and support",
  "Quality housekeeping and maintenance coordination",
  "Property inspections and condition reports",
  "Guest screening and booking management",
  "Monthly financial reporting and analytics",
  "Insurance and compliance management",
];

// Client reviews
const clientReviews = [
  {
    name: "M. G.",
    property: "Beachfront Villa, Akumal",
    rating: 5,
    text: "Margea increased our occupancy from 45% to 87% in just 6 months. Their professional approach and attention to detail have made property ownership stress-free. Highly recommend!",
  },
  {
    name: "C. M.",
    property: "Luxury Condo, Playa del Carmen",
    rating: 5,
    text: "The monthly reports are incredibly detailed. I always know exactly how my property is performing. Our net income increased by 40% compared to self-managing.",
  },
  {
    name: "J. S.",
    property: "Ocean View Apartment, Cancún",
    rating: 4.5,
    text: "Living abroad, I needed a team I could trust completely. Margea handles everything seamlessly - from guest check-ins to maintenance emergencies. Peace of mind is priceless.",
  },
  {
    name: "R. H.",
    property: "Golf Course Villa, Mayakoba",
    rating: 5,
    text: "The dynamic pricing strategy alone paid for the management fees. They truly understand the Riviera Maya market and maximize every booking opportunity.",
  },
];

export default function PropertyManagement() {
  const { language, setLanguage } = useLanguage();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Property Management | Margea";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Professional property management services in Riviera Maya. Maximize your rental income with Margea's comprehensive management solutions.");
    }
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('available', true)
        .order('created_at', { ascending: false })
        .limit(6);
      if (error) throw error;
      const visibleProperties = (data || []).filter(p => !isPropertyHidden(p));
      setProperties(visibleProperties);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar language={language} onLanguageChange={setLanguage} />

      {/* 1. Hero Section - Existing */}
      <section className="relative w-full" style={{ height: '80vh', minHeight: '600px' }}>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(media('/property-images/akumal-u7-1.jpg'))`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, rgba(29,40,57,0.88) 0%, rgba(29,40,57,0.7) 35%, rgba(29,40,57,0.25) 60%, transparent 80%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.15) 30%, transparent 50%)',
          }}
        />
        <div className="relative z-10 h-full flex flex-col justify-between px-6 md:px-12 lg:px-20 max-w-[1400px]">
          <div className="pt-32 md:pt-40">
            <span
              className="font-inter tracking-[0.25em] uppercase mb-4 block"
              style={{ fontSize: '10px', color: '#D4C5A9' }}
            >
              Margea Properties · Riviera Maya
            </span>
            <h1
              className="font-cormorant leading-[1.05] text-white mb-0"
              style={{ fontSize: 'clamp(56px, 8vw, 88px)', fontWeight: 300 }}
            >
              Your property.
              <br />
              <span className="italic" style={{ color: '#D4C5A9' }}>
                Earning more.
              </span>
            </h1>
          </div>
          <div className="pb-10 md:pb-12">
            <div className="flex flex-col md:flex-row gap-3 md:gap-4">
              {[
                { value: '92%', label: 'Avg. Occupancy Rate' },
                { value: '+38%', label: 'Revenue vs. Self-Managed' },
                { value: '10+', label: 'Properties Under Management' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="text-center md:text-left"
                  style={{
                    background: 'rgba(255,255,255,0.10)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255,255,255,0.20)',
                    borderRadius: '4px',
                    padding: '20px 32px',
                    flex: 1,
                  }}
                >
                  <div
                    className="font-cormorant leading-none mb-1 text-white"
                    style={{ fontSize: '48px', fontWeight: 300 }}
                  >
                    {stat.value}
                  </div>
                  <p
                    className="font-inter text-[11px] tracking-[0.15em] uppercase"
                    style={{ color: 'rgba(255,255,255,0.6)' }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Pain Section (new) */}
      <PainSection language={language} />

      {/* 3. Before & After (new) */}
      <BeforeAfterSection language={language} />

      {/* 4. How It Works (new) */}
      <HowItWorksSection language={language} />

      {/* 5. Hero Testimonial (new) */}
      <HeroTestimonialSection language={language} />

      {/* 6. Managed Portfolio (existing) */}
      <section className="py-16 md:py-24 bg-white" style={{ borderTop: '1px solid rgba(29,40,57,0.06)' }}>
        <div className="max-w-[1280px] mx-auto px-5 md:px-4">
          <div className="text-center mb-14">
            <span className="eyebrow block mb-3">Our Properties</span>
            <h2 className="font-cormorant font-light text-[32px] md:text-[44px] text-[#1d2839]">
              Our Managed Portfolio
            </h2>
          </div>
          <p className="text-[#6b7280] text-center mb-12 max-w-2xl mx-auto font-inter text-[15px]">
            Explore some of the exceptional properties we manage across the Riviera Maya.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Cancun Luxury Oceanfront House",
                location: "Cancun – Oceanfront",
                tag: "Luxury Villa",
                badge: "High Performance",
                image: media("/property-images/cancun-estate-1.jpg"),
                link: "/stays/cancun",
                cta: "View Property",
              },
              {
                title: "Tulum Apartments",
                location: "Tulum",
                tag: "Modern Apartments",
                badge: "High Demand",
                image: media("/property-images/azana-tulum-1.jpg"),
                link: "/stays/tulum",
                cta: "View Properties",
              },
              {
                title: "Akumal Apartments",
                location: "Akumal",
                tag: "Beachside Apartments",
                badge: "Strong Occupancy",
                image: media("/property-images/akumal-u7-cover.jpeg"),
                link: "/stays/akumal",
                cta: "View Properties",
              },
              {
                title: "Puerto Morelos Apartments",
                location: "Puerto Morelos",
                tag: "Ocean View Apartments",
                badge: "Growing Market",
                image: media("/property-images/puerto-morelos-16.jpg"),
                link: "/stays/puerto-morelos",
                cta: "View Properties",
              },
            ].map((item, index) => (
              <Card key={index} className="overflow-hidden group rounded-[10px] bg-white border border-[rgba(29,40,57,0.07)] shadow-[0_2px_12px_rgba(29,40,57,0.06)] transition-all duration-300 ease-out hover:-translate-y-[5px] hover:shadow-[0_16px_48px_rgba(29,40,57,0.13)]">
                <div className="aspect-video overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <Badge className="absolute top-4 right-4 bg-green-500 text-white">
                    {item.badge}
                  </Badge>
                  <span className="absolute top-4 left-4 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded">
                    {item.tag}
                  </span>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-inter font-semibold text-[15px] text-[#1d2839] mb-1 line-clamp-1">{item.title}</h3>
                  <div className="flex items-center gap-1 text-[13px] text-[#6b7280] mb-3 font-inter">
                    <MapPin className="h-4 w-4" />
                    <span>{item.location}</span>
                  </div>
                  <Link to={item.link}>
                    <Button variant="outline" size="sm" className="w-full">
                      {item.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Service Package / Pricing (existing) */}
      <section id="pricing" className="py-16 md:py-24 bg-[#f7f6f3]">
        <div className="max-w-[1280px] mx-auto px-5 md:px-4">
          <div className="text-center mb-14">
            <span className="eyebrow block mb-3">All-Inclusive</span>
            <h2 className="font-cormorant font-light text-[32px] md:text-[44px] text-[#1d2839]">
              Comprehensive Management Services
            </h2>
          </div>
          <p className="text-[#6b7280] text-center mb-12 max-w-2xl mx-auto font-inter text-[15px]">
            Everything you need to maximize your property's potential with zero hassle.
          </p>
          <Card className="max-w-3xl mx-auto border-2 border-primary shadow-lg">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                    <span className="text-3xl font-bold text-primary-foreground">20%</span>
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                    <h3 className="text-2xl font-bold">Complete Property Management</h3>
                    <Badge className="bg-green-500 text-white">Limited Offer</Badge>
                  </div>
                  <p className="text-muted-foreground">Professional management fee of gross rental income</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {serviceFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <Link to="/property-request">
                  <Button variant="hero" size="lg">
                    List My Property
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 8. Client Reviews / Testimonials Carousel (existing) */}
      <section className="py-16 md:py-24 bg-white" style={{ borderTop: '1px solid rgba(29,40,57,0.06)' }}>
        <div className="max-w-[1280px] mx-auto px-5 md:px-4">
          <div className="text-center mb-12">
            <span className="eyebrow block mb-3">Testimonials</span>
            <h2 className="font-cormorant font-light text-[32px] md:text-[44px] text-[#1d2839] mb-4">What Our Clients Say</h2>
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="flex">
                {[1, 2, 3, 4].map((_, i) => (
                  <Star key={i} className="h-6 w-6 fill-secondary text-secondary" />
                ))}
                <div className="relative">
                  <Star className="h-6 w-6 text-muted" />
                  <div className="absolute inset-0 overflow-hidden" style={{ width: '80%' }}>
                    <Star className="h-6 w-6 fill-secondary text-secondary" />
                  </div>
                </div>
              </div>
              <span className="font-bold text-lg">4.8/5</span>
              <span className="text-muted-foreground">(47 reviews)</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {clientReviews.map((review, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => {
                      const filled = i < Math.floor(review.rating);
                      const partial = i === Math.floor(review.rating) && review.rating % 1 !== 0;
                      return (
                        <div key={i} className="relative">
                          <Star className={`h-5 w-5 ${filled ? 'fill-secondary text-secondary' : 'text-muted'}`} />
                          {partial && (
                            <div className="absolute inset-0 overflow-hidden" style={{ width: `${(review.rating % 1) * 100}%` }}>
                              <Star className="h-5 w-5 fill-secondary text-secondary" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{review.text}"</p>
                  <div>
                    <p className="font-semibold">{review.name}</p>
                    <p className="text-sm text-muted-foreground">{review.property}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FAQ Objeciones (new) */}
      <FAQSection language={language} />

      {/* 10. CTA Final (new) */}
      <FinalCTASection language={language} />

      {/* Floating Action Button */}
      <Link to="/property-request" className="fixed bottom-[160px] right-6 z-50">
        <Button
          className="shadow-lg hover:shadow-xl rounded-full h-14 w-14 md:w-auto md:h-auto md:px-6 md:py-6 bg-primary hover:bg-primary-dark p-0"
          size="lg"
        >
          <Building2 className="h-5 w-5 md:mr-2" />
          <span className="hidden md:inline">List Your Property</span>
        </Button>
      </Link>

      <Footer language={language} />
    </div>
  );
}
