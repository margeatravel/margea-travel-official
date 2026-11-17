import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ExoticCar, exoticCars, experienceOptions, suvDurationOptions } from "@/data/exotic-cars-data";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface ExoticCarBookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedCar?: ExoticCar | null;
  language: 'en' | 'es';
}

const translations = {
  en: {
    title: "Book Your Exotic Car Experience",
    selectCar: "Select Car",
    selectExperience: "Select Experience Type",
    selectDuration: "Select Duration",
    date: "Date",
    preferredTime: "Preferred Time",
    driverName: "Driver Name",
    phone: "Phone",
    email: "Email",
    paymentOption: "Payment Option",
    payFullLabel: "Pay in Full (100%)",
    payFullRecommended: "Recommended",
    payDepositLabel: "Deposit (30%)",
    payNow: "Pay now",
    deposit: "Deposit (30%)",
    fullPaymentNote: "Pay in full now to confirm your reservation.",
    depositNote: "30% due now to confirm your reservation.",
    balanceDue: "Balance due on day of service",
    proceedToPayment: "Proceed to Payment",
    total: "Total",
    pickDate: "Pick a date",
    required: "Required",
    processing: "Processing...",
    termsLabel: "I accept the booking terms and reservation requirements",
    termsRequired: "Please accept the terms to proceed",
    perHour: "Per Hour",
    per24Hours: "24 Hours",
    exoticCars: "Exotic Cars",
    suvs: "Luxury SUVs",
  },
  es: {
    title: "Reserva Tu Experiencia de Auto Exótico",
    selectCar: "Seleccionar Auto",
    selectExperience: "Seleccionar Tipo de Experiencia",
    selectDuration: "Seleccionar Duración",
    date: "Fecha",
    preferredTime: "Hora Preferida",
    driverName: "Nombre del Conductor",
    phone: "Teléfono",
    email: "Correo Electrónico",
    paymentOption: "Opción de Pago",
    payFullLabel: "Pago Completo (100%)",
    payFullRecommended: "Recomendado",
    payDepositLabel: "Depósito (30%)",
    payNow: "Pagar ahora",
    deposit: "Depósito (30%)",
    fullPaymentNote: "Paga el total ahora para confirmar tu reserva.",
    depositNote: "30% se paga ahora para confirmar tu reserva.",
    balanceDue: "Saldo restante en el día del servicio",
    proceedToPayment: "Proceder al Pago",
    total: "Total",
    pickDate: "Selecciona una fecha",
    required: "Requerido",
    processing: "Procesando...",
    termsLabel: "Acepto los términos de reserva y los requisitos",
    termsRequired: "Por favor acepta los términos para continuar",
    perHour: "Por Hora",
    per24Hours: "24 Horas",
    exoticCars: "Autos Exóticos",
    suvs: "SUVs de Lujo",
  },
};

export function ExoticCarBookingModal({ 
  open, 
  onOpenChange, 
  preselectedCar, 
  language 
}: ExoticCarBookingModalProps) {
  const t = translations[language];
  
  const [selectedCarId, setSelectedCarId] = useState<string>("");
  const [selectedExperienceId, setSelectedExperienceId] = useState<string>("");
  const [selectedSuvDurationId, setSelectedSuvDurationId] = useState<string>("");
  const [date, setDate] = useState<Date | undefined>();
  const [preferredTime, setPreferredTime] = useState("");
  const [driverName, setDriverName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentType, setPaymentType] = useState<"full" | "deposit">("full");

  // Set preselected car when modal opens
  useEffect(() => {
    if (preselectedCar && open) {
      setSelectedCarId(preselectedCar.id);
    }
  }, [preselectedCar, open]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setSelectedCarId("");
        setSelectedExperienceId("");
        setSelectedSuvDurationId("");
        setDate(undefined);
        setPreferredTime("");
        setDriverName("");
        setPhone("");
        setEmail("");
        setPaymentType("full");
        setTermsAccepted(false);
      }, 300);
    }
  }, [open]);

  const selectedCar = exoticCars.find((c) => c.id === selectedCarId);
  const selectedExperience = experienceOptions.find((e) => e.id === selectedExperienceId);
  const selectedSuvDuration = suvDurationOptions.find((d) => d.id === selectedSuvDurationId);

  // Calculate total price based on car category
  const getTotalPrice = (): number => {
    if (!selectedCar) return 0;
    
    if (selectedCar.category === 'exotic' && selectedExperience) {
      return selectedExperience.price;
    }
    
    if (selectedCar.category === 'suv' && selectedCar.suvPricing && selectedSuvDuration) {
      return selectedSuvDuration.id === 'hourly' 
        ? selectedCar.suvPricing.hourly 
        : selectedCar.suvPricing.daily;
    }
    
    return 0;
  };

  const totalPrice = getTotalPrice();
  const depositAmount = Math.round(totalPrice * 0.3);
  const payNowAmount = paymentType === "full" ? totalPrice : depositAmount;
  const balanceDue = paymentType === "full" ? 0 : totalPrice - depositAmount;

  // Get experience/duration name for display
  const getExperienceName = (): string => {
    if (selectedCar?.category === 'exotic' && selectedExperience) {
      return language === 'es' ? selectedExperience.nameEs : selectedExperience.name;
    }
    if (selectedCar?.category === 'suv' && selectedSuvDuration) {
      return language === 'es' ? selectedSuvDuration.nameEs : selectedSuvDuration.name;
    }
    return '';
  };

  const getExperienceDuration = (): string => {
    if (selectedCar?.category === 'exotic' && selectedExperience) {
      return selectedExperience.duration;
    }
    if (selectedSuvDuration) {
      return selectedSuvDuration.duration;
    }
    return '';
  };

  // Check if duration/experience is selected based on car category
  const isDurationSelected = (): boolean => {
    if (!selectedCar) return false;
    if (selectedCar.category === 'exotic') return !!selectedExperienceId;
    if (selectedCar.category === 'suv') return !!selectedSuvDurationId;
    return false;
  };

  const isFormValid = 
    selectedCarId && 
    isDurationSelected() &&
    date && 
    preferredTime && 
    driverName.trim() && 
    phone.trim() && 
    email.trim() &&
    email.includes("@") &&
    termsAccepted;

  const handleSubmit = async () => {
    if (!isFormValid || !selectedCar) return;
    
    setIsSubmitting(true);

    try {
      const experienceId = selectedCar.category === 'exotic' ? selectedExperienceId : selectedSuvDurationId;
      
      const { data, error } = await supabase.functions.invoke("create-car-rental-checkout", {
        body: {
          car_id: selectedCar.id,
          car_name: selectedCar.name,
          experience_id: experienceId,
          experience_name: getExperienceName(),
          experience_duration: getExperienceDuration(),
          total_usd: totalPrice,
          pay_now_usd: payNowAmount,
          balance_due_usd: balanceDue,
          payment_type: paymentType,
          driver_name: driverName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          date: format(date!, "yyyy-MM-dd"),
          preferred_time: preferredTime,
          source: "booking_modal",
          vehicle_category: selectedCar.category,
          vehicle_deposit: selectedCar.deposit,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, "_blank");
        onOpenChange(false);
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Error",
        description: "Failed to create checkout session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Group cars by category
  const exoticCarsList = exoticCars.filter(c => c.category === 'exotic');
  const suvCarsList = exoticCars.filter(c => c.category === 'suv');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{t.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Select Car */}
          <div className="space-y-2">
            <Label htmlFor="car">{t.selectCar} *</Label>
            <Select value={selectedCarId} onValueChange={(value) => {
              setSelectedCarId(value);
              setSelectedExperienceId("");
              setSelectedSuvDurationId("");
            }}>
              <SelectTrigger id="car">
                <SelectValue placeholder={t.selectCar} />
              </SelectTrigger>
              <SelectContent className="bg-popover z-[9999]">
                {/* Exotic Cars Group */}
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">{t.exoticCars}</div>
                {exoticCarsList.map((car) => (
                  <SelectItem key={car.id} value={car.id}>
                    {car.name}
                  </SelectItem>
                ))}
                {/* SUVs Group */}
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2 border-t pt-2">{t.suvs}</div>
                {suvCarsList.map((car) => (
                  <SelectItem key={car.id} value={car.id}>
                    {car.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Select Experience (for Exotic Cars) */}
          {selectedCar?.category === 'exotic' && (
            <div className="space-y-2">
              <Label htmlFor="experience">{t.selectExperience} *</Label>
              <Select value={selectedExperienceId} onValueChange={setSelectedExperienceId}>
                <SelectTrigger id="experience">
                  <SelectValue placeholder={t.selectExperience} />
                </SelectTrigger>
                <SelectContent className="bg-popover z-[9999]">
                  {experienceOptions.map((exp) => (
                    <SelectItem key={exp.id} value={exp.id}>
                      {language === 'es' ? exp.nameEs : exp.name} — ${exp.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Select Duration (for SUVs) */}
          {selectedCar?.category === 'suv' && selectedCar.suvPricing && (
            <div className="space-y-2">
              <Label htmlFor="duration">{t.selectDuration} *</Label>
              <Select value={selectedSuvDurationId} onValueChange={setSelectedSuvDurationId}>
                <SelectTrigger id="duration">
                  <SelectValue placeholder={t.selectDuration} />
                </SelectTrigger>
                <SelectContent className="bg-popover z-[9999]">
                  <SelectItem value="hourly">
                    {t.perHour} — ${selectedCar.suvPricing.hourly}
                  </SelectItem>
                  <SelectItem value="daily">
                    {t.per24Hours} — ${selectedCar.suvPricing.daily}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Date */}
          <div className="space-y-2">
            <Label>{t.date} *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : t.pickDate}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-[9999]" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(d) => d < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Preferred Time */}
          <div className="space-y-2">
            <Label htmlFor="time">{t.preferredTime} *</Label>
            <Input
              id="time"
              type="time"
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              required
            />
          </div>

          {/* Driver Name */}
          <div className="space-y-2">
            <Label htmlFor="driverName">{t.driverName} *</Label>
            <Input
              id="driverName"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">{t.phone} *</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 234 567 8900"
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">{t.email} *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              required
            />
          </div>

          {/* Terms Acceptance */}
          <div className="flex items-start space-x-3 py-2">
            <Checkbox 
              id="terms" 
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked === true)}
            />
            <label 
              htmlFor="terms" 
              className="text-sm text-muted-foreground leading-tight cursor-pointer"
            >
              {t.termsLabel}
            </label>
          </div>

          {/* Payment Option Toggle */}
          {totalPrice > 0 && (
            <div className="space-y-3">
              <Label>{t.paymentOption}</Label>
              <RadioGroup
                value={paymentType}
                onValueChange={(value) => setPaymentType(value as "full" | "deposit")}
                className="grid grid-cols-2 gap-3"
              >
                <label
                  htmlFor="pay-full"
                  className={cn(
                    "flex flex-col items-center justify-center rounded-lg border-2 p-3 cursor-pointer transition-all",
                    paymentType === "full"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <RadioGroupItem value="full" id="pay-full" className="sr-only" />
                  <span className="text-sm font-medium">{t.payFullLabel}</span>
                  <span className="text-xs text-primary">{t.payFullRecommended}</span>
                </label>
                <label
                  htmlFor="pay-deposit"
                  className={cn(
                    "flex flex-col items-center justify-center rounded-lg border-2 p-3 cursor-pointer transition-all",
                    paymentType === "deposit"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <RadioGroupItem value="deposit" id="pay-deposit" className="sr-only" />
                  <span className="text-sm font-medium">{t.payDepositLabel}</span>
                </label>
              </RadioGroup>
            </div>
          )}

          {/* Pricing Summary */}
          {totalPrice > 0 && (
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>{t.total}</span>
                <span className="font-semibold">${totalPrice} USD</span>
              </div>
              <div className="flex justify-between text-sm text-primary font-semibold">
                <span>{t.payNow} ({paymentType === "full" ? "100%" : "30%"})</span>
                <span>${payNowAmount} USD</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{t.balanceDue}</span>
                <span>${balanceDue} USD</span>
              </div>
              <p className="text-xs text-primary/80 mt-2 pt-2 border-t border-border">
                {paymentType === "full" ? t.fullPaymentNote : t.depositNote}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className={cn(
              "w-full transition-all duration-200",
              isFormValid && !isSubmitting 
                ? "bg-primary hover:bg-primary/90" 
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t.processing}
              </>
            ) : (
              `${t.proceedToPayment}${payNowAmount > 0 ? ` — $${payNowAmount}` : ''}`
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
