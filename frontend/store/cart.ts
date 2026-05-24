/**
 * Zustand cart store — single source of truth for the shopping cart.
 * Follows the contract in docs/09-frontend-architecture.md § Zustand cart store.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { recomputeLineForTier } from '@/lib/price';
import type { CartLine } from '@/lib/types';

interface CartState {
  lines: CartLine[];
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  isUpsellOpen: boolean;
  lastOrderId: string | null;
  upsellToken: string | null;
  upsellSku: string | null;

  addLine: (line: Omit<CartLine, 'totalPrice'>) => void;
  removeLine: (productId: string) => void;
  setTier: (productId: string, tier: 1 | 2 | 3) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  openUpsell: (orderId: string, token: string, sku: string) => void;
  closeUpsell: () => void;
  totalSar: () => number;
  totalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      isCartOpen: false,
      isCheckoutOpen: false,
      isUpsellOpen: false,
      lastOrderId: null,
      upsellToken: null,
      upsellSku: null,

      addLine: (incoming) => {
        set((state) => {
          const existing = state.lines.find((l) => l.productId === incoming.productId);
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.productId === incoming.productId
                  ? { ...l, tier: incoming.tier, quantity: incoming.quantity, totalPrice: incoming.unitPrice * incoming.quantity }
                  : l,
              ),
            };
          }
          return {
            lines: [
              ...state.lines,
              {
                ...incoming,
                totalPrice: incoming.unitPrice * incoming.quantity,
              },
            ],
          };
        });
      },

      removeLine: (productId) => {
        set((state) => ({
          lines: state.lines.filter((l) => l.productId !== productId),
        }));
      },

      setTier: (productId, tier) => {
        set((state) => ({
          lines: state.lines.map((l) => {
            if (l.productId !== productId) return l;
            return recomputeLineForTier(l, tier);
          }),
        }));
      },

      clearCart: () => set({ lines: [] }),

      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      openCheckout: () => set({ isCheckoutOpen: true, isCartOpen: false }),
      closeCheckout: () => set({ isCheckoutOpen: false }),
      openUpsell: (orderId, token, sku) =>
        set({ isUpsellOpen: true, isCheckoutOpen: false, lastOrderId: orderId, upsellToken: token, upsellSku: sku }),
      closeUpsell: () => set({ isUpsellOpen: false }),

      totalSar: () => get().lines.reduce((sum, l) => sum + l.totalPrice, 0),
      totalItems: () => get().lines.reduce((sum, l) => sum + l.quantity, 0),
    }),
    {
      name: 'raheeq-cart',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        lines: state.lines,
        lastOrderId: state.lastOrderId,
        upsellToken: state.upsellToken,
        upsellSku: state.upsellSku,
      }),
    },
  ),
);
