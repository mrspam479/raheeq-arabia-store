'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCartStore } from '@/store/cart';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { COPY } from '@/data/copy';
import { validateKsaPhone } from '@/lib/phone';
import { trackPurchase } from '@/lib/analytics';
import { showToast } from '@/components/ui/Toast';
import { cn } from '@/lib/cn';
import { v4 as uuidv4 } from 'uuid';

const schema = z.object({
  name: z.string().min(2, COPY.CHECKOUT.NAME_ERROR).max(80, COPY.CHECKOUT.NAME_ERROR),
  phone: z.string().refine((v) => validateKsaPhone(v), COPY.CHECKOUT.PHONE_ERROR),
  honeypot: z.string().max(0),
});

type FormValues = z.infer<typeof schema>;

export function CheckoutModal() {
  const { isCheckoutOpen, closeCheckout, lines, openUpsell, totalSar } =
    useCartStore();
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const idempotencyRef = useRef<string>(uuidv4());

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', phone: '', honeypot: '' },
  });

  // Reset idempotency key each open
  useEffect(() => {
    if (isCheckoutOpen) {
      idempotencyRef.current = uuidv4();
      reset();
    }
  }, [isCheckoutOpen, reset]);

  useEffect(() => {
    if (!isCheckoutOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCheckout();
    };
    window.addEventListener('keydown', onKey);
    modalRef.current?.focus();
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isCheckoutOpen, closeCheckout]);

  const total = totalSar();

  const onSubmit = async (values: FormValues) => {
    if (values.honeypot) return;
    if (lines.length === 0) return;

    setSubmitting(true);
    try {
      const purchaseEventId = uuidv4();
      const utmParams = new URLSearchParams(window.location.search);
      const payload = {
        customer: { full_name: values.name, phone: values.phone },
        lines: lines.map((l) => ({
          product_slug: l.productId,
          // Fallback: derive offer_code from tier if old cart item lacks it
          offer_code: l.offerCode ?? (l.tier === 1 ? 'T1' : l.tier === 2 ? 'T2' : 'T3'),
        })),
        tracking: {
          event_id: purchaseEventId,
          fbp: getCookie('_fbp') || undefined,
          fbc: getCookie('_fbc') || undefined,
          ttp: getCookie('_ttp') || undefined,
          ttclid: utmParams.get('ttclid') ?? undefined,
          sc_click_id: utmParams.get('ScCid') ?? undefined,
          referrer: document.referrer || undefined,
          landing_url: window.location.href,
          client_user_agent: navigator.userAgent,
          utm: {
            source: utmParams.get('utm_source') ?? undefined,
            medium: utmParams.get('utm_medium') ?? undefined,
            campaign: utmParams.get('utm_campaign') ?? undefined,
            content: utmParams.get('utm_content') ?? undefined,
            term: utmParams.get('utm_term') ?? undefined,
          },
        },
        honeypot: '',
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyRef.current,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const rawText = await res.text().catch(() => '');
        let msg: string = `خطأ ${res.status}`;
        try {
          const err = JSON.parse(rawText) as Record<string, unknown>;
          const detail = err['detail'];
          const errorObj = err['error'] as Record<string, unknown> | undefined;
          if (typeof detail === 'string') {
            msg = detail;
          } else if (detail && typeof (detail as Record<string, unknown>)['message'] === 'string') {
            msg = (detail as Record<string, unknown>)['message'] as string;
          } else if (Array.isArray(detail) && detail.length > 0) {
            const first = detail[0] as Record<string, unknown> | undefined;
            const loc = Array.isArray(first?.['loc']) ? (first['loc'] as unknown[]).join('.') : '';
            const fieldMsg = typeof first?.['msg'] === 'string' ? first['msg'] as string : '';
            msg = loc ? `${loc}: ${fieldMsg}` : fieldMsg || `خطأ ${res.status}`;
          } else if (errorObj && typeof errorObj['message'] === 'string') {
            msg = errorObj['message'] as string;
          } else if (rawText) {
            msg = `خطأ ${res.status}`;
          }
        } catch {
          msg = `خطأ ${res.status}`;
        }
        throw new Error(msg);
      }

      const data = await res.json() as {
        order: { id: string; status: string; total_sar: number };
        upsell: { token: string; sku: string; price_sar: number } | null;
      };

      const orderId = data.order.id;
      const upsellToken = data.upsell?.token ?? '';
      const upsellSku = data.upsell?.sku ?? '';

      trackPurchase(orderId, total, values.phone, values.name, purchaseEventId);
      openUpsell(orderId, upsellToken, upsellSku, { name: values.name, phone: values.phone });
    } catch (err) {
      if (isLocalPreview()) {
        const previewOrderId = `preview-${Date.now()}`;
        trackPurchase(previewOrderId, total, values.phone, values.name, uuidv4());
        openUpsell(previewOrderId, 'preview-upsell-token', 'habba-bareeq', { name: values.name, phone: values.phone });
        return;
      }

      showToast(
        err instanceof Error ? err.message : COPY.ERROR_PAGES.GENERIC,
        'error',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-[290] bg-black/40 backdrop-blur-sm transition-opacity duration-300',
          isCheckoutOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        onClick={closeCheckout}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label={COPY.CHECKOUT.MODAL_TITLE}
        tabIndex={-1}
        className={cn(
          'fixed inset-x-0 bottom-0 z-[300] flex items-end justify-center sm:inset-0 sm:items-center sm:p-4',
          'focus:outline-none',
          isCheckoutOpen ? 'pointer-events-auto' : 'pointer-events-none',
        )}
      >
        <div
          className={cn(
            'w-full max-w-md overflow-hidden bg-white shadow-2xl transition-all duration-300',
            'rounded-t-[28px] sm:rounded-[28px]',
            isCheckoutOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Header ── */}
          <div className="flex items-center justify-between bg-emerald px-5 py-3.5">
            <div className="flex items-center gap-2">
              {/* Lock icon — implies security */}
              <svg className="h-4 w-4 text-saffron shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <div>
                <p className="font-tajawal text-[10px] font-bold text-saffron tracking-widest">خطوة واحدة فقط</p>
                <h2 className="font-tajawal text-lg font-black text-white leading-tight">أكملي طلبكِ الآن</h2>
              </div>
            </div>
            <button
              onClick={closeCheckout}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
              aria-label="إغلاق"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* ── Body — fits one screen, no scroll ── */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-3 p-4 bg-white">
            <input {...register('honeypot')} type="text" autoComplete="off" tabIndex={-1} aria-hidden="true" style={{ display: 'none' }} />

            {/* ── Order summary — soft premium card ── */}
            {lines.map((line) => {
              const bottles = line.quantity;
              const gummies = bottles * 90;
              const months = bottles;
              return (
                <div key={line.productId} className="rounded-2xl bg-[#F8FAF9] ring-1 ring-black/5 shadow-sm px-3 py-3">
                  <div className="flex items-center gap-3">
                    {/* Product image — soft, rounded */}
                    <div className="relative h-[72px] w-14 shrink-0 overflow-hidden rounded-2xl bg-white shadow ring-1 ring-black/8">
                      <Image
                        src={line.imageUrl}
                        alt={line.nameAr}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-tajawal text-[13px] font-black text-charcoal line-clamp-2 leading-snug">{line.nameAr}</p>
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        <span className="rounded-full bg-emerald/10 px-2 py-0.5 font-tajawal text-[10px] font-bold text-emerald">
                          {bottles === 1 ? 'علبة واحدة' : `${bottles} علب`}
                        </span>
                        <span className="rounded-full bg-emerald/10 px-2 py-0.5 font-tajawal text-[10px] font-bold text-emerald">
                          {gummies} علكة
                        </span>
                        <span className="rounded-full bg-emerald/10 px-2 py-0.5 font-tajawal text-[10px] font-bold text-emerald">
                          يكفي {months === 1 ? 'شهر' : `${months} أشهر`}
                        </span>
                      </div>
                    </div>

                    {/* Price — luxurious layout */}
                    <div className="shrink-0 text-left">
                      <p className="font-tajawal text-2xl font-black text-emerald leading-none whitespace-nowrap">
                        {mounted ? line.totalPrice : 0}
                      </p>
                      <p className="font-tajawal text-[11px] font-bold text-emerald/60 text-left mt-0.5">ر.س</p>
                    </div>
                  </div>

                  {/* Trust row — with icons */}
                  <div className="mt-2.5 pt-2.5 border-t border-black/6 flex items-center justify-center gap-3">
                    <span className="flex items-center gap-1">
                      {/* Hand/cash icon */}
                      <svg className="h-3 w-3 text-emerald shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className="font-tajawal text-[10px] font-bold text-charcoal/70">دفع عند الاستلام</span>
                    </span>
                    <span className="text-stone-300">|</span>
                    <span className="flex items-center gap-1">
                      {/* Truck icon */}
                      <svg className="h-3 w-3 text-emerald shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                      </svg>
                      <span className="font-tajawal text-[10px] font-bold text-charcoal/70">شحن مجاني</span>
                    </span>
                    <span className="text-stone-300">|</span>
                    <span className="flex items-center gap-1">
                      {/* Shield icon */}
                      <svg className="h-3 w-3 text-emerald shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span className="font-tajawal text-[10px] font-bold text-charcoal/70">ضمان 30 يوم</span>
                    </span>
                  </div>
                </div>
              );
            })}

            {/* ── Instruction — guiding section header ── */}
            <div className="flex items-center gap-2 py-0.5">
              <div className="flex-1 h-px bg-stone-200" />
              <p className="font-tajawal text-[13px] font-bold text-charcoal/60 whitespace-nowrap">
                اكتبي اسمكِ ورقم جوالكِ
              </p>
              <div className="flex-1 h-px bg-stone-200" />
            </div>

            {/* Name */}
            <Input
              label={COPY.CHECKOUT.NAME_LABEL}
              placeholder={COPY.CHECKOUT.NAME_PLACEHOLDER}
              autoComplete="name"
              {...register('name')}
              error={errors.name?.message}
            />

            {/* Phone */}
            <div>
              <Input
                label={COPY.CHECKOUT.PHONE_LABEL}
                placeholder={COPY.CHECKOUT.PHONE_PLACEHOLDER}
                type="tel"
                inputMode="tel"
                dir="ltr"
                autoComplete="tel"
                {...register('phone')}
                error={errors.phone?.message}
              />
              <p className="mt-1 font-tajawal text-xs text-charcoal/50">{COPY.CHECKOUT.PHONE_HINT}</p>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={submitting}
              className="h-14 text-base font-black shadow-lg shadow-emerald/30"
            >
              أكّدي الطلب — دفع عند الاستلام
            </Button>

            <p className="text-center font-tajawal text-[10px] text-charcoal/35 pb-1">
              سنتصل بكِ لتأكيد الطلب وأخذ العنوان · بدون بطاقة
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match?.[1] ? decodeURIComponent(match[1]) : undefined;
}

function isLocalPreview(): boolean {
  if (typeof window === 'undefined') return false;
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
}
