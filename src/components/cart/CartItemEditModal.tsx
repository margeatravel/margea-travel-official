import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CartItem } from "@/contexts/CartContext";
import { getTourPricing } from "@/data/toursPricing";

interface CartItemEditModalProps {
  item: CartItem;
  open: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<CartItem>) => void;
}

export function CartItemEditModal({ item, open, onClose, onSave }: CartItemEditModalProps) {
  const tourPricing = useMemo(() => getTourPricing(item.tourId), [item.tourId]);

  const [variantId, setVariantId] = useState(item.variantId);
  const [date, setDate] = useState(item.date);
  const [time, setTime] = useState(item.time);
  const [adults, setAdults] = useState(item.adults);
  const [children, setChildren] = useState(item.children);
  const [error, setError] = useState("");

  const selectedVariant = useMemo(
    () => tourPricing?.variants.find((v) => v.id === variantId),
    [tourPricing, variantId]
  );

  const hasMultipleVariants = (tourPricing?.variants.length ?? 0) > 1;
  const hasChildPricing = selectedVariant?.childPrice !== null && selectedVariant?.childPrice !== undefined;

  const computedTotal = useMemo(() => {
    if (!selectedVariant) return 0;
    return adults * selectedVariant.adultPrice + children * (selectedVariant.childPrice || 0);
  }, [selectedVariant, adults, children]);

  const handleSave = () => {
    if (!selectedVariant) return;
    if (adults < 1) {
      setError("At least 1 adult is required.");
      return;
    }
    if (!date) {
      setError("Please select a date.");
      return;
    }
    if (!time) {
      setError("Please select a time.");
      return;
    }
    setError("");

    onSave(item.id, {
      variantId,
      variantTitle: selectedVariant.title,
      date,
      time,
      adults,
      children: hasChildPricing ? children : 0,
      adultPrice: selectedVariant.adultPrice,
      childPrice: selectedVariant.childPrice,
    });
    onClose();
  };

  // Lock background scroll while open, restore on close
  useEffect(() => {
    if (!open) return;
    const body = document.body;
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const shell = (children: React.ReactNode) =>
    createPortal(
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/70 animate-in fade-in-0"
          onClick={onClose}
          aria-hidden="true"
        />
        <div
          role="dialog"
          aria-modal="true"
          className="relative z-10 w-full sm:max-w-md max-h-[85dvh] overflow-y-auto overscroll-contain rounded-xl border bg-background p-6 shadow-lg animate-in fade-in-0 zoom-in-95"
        >
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
          {children}
        </div>
      </div>,
      document.body
    );

  if (!tourPricing) {
    return shell(
      <>
        <h2 className="text-lg font-semibold leading-none tracking-tight pr-8">Edit not available</h2>
        <p className="text-sm text-muted-foreground mt-4">Pricing data not found for this tour.</p>
        <div className="flex justify-end mt-6">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </>
    );
  }

  return shell(
    <>
        <div className="flex flex-col space-y-1.5 text-left pr-8">
          <h2 className="text-base font-semibold leading-tight tracking-tight">{item.tourTitle}</h2>
        </div>


        <div className="space-y-4 py-2">
          {/* Variant */}
          {hasMultipleVariants && (
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Package / Tier</Label>
              <Select value={variantId} onValueChange={setVariantId}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tourPricing.variants.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.title} — ${v.adultPrice}/adult
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Date */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Date</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-9 text-sm"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          {/* Time */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Time</Label>
            <Select value={time} onValueChange={setTime}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tourPricing.timeSlots.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Adults */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Adults</Label>
            <Input
              type="number"
              min={1}
              max={20}
              value={adults}
              onChange={(e) => setAdults(Math.max(1, parseInt(e.target.value) || 1))}
              className="h-9 text-sm w-24"
            />
          </div>

          {/* Children */}
          {hasChildPricing && (
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Children</Label>
              <Input
                type="number"
                min={0}
                max={20}
                value={children}
                onChange={(e) => setChildren(Math.max(0, parseInt(e.target.value) || 0))}
                className="h-9 text-sm w-24"
              />
            </div>
          )}

          {/* Price preview */}
          <div className="flex justify-between items-center pt-2 border-t border-border/50">
            <span className="text-sm font-medium">Updated total</span>
            <span className="text-base font-bold text-primary">${computedTotal} {tourPricing.currency}</span>
          </div>

          {error && (
            <p className="text-xs text-destructive font-medium">{error}</p>
          )}
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 sm:gap-0 mt-4">
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={handleSave}>Save Changes</Button>
        </div>
    </>
  );

}
