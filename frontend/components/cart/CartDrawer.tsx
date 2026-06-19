'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cart';
import { Button } from '@/components/ui/Button';
import { COPY } from '@/data/copy';
import { formatSar } from '@/lib/price';
import { PRODUCTS, PRODUCT_ONE_LINERS } from '@/data/products';
import { cn } from '@/lib/cn';
import { trackInitiateCheckout, type CartItem } from '@/lib/analytics';
import type { CartLine } from '@/lib/types';

export function CartDrawer() {
  const { lines, isCartOpen, closeCart, removeLine, setTier, openCheckout, totalSar } =
    useCartStore();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  // Trap focus and close on Escape
  useEffect(() => {
    if (!isCartOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    window.addEventListener('keydown', onKey);
    drawerRef.current?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [isCartOpen, closeCart]);

  const total = totalSar();

  // Products NOT in cart → cross-sell candidates
  const crossSells = PRODUCTS.filter((p) => !lines.find((l) => l.productId === p.slug)).slice(0, 2);

  // Guard against duplicate InitiateCheckout events if user clicks the button twice
  const checkoutTracked = useRef(false);

  const handleCheckout = () => {
    if (!checkoutTracked.current) {
      checkoutTracked.current = true;
      const cartItems: CartItem[] = lines.map((l: CartLine) => ({
        slug: l.productId,
        quantity: l.quantity,
        unitPrice: l.unitPrice,
      }));
      trackInitiateCheckout(total, cartItems);
    }
    openCheckout();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-[80] bg-charcoal/40 backdrop-blur-sm transition-opacity duration-300',
          isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="سلة التسوق"
        tabIndex={-1}
        className={cn(
          'fixed inset-y-0 start-0 z-[90] w-full max-w-[400px]',
          'bg-ivory flex flex-col shadow-2xl',
          'transition-transform duration-300 ease-out',
          'focus:outline-none',
          isCartOpen ? 'translate-x-0' : '-translate-x-full rtl:translate-x-full',
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-200">
          <h2 className="font-tajawal font-bold text-lg text-emerald">
            {COPY.CART.TITLE}
          </h2>
          <button
            onClick={closeCart}
            className="p-2 rounded-full hover:bg-stone-100 transition-colors focus-visible:ring-2 focus-visible:ring-emerald"
            aria-label="إغلاق السلة"
          >
            <svg className="w-5 h-5 text-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
          {lines.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 py-12 text-center">
              <svg className="w-16 h-16 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              <p className="font-tajawal text-charcoal/60">{COPY.CART.EMPTY}</p>
              <Button variant="outline" size="sm" onClick={closeCart} asChild>
                <Link href="/collection">{COPY.CART.CONTINUE_SHOPPING}</Link>
              </Button>
            </div>
          ) : (
            <>
              {/* Cart lines */}
              <ul className="flex flex-col gap-3" role="list">
                {lines.map((line) => (
                  <CartLineItem
                    key={line.productId}
                    line={line}
                    onRemove={() => removeLine(line.productId)}
                    onTierChange={(t) => setTier(line.productId, t)}
                  />
                ))}
              </ul>

              {/* Cross-sells */}
              {crossSells.length > 0 && (
                <div className="border-t border-stone-200 pt-4">
                  <p className="font-tajawal text-sm font-semibold text-emerald mb-3">
                    {COPY.CART.CROSS_SELL_HEADING}
                  </p>
                  <div className="flex flex-col gap-2">
                    {crossSells.map((p) => (
                      <CrossSellItem key={p.slug} slug={p.slug} nameAr={p.nameAr} oneLine={PRODUCT_ONE_LINERS[p.slug] ?? ''} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer CTA */}
        {lines.length > 0 && (
          <div className="p-5 border-t border-stone-200 bg-ivory">
            <div className="flex items-center justify-between mb-4">
              <span className="font-tajawal font-medium text-charcoal">{COPY.CART.SUBTOTAL}</span>
              <span className="font-tajawal font-bold text-emerald text-lg">
                {formatSar(total)}
              </span>
            </div>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleCheckout}
            >
              {COPY.CART.CHECKOUT_CTA}
            </Button>
            <p className="mt-2 text-center font-tajawal text-xs text-charcoal/60">
              {COPY.CART.COD_NOTE}
            </p>
          </div>
        )}
      </div>
    </>
  );
}

function CartLineItem({
  line,
  onRemove,
  onTierChange,
}: {
  line: CartLine;
  onRemove: () => void;
  onTierChange: (t: 1 | 2 | 3) => void;
}) {
  const tiers: { tier: 1 | 2 | 3; label: string; price: number }[] = [
    { tier: 1, label: 'علبة', price: 199 },
    { tier: 2, label: 'الزوجي', price: 279 },
    { tier: 3, label: 'Glow Kit', price: 349 },
  ];

  return (
    <li className="flex gap-3 p-3 bg-white rounded-xl border border-stone-200">
      <div className="w-16 h-16 rounded-lg bg-stone-100 overflow-hidden shrink-0 relative">
        <Image
          src={line.imageUrl || `/images/products/${line.productId}/cover.webp`}
          alt={line.nameAr}
          fill
          className="object-cover"
          sizes="64px"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="font-tajawal font-semibold text-sm text-emerald truncate">
            {line.nameAr}
          </p>
          <button
            onClick={onRemove}
            className="text-charcoal/40 hover:text-red-500 transition-colors shrink-0 p-0.5"
            aria-label={`حذف ${line.nameAr}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tier selector */}
        <div className="flex gap-1 mt-2">
          {tiers.map(({ tier, label }) => (
            <button
              key={tier}
              onClick={() => onTierChange(tier)}
              className={cn(
                'px-2 py-0.5 rounded-md text-[10px] font-tajawal font-medium transition-colors border',
                line.tier === tier
                  ? 'bg-emerald text-ivory border-emerald'
                  : 'bg-transparent text-charcoal/60 border-stone-200 hover:border-emerald/50',
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <p className="font-tajawal font-bold text-sm text-emerald mt-1.5">
          {formatSar(line.totalPrice)}
        </p>
      </div>
    </li>
  );
}

function CrossSellItem({
  slug,
  nameAr,
  oneLine,
}: {
  slug: string;
  nameAr: string;
  oneLine: string;
}) {
  const { addLine } = useCartStore();

  const handleAdd = () => {
    addLine({
      productId: slug,
      nameAr,
      tier: 3,
      quantity: 3,
      unitPrice: 349 / 3,
      imageUrl: `/images/products/${slug}/cover.webp`,
      offerCode: 'T3',
    });
  };

  return (
    <div className="flex items-center gap-3 p-2.5 bg-stone-50 rounded-lg border border-stone-200">
      <div className="w-10 h-10 rounded-md bg-stone-100 overflow-hidden relative shrink-0">
        <Image
          src={`/images/products/${slug}/cover.webp`}
          alt={nameAr}
          fill
          className="object-cover"
          sizes="40px"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-tajawal font-semibold text-xs text-emerald">{nameAr}</p>
        <p className="font-tajawal text-[10px] text-charcoal/60 truncate">{oneLine}</p>
      </div>
      <button
        onClick={handleAdd}
        className="shrink-0 w-7 h-7 rounded-full bg-emerald text-ivory flex items-center justify-center hover:bg-emerald/90 transition-colors"
        aria-label={`أضيفي ${nameAr}`}
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}
