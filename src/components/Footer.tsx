import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Instagram } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { Language } from "./LanguageToggle";
import { getWhatsAppUrl } from "@/lib/whatsapp";

interface FooterProps {
  language: Language;
}

const translations = {
  en: {
    aboutTitle: "About Margea",
    aboutText: "Your trusted partner for Riviera Maya experiences. Direct bookings, personalized service, 24/7 support.",
    quickLinks: "Quick Links",
    stays: "Stays",
    tours: "Tours & Activities",
    customPackage: "Custom Package",
    concierge: "Concierge",
    propertyManagement: "Property Management",
    about: "About Us",
    contact: "Contact",
    contactTitle: "Contact Us",
    location: "Cancún, Quintana Roo",
    instagram: "@margeatravel",
    legal: "Legal",
    terms: "Terms & Conditions",
    privacy: "Privacy Policy",
    cancellation: "Cancellation Policy",
    rights: "All rights reserved.",
  },
  es: {
    aboutTitle: "Sobre Margea",
    aboutText: "Tu socio de confianza para experiencias en Riviera Maya. Reservas directas, servicio personalizado, soporte 24/7.",
    quickLinks: "Enlaces Rápidos",
    stays: "Alojamientos",
    tours: "Tours y Actividades",
    customPackage: "Paquete Personalizado",
    concierge: "Concierge",
    propertyManagement: "Administración",
    about: "Nosotros",
    contact: "Contacto",
    contactTitle: "Contáctanos",
    location: "Cancún, Quintana Roo",
    instagram: "@margeatravel",
    legal: "Legal",
    terms: "Términos y Condiciones",
    privacy: "Política de Privacidad",
    cancellation: "Política de Cancelación",
    rights: "Todos los derechos reservados.",
  },
};

export function Footer({ language }: FooterProps) {
  const t = translations[language];
  const currentYear = new Date().getFullYear();

  const linkClass = "text-sm text-white/70 hover:text-[#b8975a] transition-colors duration-200";

  return (
    <footer className="bg-[#1d2839] text-white">
      <div className="max-w-[1280px] mx-auto px-4 py-24 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-cormorant font-normal text-white mb-4">
              {t.aboutTitle}
            </h3>
            <p className="text-sm text-white/70 leading-relaxed font-inter">
              {t.aboutText}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-cormorant font-normal text-white mb-4">{t.quickLinks}</h3>
            <ul className="space-y-2">
              <li><Link to="/stays" className={linkClass}>{t.stays}</Link></li>
              <li><Link to="/tours" className={linkClass}>{t.tours}</Link></li>
              <li><Link to="/custom-package" className={linkClass}>{t.customPackage}</Link></li>
              <li><Link to="/concierge" className={linkClass}>{t.concierge}</Link></li>
              <li><Link to="/property-management" className={linkClass}>{t.propertyManagement}</Link></li>
              <li><Link to="/about" className={linkClass}>{t.about}</Link></li>
              <li><Link to="/contact" className={linkClass}>{t.contact}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-cormorant font-normal text-white mb-4">{t.contactTitle}</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-white/70">
                <MapPin className="h-5 w-5 flex-shrink-0 text-white" />
                <span>{t.location}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/70">
                <Phone className="h-5 w-5 flex-shrink-0 text-white" />
                <a href="tel:+529982334867" className="hover:text-[#b8975a] transition-colors duration-200" aria-label="Call Margea: +52 998 233 4867">+52 998 233 4867</a>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/70">
                <WhatsAppIcon size={20} className="flex-shrink-0 text-white" />
                <a href={getWhatsAppUrl(language)} target="_blank" rel="noopener noreferrer" className="hover:text-[#b8975a] transition-colors duration-200" aria-label="WhatsApp Margea: +52 998 233 4867">WhatsApp</a>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/70">
                <Mail className="h-5 w-5 flex-shrink-0 text-white" />
                <a href="mailto:admin@margeatravel.com" className="hover:text-[#b8975a] transition-colors duration-200">admin@margeatravel.com</a>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/70">
                <Instagram className="h-5 w-5 flex-shrink-0 text-white" />
                <a href="https://www.instagram.com/margeatravel/" target="_blank" rel="noopener noreferrer" className="hover:text-[#b8975a] transition-colors duration-200">{t.instagram}</a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-cormorant font-normal text-white mb-4">{t.legal}</h3>
            <ul className="space-y-2">
              <li><Link to="/terms" className={linkClass}>{t.terms}</Link></li>
              <li><Link to="/privacy" className={linkClass}>{t.privacy}</Link></li>
              <li><Link to="/cancellation" className={linkClass}>{t.cancellation}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/20 text-center">
          <p className="text-sm text-white/50 font-inter">
            © {currentYear} Margea. {t.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
