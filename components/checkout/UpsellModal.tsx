'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { COPY } from '@/data/copy';
import { formatSar } from '@/lib/price';
import { showToast } from '@/components/ui/Toast';
import { cn } from '@/lib/cn';

const UPSELL_PRICE = 99;
const COUNTDOWN_SECONDS = 15;

export function UpsellModal() {
  const { isUpsellOpen, closeUpsell, lastOrderId, upsellToken, clearCart } = useCartStore();
  const router = useRouter();
  const [seconds, setSeconds] = useState(COUNTDOWN_SECONDS);
  const [accepting, setAccepting] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleExpire = useCallback(() => {
    clearCart();
    closeUpsell();
    router.push('/thank-you');
  }, [clearCart, closeUpsell, router]);

  useEffect(() => {
    if (!isUpsellOpen) {
      setSeconds(COUNTDOWN_SECONDS);
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
    if (!lastOrderId || !upsellToken) return;
    if (intervalRef.current) clearInterval(intervalRef.current);

    setAccepting(true);
    try {
      if (upsellToken !== 'preview-upsell-token') {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL ?? 'https://api.raheeqarabia.com'}/api/orders/${lastOrderId}/upsell`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'X-Upsell-Token': upsellToken,
            },
            body: JSON.stringify({ upsell_token: upsellToken }),
          },
        );

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

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-[120] bg-emerald/55 backdrop-blur-sm transition-opacity duration-300',
          isUpsellOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        aria-hidden="true"
      />

      <div
        className={cn(
          'fixed inset-0 z-[130] flex items-center justify-center p-4',
          isUpsellOpen ? 'pointer-events-auto' : 'pointer-events-none',
        )}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-label={COPY.UPSELL.MODAL_TITLE}
          className={cn(
            'w-full max-w-md overflow-hidden rounded-[30px] bg-ivory shadow-2xl',
            'transition-all duration-300',
            isUpsellOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90',
          )}
        >
          {/* Progress bar */}
          <div className="h-2 bg-stone-200 relative overflow-hidden">
            <div
              className="absolute inset-y-0 start-0 bg-emerald transition-all duration-1000 ease-linear"
              style={{ width: `${progressPct}%` }}
              aria-hidden="true"
            />
          </div>

          {/* Product image */}
          <div className="relative h-48 bg-stone-100">
            <Image
              src="/images/products/habba-noura/cover.svg"
              alt="حبّة نورة"
              fill
              className="object-cover"
              sizes="(max-width: 400px) 100vw, 400px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald/65 via-emerald/10 to-transparent" />
            {/* Countdown badge */}
            <div className="absolute top-3 end-3">
              <div className="flex h-14 w-14 flex-col items-center justify-center rounded-full bg-saffron text-emerald shadow-lg">
                <span className="font-inter text-lg font-black leading-none">{seconds}</span>
                <span className="font-tajawal text-[9px] font-bold leading-none">ثانية</span>
              </div>
            </div>
            <div className="absolute bottom-3 start-3">
              <Badge variant="saffron">بعد تأكيد الطلب فقط</Badge>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-4 p-5">
            <div>
              <p className="mb-1 font-tajawal text-xs font-bold text-saffron">
                عرض يظهر مرة واحدة
              </p>
              <h2 className="font-tajawal text-2xl font-black leading-tight text-emerald">
                أضيفي المنتج المكمل لطلبك بـ 99 SAR
              </h2>
              <p className="mt-2 font-tajawal text-sm leading-relaxed text-charcoal/75">
                ينضم لنفس الطلب بدون شحن إضافي. إذا خرجتِ من هنا، ما يرجع العرض.
              </p>
            </div>

            {/* Price */}
            <div className="rounded-2xl border border-emerald/10 bg-ivory p-4 text-center">
              <p className="font-tajawal text-xs font-bold text-saffron">سعر خاص الآن</p>
              <span className="font-inter text-4xl font-black text-emerald">
                {formatSar(UPSELL_PRICE)}
              </span>
              <div className="mt-1 flex items-center justify-center gap-2">
                <span className="font-tajawal text-sm text-charcoal/45 line-through">
                  {formatSar(199)}
                </span>
                <Badge variant="saffron">وفّري 100 SAR</Badge>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              loading={accepting}
              onClick={handleAccept}
              className="h-14 text-lg"
            >
              أضيفيها لطلبي الآن · 99 SAR
            </Button>

            <button
              onClick={handleDecline}
              className="text-center font-tajawal text-xs text-charcoal/50 transition-colors hover:text-charcoal"
            >
              لا شكرًا، كمّلي طلبي بدون العرض
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
