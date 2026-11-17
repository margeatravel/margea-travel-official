import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { CreditCard, ShoppingBag, Loader2, Link2Off, Lock } from "lucide-react";
import { getTourImage } from "@/data/tourImages";
import type { CartItem } from "@/contexts/CartContext";

type LoadState = "loading" | "ready" | "unavailable";

export default function SharedCart() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [state, setState] = useState<LoadState>("loading");
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    lodging: "",
    checkin: "",
    checkout: "",
    notes: "",
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  useEffect(() => {
    let active = true;
    (async () => {
      if (!id) {
        setState("unavailable");
        return;
      }
      const { data: rows, error } = await supabase.rpc("get_shared_cart", { _id: id });
      const data = rows?.[0] ?? null;

      if (!active) return;

      const expired = data ? new Date(data.expires_at).getTime() < Date.now() : true;
      const cart = (data?.cart_json as unknown as CartItem[]) || [];

      if (error || !data || data.used_at || expired || cart.length === 0) {
        setState("unavailable");
        return;
      }

      setItems(cart);
      setState("ready");
    })();
    return () => {
      active = false;
    };
  }, [id]);

  const totalPrice = items.reduce(
    (sum, i) => sum + i.adults * i.adultPrice + i.children * (i.childPrice || 0),
    0
  );

  const isValid =
    form.fullName.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
    form.phone.trim().length >= 7 &&
    form.lodging.trim().length > 0 &&
    form.checkin &&
    form.checkout &&
    confirmed;

  const handleProceed = async () => {
    if (!isValid || items.length === 0 || !id) return;
    setIsLoading(true);
    try {
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

      const { data, error } = await supabase.functions.invoke("create-cart-checkout", {
        body: {
          items,
          customerEmail: form.email.trim(),
          promoCode: null,
          metadata: {
            order_draft_id: draft.id,
            shared_cart_id: id,
            full_name: form.fullName.trim(),
            phone: form.phone.trim(),
            lodging: form.lodging.trim(),
            checkin: form.checkin,
            checkout: form.checkout,
          },
        },
      });

      if (error) throw error;
      if (!data?.url) throw new Error("No checkout URL returned");

      // Mark the shared link as used so it can't be reused
      await supabase.rpc("mark_shared_cart_used", { _id: id });

      window.location.href = data.url;
    } catch (err: any) {
      console.error("Shared cart checkout error:", err);
      toast.error(err.message || "Failed to create checkout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (state === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (state === "unavailable") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <Link2Off className="w-14 h-14 text-muted-foreground/40 mb-4" />
        <h1 className="text-xl font-semibold">This cart link is no longer available</h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-sm">
          The link may have expired, already been used for a booking, or be invalid.
        </p>
        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={() => navigate("/")}>Back to homepage</Button>
          <Button onClick={() => navigate("/tours")}>Browse tours</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-semibold">Shared Cart</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            Shared items ({items.length}) — view only
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
          <div className="flex justify-between items-center">
            <span className="font-semibold">Total</span>
            <span className="text-xl font-bold text-primary">${totalPrice.toLocaleString()} USD</span>
          </div>
        </section>

        <Separator />

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
              <Checkbox id="confirm" checked={confirmed} onCheckedChange={(v) => setConfirmed(v === true)} />
              <Label htmlFor="confirm" className="text-sm leading-tight cursor-pointer">
                I confirm that all details above are correct
              </Label>
            </div>
          </div>
        </section>

        <Button
          onClick={handleProceed}
          disabled={!isValid || isLoading}
          className="w-full h-12 text-base font-semibold gap-2"
          size="lg"
        >
          {isLoading ? "Processing..." : (
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
