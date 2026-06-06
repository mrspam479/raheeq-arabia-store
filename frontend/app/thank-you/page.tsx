'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cart';
import { Button } from '@/components/ui/Button';
import { COPY } from '@/data/copy';
import { MAIN_PRODUCTS } from '@/data/products';
import { formatSar } from '@/lib/price';

export default function ThankYouPage() {
  const { lastOrderId } = useCartStore();

  return (
    <div className="bg-white">
      <section className="bg-gradient-to-b from-emerald to-[#00A85A] px-4 py-16 md:py-24 text-center">
        <div className="container mx-auto max-w-lg">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <p className="mb-2 font-tajawal text-sm font-bold text-saffron uppercase tracking-wider">
            {COPY.THANK_YOU.EYEBROW}
          </p>
          <h1 className="font-tajawal text-3xl font-black text-white md:text-4xl">
            شكرًا — طلبكِ في أيادٍ أمينة.
          </h1>
          <p className="mx-auto mt-4 max-w-md font-tajawal text-base leading-relaxed text-white/80">
            {COPY.THANK_YOU.BODY}
          </p>

          {lastOrderId && (
            <div className="mx-auto mt-6 max-w-sm rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
              <p className="font-tajawal text-sm text-white/70">
                {COPY.THANK_YOU.ORDER_ID_LABEL}
              </p>
              <p className="mt-1 font-inter text-xs font-mono text-white break-all">
                {lastOrderId}
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="container mx-auto max-w-lg">
          <h2 className="mb-6 text-center font-tajawal text-xl font-black text-emerald">
            إيش بيصير الحين؟
          </h2>
          <div className="flex flex-col gap-4">
            {[
              { step: '1', title: 'اتصال للتأكيد', desc: 'فريق رحيق بيكلّمكِ خلال ٢٤ ساعة لتأكيد العنوان وموعد التوصيل.', icon: '📞', active: true },
              { step: '2', title: 'تجهيز وشحن', desc: 'نجهّز طلبكِ ونشحنه خلال ١-٣ أيام عمل لباب بيتكِ.', icon: '📦', active: false },
              { step: '3', title: 'الاستلام والدفع', desc: 'تدفعين كاش لمندوب التوصيل لما يوصلكِ. بكل بساطة.', icon: '💵', active: false },
            ].map((item) => (
              <div
                key={item.step}
                className={`flex items-start gap-4 rounded-2xl border p-5 ${
                  item.active
                    ? 'border-emerald/30 bg-emerald/5'
                    : 'border-stone-200 bg-[#FAFAF8]'
                }`}
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-tajawal text-lg font-black ${
                  item.active ? 'bg-emerald text-white' : 'bg-stone-200 text-charcoal/50'
                }`}>
                  {item.step}
                </div>
                <div>
                  <p className="font-tajawal text-base font-black text-charcoal">{item.title}</p>
                  <p className="mt-1 font-tajawal text-sm text-charcoal/65">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-saffron/30 bg-saffron/5 p-5 text-center">
            <p className="font-tajawal text-sm font-bold text-emerald">
              نصيحة مهمة
            </p>
            <p className="mt-2 font-tajawal text-sm text-charcoal/70">
              لما يكلّمكِ فريقنا، الرجاء الرد على المكالمة عشان نقدر نوصّل لكِ في أسرع وقت. لو ما رديتِ، بنحاول مرة ثانية.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-stone-200 px-4 py-12">
        <div className="container mx-auto max-w-5xl">
          <h2 className="mb-6 text-center font-tajawal text-xl font-black text-emerald">
            أكملي روتينكِ
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {MAIN_PRODUCTS.map((product) => (
              <Link
                key={product.slug}
                href={`/p/${product.slug}`}
                prefetch
                className="group flex items-center gap-4 rounded-2xl border border-stone-200 bg-white p-4 hover:border-emerald/40 hover:shadow-lg transition-all"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-stone-100">
                  <Image
                    src={product.coverImageUrl}
                    alt={product.nameAr}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                    sizes="80px"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-tajawal text-base font-black text-emerald">{product.nameAr}</p>
                  <p className="mt-0.5 font-tajawal text-xs text-charcoal/60 line-clamp-1">{product.heroTagAr}</p>
                  <p className="mt-1 font-tajawal text-sm font-bold text-emerald">
                    من {formatSar(product.offers[0]?.priceSar ?? 199)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-stone-200 px-4 py-10 text-center">
        <div className="container mx-auto max-w-lg">
          <Button variant="primary" size="lg" asChild>
            <Link href="/">{COPY.THANK_YOU.HOME_CTA}</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
