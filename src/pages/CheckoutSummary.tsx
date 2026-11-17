import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CreditCard, ShoppingBag, Tag, Check, X, Sparkles } from "lucide-react";
import { getTourImage } from "@/data/tourImages";
import { validateCartPromo, type CartPromoCode } from "@/config/cart-promo-codes";
import { ShareCartControl } from "@/components/cart/ShareCartControl";


export default function CheckoutSummary() {
  const { items, totalPrice, itemCount, clearCart } = useCart();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  // Promo code state
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<CartPromoCode | null>(null);
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");

  // Drop the code automatically if the cart stops qualifying
  useEffect(() => {
    if (!appliedPromo) return;
    const result = validateCartPromo(appliedPromo.code, items);
    if (result.status === "valid") {
      setDiscount(result.discountUsd);
    } else {
      setAppliedPromo(null);
      setDiscount(0);
      setPromoError(
        result.status === "not-eligible"
          ? result.promo.requirement.en
          : "Invalid promo code"
      );
    }
  }, [items, appliedPromo]);

  const handleApplyPromo = () => {
    setPromoError("");
    if (!promoInput.trim()) return;

    const result = validateCartPromo(promoInput, items);
    if (result.status === "valid") {
      setAppliedPromo(result.promo);
      setDiscount(result.discountUsd);
    } else if (result.status === "not-eligible") {
      setAppliedPromo(null);
      setDiscount(0);
      setPromoError(result.promo.requirement.en);
    } else {
      setAppliedPromo(null);
      setDiscount(0);
      setPromoError("Invalid promo code");
    }
  };

  const handleRemovePromo = () => {
    setPromoInput("");
    setAppliedPromo(null);
    setDiscount(0);
    setPromoError("");
  };

  const finalTotal = Math.max(totalPrice - discount, 0);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    lodging: "",
    checkin: "",
    checkout: "",
    notes: "",
  });

  const [isMember, setIsMember] = useState(false);

  // Prefill from the signed-in member profile when available.
  // Re-runs on auth changes so a guest who signs up mid-checkout is recognized.
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (cancelled) return;
      if (!user) {
        setIsMember(false);
        return;
      }
      setIsMember(true);
      const { data: member } = await supabase
        .from("members")
        .select("first_name, last_name, email, phone")
        .eq("user_id", user.id)
        .maybeSingle();
      if (cancelled) return;
      setForm((prev) => ({
        ...prev,
        fullName: prev.fullName || [member?.first_name, member?.last_name].filter(Boolean).join(" ").trim(),
        email: prev.email || member?.email || user.email || "",
        phone: prev.phone || member?.phone || "",
      }));
    };
    load();
    const { data: sub } = supabase.auth.onAuthStateChange(() => { load(); });
    return () => { cancelled = true; sub.subscription.unsubscribe(); };
  }, []);

  const pointsEarned = Math.floor(finalTotal * 0.1);


  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const isValid =
    form.fullName.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
    form.phone.trim().length >= 7 &&
    form.lodging.trim().length > 0 &&
    form.checkin &&
    form.checkout &&
    confirmed;


  const handleProceed = async () => {
    if (!isValid || items.length === 0) return;
    setIsLoading(true);

    try {
      // Save order draft
      const { data: draft, error: draftError } = await supabase
        .from("order_drafts")
        .insert({
          cart_json: items as any,
          full_name: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          lodging: form.lodging.trim(),
          checkin: form.checkin,
          checkout: form.checkout,
          notes: form.notes.trim() || null,
        })
        .select("id")
        .single();

      if (draftError) throw draftError;

      // Create Stripe session with metadata
      const { data, error } = await supabase.functions.invoke("create-cart-checkout", {
        body: {
          items,
          customerEmail: form.email.trim(),
          promoCode: appliedPromo?.code ?? null,
          metadata: {
            order_draft_id: draft.id,
            full_name: form.fullName.trim(),
            phone: form.phone.trim(),
            lodging: form.lodging.trim(),
            checkin: form.checkin,
            checkout: form.checkout,
          },
        },
      });


      if (error) throw error;

      if (data?.url) {
        clearCart();
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.message || "Failed to create checkout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mb-4" />
        <p className="text-lg font-medium text-muted-foreground">Your cart is empty</p>
        <Button variant="outline" className="mt-6" onClick={() => navigate("/tours")}>
          Browse Tours
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Checkout Summary</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Cart Summary */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Your Items ({itemCount})
          </h2>
          <div className="space-y-3">
            {items.map((item) => {
              const itemTotal = item.adults * item.adultPrice + item.children * (item.childPrice || 0);
              const thumb = getTourImage(item.tourId);
              return (
                <div key={item.id} className="flex gap-3 p-3 rounded-xl bg-muted/50 border border-border/50">
                  {thumb && (
                    <img
                      src={thumb}
                      alt=""
                      className="w-12 h-12 rounded-lg object-cover shrink-0"
                      onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm leading-tight line-clamp-2">{item.tourTitle}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.variantTitle}</p>
                    <div className="flex flex-wrap gap-x-3 mt-1 text-xs text-muted-foreground">
                      <span>{item.date}</span>
                      <span>{item.time}</span>
                    </div>
                    <div className="flex flex-wrap gap-x-3 mt-0.5 text-xs">
                      {item.adults > 0 && <span>{item.adults} Adult{item.adults !== 1 ? "s" : ""}</span>}
                      {item.children > 0 && <span>{item.children} Child{item.children !== 1 ? "ren" : ""}</span>}
                    </div>
                  </div>
                  <span className="font-bold text-sm text-primary shrink-0">${itemTotal} {item.currency}</span>
                </div>
              );
            })}
          </div>
          <Separator className="my-4" />

          {/* Promo code */}
          <div className="rounded-xl bg-muted/30 p-3 space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              Promo code
            </Label>
            <div className="flex gap-2">
              <Input
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleApplyPromo();
                  }
                }}
                placeholder="Enter code"
                className="flex-1 bg-background"
                disabled={!!appliedPromo}
              />
              {appliedPromo ? (
                <Button type="button" variant="outline" onClick={handleRemovePromo} className="shrink-0">
                  <X className="w-4 h-4 mr-1" />
                  Remove
                </Button>
              ) : (
                <Button type="button" variant="outline" onClick={handleApplyPromo} className="shrink-0">
                  Apply
                </Button>
              )}
            </div>
            {appliedPromo && (
              <p className="flex items-center gap-1.5 text-sm text-emerald-600">
                <Check className="w-4 h-4" />
                {appliedPromo.code} applied — {appliedPromo.label.en}
              </p>
            )}
            {promoError && <p className="text-sm text-destructive">{promoError}</p>}
          </div>

          <Separator className="my-4" />

          <div className="space-y-2">
            {discount > 0 && (
              <>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${totalPrice.toLocaleString()} USD</span>
                </div>
                <div className="flex justify-between items-center text-sm text-emerald-600">
                  <span>Discount ({appliedPromo?.code})</span>
                  <span>−${discount.toLocaleString()} USD</span>
                </div>
              </>
            )}
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total</span>
              <span className="text-xl font-bold text-primary">${finalTotal.toLocaleString()} USD</span>
            </div>
            {isMember && pointsEarned > 0 && (
              <div className="flex items-center gap-1.5 rounded-lg border border-[#c9a96e]/40 bg-[#c9a96e]/10 px-3 py-2">
                <Sparkles className="w-3.5 h-3.5 text-[#c9a96e] shrink-0" />
                <p className="text-xs font-medium text-[#a8863f]">
                  You'll earn {pointsEarned.toLocaleString()} Margea Points with this booking
                </p>
              </div>
            )}
            {!isMember && pointsEarned > 0 && (
              <div className="flex items-center justify-between gap-3 rounded-lg border border-[#c9a96e]/40 bg-[#c9a96e]/10 px-3 py-2">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#c9a96e] shrink-0" />
                  <p className="text-xs font-medium text-[#a8863f]">
                    Join now and earn {pointsEarned.toLocaleString()} Margea Points on this booking
                  </p>
                </div>
                <Link
                  to={`/members?redirect=${encodeURIComponent("/checkout-summary?member=1")}#join-form`}
                  className="shrink-0 rounded-md bg-[#c9a96e] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#1d2839] transition-colors hover:bg-[#b8985d]"
                >
                  Join Now
                </Link>
              </div>
            )}
          </div>


          <div className="mt-4 space-y-2">
            <ShareCartControl />
          </div>

        </section>

        <Separator />


        {/* Customer Info Form */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Your Details
          </h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input id="fullName" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} placeholder="John Doe" />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="john@example.com" />
            </div>
            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input id="phone" type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+1 555 123 4567" />
            </div>
            <div>
              <Label htmlFor="lodging">Where are you staying? *</Label>
              <Input id="lodging" value={form.lodging} onChange={(e) => update("lodging", e.target.value)} placeholder="Hotel / Property name" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="checkin">Check-in Date *</Label>
                <Input id="checkin" type="date" value={form.checkin} onChange={(e) => update("checkin", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="checkout">Check-out Date *</Label>
                <Input id="checkout" type="date" value={form.checkout} onChange={(e) => update("checkout", e.target.value)} />
              </div>
            </div>
            <div>
              <Label htmlFor="notes">Notes / Special Requests</Label>
              <Textarea id="notes" value={form.notes} onChange={(e) => update("notes", e.target.value)} placeholder="Any special requirements..." rows={3} />
            </div>
            <div className="flex items-start gap-2">
              <Checkbox
                id="confirm"
                checked={confirmed}
                onCheckedChange={(v) => setConfirmed(v === true)}
              />
              <Label htmlFor="confirm" className="text-sm leading-tight cursor-pointer">
                I confirm that all details above are correct
              </Label>
            </div>
          </div>
        </section>

        {/* CTA */}
        <Button
          onClick={handleProceed}
          disabled={!isValid || isLoading}
          className="w-full h-12 text-base font-semibold gap-2"
          size="lg"
        >
          {isLoading ? (
            "Processing..."
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              Proceed to Payment
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
