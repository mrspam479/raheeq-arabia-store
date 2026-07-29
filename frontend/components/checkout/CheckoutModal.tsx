'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCartStore } from '@/store/cart';
import { PRODUCTS } from '@/data/products';
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
  const { isCheckoutOpen, closeCheckout, lines, openUpsell, totalSar, setLastOrderSummary } =
    useCartStore();
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  const isMasc = lines.some((l) => PRODUCTS.find((p) => p.slug === l.productId)?.genderMasculine);
  const m = (masculine: string, feminine: string) => (isMasc ? masculine : feminine);
  const modalRef = useRef<HTMLDivElement>(null);
  const idempotencyRef = useRef<string>(uuidv4());

  useEffect(() => { setMounted(true); }, []);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', phone: '', honeypot: '' },
  });

  useEffect(() => {
    if (isCheckoutOpen) {
      idempotencyRef.current = uuidv4();
      reset();
      void fetch('/api/geo/warm').catch(() => {});
    }
  }, [isCheckoutOpen, reset]);

  useEffect(() => {
    if (!isCheckoutOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCheckout(); };
    window.addEventListener('keydown', onKey);
    modalRef.current?.focus();
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isCheckoutOpen, closeCheckout]);

  useEffect(() => {
    if (!isCheckoutOpen) return;
    window.history.pushState({ checkoutModal: true }, '');
    const onPopState = () => closeCheckout();
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
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
        headers: { 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyRef.current },
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
        } catch { msg = `خطأ ${res.status}`; }
        throw new Error(msg);
      }

      const data = await res.json() as {
        order: { id: string; status: string; total_sar: number };
        upsell: { token: string; sku: string; price_sar: number } | null;
      };

      const orderId = data.order.id;
      const upsellToken = data.upsell?.token ?? '';
      const upsellSku = data.upsell?.sku ?? '';

      setLastOrderSummary({
        lines: lines.map((l) => ({ productId: l.productId, nameAr: l.nameAr, imageUrl: l.imageUrl, quantity: l.quantity, totalPrice: l.totalPrice })),
        totalSar: total,
        orderId,
      });
      trackPurchase(orderId, total, values.phone, values.name, purchaseEventId);
      openUpsell(orderId, upsellToken, upsellSku, { name: values.name, phone: values.phone });
    } catch (err) {
      if (isLocalPreview()) {
        const previewOrderId = `preview-${Date.now()}`;
        setLastOrderSummary({
          lines: lines.map((l) => ({ productId: l.productId, nameAr: l.nameAr, imageUrl: l.imageUrl, quantity: l.quantity, totalPrice: l.totalPrice })),
          totalSar: total,
          orderId: previewOrderId,
        });
        trackPurchase(previewOrderId, total, values.phone, values.name, uuidv4());
        const previewSku = lines[0]?.productId ?? 'habba-bareeq';
        openUpsell(previewOrderId, 'preview-upsell-token', previewSku, { name: values.name, phone: values.phone });
        return;
      }
      showToast(err instanceof Error ? err.message : COPY.ERROR_PAGES.GENERIC, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-[290] bg-black/70 backdrop-blur-sm transition-opacity duration-300',
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
          dir="rtl"
          className={cn(
            'w-full max-w-sm overflow-hidden shadow-2xl transition-all duration-300',
            'rounded-t-[28px] sm:rounded-[28px]',
            isCheckoutOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Dark header ── */}
          <div className="bg-[#0A2A1A] px-5 pt-5 pb-4">
            {/* Top row: label + close */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#4ADE80] animate-pulse" />
                <span className="font-tajawal text-xs font-black text-[#F5C842] tracking-wide">
                  🔒 خطوة واحدة فقط
                </span>
              </div>
              <button
                onClick={closeCheckout}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 transition-colors"
                aria-label="إغلاق"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Product summary — one card per line */}
            {lines.map((line) => {
              const gpb = PRODUCTS.find((p) => p.slug === line.productId)?.gummiesPerBottle ?? 90;
              const gummies = line.quantity * gpb;
              const durationDays = Math.round(gummies / 2);
              const months = Math.max(1, Math.round(durationDays / 30));
              const durationLabel = durationDays < 25
                ? `${durationDays} يوم`
                : months === 1 ? 'شهر' : `${months} أشهر`;

              return (
                <div key={line.productId} className="flex items-center gap-3 mb-3">
                  {/* Product image */}
                  <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-xl bg-white/10 ring-1 ring-white/20">
                    <Image
                      src={line.imageUrl}
                      alt={line.nameAr}
                      fill
                      className="object-contain p-1"
                      sizes="48px"
                    />
                  </div>
                  {/* Name + badges */}
                  <div className="flex-1 min-w-0">
                    <p className="font-tajawal text-sm font-black text-white leading-snug line-clamp-2">
                      {line.nameAr}
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      <span className="rounded-full bg-white/10 px-2 py-0.5 font-tajawal text-[10px] font-bold text-white/70">
                        {line.quantity === 1 ? 'علبة واحدة' : `${line.quantity} علب`}
                      </span>
                      <span className="rounded-full bg-white/10 px-2 py-0.5 font-tajawal text-[10px] font-bold text-white/70">
                        {gummies} علكة
                      </span>
                      <span className="rounded-full bg-white/10 px-2 py-0.5 font-tajawal text-[10px] font-bold text-white/70">
                        يكفي {durationLabel}
                      </span>
                    </div>
                  </div>
                  {/* Price — big saffron */}
                  <div className="shrink-0 text-left">
                    <p className="font-tajawal text-3xl font-black text-[#F5C842] leading-none">
                      {mounted ? line.totalPrice : 0}
                    </p>
                    <p className="font-tajawal text-[10px] font-bold text-[#F5C842]/60 text-left">ر.س</p>
                  </div>
                </div>
              );
            })}

            {/* Trust badges row */}
            <div className="flex items-center justify-center gap-3 mt-1 pt-3 border-t border-white/10">
              {[
                { icon: '💵', label: 'دفع عند الاستلام' },
                { icon: '🚚', label: 'شحن مجاني' },
                { icon: '🛡️', label: 'ضمان 30 يوم' },
              ].map((b) => (
                <span key={b.label} className="flex items-center gap-1">
                  <span className="text-xs">{b.icon}</span>
                  <span className="font-tajawal text-[10px] font-bold text-white/60">{b.label}</span>
                </span>
              ))}
            </div>

            {/* 3-step progress */}
            <div className="mt-4 flex items-center">
              {[
                m('أكمل بياناتك', 'أكملي بياناتكِ'),
                m('نتصل نأكد', 'نتصل نأكد'),
                m('استلم وادفع', 'استلمي وادفعي'),
              ].map((step, i) => (
                <div key={step} className="flex items-center flex-1">
                  <div className="flex flex-col items-center gap-1">
                    <div className={cn(
                      'flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-black',
                      i === 0 ? 'bg-[#F5C842] text-[#0A2A1A]' : 'bg-white/10 text-white/40',
                    )}>
                      {i + 1}
                    </div>
                    <p className={cn(
                      'font-tajawal text-[9px] font-bold whitespace-nowrap',
                      i === 0 ? 'text-[#F5C842]' : 'text-white/30',
                    )}>
                      {step}
                    </p>
                  </div>
                  {i < 2 && <div className="flex-1 h-px bg-white/10 mx-1 mb-3" />}
                </div>
              ))}
            </div>
          </div>

          {/* ── Processing overlay — shown immediately on submit ── */}
          {submitting && (
            <div className="flex flex-col items-center justify-center gap-4 bg-white px-5 py-12">
              <div className="relative flex h-16 w-16 items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-[#0A2A1A]/10" />
                <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-[#F5C842]" />
                <span className="text-2xl">🔒</span>
              </div>
              <div className="text-center">
                <p className="font-tajawal text-base font-black text-[#0A2A1A]">جاري تأكيد طلبك...</p>
                <p className="font-tajawal text-sm text-charcoal/50 mt-1">ثانية وتكمل ✓</p>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-[#0A2A1A]/5 px-4 py-2.5 mt-1">
                {[{ icon: '💵', label: 'دفع عند الاستلام' }, { icon: '🚚', label: 'شحن مجاني' }].map((b) => (
                  <span key={b.label} className="flex items-center gap-1">
                    <span className="text-sm">{b.icon}</span>
                    <span className="font-tajawal text-xs font-bold text-charcoal/60">{b.label}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── Form body ── */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className={`flex flex-col gap-3 p-4 bg-white${submitting ? ' hidden' : ''}`}>
            <input {...register('honeypot')} type="text" autoComplete="off" tabIndex={-1} aria-hidden="true" style={{ display: 'none' }} />

            {/* Section divider */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-stone-200" />
              <p className="font-tajawal text-xs font-bold text-charcoal/50 whitespace-nowrap">
                {m('اكتب اسمك ورقم جوالك', 'اكتبي اسمكِ ورقم جوالكِ')}
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

            {/* What happens next — compact */}
            <div className="rounded-2xl bg-[#0A2A1A]/5 border border-[#0A2A1A]/10 px-3 py-2.5">
              <p className="font-tajawal text-[11px] font-black text-[#0A2A1A] mb-2">📦 {m('ماذا يصير بعد ما تأكّد؟', 'ماذا يصير بعد ما تأكّدي؟')}</p>
              <div className="flex flex-col gap-1.5">
                {[
                  { icon: '📞', text: m('نتصل بك خلال ساعات نأكد الطلب', 'نتصل بكِ خلال ساعات نأكد الطلب') },
                  { icon: '🚚', text: 'نوصّل خلال ١–٣ أيام عمل' },
                  { icon: '💵', text: m('تدفع كاش للمندوب — بدون بطاقة', 'تدفعين كاش للمندوب — بدون بطاقة') },
                ].map((s) => (
                  <div key={s.icon} className="flex items-center gap-2">
                    <span className="text-sm shrink-0">{s.icon}</span>
                    <p className="font-tajawal text-[11px] text-charcoal/70">{s.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={submitting}
              className="h-14 text-base font-black shadow-xl shadow-emerald/30"
            >
              {m('أكّد الطلب — دفع عند الاستلام', 'أكّدي الطلب — دفع عند الاستلام')} 🔒
            </Button>

            {/* Exit link */}
            <button
              type="button"
              onClick={closeCheckout}
              className="w-full py-1 text-center font-tajawal text-xs text-charcoal/40 hover:text-charcoal/70 transition-colors"
            >
              ← {m('رجوع لقراءة تفاصيل المنتج', 'رجوع لقراءة تفاصيل المنتج')}
            </button>
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
