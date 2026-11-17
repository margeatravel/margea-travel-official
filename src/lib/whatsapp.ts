import { Language } from "@/components/LanguageToggle";

const WHATSAPP_MESSAGES = {
  en: "Hi, I'd like to get more information about Margea's services.",
  es: "Hola, me gustaría obtener más información sobre los servicios de Margea.",
};

export function getWhatsAppUrl(language: Language = "en"): string {
  const message = encodeURIComponent(WHATSAPP_MESSAGES[language]);
  return `https://wa.me/529982334867?text=${message}`;
}
