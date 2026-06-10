/**
 * Zustand cart store — single source of truth for the shopping cart.
 * Follows the contract in docs/09-frontend-architecture.md § Zustand cart store.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { recomputeLineForTier } from '@/lib/price';
import { PRODUCTS } from '@/data/products';
import type { CartLine, OfferCode } from '@/lib/types';

interface CartState {
  lines: CartLine[];
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  isUpsellOpen: boolean;
  lastOrderId: string | null;
  lastOrderCustomer: { name: string; phone: string } | null;
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
  openUpsell: (orderId: string, token: string, sku: string, customer?: { name: string; phone: string }) => void;
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
      lastOrderCustomer: null,
      upsellToken: null,
      upsellSku: null,

      addLine: (incoming) => {
        set((state) => {
          const existing = state.lines.find((l) => l.productId === incoming.productId);
          if (existing) {
          return {
            lines: state.lines.map((l) =>
              l.productId === incoming.productId
                ? { ...l, tier: incoming.tier, offerCode: incoming.offerCode, quantity: incoming.quantity, unitPrice: incoming.unitPrice, totalPrice: incoming.unitPrice * incoming.quantity }
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
            // Prefer the product's own offers (handles bundle SKU with custom prices)
            const product = PRODUCTS.find((p) => p.slug === productId);
            const offerCode = `T${tier}` as OfferCode;
            const productOffer = product?.offers.find((o) => o.code === offerCode);
            if (productOffer) {
              return {
                ...l,
                tier,
                offerCode: productOffer.code,
                quantity: productOffer.quantity,
                unitPrice: productOffer.priceSar / productOffer.quantity,
                totalPrice: productOffer.priceSar,
              };
            }
            return recomputeLineForTier(l, tier);
          }),
        }));
      },

      clearCart: () => set({ lines: [] }),

      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      openCheckout: () => set({ isCheckoutOpen: true, isCartOpen: false }),
      closeCheckout: () => set({ isCheckoutOpen: false }),
      openUpsell: (orderId, token, sku, customer) =>
        set({ isUpsellOpen: true, isCheckoutOpen: false, lastOrderId: orderId, upsellToken: token, upsellSku: sku, ...(customer ? { lastOrderCustomer: customer } : {}) }),
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
        lastOrderCustomer: state.lastOrderCustomer,
        upsellToken: state.upsellToken,
        upsellSku: state.upsellSku,
      }),
    },
  ),
);
