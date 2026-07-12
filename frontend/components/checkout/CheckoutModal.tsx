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
import { formatSar } from '@/lib/price';
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
          <div className="bg-emerald px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-tajawal text-[11px] font-bold text-saffron uppercase tracking-widest mb-0.5">خطوة واحدة فقط</p>
                <h2 className="font-tajawal text-xl font-black text-white">أكملي طلبكِ الآن</h2>
              </div>
              <button
                onClick={closeCheckout}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
                aria-label="إغلاق"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* Trust pills inside header */}
            <div className="mt-3 flex gap-2">
              {['💵 دفع عند الاستلام', '🚚 شحن سريع', '🛡️ ضمان ٣٠ يوم'].map((t) => (
                <span key={t} className="rounded-full bg-white/15 px-2.5 py-0.5 font-tajawal text-[10px] font-bold text-white/90">{t}</span>
              ))}
            </div>
          </div>

          {/* ── Scrollable body ── */}
          <div className="max-h-[70vh] overflow-y-auto bg-white pb-safe">
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4 p-5">
              {/* Honeypot */}
              <input
                {...register('honeypot')}
                type="text"
                autoComplete="off"
                tabIndex={-1}
                aria-hidden="true"
                style={{ display: 'none' }}
              />

              {/* ── Order summary ── */}
              <div className="rounded-2xl border border-emerald/20 bg-white p-4 shadow-sm">
                <p className="mb-3 font-tajawal text-[11px] font-bold uppercase tracking-wide text-emerald">
                  ملخّص طلبكِ
                </p>
                <div className="flex flex-col gap-3">
                  {lines.map((line) => (
                    <div key={line.productId} className="flex items-center gap-3">
                      <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-xl border border-stone-200 bg-white">
                        <Image
                          src={line.imageUrl}
                          alt={line.nameAr}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-tajawal text-sm font-black text-charcoal leading-snug line-clamp-2">
                          {line.nameAr}
                        </p>
                        <p className="font-tajawal text-xs text-charcoal/50 mt-0.5">
                          {line.quantity > 1 ? `${line.quantity} علب` : 'علبة واحدة'}
                        </p>
                      </div>
                      <p className="font-tajawal text-base font-black text-emerald shrink-0">
                        {formatSar(line.totalPrice)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between rounded-xl bg-emerald/8 px-3 py-2.5">
                  <span className="font-tajawal text-sm font-bold text-charcoal">الإجمالي</span>
                  <span className="font-tajawal text-2xl font-black text-emerald">
                    {mounted ? formatSar(total) : formatSar(0)}
                  </span>
                </div>
              </div>

              {/* ── Name ── */}
              <Input
                label={COPY.CHECKOUT.NAME_LABEL}
                placeholder={COPY.CHECKOUT.NAME_PLACEHOLDER}
                autoComplete="name"
                {...register('name')}
                error={errors.name?.message}
              />

              {/* ── Phone ── */}
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
                <p className="mt-1 font-tajawal text-xs text-charcoal/50">
                  {COPY.CHECKOUT.PHONE_HINT}
                </p>
              </div>

              {/* ── Submit ── */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={submitting}
                className="h-14 text-base font-black shadow-[0_8px_24px_rgba(15,77,61,0.30)]"
              >
                أكّدي الطلب — دفع عند الاستلام
              </Button>

              <p className="text-center font-tajawal text-[11px] text-charcoal/40 leading-relaxed pb-1">
                بعد التأكيد بيظهر لكِ عرض 99 SAR لمدة 15 ثانية فقط.
              </p>
            </form>
          </div>
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
