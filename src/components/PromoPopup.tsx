import { useState, useEffect } from "react";
import { X, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const STORAGE_KEY = "margea_promo_popup_dismissed";
const DISMISS_DURATION_DAYS = 30;

interface PromoPopupProps {
  /** Delay in milliseconds before showing the popup (default: 3000ms) */
  showDelay?: number;
}

export const PromoPopup = ({ showDelay = 3000 }: PromoPopupProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    checkIn: undefined as Date | undefined,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Check if popup was dismissed within the last 30 days
    const dismissedAt = localStorage.getItem(STORAGE_KEY);
    if (dismissedAt) {
      const dismissedDate = new Date(dismissedAt);
      const now = new Date();
      const daysSinceDismissed = (now.getTime() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysSinceDismissed < DISMISS_DURATION_DAYS) {
        return; // Don't show popup
      }
    }

    // Show popup after delay
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, showDelay);

    return () => clearTimeout(timer);
  }, [showDelay]);

  const handleClose = () => {
    setIsOpen(false);
    // Store dismissal time
    localStorage.setItem(STORAGE_KEY, new Date().toISOString());
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName) {
      newErrors.firstName = "First name is required";
    }
    
    if (!formData.lastName) {
      newErrors.lastName = "Last name is required";
    }
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!formData.phone) {
      newErrors.phone = "Phone is required";
    }
    
    if (!formData.checkIn) {
      newErrors.checkIn = "Check-in date is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Prepare data with UTM tracking and timestamp
      const subscriptionData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        checkIn: formData.checkIn ? format(formData.checkIn, "yyyy-MM-dd") : "",
        timestamp: new Date().toISOString(),
        tag: "Airport_Transfer_20pct_2025",
        utm_source: "popup",
        utm_campaign: "airport_transfer",
      };
      
      // Send to edge function
      const { data, error } = await supabase.functions.invoke('send-promo-signup', {
        body: subscriptionData,
      });

      if (error) throw error;
      
      setShowSuccess(true);
      
      // Store dismissal and close after 2 seconds
      localStorage.setItem(STORAGE_KEY, new Date().toISOString());
      setTimeout(() => {
        setIsOpen(false);
      }, 2000);
      
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | Date | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const inputStyles = "w-full bg-white/10 border-promo-gold/40 text-white placeholder:text-white/60 focus:border-promo-gold focus:ring-promo-gold/20 h-10";

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[9997] bg-black/15"
          onClick={handleClose}
        />
      )}
      <Dialog open={isOpen} onOpenChange={setIsOpen} modal={false}>
        <DialogContent 
          className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-[9998] w-[95vw] max-w-[800px] p-0 border-none bg-transparent shadow-none gap-0"
          onPointerDownOutside={handleClose}
          onEscapeKeyDown={handleClose}
        >
        <div className="relative bg-promo-navy rounded-xl p-6 md:p-8">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-promo-gold hover:text-promo-gold/80 transition-colors z-10"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
          
          {showSuccess ? (
            <div className="text-center py-6">
              <h2 className="text-xl md:text-2xl font-serif text-white mb-3">
                Thank you!
              </h2>
              <p className="text-white/90">
                We will contact you shortly to arrange your airport transfer.
              </p>
            </div>
          ) : (
            <>
              {/* Headline */}
              <h2 className="text-xl md:text-2xl font-serif text-white text-center mb-2 pr-8">
                Unlock 20% off airport transportation when you book with us.
              </h2>
              
              {/* Subheader */}
              <p className="text-white/80 text-center text-sm mb-6">
                Receive exclusive deals, travel guides, news & more
              </p>
              
              {/* Form - horizontal layout */}
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Row 1: First Name & Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Input
                      type="text"
                      placeholder="First Name*"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className={inputStyles}
                    />
                    {errors.firstName && (
                      <p className="text-promo-coral text-xs mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <Input
                      type="text"
                      placeholder="Last Name*"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className={inputStyles}
                    />
                    {errors.lastName && (
                      <p className="text-promo-coral text-xs mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>
                
                {/* Row 2: Email & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Input
                      type="email"
                      placeholder="Email*"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={inputStyles}
                    />
                    {errors.email && (
                      <p className="text-promo-coral text-xs mt-1">{errors.email}</p>
                    )}
                  </div>
                  <div>
                    <Input
                      type="tel"
                      placeholder="Phone*"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className={inputStyles}
                    />
                    {errors.phone && (
                      <p className="text-promo-coral text-xs mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>
                
                {/* Row 3: Check-In & Subscribe button */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            inputStyles,
                            "justify-start text-left font-normal",
                            !formData.checkIn && "text-white/60"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.checkIn ? format(formData.checkIn, "PPP") : "Check-In*"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 z-[60]" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.checkIn}
                          onSelect={(date) => handleInputChange("checkIn", date)}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="p-3 pointer-events-auto bg-white"
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.checkIn && (
                      <p className="text-promo-coral text-xs mt-1">{errors.checkIn}</p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-10 bg-promo-coral hover:bg-promo-coral/90 text-white font-semibold"
                  >
                    {isSubmitting ? "Subscribing..." : "Subscribe"}
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
};
