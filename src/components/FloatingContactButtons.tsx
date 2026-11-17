import { Phone } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { useLanguage } from "@/components/LanguageToggle";
import { getWhatsAppUrl } from "@/lib/whatsapp";

const PHONE_NUMBER = "+529982334867";
const TEL_URL = `tel:${PHONE_NUMBER}`;

export function FloatingContactButtons() {
  const { language } = useLanguage();
  const WHATSAPP_URL = getWhatsAppUrl(language);
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col-reverse gap-3">
      {/* WhatsApp Button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp Margea: +52 998 233 4867"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:scale-100"
          >
            <WhatsAppIcon size={28} />
          </a>
        </TooltipTrigger>
        <TooltipContent side="left" className="bg-foreground text-background">
          WhatsApp
        </TooltipContent>
      </Tooltip>

      {/* Phone Button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href={TEL_URL}
            aria-label="Call Margea: +52 998 233 4867"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:scale-100"
          >
            <Phone className="h-7 w-7" />
          </a>
        </TooltipTrigger>
        <TooltipContent side="left" className="bg-foreground text-background">
          Call
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
