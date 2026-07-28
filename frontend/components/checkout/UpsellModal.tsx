'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart';
import { PRODUCTS } from '@/data/products';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { COPY } from '@/data/copy';
import { formatSar } from '@/lib/price';
import { showToast } from '@/components/ui/Toast';
import { cn } from '@/lib/cn';

const COUNTDOWN_SECONDS = 30;

// Tiered upsell config: what to offer based on what they already bought
const UPSELL_CONFIG: Record<string, { addQty: number; addPrice: number; headline: (m: (a:string,b:string)=>string) => string; sub: (m: (a:string,b:string)=>string) => string }> = {
  T1: {
    addQty: 2,
    addPrice: 100,
    headline: (m) => m('أضف علبتين وكمّل كورس شهر كامل', 'أضيفي علبتين وكمّلي كورس شهر كامل'),
    sub: (m) => m('بـ 100 ريال فقط — يوصلك مع نفس الطلب بدون شحن زيادة', 'بـ 100 ريال فقط — يوصلكِ مع نفس الطلب بدون شحن زيادة'),
  },
  T2: {
    addQty: 3,
    addPrice: 150,
    headline: (m) => m('أضف 3 علب وكمّل كورس شهرين كاملين', 'أضيفي 3 علب وكمّلي كورس شهرين كاملين'),
    sub: (m) => m('بـ 150 ريال فقط — يوصلك مع نفس الطلب بدون شحن زيادة', 'بـ 150 ريال فقط — يوصلكِ مع نفس الطلب بدون شحن زيادة'),
  },
  T3: { addQty: 0, addPrice: 0, headline: () => '', sub: () => '' },
};

export function UpsellModal() {
  const { isUpsellOpen, closeUpsell, lastOrderId, upsellToken, upsellSku, clearCart, lines } = useCartStore();
  const router = useRouter();

  // Determine gender from cart product (the actual product ordered)
  const cartProduct = PRODUCTS.find((p) => p.slug === lines[0]?.productId);
  const isMasc = cartProduct?.genderMasculine ?? false;
  const m = (masculine: string, feminine: string) => isMasc ? masculine : feminine;

  // Determine which tier was ordered
  const orderedTier = lines[0]?.offerCode ?? 'T2';
  const upsellCfg = UPSELL_CONFIG[orderedTier] ?? UPSELL_CONFIG['T2'];
  const isShilajit = lines[0]?.productId === 'habba-shilajit';
  const upsellPrice = upsellCfg.addPrice;
  const [seconds, setSeconds] = useState(COUNTDOWN_SECONDS);
  const [accepting, setAccepting] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const acceptedRef = useRef(false);

  const handleExpire = useCallback(() => {
    clearCart();
    closeUpsell();
    router.push('/thank-you');
  }, [clearCart, closeUpsell, router]);

  useEffect(() => {
    if (!isUpsellOpen) {
      setSeconds(COUNTDOWN_SECONDS);
      acceptedRef.current = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    setSeconds(COUNTDOWN_SECONDS);
    intervalRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current!);
          handleExpire();
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isUpsellOpen, handleExpire]);

  const handleDecline = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    handleExpire();
  };

  const handleAccept = async () => {
    if (acceptedRef.current || accepting) return;
    if (!lastOrderId || !upsellToken) return;
    acceptedRef.current = true;
    if (intervalRef.current) clearInterval(intervalRef.current);

    setAccepting(true);
    try {
      if (upsellToken !== 'preview-upsell-token') {
        const res = await fetch(`/api/orders/${lastOrderId}/upsell`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'X-Upsell-Token': upsellToken,
          },
          body: JSON.stringify({ token: upsellToken, sku: upsellSku ?? '' }),
        });

        if (!res.ok) {
          throw new Error(COPY.UPSELL.ERROR);
        }
      }

      showToast(COPY.UPSELL.SUCCESS_TOAST, 'success');
    } catch {
      showToast(COPY.UPSELL.ERROR, 'error');
    } finally {
      setAccepting(false);
      clearCart();
      closeUpsell();
      router.push('/thank-you');
    }
  };

  const progressPct = ((COUNTDOWN_SECONDS - seconds) / COUNTDOWN_SECONDS) * 100;

  // T3 buyers get no upsell — skip straight to thank-you
  if (isUpsellOpen && orderedTier === 'T3') {
    handleDecline();
  }

  const normalPricePerBottle = cartProduct?.offers.find((o) => o.code === 'T1')?.priceSar ?? 199;
  const normalTotal = upsellCfg.addQty * normalPricePerBottle;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm transition-opacity duration-300',
          isUpsellOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        aria-hidden="true"
      />

      <div
        className={cn(
          'fixed inset-0 z-[130] flex items-end justify-center sm:items-center p-0 sm:p-4',
          isUpsellOpen ? 'pointer-events-auto' : 'pointer-events-none',
        )}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-label={COPY.UPSELL.MODAL_TITLE}
          className={cn(
            'w-full max-w-md overflow-hidden bg-white shadow-2xl',
            'rounded-t-[32px] sm:rounded-[32px]',
            'transition-all duration-300',
            isUpsellOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
          )}
        >
          {/* Progress bar */}
          <div className="h-1.5 bg-stone-100 relative overflow-hidden">
            <div
              className="absolute inset-y-0 start-0 bg-saffron transition-all duration-1000 ease-linear"
              style={{ width: `${progressPct}%` }}
              aria-hidden="true"
            />
          </div>

          {/* Header */}
          <div className="bg-emerald px-5 pt-4 pb-5 relative overflow-hidden">
            <div className="absolute -top-6 -start-6 h-24 w-24 rounded-full bg-saffron/15 blur-2xl" />
            <div className="flex items-center justify-between relative">
              <div>
                <p className="font-tajawal text-[11px] font-bold text-saffron mb-0.5">⚡ عرض لمرة واحدة فقط</p>
                <h2 className="font-tajawal text-lg font-black text-white leading-snug max-w-[220px]">
                  {upsellCfg.headline(m)}
                </h2>
              </div>
              {/* Countdown */}
              <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-full bg-saffron shadow-lg">
                <span className="font-tajawal text-xl font-black text-emerald leading-none">{seconds}</span>
                <span className="font-tajawal text-[9px] font-bold text-emerald/70 leading-none">ثانية</span>
              </div>
            </div>
            <p className="mt-2 font-tajawal text-sm text-white/70 relative">{upsellCfg.sub(m)}</p>
          </div>

          {/* Product + price */}
          <div className="flex items-center gap-4 px-5 py-4 border-b border-stone-100">
            {/* Bottle image */}
            <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-2xl bg-stone-50">
              <Image
                src={isShilajit ? '/images/products/habba-shilajit/bottle.webp' : `/images/products/${upsellSku || 'habba-bareeq'}/cover.webp`}
                alt="المنتج"
                fill
                className="object-contain p-1"
                sizes="64px"
              />
            </div>
            <div className="flex-1">
              <p className="font-tajawal text-sm font-black text-charcoal">{cartProduct?.nameAr ?? 'المنتج'}</p>
              <p className="font-tajawal text-[11px] text-charcoal/55 mt-0.5">
                {upsellCfg.addQty} {m('علب إضافية', 'علب إضافية')} · {m('توصّل معك', 'توصّل معكِ')} بدون رسوم
              </p>
            </div>
            <div className="shrink-0 text-left">
              <p className="font-tajawal text-2xl font-black text-emerald leading-none">{upsellPrice}</p>
              <p className="font-tajawal text-[11px] font-bold text-emerald/60">ر.س</p>
              {normalTotal > upsellPrice && (
                <p className="font-tajawal text-[10px] text-charcoal/35 line-through">{normalTotal} ر.س</p>
              )}
            </div>
          </div>

          {/* Savings highlight */}
          <div className="mx-5 mt-3 rounded-2xl bg-saffron/10 border border-saffron/30 px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">💰</span>
              <p className="font-tajawal text-sm font-bold text-charcoal">
                {m('توفّر', 'توفّري')} {normalTotal - upsellPrice} ر.س مقارنة بالشراء لاحقاً
              </p>
            </div>
            <Badge variant="saffron">{Math.round(((normalTotal - upsellPrice) / normalTotal) * 100)}%</Badge>
          </div>

          <div className="flex flex-col gap-3 px-5 pb-5 pt-3">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              loading={accepting}
              onClick={handleAccept}
              className="h-14 text-base font-black touch-manipulation select-none shadow-lg shadow-emerald/25"
            >
              {m(`أضفها لطلبي · ${formatSar(upsellPrice)}`, `أضيفيها لطلبي · ${formatSar(upsellPrice)}`)} 🔒
            </Button>

            <button
              onClick={handleDecline}
              disabled={accepting}
              className="w-full py-2 text-center font-tajawal text-xs text-charcoal/40 transition-colors hover:text-charcoal/70 disabled:opacity-40 touch-manipulation"
            >
              {m('لا شكرًا، أكمل طلبي بدون العرض', 'لا شكرًا، أكملي طلبي بدون العرض')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
