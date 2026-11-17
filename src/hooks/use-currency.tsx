import { createContext, useContext, ReactNode } from "react";

interface CurrencyContextType {
  formatPrice: (priceInMXN: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const formatPrice = (price: number): string => {
    const formattedNumber = Math.round(price).toLocaleString('es-MX');
    return `$${formattedNumber} MXN`;
  };

  return (
    <CurrencyContext.Provider value={{ formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
