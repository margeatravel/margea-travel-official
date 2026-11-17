import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

export interface CartItem {
  id: string; // unique key: `${tourId}-${variantId}-${date}-${time}`
  tourId: string;
  tourTitle: string;
  variantId: string;
  variantTitle: string;
  date: string;
  time: string;
  adults: number;
  children: number;
  adultPrice: number;
  childPrice: number | null;
  currency: "USD" | "MXN";
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<CartItem>) => void;
  clearCart: () => void;
  itemCount: number;
  totalPrice: number;
  isDrawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "margea-cart";

function generateItemId(item: Omit<CartItem, "id">): string {
  return `${item.tourId}-${item.variantId}-${item.date}-${item.time}`;
}

function loadCart(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((item: Omit<CartItem, "id">) => {
    const id = generateItemId(item);
    setItems((prev) => {
      // If same tour+variant+date+time exists, update quantities
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) =>
          i.id === id
            ? { ...i, adults: item.adults, children: item.children }
            : i
        );
      }
      return [...prev, { ...item, id }];
    });
    setDrawerOpen(true);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<CartItem>) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...updates } : i)));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = items.length;

  const totalPrice = items.reduce((sum, item) => {
    const adultTotal = item.adults * item.adultPrice;
    const childTotal = item.children * (item.childPrice || 0);
    return sum + adultTotal + childTotal;
  }, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateItem, clearCart, itemCount, totalPrice, isDrawerOpen, setDrawerOpen }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
