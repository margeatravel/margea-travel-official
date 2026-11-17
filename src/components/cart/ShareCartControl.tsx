import { useState } from "react";
import { Share2, Copy, Check, Mail, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

// Module-level cache so the same still-valid link is reused across
// remounts / pages (cart panel <-> checkout summary).
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
let cachedLink: { url: string; createdAt: number; signature: string } | null = null;

function cartSignature(items: { id: string; adults: number; children: number }[]) {
  return items.map((i) => `${i.id}:${i.adults}:${i.children}`).join("|");
}

export function ShareCartControl({ compact = false }: { compact?: boolean }) {
  const { items, totalPrice } = useCart();
  const signature = cartSignature(items as any);
  const valid =
    cachedLink && cachedLink.signature === signature && Date.now() - cachedLink.createdAt < SEVEN_DAYS
      ? cachedLink.url
      : null;

  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (items.length === 0 || isSharing) return;

    if (valid) {
      setShareUrl(valid);
      return;
    }

    setIsSharing(true);
    try {
      const { data: cartId, error } = await supabase.rpc("create_shared_cart", {
        _cart_json: items as any,
        _total_usd: totalPrice,
      });

      if (error || !cartId) throw error || new Error("No cart id");

      const url = `${window.location.origin}/cart/shared/${cartId}`;
      cachedLink = { url, createdAt: Date.now(), signature };
      setShareUrl(url);
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success("Link copied");
        setTimeout(() => setCopied(false), 2500);
      } catch {
        toast.success("Share link created");
      }
    } catch (err: any) {
      console.error("Share cart error:", err);
      toast.error("Could not create the share link. Please try again.");
    } finally {
      setIsSharing(false);
    }
  };

  const copyShareUrl = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copied");
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      <button
        onClick={handleShare}
        disabled={isSharing || items.length === 0}
        className={
          compact
            ? "w-full flex items-center justify-center gap-1 text-[11px] text-muted-foreground hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors py-0.5"
            : "w-full flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors py-1"
        }
      >
        <Share2 className={compact ? "w-3 h-3" : "w-4 h-4"} />
        {isSharing ? "Creating link..." : "Share cart"}
      </button>

      {shareUrl && (
        <div className="relative rounded-xl bg-muted/50 border border-border/50 p-2.5 space-y-2">
          <button
            onClick={() => setShareUrl(null)}
            aria-label="Close share cart"
            className="absolute top-1.5 right-1.5 text-muted-foreground hover:text-foreground transition-colors p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <p className="text-[11px] text-muted-foreground leading-tight pr-6">
            Anyone with this link can review these items and pay with their own details. Valid for 7 days or until booked.
          </p>
          <div className="flex gap-2">
            <input
              readOnly
              value={shareUrl}
              onFocus={(e) => e.currentTarget.select()}
              className="flex-1 min-w-0 text-xs bg-background rounded-md border px-2 py-1.5"
            />
            <Button size="sm" variant="secondary" onClick={copyShareUrl} className="shrink-0">
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1 gap-1.5 text-xs" asChild>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Here's our Margea cart — you can review it and complete the booking here: ${shareUrl}`)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon size={14} />
                WhatsApp
              </a>
            </Button>
            <Button size="sm" variant="outline" className="flex-1 gap-1.5 text-xs" asChild>
              <a
                href={`mailto:?subject=${encodeURIComponent("Our Margea cart")}&body=${encodeURIComponent(`You can review the cart and complete the booking here: ${shareUrl}`)}`}
              >
                <Mail className="w-3.5 h-3.5" />
                Email
              </a>
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
