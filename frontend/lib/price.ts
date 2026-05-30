import type { CartLine } from './types';

export const TIER_PRICES: Record<1 | 2 | 3, { quantity: number; priceSar: number; labelAr: string }> = {
  1: { quantity: 1, priceSar: 199, labelAr: 'علبة' },
  2: { quantity: 2, priceSar: 279, labelAr: 'الزوجي' },
  3: { quantity: 3, priceSar: 349, labelAr: 'Glow Kit (الأنصح)' },
};

/** Kept for backward-compat */
export const OFFER_MAP = {
  T1: { quantity: 1, priceSar: 199, labelAr: 'علبة' },
  T2: { quantity: 2, priceSar: 279, labelAr: 'الزوجي' },
  T3: { quantity: 3, priceSar: 349, labelAr: 'Glow Kit (الأنصح)' },
} as const;

const TIER_TO_CODE: Record<1 | 2 | 3, 'T1' | 'T2' | 'T3'> = { 1: 'T1', 2: 'T2', 3: 'T3' };

export function recomputeLineForTier(line: CartLine, tier: 1 | 2 | 3): CartLine {
  const tierData = TIER_PRICES[tier];
  return {
    ...line,
    tier,
    offerCode: TIER_TO_CODE[tier],
    quantity: tierData.quantity,
    unitPrice: tierData.priceSar / tierData.quantity,
    totalPrice: tierData.priceSar,
  };
}

export function formatSar(amount: number): string {
  return `${amount.toLocaleString('en-US')} ريال سعودي`;
}

export function formatSarLatin(amount: number): string {
  return `${amount.toLocaleString('en-US')} SAR`;
}

export function formatNumber(value: number): string {
  return value.toLocaleString('en-US');
}
