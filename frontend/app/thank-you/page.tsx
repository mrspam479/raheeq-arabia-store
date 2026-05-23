'use client';

import Link from 'next/link';
import { useCartStore } from '@/store/cart';
import { Button } from '@/components/ui/Button';
import { COPY } from '@/data/copy';

export default function ThankYouPage() {
  const { lastOrderId } = useCartStore();

  return (
    <section className="min-h-[70vh] flex items-center justify-center bg-ivory py-20">
      <div className="container mx-auto px-4 max-w-lg text-center">
        {/* Checkmark */}
        <div className="w-20 h-20 rounded-full bg-emerald/10 flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-emerald" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <p className="font-tajawal text-sm text-emerald/60 uppercase tracking-wider mb-2">
          {COPY.THANK_YOU.EYEBROW}
        </p>
        <h1 className="font-tajawal font-black text-3xl md:text-4xl text-emerald mb-4">
          شكرًا — طلبكِ في أيادٍ أمينة.
        </h1>
        <p className="font-tajawal text-base text-charcoal/70 leading-relaxed mb-6">
          {COPY.THANK_YOU.BODY}
        </p>

        {lastOrderId && (
          <div className="mb-6 p-4 bg-emerald/5 rounded-xl border border-emerald/10">
            <p className="font-tajawal text-sm text-charcoal/60">
              {COPY.THANK_YOU.ORDER_ID_LABEL}
            </p>
            <p className="font-inter text-xs font-mono text-charcoal/80 mt-1 break-all">
              {lastOrderId}
            </p>
          </div>
        )}

        {/* Steps */}
        <div className="flex justify-center gap-6 mb-10">
          {COPY.THANK_YOU.STEPS.map((step, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-tajawal font-bold text-sm ${
                  i === 0
                    ? 'bg-emerald text-ivory'
                    : 'bg-stone-200 text-charcoal/50'
                }`}
              >
                {i + 1}
              </div>
              <span className="font-tajawal text-xs text-charcoal/60 text-center max-w-[60px]">
                {step}
              </span>
            </div>
          ))}
        </div>

        <Button variant="primary" size="lg" asChild>
          <Link href="/">{COPY.THANK_YOU.HOME_CTA}</Link>
        </Button>
      </div>
    </section>
  );
}
