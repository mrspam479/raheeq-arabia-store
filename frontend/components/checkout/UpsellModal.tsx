'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart';
import { PRODUCTS } from '@/data/products';
import { Button } from '@/components/ui/Button';
import { showToast } from '@/components/ui/Toast';
import { COPY } from '@/data/copy';
import { cn } from '@/lib/cn';

const COUNTDOWN_SECONDS = 25;

// Flat upsell: 2 extra bottles for 99 SAR
// Cost: ~26 SAR/bottle × 2 = 52 SAR → profit: 47 SAR ✅
const UPSELL_ADD_PRICE = 99;
const UPSELL_NORMAL_PRICE = 398; // 2 × T1 price (199 SAR each)
const SAVINGS = UPSELL_NORMAL_PRICE - UPSELL_ADD_PRICE; // 299 SAR

export function UpsellModal() {
  const {
    isUpsellOpen, closeUpsell, lastOrderId, upsellToken, upsellSku,
    clearCart, lines, lastOrderSummary, setLastOrderSummary,
  } = useCartStore();
  const router = useRouter();

  const cartProduct = PRODUCTS.find((p) => p.slug === lines[0]?.productId);
  const isMasc = cartProduct?.genderMasculine ?? false;
  const m = (masculine: string, feminine: string) => (isMasc ? masculine : feminine);

  const isShilajit = lines[0]?.productId === 'habba-shilajit';
  const orderedTier = lines[0]?.offerCode ?? 'T2';

  // Compute early so handleAccept can reference them before the mounted guard
  const bottleImgEarly = isShilajit
    ? '/images/products/habba-shilajit/bottle.webp'
    : `/images/products/${upsellSku || 'habba-bareeq'}/cover.webp`;
  const productShortNameEarly = isShilajit ? 'الشلاجيت' : (cartProduct?.nameAr ?? 'المنتج');

  const [mounted, setMounted] = useState(false);
  const [seconds, setSeconds] = useState(COUNTDOWN_SECONDS);
  const [accepting, setAccepting] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const acceptedRef = useRef(false);

  const handleExpire = useCallback(() => {
    clearCart();
    closeUpsell();
    router.push('/thank-you');
  }, [clearCart, closeUpsell, router]);

  const handleDecline = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    clearCart();
    closeUpsell();
    router.push('/thank-you');
  }, [clearCart, closeUpsell, router]);

  useEffect(() => { setMounted(true); }, []);

  // T3 buyers already have max supply — skip upsell immediately (in effect, not render)
  useEffect(() => {
    if (isUpsellOpen && orderedTier === 'T3') {
      handleDecline();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpsellOpen, orderedTier]);

  useEffect(() => {
    if (!isUpsellOpen || orderedTier === 'T3') {
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
  }, [isUpsellOpen, orderedTier, handleExpire]);

  const handleAccept = async () => {
    if (acceptedRef.current || accepting) return;
    acceptedRef.current = true;
    if (intervalRef.current) clearInterval(intervalRef.current);

    // Call upsell API only when we have a real server token
    const hasRealToken = upsellToken && upsellToken !== 'preview-upsell-token';
    if (hasRealToken && lastOrderId) {
      setAccepting(true);
      try {
        const res = await fetch(`/api/orders/${lastOrderId}/upsell`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'X-Upsell-Token': upsellToken,
          },
          body: JSON.stringify({ token: upsellToken, sku: upsellSku ?? '' }),
        });
        if (!res.ok) throw new Error(COPY.UPSELL.ERROR);
        showToast(COPY.UPSELL.SUCCESS_TOAST, 'success');
      } catch {
        showToast(COPY.UPSELL.ERROR, 'error');
      } finally {
        setAccepting(false);
      }
    } else if (upsellToken === 'preview-upsell-token') {
      showToast(COPY.UPSELL.SUCCESS_TOAST, 'success');
    }

    // Append upsell line to the receipt so thank-you page shows the full order
    if (lastOrderSummary) {
      setLastOrderSummary({
        ...lastOrderSummary,
        lines: [
          ...lastOrderSummary.lines,
          {
            productId: lines[0]?.productId ?? 'habba-shilajit',
            nameAr: `${productShortNameEarly} — عرض خاص × ٢`,
            imageUrl: bottleImgEarly,
            quantity: 2,
            totalPrice: UPSELL_ADD_PRICE,
          },
        ],
        totalSar: lastOrderSummary.totalSar + UPSELL_ADD_PRICE,
      });
    }

    // Always navigate — regardless of token presence
    clearCart();
    closeUpsell();
    router.push('/thank-you');
  };

  if (!mounted) return null;

  const progressPct = ((COUNTDOWN_SECONDS - seconds) / COUNTDOWN_SECONDS) * 100;
  const bottleImg = isShilajit
    ? '/images/products/habba-shilajit/bottle.webp'
    : `/images/products/${upsellSku || 'habba-bareeq'}/cover.webp`;
  const productShortName = isShilajit ? 'الشلاجيت' : (cartProduct?.nameAr ?? 'المنتج');

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-[120] bg-black/70 backdrop-blur-sm transition-opacity duration-300',
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
            'w-full max-w-sm overflow-hidden bg-white shadow-2xl',
            'rounded-t-[28px] sm:rounded-[28px]',
            'transition-all duration-300',
            isUpsellOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
          )}
          dir="rtl"
        >
          {/* ── Countdown progress bar ── */}
          <div className="h-1.5 bg-stone-200 relative overflow-hidden">
            <div
              className="absolute inset-y-0 start-0 bg-red-500 transition-all duration-1000 ease-linear"
              style={{ width: `${progressPct}%` }}
              aria-hidden="true"
            />
          </div>

          {/* ── Dark header — maximum contrast ── */}
          <div className="bg-[#0A2A1A] px-5 pt-5 pb-5 text-center">
            {/* Timer pill */}
            <div className="inline-flex items-center gap-1.5 rounded-full bg-red-500 px-3 py-1 mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              <span className="font-tajawal text-xs font-black text-white">
                ينتهي العرض خلال{' '}
                <span className="text-sm">{seconds}</span>
                {' '}ثانية
              </span>
            </div>

            {/* Headline */}
            <h2 className="font-tajawal text-2xl font-black text-white leading-snug">
              {m('أضف علبتين شلاجيت', 'أضيفي علبتين شلاجيت')}
            </h2>
            <p className="font-tajawal text-sm text-white/70 mt-1">
              {m('توصّل معك في نفس الطلب — بدون شحن زيادة', 'توصّل معكِ في نفس الطلب — بدون شحن زيادة')}
            </p>

            {/* Big price */}
            <div className="mt-4 flex items-center justify-center gap-3">
              <div className="text-center">
                <p className="font-tajawal text-5xl font-black text-[#F5C842] leading-none">{UPSELL_ADD_PRICE}</p>
                <p className="font-tajawal text-sm font-bold text-[#F5C842]/80">ريال سعودي فقط</p>
              </div>
              <div className="h-12 w-px bg-white/20" />
              <div className="text-center">
                <p className="font-tajawal text-sm text-white/50 line-through leading-none">{UPSELL_NORMAL_PRICE} ر.س</p>
                <p className="font-tajawal text-lg font-black text-[#4ADE80] mt-0.5">وفّر {SAVINGS} ر.س</p>
              </div>
            </div>
          </div>

          {/* ── Two bottles visual ── */}
          <div className="flex items-end justify-center gap-2 bg-stone-50 px-5 pt-4 pb-2 border-b border-stone-100">
            {/* Bottle 1 */}
            <div className="flex flex-col items-center gap-1">
              <div className="relative h-28 w-20">
                <Image
                  src={bottleImg}
                  alt={productShortName}
                  fill
                  className="object-contain drop-shadow-lg"
                  sizes="80px"
                />
              </div>
              <span className="rounded-full bg-emerald/15 px-2 py-0.5 font-tajawal text-[10px] font-black text-emerald">
                علبة ١
              </span>
            </div>

            {/* Plus sign */}
            <div className="mb-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F5C842] shadow">
              <span className="text-lg font-black text-[#0A2A1A] leading-none">+</span>
            </div>

            {/* Bottle 2 */}
            <div className="flex flex-col items-center gap-1">
              <div className="relative h-28 w-20">
                <Image
                  src={bottleImg}
                  alt={productShortName}
                  fill
                  className="object-contain drop-shadow-lg"
                  sizes="80px"
                />
              </div>
              <span className="rounded-full bg-emerald/15 px-2 py-0.5 font-tajawal text-[10px] font-black text-emerald">
                علبة ٢
              </span>
            </div>

            {/* = Price */}
            <div className="mb-10 flex flex-col items-center justify-center gap-0.5">
              <span className="text-lg font-black text-charcoal/40 leading-none">=</span>
            </div>
            <div className="mb-8 flex flex-col items-center">
              <span className="font-tajawal text-3xl font-black text-emerald leading-none">{UPSELL_ADD_PRICE}</span>
              <span className="font-tajawal text-xs font-bold text-emerald/70">ريال فقط</span>
              <span className="font-tajawal text-[10px] text-charcoal/35 line-through mt-0.5">{UPSELL_NORMAL_PRICE} ر.س</span>
            </div>
          </div>

          {/* ── CTA buttons ── */}
          <div className="flex flex-col gap-3 px-5 pb-6 pt-4 bg-white">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              loading={accepting}
              onClick={handleAccept}
              className="h-14 text-base font-black touch-manipulation select-none shadow-xl shadow-emerald/30"
            >
              {m(
                `✅ أضفها لطلبي بـ ${UPSELL_ADD_PRICE} ريال`,
                `✅ أضيفيها لطلبي بـ ${UPSELL_ADD_PRICE} ريال`,
              )}
            </Button>

            <button
              onClick={handleDecline}
              disabled={accepting}
              className="w-full py-2.5 text-center font-tajawal text-sm text-charcoal/50 transition-colors hover:text-charcoal/80 disabled:opacity-40 touch-manipulation"
            >
              {m('لا شكراً، أكمل طلبي بدون العرض', 'لا شكراً، أكملي طلبي بدون العرض')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
