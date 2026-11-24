import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LanguageToggle, Language } from "./LanguageToggle";
import { Menu, X, ChevronDown, ShoppingCart, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import margeaLogo from "@/assets/margea-logo.png";
import margeaLogoWhite from "@/assets/margea-logo-white.png";
import { useCart } from "@/contexts/CartContext";
import { useMemberSession } from "@/hooks/useMemberSession";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  forceOpaque?: boolean;
}

const translations = {
  en: {
    stays: "Stays",
    activities: "Activities",
    tours: "Tours",
    yachts: "Yachts",
    customPackage: "Custom Package",
    concierge: "Concierge",
    bundles: "Bundles",
    transportation: "Transportation",
    flights: "Flights",
    exoticCars: "Exotic Car Rentals",
    carRentals: "Car Rentals",
    golfCourses: "Golf Courses",
    propertyManagement: "Property Management",
    calculateEarnings: "Calculate Your Earnings",
    members: "Members",
    about: "About",
    contact: "Contact",
    signIn: "Sign In",
    signOut: "Sign Out",
    myAccount: "My Account",
  },
  es: {
    stays: "Alojamientos",
    activities: "Actividades",
    tours: "Tours",
    yachts: "Yates",
    customPackage: "Paquete Personalizado",
    concierge: "Concierge",
    bundles: "Paquetes",
    transportation: "Transporte",
    flights: "Vuelos",
    exoticCars: "Autos Exóticos",
    carRentals: "Renta de Coches",
    golfCourses: "Campos de Golf",
    propertyManagement: "Administración",
    calculateEarnings: "Calcula tus Ganancias",
    members: "Miembros",
    signIn: "Iniciar Sesión",
    signOut: "Cerrar Sesión",
    myAccount: "Mi Cuenta",
    about: "Nosotros",
    contact: "Contacto",
  },
};

export function Navbar({ language, onLanguageChange, forceOpaque = false }: NavbarProps) {
  const { itemCount, setDrawerOpen } = useCart();
  const { isSignedIn } = useMemberSession();
  const navigate = useNavigate();
  const membersHref = isSignedIn ? "/members/rewards" : "/members";

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("You've been signed out.");
    navigate("/", { replace: true });
  };
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activitiesOpen, setActivitiesOpen] = useState(false);
  const [staysOpen, setStaysOpen] = useState(false);
  const [mobileActivitiesOpen, setMobileActivitiesOpen] = useState(false);
  const [mobileStaysOpen, setMobileStaysOpen] = useState(false);
  const [propertyMgmtOpen, setPropertyMgmtOpen] = useState(false);
  const [mobilePropertyMgmtOpen, setMobilePropertyMgmtOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const activitiesDropdownRef = useRef<HTMLDivElement>(null);
  const staysDropdownRef = useRef<HTMLDivElement>(null);
  const propertyMgmtDropdownRef = useRef<HTMLDivElement>(null);
  const activitiesCloseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const staysCloseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const propertyMgmtCloseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t = translations[language];

  // Scroll detection for glass effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const linkClasses = "font-inter font-medium text-white/80 uppercase tracking-[0.1em] text-[13px] transition-all duration-200 ease-out whitespace-nowrap hover:text-white hover:[text-shadow:0_0_20px_rgba(255,255,255,0.9),0_0_40px_rgba(255,255,255,0.4)]";
  const dropdownLinkClasses = "block px-3 py-2 font-inter text-[13px] text-[#1d2839] rounded-[8px] hover:bg-[rgba(29,40,57,0.05)] transition-colors duration-150 whitespace-nowrap";
  const dropdownLabelClasses = "block px-3 py-2 font-inter text-[#9aa5b4] uppercase tracking-[0.1em] text-[11px] whitespace-nowrap";

  // Handle Activities dropdown
  const handleActivitiesEnter = () => {
    if (activitiesCloseTimeoutRef.current) {
      clearTimeout(activitiesCloseTimeoutRef.current);
      activitiesCloseTimeoutRef.current = null;
    }
    setStaysOpen(false);
    setPropertyMgmtOpen(false);
    setActivitiesOpen(true);
  };

  const handleActivitiesLeave = () => {
    activitiesCloseTimeoutRef.current = setTimeout(() => {
      setActivitiesOpen(false);
    }, 250);
  };

  // Handle Stays dropdown
  const handleStaysEnter = () => {
    if (staysCloseTimeoutRef.current) {
      clearTimeout(staysCloseTimeoutRef.current);
      staysCloseTimeoutRef.current = null;
    }
    setActivitiesOpen(false);
    setPropertyMgmtOpen(false);
    setStaysOpen(true);
  };

  const handleStaysLeave = () => {
    staysCloseTimeoutRef.current = setTimeout(() => {
      setStaysOpen(false);
    }, 250);
  };

  // Handle Property Management dropdown
  const handlePropertyMgmtEnter = () => {
    if (propertyMgmtCloseTimeoutRef.current) {
      clearTimeout(propertyMgmtCloseTimeoutRef.current);
      propertyMgmtCloseTimeoutRef.current = null;
    }
    setStaysOpen(false);
    setActivitiesOpen(false);
    setPropertyMgmtOpen(true);
  };

  const handlePropertyMgmtLeave = () => {
    propertyMgmtCloseTimeoutRef.current = setTimeout(() => {
      setPropertyMgmtOpen(false);
    }, 250);
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (activitiesCloseTimeoutRef.current) {
        clearTimeout(activitiesCloseTimeoutRef.current);
      }
      if (staysCloseTimeoutRef.current) {
        clearTimeout(staysCloseTimeoutRef.current);
      }
      if (propertyMgmtCloseTimeoutRef.current) {
        clearTimeout(propertyMgmtCloseTimeoutRef.current);
      }
    };
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (activitiesDropdownRef.current && !activitiesDropdownRef.current.contains(event.target as Node)) {
        setActivitiesOpen(false);
      }
      if (staysDropdownRef.current && !staysDropdownRef.current.contains(event.target as Node)) {
        setStaysOpen(false);
      }
      if (propertyMgmtDropdownRef.current && !propertyMgmtDropdownRef.current.contains(event.target as Node)) {
        setPropertyMgmtOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav 
        className="fixed top-0 left-0 right-0 z-[1000] transition-all duration-300"
        style={{
          background: (forceOpaque || scrolled) ? 'rgba(29, 40, 57, 0.92)' : 'transparent',
          backdropFilter: (forceOpaque || scrolled) ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: (forceOpaque || scrolled) ? 'blur(16px)' : 'none',
          borderBottom: (forceOpaque || scrolled) ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid transparent',
        }}
      >
      <div className="px-[3vw] py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img src={margeaLogoWhite} alt="Margea - Riviera Maya Travel" className="h-12 md:h-[68px] w-auto" loading="eager" decoding="async" fetchPriority="high" width={180} height={68} />
          </Link>

          {/* Desktop & Tablet Navigation */}
          <nav className="hidden md:flex items-center flex-1 justify-end">
            <div className="flex items-center gap-5 lg:gap-8">
              {/* Stays Dropdown */}
              <div 
                ref={staysDropdownRef}
                className="relative"
                onMouseEnter={handleStaysEnter}
                onMouseLeave={handleStaysLeave}
              >
                <button
                  onClick={() => setStaysOpen(!staysOpen)}
                  className={`${linkClasses} flex items-center gap-1 py-2`}
                >
                  {t.stays}
                  <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${staysOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {staysOpen && (
                  <div 
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-2"
                    onMouseEnter={handleStaysEnter}
                    onMouseLeave={handleStaysLeave}
                  >
                    <div className="min-w-[200px] z-[1001] p-2" style={{ background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: '1px solid rgba(29,40,57,0.08)', borderRadius: '12px', boxShadow: '0 8px 32px rgba(29,40,57,0.12)' }}>
                      <Link
                        to="/stays"
                        className={dropdownLinkClasses}
                        onClick={() => setStaysOpen(false)}
                      >
                        All Vacation Rentals
                      </Link>
                      <div className="border-t border-[rgba(29,40,57,0.08)] mx-1 my-1" />
                      <span className={dropdownLabelClasses}>Browse by Destination:</span>
                      <Link to="/stays/isla-mujeres" className={dropdownLinkClasses} onClick={() => setStaysOpen(false)}>Isla Mujeres</Link>
                      <Link to="/stays/cancun" className={dropdownLinkClasses} onClick={() => setStaysOpen(false)}>Cancún</Link>
                      <Link to="/stays/puerto-morelos" className={dropdownLinkClasses} onClick={() => setStaysOpen(false)}>Puerto Morelos</Link>
                      <Link to="/stays/playa-del-carmen" className={dropdownLinkClasses} onClick={() => setStaysOpen(false)}>Playa del Carmen</Link>
                      <Link to="/stays/akumal" className={dropdownLinkClasses} onClick={() => setStaysOpen(false)}>Akumal</Link>
                      <Link to="/stays/tulum" className={dropdownLinkClasses} onClick={() => setStaysOpen(false)}>Tulum</Link>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Activities Dropdown */}
              <div 
                ref={activitiesDropdownRef}
                className="relative"
                onMouseEnter={handleActivitiesEnter}
                onMouseLeave={handleActivitiesLeave}
              >
                <button
                  onClick={() => setActivitiesOpen(!activitiesOpen)}
                  className={`${linkClasses} flex items-center gap-1 py-2`}
                >
                  {t.activities}
                  <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${activitiesOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {activitiesOpen && (
                  <div 
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-2"
                    onMouseEnter={handleActivitiesEnter}
                    onMouseLeave={handleActivitiesLeave}
                  >
                    <div className="min-w-[180px] z-[1001] p-2" style={{ background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: '1px solid rgba(29,40,57,0.08)', borderRadius: '12px', boxShadow: '0 8px 32px rgba(29,40,57,0.12)' }}>
                      <Link to="/tours" className={dropdownLinkClasses} onClick={() => setActivitiesOpen(false)}>{t.tours}</Link>
                      <Link to="/yachts" className={dropdownLinkClasses} onClick={() => setActivitiesOpen(false)}>{t.yachts}</Link>
                      <Link to="/concierge" className={dropdownLinkClasses} onClick={() => setActivitiesOpen(false)}>{t.concierge}</Link>
                      <Link to="/bundles" className={dropdownLinkClasses} onClick={() => setActivitiesOpen(false)}>{t.bundles}</Link>
                      <Link to="/activities/transportation" className={dropdownLinkClasses} onClick={() => setActivitiesOpen(false)}>{t.transportation}</Link>
                      <Link to="/activities/flights" className={dropdownLinkClasses} onClick={() => setActivitiesOpen(false)}>{t.flights}</Link>
                      <Link to="/activities/exotic-cars" className={dropdownLinkClasses} onClick={() => setActivitiesOpen(false)}>{t.exoticCars}</Link>
                      <Link to="/activities/car-rentals" className={dropdownLinkClasses} onClick={() => setActivitiesOpen(false)}>{t.carRentals}</Link>
                      <Link to="/activities/golf" className={dropdownLinkClasses} onClick={() => setActivitiesOpen(false)}>{t.golfCourses}</Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Property Management Dropdown */}
              <div 
                ref={propertyMgmtDropdownRef}
                className="relative"
                onMouseEnter={handlePropertyMgmtEnter}
                onMouseLeave={handlePropertyMgmtLeave}
              >
                <button
                  onClick={() => setPropertyMgmtOpen(!propertyMgmtOpen)}
                  className={`${linkClasses} flex items-center gap-1 py-2`}
                >
                  {t.propertyManagement}
                  <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${propertyMgmtOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {propertyMgmtOpen && (
                  <div 
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-2"
                    onMouseEnter={handlePropertyMgmtEnter}
                    onMouseLeave={handlePropertyMgmtLeave}
                  >
                    <div className="min-w-[200px] z-[1001] p-2" style={{ background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: '1px solid rgba(29,40,57,0.08)', borderRadius: '12px', boxShadow: '0 8px 32px rgba(29,40,57,0.12)' }}>
                      <Link to="/property-management" className={dropdownLinkClasses} onClick={() => setPropertyMgmtOpen(false)}>{t.propertyManagement}</Link>
                      <Link to="/property-management/calculator" className={dropdownLinkClasses} onClick={() => setPropertyMgmtOpen(false)}>{t.calculateEarnings}</Link>
                    </div>
                  </div>
                )}
              </div>
              <Link to="/about" className={linkClasses}>{t.about}</Link>
              <Link to="/contact" className={linkClasses}>{t.contact}</Link>
              <Link to={membersHref} className={linkClasses}>{t.members}</Link>
              {isSignedIn ? (
                <>
                  <Link
                    to="/members/dashboard"
                    aria-label={t.myAccount}
                    title={t.myAccount}
                    className={`${linkClasses} flex items-center`}
                  >
                    <User className="w-5 h-5" />
                  </Link>
                  <button type="button" onClick={handleSignOut} className={linkClasses}>{t.signOut}</button>
                </>
              ) : (
                <Link to="/members/login" className={linkClasses}>{t.signIn}</Link>
              )}

            </div>
          </nav>

          {/* Right side actions - Desktop & Tablet */}
          <div className="hidden md:flex items-center flex-shrink-0 ml-2 gap-1">
            <button
              onClick={() => setDrawerOpen(true)}
              className="relative p-2 text-white/80 hover:text-white transition-all duration-200 hover:[text-shadow:0_0_20px_rgba(255,255,255,0.9),0_0_40px_rgba(255,255,255,0.4)]"
              aria-label="Open cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-white text-[#1d2839] text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 leading-none">
                  {itemCount}
                </span>
              )}
            </button>
            <LanguageToggle language={language} onLanguageChange={onLanguageChange} />
          </div>

          {/* Mobile actions */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={() => setDrawerOpen(true)}
              className="relative p-2 text-white/80 hover:text-white transition-opacity"
              aria-label="Open cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-white text-[#1d2839] text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 leading-none">
                  {itemCount}
                </span>
              )}
            </button>
            <button
              className="p-2 hover:opacity-70 rounded-[3px] transition-opacity"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6 text-white" />
            </button>
          </div>
        </div>
      </div>

    </nav>
    
    {/* Mobile menu */}
    {mobileMenuOpen && (
      <div 
        className="md:hidden"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          backgroundColor: '#1d2839',
          overflowY: 'auto',
        }}
      >
        <div className="flex flex-col min-h-full">
          <div className="flex items-center justify-between px-[3vw] py-3 border-b border-white/10">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center">
              <img src={margeaLogoWhite} alt="Margea - Riviera Maya Travel" className="h-12 w-auto" loading="eager" decoding="async" width={128} height={48} />
            </Link>
            <button
              className="p-3 hover:opacity-70 rounded-[3px] transition-opacity -mr-1"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>

          <div className="flex flex-col flex-1 py-6">
            {/* Mobile Stays Dropdown */}
            <div className="flex flex-col w-full">
              <button
                onClick={() => setMobileStaysOpen(!mobileStaysOpen)}
                className="w-full px-6 py-4 font-inter font-medium text-white/80 uppercase tracking-[0.1em] text-[13px] transition-all duration-200 ease-out hover:text-white hover:[text-shadow:0_0_20px_rgba(255,255,255,0.9),0_0_40px_rgba(255,255,255,0.4)] flex items-center justify-center gap-2"
              >
                {t.stays}
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${mobileStaysOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {mobileStaysOpen && (
                <div className="flex flex-col bg-white/5">
                  <Link to="/stays" className="w-full px-6 py-3 font-inter font-medium text-white/80 uppercase tracking-[0.1em] text-[13px] transition-all duration-200 ease-out hover:text-white hover:[text-shadow:0_0_20px_rgba(255,255,255,0.9),0_0_40px_rgba(255,255,255,0.4)] text-center" onClick={() => setMobileMenuOpen(false)}>All Vacation Rentals</Link>
                  <div className="border-t border-white/10 mx-6 my-1" />
                  <span className="w-full px-6 py-2 font-inter font-medium text-white/40 uppercase tracking-[0.1em] text-[11px] text-center">Browse by Destination:</span>
                  <Link to="/stays/isla-mujeres" className="w-full px-6 py-3 font-inter font-medium text-white/80 uppercase tracking-[0.1em] text-[13px] transition-all duration-200 ease-out hover:text-white hover:[text-shadow:0_0_20px_rgba(255,255,255,0.9),0_0_40px_rgba(255,255,255,0.4)] text-center" onClick={() => setMobileMenuOpen(false)}>Isla Mujeres</Link>
                  <Link to="/stays/cancun" className="w-full px-6 py-3 font-inter font-medium text-white/80 uppercase tracking-[0.1em] text-[13px] transition-all duration-200 ease-out hover:text-white hover:[text-shadow:0_0_20px_rgba(255,255,255,0.9),0_0_40px_rgba(255,255,255,0.4)] text-center" onClick={() => setMobileMenuOpen(false)}>Cancún</Link>
                  <Link to="/stays/puerto-morelos" className="w-full px-6 py-3 font-inter font-medium text-white/80 uppercase tracking-[0.1em] text-[13px] transition-all duration-200 ease-out hover:text-white hover:[text-shadow:0_0_20px_rgba(255,255,255,0.9),0_0_40px_rgba(255,255,255,0.4)] text-center" onClick={() => setMobileMenuOpen(false)}>Puerto Morelos</Link>
                  <Link to="/stays/playa-del-carmen" className="w-full px-6 py-3 font-inter font-medium text-white/80 uppercase tracking-[0.1em] text-[13px] transition-all duration-200 ease-out hover:text-white hover:[text-shadow:0_0_20px_rgba(255,255,255,0.9),0_0_40px_rgba(255,255,255,0.4)] text-center" onClick={() => setMobileMenuOpen(false)}>Playa del Carmen</Link>
                  <Link to="/stays/akumal" className="w-full px-6 py-3 font-inter font-medium text-white/80 uppercase tracking-[0.1em] text-[13px] transition-all duration-200 ease-out hover:text-white hover:[text-shadow:0_0_20px_rgba(255,255,255,0.9),0_0_40px_rgba(255,255,255,0.4)] text-center" onClick={() => setMobileMenuOpen(false)}>Akumal</Link>
                  <Link to="/stays/tulum" className="w-full px-6 py-3 font-inter font-medium text-white/80 uppercase tracking-[0.1em] text-[13px] transition-all duration-200 ease-out hover:text-white hover:[text-shadow:0_0_20px_rgba(255,255,255,0.9),0_0_40px_rgba(255,255,255,0.4)] text-center" onClick={() => setMobileMenuOpen(false)}>Tulum</Link>
                </div>
              )}
            </div>
            
            {/* Mobile Activities Dropdown */}
            <div className="flex flex-col w-full">
              <button
                onClick={() => setMobileActivitiesOpen(!mobileActivitiesOpen)}
                className="w-full px-6 py-4 font-inter font-medium text-white/80 uppercase tracking-[0.1em] text-[13px] transition-all duration-200 ease-out hover:text-white hover:[text-shadow:0_0_20px_rgba(255,255,255,0.9),0_0_40px_rgba(255,255,255,0.4)] flex items-center justify-center gap-2"
              >
                {t.activities}
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${mobileActivitiesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {mobileActivitiesOpen && (
                <div className="flex flex-col bg-white/5">
                  <Link to="/tours" className="w-full px-6 py-3 font-inter font-medium text-white/80 uppercase tracking-[0.1em] text-[13px] transition-all duration-200 ease-out hover:text-white hover:[text-shadow:0_0_20px_rgba(255,255,255,0.9),0_0_40px_rgba(255,255,255,0.4)] text-center" onClick={() => setMobileMenuOpen(false)}>{t.tours}</Link>
                  <Link to="/yachts" className="w-full px-6 py-3 font-inter font-medium text-white/80 uppercase tracking-[0.1em] text-[13px] transition-all duration-200 ease-out hover:text-white hover:[text-shadow:0_0_20px_rgba(255,255,255,0.9),0_0_40px_rgba(255,255,255,0.4)] text-center" onClick={() => setMobileMenuOpen(false)}>{t.yachts}</Link>
                  <Link to="/concierge" className="w-full px-6 py-3 font-inter font-medium text-white/80 uppercase tracking-[0.1em] text-[13px] transition-all duration-200 ease-out hover:text-white hover:[text-shadow:0_0_20px_rgba(255,255,255,0.9),0_0_40px_rgba(255,255,255,0.4)] text-center" onClick={() => setMobileMenuOpen(false)}>{t.concierge}</Link>
                  <Link to="/bundles" className="w-full px-6 py-3 font-inter font-medium text-white/80 uppercase tracking-[0.1em] text-[13px] transition-all duration-200 ease-out hover:text-white hover:[text-shadow:0_0_20px_rgba(255,255,255,0.9),0_0_40px_rgba(255,255,255,0.4)] text-center" onClick={() => setMobileMenuOpen(false)}>{t.bundles}</Link>
                  <Link to="/activities/transportation" className="w-full px-6 py-3 font-inter font-medium text-white/80 uppercase tracking-[0.1em] text-[13px] transition-all duration-200 ease-out hover:text-white hover:[text-shadow:0_0_20px_rgba(255,255,255,0.9),0_0_40px_rgba(255,255,255,0.4)] text-center" onClick={() => setMobileMenuOpen(false)}>{t.transportation}</Link>
                  <Link to="/activities/flights" className="w-full px-6 py-3 font-inter font-medium text-white/80 uppercase tracking-[0.1em] text-[13px] transition-all duration-200 ease-out hover:text-white hover:[text-shadow:0_0_20px_rgba(255,255,255,0.9),0_0_40px_rgba(255,255,255,0.4)] text-center" onClick={() => setMobileMenuOpen(false)}>{t.flights}</Link>
                  <Link to="/activities/exotic-cars" className="w-full px-6 py-3 font-inter font-medium text-white/80 uppercase tracking-[0.1em] text-[13px] transition-all duration-200 ease-out hover:text-white hover:[text-shadow:0_0_20px_rgba(255,255,255,0.9),0_0_40px_rgba(255,255,255,0.4)] text-center" onClick={() => setMobileMenuOpen(false)}>{t.exoticCars}</Link>
                  <Link to="/activities/car-rentals" className="w-full px-6 py-3 font-inter font-medium text-white/80 uppercase tracking-[0.1em] text-[13px] transition-all duration-200 ease-out hover:text-white hover:[text-shadow:0_0_20px_rgba(255,255,255,0.9),0_0_40px_rgba(255,255,255,0.4)] text-center" onClick={() => setMobileMenuOpen(false)}>{t.carRentals}</Link>
                  <Link to="/activities/golf" className="w-full px-6 py-3 font-inter font-medium text-white/80 uppercase tracking-[0.1em] text-[13px] transition-all duration-200 ease-out hover:text-white hover:[text-shadow:0_0_20px_rgba(255,255,255,0.9),0_0_40px_rgba(255,255,255,0.4)] text-center" onClick={() => setMobileMenuOpen(false)}>{t.golfCourses}</Link>
                </div>
              )}
            </div>

            {/* Mobile Property Management Dropdown */}
            <div className="flex flex-col w-full">
              <button
                onClick={() => setMobilePropertyMgmtOpen(!mobilePropertyMgmtOpen)}
                className="w-full px-6 py-4 font-inter font-medium text-white/80 uppercase tracking-[0.1em] text-[13px] transition-all duration-200 ease-out hover:text-white hover:[text-shadow:0_0_20px_rgba(255,255,255,0.9),0_0_40px_rgba(255,255,255,0.4)] flex items-center justify-center gap-2"
              >
                {t.propertyManagement}
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${mobilePropertyMgmtOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {mobilePropertyMgmtOpen && (
                <div className="flex flex-col bg-white/5">
                  <Link to="/property-management" className="w-full px-6 py-3 font-inter font-medium text-white/80 uppercase tracking-[0.1em] text-[13px] transition-all duration-200 ease-out hover:text-white hover:[text-shadow:0_0_20px_rgba(255,255,255,0.9),0_0_40px_rgba(255,255,255,0.4)] text-center" onClick={() => setMobileMenuOpen(false)}>{t.propertyManagement}</Link>
                  <Link to="/property-management/calculator" className="w-full px-6 py-3 font-inter font-medium text-white/80 uppercase tracking-[0.1em] text-[13px] transition-all duration-200 ease-out hover:text-white hover:[text-shadow:0_0_20px_rgba(255,255,255,0.9),0_0_40px_rgba(255,255,255,0.4)] text-center" onClick={() => setMobileMenuOpen(false)}>{t.calculateEarnings}</Link>
                </div>
              )}
            </div>
            <Link to="/about" className="w-full px-6 py-4 font-inter font-medium text-white/80 uppercase tracking-[0.1em] text-[13px] transition-all duration-200 ease-out hover:text-white hover:[text-shadow:0_0_20px_rgba(255,255,255,0.9),0_0_40px_rgba(255,255,255,0.4)] text-center" onClick={() => setMobileMenuOpen(false)}>{t.about}</Link>
            <Link to="/contact" className="w-full px-6 py-4 font-inter font-medium text-white/80 uppercase tracking-[0.1em] text-[13px] transition-all duration-200 ease-out hover:text-white hover:[text-shadow:0_0_20px_rgba(255,255,255,0.9),0_0_40px_rgba(255,255,255,0.4)] text-center" onClick={() => setMobileMenuOpen(false)}>{t.contact}</Link>
            <Link to={membersHref} className="w-full px-6 py-4 font-inter font-medium text-white/80 uppercase tracking-[0.1em] text-[13px] transition-all duration-200 ease-out hover:text-white hover:[text-shadow:0_0_20px_rgba(255,255,255,0.9),0_0_40px_rgba(255,255,255,0.4)] text-center" onClick={() => setMobileMenuOpen(false)}>
              {t.members}
            </Link>
            {isSignedIn && (
              <Link to="/members/dashboard" className="w-full px-6 py-4 font-inter font-medium text-white/80 uppercase tracking-[0.1em] text-[13px] transition-all duration-200 ease-out hover:text-white hover:[text-shadow:0_0_20px_rgba(255,255,255,0.9),0_0_40px_rgba(255,255,255,0.4)] flex items-center justify-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <User className="h-4 w-4" />
                {t.myAccount}
              </Link>
            )}

            {isSignedIn ? (
              <button type="button" className="w-full px-6 py-4 font-inter font-medium text-white/80 uppercase tracking-[0.1em] text-[13px] transition-all duration-200 ease-out hover:text-white hover:[text-shadow:0_0_20px_rgba(255,255,255,0.9),0_0_40px_rgba(255,255,255,0.4)] text-center" onClick={() => { setMobileMenuOpen(false); handleSignOut(); }}>{t.signOut}</button>
            ) : (
              <Link to="/members/login" className="w-full px-6 py-4 font-inter font-medium text-white/80 uppercase tracking-[0.1em] text-[13px] transition-all duration-200 ease-out hover:text-white hover:[text-shadow:0_0_20px_rgba(255,255,255,0.9),0_0_40px_rgba(255,255,255,0.4)] text-center" onClick={() => setMobileMenuOpen(false)}>{t.signIn}</Link>
            )}
            
            <div className="mt-6 pt-4 border-t border-white/10 flex justify-center">
              <LanguageToggle language={language} onLanguageChange={onLanguageChange} />
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
