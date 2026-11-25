import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart, CartItem } from "@/contexts/CartContext";
import { Trash2, ShoppingBag, CreditCard, Plus, ArrowRight, Pencil, Share2, Copy, Check, Mail, UserRound } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { CartItemEditModal } from "./CartItemEditModal";
import { getTourImage } from "@/data/tourImages";
import { supabase } from "@/integrations/supabase/client";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { ShareCartControl } from "./ShareCartControl";
import { media } from "@/lib/media";


function CartItemCard({
  item,
  onRemove,
  onEdit,
}: {
  item: CartItem;
  onRemove: () => void;
  onEdit: () => void;
}) {
  const itemTotal = item.adults * item.adultPrice + item.children * (item.childPrice || 0);
  const thumb = getTourImage(item.tourId);

  return (
    <div className="flex gap-2 p-2 rounded-lg bg-muted/50 border border-border/50">
      {thumb && (
        <img
          src={thumb}
          alt=""
          className="w-8 h-8 rounded-md object-cover shrink-0"
        />
      )}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-xs leading-tight line-clamp-2">{item.tourTitle}</h4>
        <p className="text-[11px] text-muted-foreground mt-0 leading-tight">{item.variantTitle}</p>
        <div className="flex flex-wrap gap-x-2 gap-y-0 mt-0.5 text-[11px] text-muted-foreground leading-tight">
          <span>{item.date}</span>
          <span>{item.time}</span>
        </div>
        <div className="flex flex-wrap gap-x-2 mt-0 text-[11px] leading-tight">
          {item.adults > 0 && <span>{item.adults} Adult{item.adults !== 1 ? "s" : ""}</span>}
          {item.children > 0 && <span>{item.children} Child{item.children !== 1 ? "ren" : ""}</span>}
        </div>
      </div>
      <div className="flex flex-col items-end justify-between shrink-0">
        <span className="font-bold text-xs text-primary">${itemTotal} {item.currency}</span>
        <div className="flex items-center gap-0.5">
          <button
            onClick={onEdit}
            className="text-muted-foreground hover:text-primary transition-colors p-0.5"
            aria-label="Edit item"
          >
            <Pencil className="w-3 h-3" />
          </button>
          <button
            onClick={onRemove}
            className="text-muted-foreground hover:text-destructive transition-colors p-0.5"
            aria-label="Remove item"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Upsell thumbnail component
function UpsellThumb({ src }: { src: string | null }) {
  return (
    <img
      src={src || "/placeholder.svg"}
      alt=""
      className="w-8 h-8 rounded-md object-cover shrink-0"
      onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
    />
  );
}

export function CartDrawer() {
  const { items, removeItem, updateItem, clearCart, totalPrice, isDrawerOpen, setDrawerOpen, itemCount } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);


  // Lock body scroll & save/restore scroll position when cart is open
  useEffect(() => {
    if (isDrawerOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isDrawerOpen]);

  const handleEdit = (item: CartItem) => {
    setDrawerOpen(false);
    // Wait for drawer close animation before opening the edit modal
    setTimeout(() => setEditingItem(item), 250);
  };

  const closeEditModal = () => {
    setEditingItem(null);
    // Return the user to the cart
    setTimeout(() => setDrawerOpen(true), 200);
  };

  const handleCheckout = () => {
    if (items.length === 0) return;
    setDrawerOpen(false);
    // Small delay to let drawer close animation finish
    setTimeout(() => {
      window.location.href = "/checkout-summary";
    }, 300);
  };

  const handleMemberCheckout = async () => {
    if (items.length === 0) return;
    setDrawerOpen(false);

    // Validate the session against the auth server — a stale local token
    // must NOT count as signed in (that made this behave like guest checkout).
    let signedIn = false;
    try {
      const { data, error } = await supabase.auth.getUser();
      signedIn = !error && !!data.user;
    } catch {
      signedIn = false;
    }
    if (!signedIn) {
      // Clear any stale token so the login page doesn't auto-redirect
      await supabase.auth.signOut({ scope: "local" }).catch(() => {});
    }

    const target = signedIn
      ? "/checkout-summary?member=1"
      : `/members/login?redirect=${encodeURIComponent("/checkout-summary?member=1")}`;
    setTimeout(() => {
      // Cart lives in localStorage, so it survives this navigation
      window.location.href = target;
    }, 300);
  };








  return (
    <>
      <Sheet open={isDrawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent 
          className="w-full sm:max-w-md flex flex-col p-6 pb-0" 
          style={{ 
            position: 'fixed', 
            top: 0, 
            right: 0, 
            bottom: 0, 
            height: '100dvh', 
            maxHeight: '100dvh',
            overflow: 'hidden',
          }}
        >
          <SheetHeader className="shrink-0">
            <SheetTitle className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Your Cart ({itemCount})
            </SheetTitle>
          </SheetHeader>

          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4 min-h-0">
              <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground font-medium">Your cart is empty</p>
              <p className="text-sm text-muted-foreground mt-1">Add tours and activities to get started</p>
              <Button
                variant="outline"
                className="mt-6"
                onClick={() => setDrawerOpen(false)}
                asChild
              >
                <Link to="/tours">
                  <Plus className="w-4 h-4 mr-2" />
                  Browse Tours
                </Link>
              </Button>
            </div>
          ) : (
            <>
              {/* Scrollable Body — items + upsell */}
              <div className="flex-1 min-h-0 overflow-y-auto py-3" style={{ WebkitOverflowScrolling: 'touch' as any }}>
                <div className="space-y-2">
                  {items.map((item) => (
                    <CartItemCard
                      key={item.id}
                      item={item}
                      onRemove={() => removeItem(item.id)}
                      onEdit={() => handleEdit(item)}
                    />
                  ))}
                </div>

                {/* Upsell section — inside scroll area */}
                <div className="border-t border-dashed pt-2 pb-1 mt-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Complete your trip
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-[10px] flex-1 justify-start gap-1.5 h-auto py-1 px-1.5"
                      onClick={() => setDrawerOpen(false)}
                      asChild
                    >
                      <Link to="/tours">
                        <UpsellThumb src={media("/tour-images/snorkeling-adventure-cover.jpg")} />
                        <span className="flex items-center gap-1">
                          <Plus className="w-2.5 h-2.5" />
                          Add more tours
                        </span>
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-[10px] flex-1 justify-start gap-1.5 h-auto py-1 px-1.5"
                      onClick={() => setDrawerOpen(false)}
                      asChild
                    >
                      <Link to="/activities/transportation">
                        <UpsellThumb src={media("/tour-images/extreme-adventuring-cover.jpg")} />
                        <span className="flex items-center gap-1">
                          <ArrowRight className="w-2.5 h-2.5" />
                          Add transport
                        </span>
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Sticky Footer */}
              <div className="shrink-0 pt-1 pb-0 space-y-0.5 mt-auto">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sm">Total</span>
                  <span className="text-lg font-bold text-primary">
                    ${totalPrice.toLocaleString()} USD
                  </span>
                </div>
                <Button
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className="w-full h-8 text-[11px] font-semibold gap-1 py-0"
                >
                  {isLoading ? (
                    "Processing..."
                  ) : (
                    <>
                      <CreditCard className="w-3 h-3" />
                      Guest Checkout ({itemCount} item{itemCount !== 1 ? "s" : ""})
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleMemberCheckout}
                  className="w-full h-8 text-[11px] font-semibold gap-1 py-0 bg-[#1d2839] text-[#f7f6f3] hover:bg-[#1d2839]/90 border border-[#c9a962]"
                >
                  <UserRound className="w-3 h-3 text-[#c9a962]" />
                  Member Checkout
                </Button>

                <ShareCartControl compact />


                <button
                  onClick={clearCart}
                  className="w-full text-[11px] text-muted-foreground hover:text-destructive transition-colors text-center py-0.5"
                >
                  Clear cart
                </button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Edit modal rendered outside Sheet to avoid z-index issues */}
      {editingItem && (
        <CartItemEditModal
          item={editingItem}
          open={!!editingItem}
          onClose={closeEditModal}
          onSave={(id, updates) => {
            updateItem(id, updates);
            toast.success("Cart item updated");
          }}
        />
      )}
    </>
  );
}
