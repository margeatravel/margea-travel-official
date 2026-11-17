import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function FloatingCartButton() {
  const { itemCount, setDrawerOpen } = useCart();

  if (itemCount === 0) return null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={() => setDrawerOpen(true)}
          aria-label={`Shopping cart with ${itemCount} items`}
          className="fixed bottom-24 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:scale-100"
        >
          <ShoppingCart className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs font-bold">
            {itemCount}
          </span>
        </button>
      </TooltipTrigger>
      <TooltipContent side="left" className="bg-foreground text-background">
        View Cart
      </TooltipContent>
    </Tooltip>
  );
}
