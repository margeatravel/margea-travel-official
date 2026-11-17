// Flight pricing utilities with IVA (16%) and dynamic deposit calculations
import type { DepositRule, DepositType } from '@/data/flights-data';

export interface FlightPricing {
  subtotal_usd: number;    // Margea price (operator * 1.15)
  iva_usd: number;         // 16% of subtotal
  total_usd: number;       // subtotal + IVA
  deposit_usd: number;     // Dynamic based on deposit rule
  balance_due_usd: number; // total - deposit
  // Deposit rule details for Stripe metadata
  deposit_type: DepositType;
  deposit_percent?: number;
  deposit_fixed_usd?: number;
  deposit_min_usd?: number;
}

// Default deposit rule: 25%
const DEFAULT_DEPOSIT_RULE: DepositRule = {
  deposit_type: 'percent',
  deposit_percent: 0.25,
};

/**
 * Calculate deposit amount based on deposit rule
 */
function calculateDeposit(total_usd: number, rule: DepositRule): number {
  let deposit_usd: number;
  
  switch (rule.deposit_type) {
    case 'percent':
      deposit_usd = Math.round(total_usd * (rule.deposit_percent || 0.25));
      break;
    
    case 'fixed':
      deposit_usd = rule.deposit_fixed_usd || 0;
      break;
    
    case 'percent_with_min':
      const percentDeposit = Math.round(total_usd * (rule.deposit_percent || 0.25));
      deposit_usd = Math.max(percentDeposit, rule.deposit_min_usd || 0);
      break;
    
    default:
      deposit_usd = Math.round(total_usd * 0.25);
  }
  
  // Clamp: deposit cannot exceed total
  return Math.min(deposit_usd, total_usd);
}

/**
 * Calculate full pricing breakdown for a flight using the Margea price and deposit rule
 * @param margea_price_usd - The public Margea price (already includes 15% markup)
 * @param depositRule - Optional deposit rule (defaults to 25%)
 * @returns Complete pricing breakdown
 */
export function calculateFlightPricingWithRule(
  margea_price_usd: number, 
  depositRule?: DepositRule
): FlightPricing {
  const rule = depositRule || DEFAULT_DEPOSIT_RULE;
  
  // Subtotal = Margea price (already marked up)
  const subtotal_usd = margea_price_usd;
  
  // IVA = 16% of subtotal
  const iva_usd = Math.round(subtotal_usd * 0.16);
  
  // Total = subtotal + IVA
  const total_usd = subtotal_usd + iva_usd;
  
  // Calculate deposit based on rule
  const deposit_usd = calculateDeposit(total_usd, rule);
  
  // Balance = total - deposit
  const balance_due_usd = total_usd - deposit_usd;
  
  return {
    subtotal_usd,
    iva_usd,
    total_usd,
    deposit_usd,
    balance_due_usd,
    deposit_type: rule.deposit_type,
    deposit_percent: rule.deposit_percent,
    deposit_fixed_usd: rule.deposit_fixed_usd,
    deposit_min_usd: rule.deposit_min_usd,
  };
}

/**
 * @deprecated Use calculateFlightPricingWithRule instead for dynamic deposits
 * Calculate full pricing breakdown for a flight (legacy - assumes 25% deposit)
 * @param operator_price_usd - The internal operator price
 * @returns Complete pricing breakdown
 */
export function calculateFlightPricing(operator_price_usd: number): FlightPricing {
  // Subtotal = operator price * 1.15 (15% markup)
  const subtotal_usd = Math.round(operator_price_usd * 1.15);
  
  // IVA = 16% of subtotal
  const iva_usd = Math.round(subtotal_usd * 0.16);
  
  // Total = subtotal + IVA
  const total_usd = subtotal_usd + iva_usd;
  
  // Deposit = 25% of total (legacy default)
  const deposit_usd = Math.round(total_usd * 0.25);
  
  // Balance = total - deposit
  const balance_due_usd = total_usd - deposit_usd;
  
  return {
    subtotal_usd,
    iva_usd,
    total_usd,
    deposit_usd,
    balance_due_usd,
    deposit_type: 'percent',
    deposit_percent: 0.25,
  };
}

/**
 * @deprecated Use calculateFlightPricingWithRule instead for dynamic deposits
 * Get pricing from margea_price_usd (already marked up) - legacy 25% deposit
 * @param margea_price_usd - The public Margea price (already includes 15% markup)
 * @returns Complete pricing breakdown
 */
export function calculateFlightPricingFromMargeaPrice(margea_price_usd: number): FlightPricing {
  return calculateFlightPricingWithRule(margea_price_usd);
}
