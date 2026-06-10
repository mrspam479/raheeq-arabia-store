'use client';

import { useEffect, useRef, useState } from 'react';
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
  const modalRef = useRef<HTMLDivElement>(null);
  const idempotencyRef = useRef<string>(uuidv4());

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
      const utmParams = new URLSearchParams(window.location.search);
      const payload = {
        customer: { full_name: values.name, phone: values.phone },
        lines: lines.map((l) => ({
          product_slug: l.productId,
          // Fallback: derive offer_code from tier if old cart item lacks it
          offer_code: l.offerCode ?? (l.tier === 1 ? 'T1' : l.tier === 2 ? 'T2' : 'T3'),
        })),
        tracking: {
          event_id: uuidv4(),
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

      trackPurchase(orderId, total, values.phone, values.name);
      openUpsell(orderId, upsellToken, upsellSku, { name: values.name, phone: values.phone });
    } catch (err) {
      if (isLocalPreview()) {
        const previewOrderId = `preview-${Date.now()}`;
        trackPurchase(previewOrderId, total, values.phone, values.name);
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
          'fixed inset-0 z-[100] bg-charcoal/50 backdrop-blur-sm transition-opacity duration-300',
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
          'fixed inset-0 z-[110] flex items-center justify-center p-4',
          'focus:outline-none',
          isCheckoutOpen ? 'pointer-events-auto' : 'pointer-events-none',
        )}
      >
        <div
          className={cn(
            'w-full max-w-md overflow-hidden rounded-[28px] bg-ivory shadow-2xl transition-all duration-300',
            isCheckoutOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-l from-emerald via-[#188565] to-[#0b4a3a] p-6 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="mb-1 font-tajawal text-xs font-bold text-saffron">
                  خطوة واحدة فقط
                </p>
                <h2 className="font-tajawal text-2xl font-black">
                  احجزي طلبك الآن
                </h2>
                <p className="mt-1 font-tajawal text-sm text-white/80">
                  الاسم + الجوال فقط. العنوان نأخذه بالاتصال.
                </p>
              </div>
            <button
              onClick={closeCheckout}
              className="rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="إغلاق"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            </div>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4 p-5">
            {/* Honeypot — hidden from humans */}
            <input
              {...register('honeypot')}
              type="text"
              autoComplete="off"
              tabIndex={-1}
              aria-hidden="true"
              style={{ display: 'none' }}
            />

            <Input
              label={COPY.CHECKOUT.NAME_LABEL}
              placeholder={COPY.CHECKOUT.NAME_PLACEHOLDER}
              autoComplete="name"
              {...register('name')}
              error={errors.name?.message}
            />

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
              <p className="mt-1 text-xs font-tajawal text-charcoal/60">
                {COPY.CHECKOUT.PHONE_HINT}
              </p>
            </div>

            {/* Order summary */}
            <div className="rounded-2xl border border-saffron/30 bg-[#fff7e8] p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-tajawal text-xs font-bold text-saffron">
                    طلبك جاهز للتأكيد
                  </p>
                  <p className="font-tajawal text-sm font-bold text-emerald">
                    {lines.length === 1 ? lines[0]?.nameAr : `${lines.length} منتجات`}
                  </p>
                </div>
                <p className="font-tajawal text-xl font-black text-emerald">
                  {formatSar(total)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center font-tajawal text-[11px] font-bold text-emerald">
              <span className="rounded-full bg-emerald/8 px-2 py-1.5">بدون بطاقة</span>
              <span className="rounded-full bg-emerald/8 px-2 py-1.5">بدون عنوان الآن</span>
              <span className="rounded-full bg-emerald/8 px-2 py-1.5">اتصال للتأكيد</span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={submitting}
              className="h-14 text-lg"
            >
              أكّدي الطلب الآن — دفع عند الاستلام
            </Button>

            <p className="text-center font-tajawal text-[11px] text-charcoal/50 leading-relaxed">
              بعد التأكيد بيظهر لكِ عرض 99 SAR لمدة 15 ثانية فقط.
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
