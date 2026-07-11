'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StarRating } from '@/components/ui/StarRating';
import Link from 'next/link';
import { COPY } from '@/data/copy';
import { formatSar } from '@/lib/price';
import { useCartStore } from '@/store/cart';
import { PRODUCT_CROSS_SELLS, getProductBySlug } from '@/data/products';
import { showToast } from '@/components/ui/Toast';
import { trackAddToCart, trackViewContent } from '@/lib/analytics';
import { cn } from '@/lib/cn';
import type { Product } from '@/lib/types';

interface Benefit {
  icon: string;
  text: string;
}

interface TimelineStep {
  when: string;
  result: string;
}

interface BeforeAfter {
  before: string[];
  after: string[];
}

interface WhyUs {
  logic: string[];
  emotion: string[];
}

interface PdpClientProps {
  product: Product;
  benefits: Benefit[];
  timeline: TimelineStep[];
  howToUse: string[];
  beforeAfter: BeforeAfter;
  whyUs: WhyUs;
}

export function PdpClient({
  product,
  benefits,
  timeline,
  howToUse,
  beforeAfter,
}: PdpClientProps) {
  const { addLine, openCart } = useCartStore();
  const [selectedTier, setSelectedTier] = useState<1 | 2 | 3>(1);
  const [activeImage, setActiveImage] = useState(0);

  const selectedOffer = product.offers.find((o) => o.code === `T${selectedTier}`)!;
  const singleBoxPrice = product.offers.find((o) => o.code === 'T1')?.priceSar ?? 199;
  const isBundle = product.slug === 'bundle-glow-trio';

  useEffect(() => {
    // Pass singleBoxPrice as value so Meta/TikTok can calculate ROAS on ViewContent
    trackViewContent(product.slug, product.nameAr, singleBoxPrice);
  }, [product.slug, product.nameAr, singleBoxPrice]);

  useEffect(() => {
    setSelectedTier(1);
    setActiveImage(0);
  }, [product.slug]);

  const handleAddToCart = () => {
    addLine({
      productId: product.slug,
      nameAr: product.nameAr,
      tier: selectedTier,
      quantity: selectedOffer.quantity,
      unitPrice: selectedOffer.priceSar / selectedOffer.quantity,
      imageUrl: product.coverImageUrl,
      offerCode: selectedOffer.code,
    });
    openCart();
    showToast(COPY.TOAST.ADDED, 'success');
    trackAddToCart(product.slug, selectedOffer.priceSar, selectedOffer.quantity);
  };

  return (
    <>
      {/* ════ HERO — image + offer card ════ */}
      <section className="bg-ivory py-8 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 max-w-5xl mx-auto">
            {/* Image gallery */}
            {isBundle ? (
              /* Bundle: show all 3 products side-by-side, no AI image */
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { src: '/images/products/habba-nadra/cover.webp', name: 'علكات الأستازانثين', sub: 'ضد التجاعيد' },
                    { src: '/images/products/habba-bareeq/cover.webp', name: 'علكات الحديد', sub: 'ضد الهالات' },
                    { src: '/images/products/habba-jathr/cover.webp', name: 'علكات البيوتين', sub: 'للشعر' },
                  ].map((p) => (
                    <div key={p.sub} className="flex flex-col items-center gap-2">
                      <div className="relative w-full aspect-square overflow-hidden rounded-2xl border-2 border-[#EAE0D0] bg-white shadow-sm">
                        <Image src={p.src} alt={p.name} fill className="object-contain p-3" sizes="(max-width: 768px) 33vw, 17vw" priority />
                      </div>
                      <div className="text-center">
                        <p className="font-tajawal text-[11px] font-black text-emerald leading-tight">{p.name}</p>
                        <p className="font-tajawal text-[10px] text-charcoal/55">{p.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl bg-[#F3FAF6] border border-emerald/20 py-3 px-4 text-center">
                  <p className="font-tajawal text-sm font-black text-emerald">الروتين الكامل — ٣ علكات في طلب واحد</p>
                  <p className="font-tajawal text-xs text-charcoal/60 mt-0.5">كل علبة تكفي شهر كامل</p>
                </div>
              </div>
            ) : (
              /* Single product: standard image gallery */
              <div className="flex flex-col gap-3">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-stone-100">
                  <Image
                    src={product.galleryImageUrls[activeImage] ?? product.coverImageUrl}
                    alt={product.nameAr}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                {product.galleryImageUrls.length > 1 && (
                  <div className="flex gap-2">
                    {product.galleryImageUrls.map((url, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className={cn(
                          'relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors',
                          activeImage === i ? 'border-emerald' : 'border-transparent',
                        )}
                        aria-label={`صورة ${i + 1}`}
                      >
                        <Image src={url} alt="" fill className="object-cover" sizes="64px" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Info card */}
            <div className="flex flex-col gap-5 rounded-[28px] border border-emerald/10 bg-white p-5 shadow-[0_18px_55px_rgba(74,56,46,0.08)] md:p-6">
              {/* Trust badges */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="ivory">{COPY.BADGES.COD}</Badge>
                <Badge variant="ivory">📋 مرخّص SFDA</Badge>
                <Badge variant="ivory">🛡️ ضمان ٣٠ يوم</Badge>
              </div>

              {/* Title + Pain Point */}
              <div>
                <h1 className="font-tajawal font-black text-2xl md:text-3xl text-emerald leading-snug">
                  {product.heroTagAr}
                </h1>
                <p className="font-tajawal text-sm md:text-base text-charcoal/80 mt-3 leading-relaxed font-medium">
                  {product.shortDescriptionAr}
                </p>
              </div>

              {/* Rating */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <StarRating
                  value={product.ratingValue}
                  showValue
                  reviewCount={product.reviewCount}
                  size="md"
                />
                {product.slug === 'habba-jathr' && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald/25 bg-emerald/8 px-2.5 py-0.5 font-tajawal text-[11px] font-bold text-emerald">
                    🍬 ٩٠ علكة في كل علبة
                  </span>
                )}
              </div>

              {/* 3 BIG benefits */}
              <div className="grid grid-cols-3 gap-2">
                {benefits.map((b) => (
                  <div
                    key={b.text}
                    className="flex flex-col items-center gap-1 rounded-2xl bg-emerald/5 p-3 text-center"
                  >
                    <span className="text-2xl" aria-hidden="true">{b.icon}</span>
                    <p className="font-tajawal text-[11px] font-bold leading-tight text-emerald">
                      {b.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Solution box */}
              <div className="rounded-2xl border border-saffron/30 bg-saffron/5 p-4 mt-2">
                <p className="mb-1 font-tajawal text-xs font-bold text-saffron">
                  الحل الجذري: {product.nameAr}
                </p>
                <p className="font-tajawal text-sm font-medium leading-relaxed text-charcoal">
                  {product.longDescriptionAr}
                </p>
              </div>

              {/* OFFER SELECTOR */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-tajawal font-bold text-base text-emerald">
                    اختاري عرضكِ:
                  </p>
                  <span className="rounded-full bg-red-50 px-2.5 py-0.5 font-tajawal text-[11px] font-bold text-red-600">
                    ⏳ عرض محدود
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  {product.offers.map((offer) => {
                    const tier = parseInt(offer.code.replace('T', '')) as 1 | 2 | 3;
                    const isActive = selectedTier === tier;
                    const fullPrice = singleBoxPrice * offer.quantity;
                    const savings = fullPrice - offer.priceSar;
                    return (
                      <button
                        key={offer.code}
                        onClick={() => setSelectedTier(tier)}
                        className={cn(
                          'relative flex w-full items-center justify-between rounded-2xl border-[3px] px-4 py-4 text-right transition-all duration-200',
                          isActive
                            ? 'border-[#00C97A] bg-white shadow-[0_8px_28px_rgba(0,201,122,0.18)]'
                            : 'border-[#ddd0bc] bg-[#fafaf8] opacity-70 hover:opacity-100 hover:border-[#00C97A]/50',
                        )}
                        aria-pressed={isActive}
                      >
                        {offer.isRecommended && (
                          <span className="absolute -top-2.5 right-4 rounded-full bg-saffron px-2.5 py-0.5 font-tajawal text-[10px] font-black text-emerald">
                            ⭐ الأكثر طلبًا
                          </span>
                        )}

                        <div className="flex shrink-0 items-center gap-1">
                          {Array.from({ length: offer.quantity }, (_, idx) => (
                            <div
                              key={idx}
                              className={cn(
                                'relative overflow-hidden rounded-lg bg-stone-100',
                                isBundle ? 'h-12 w-14 border border-emerald/15' : 'h-12 w-10',
                              )}
                            >
                              <Image
                                src={product.coverImageUrl}
                                alt={product.nameAr}
                                fill
                                className={isBundle ? 'object-contain p-1' : 'object-cover'}
                                sizes={isBundle ? '56px' : '40px'}
                              />
                            </div>
                          ))}
                        </div>

                        <div className="mx-3 flex-1">
                          <p className="font-tajawal text-base font-black text-charcoal">
                            {getOfferTitle(tier, isBundle)}
                          </p>
                          <p className={cn(
                            'font-tajawal text-xs mt-0.5',
                            isActive ? 'text-charcoal/65' : 'text-charcoal/45',
                          )}>
                            {getOfferDuration(tier, isBundle)}
                          </p>
                          {savings > 0 && (
                            <p className="mt-1 font-tajawal text-[11px] font-bold text-[#00A85A]">
                              وفّري {formatSar(savings)}
                            </p>
                          )}
                        </div>

                        <div className="text-left">
                          <p className={cn(
                            'font-tajawal text-lg font-black leading-none',
                            isActive ? 'text-[#00A85A]' : 'text-charcoal/50',
                          )}>
                            {formatSar(offer.priceSar)}
                          </p>
                          {savings > 0 && (
                            <p className="mt-0.5 font-tajawal text-[11px] text-charcoal/40 line-through">
                              {formatSar(fullPrice)}
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Stock warning */}
              <p className="text-center font-tajawal text-xs font-bold text-red-600">
                🔴 {product.stockLabelAr}
              </p>

              {/* CTA */}
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleAddToCart}
                className="h-16 text-xl shadow-[0_18px_42px_rgba(18,107,82,0.34)]"
              >
                اطلبيها الآن · {formatSar(selectedOffer.priceSar)}
              </Button>

              {/* Reassurance */}
              <div className="rounded-xl bg-saffron/10 px-4 py-3 text-center">
                <p className="font-tajawal text-sm font-bold text-emerald">
                  💵 الدفع عند الاستلام — بدون بطاقة
                </p>
                <p className="mt-1 font-tajawal text-xs text-charcoal/70">
                  نتّصل بكِ نأكد الطلب · نوصّل خلال ١-٣ أيام · ادفعي كاش للمندوب
                </p>
              </div>

              {/* Trust row */}
              <div className="flex flex-wrap justify-center gap-3 border-t border-stone-100 pt-3">
                {['💵 دفع عند الاستلام', '🚚 شحن سريع', '☪️ حلال ١٠٠٪', '🛡️ ضمان ٣٠ يوم'].map((badge) => (
                  <span key={badge} className="font-tajawal text-[11px] font-bold text-charcoal/60">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════ "DO YOU SUFFER FROM..." — Pain identification ════ */}
      <section className="py-14 bg-[#FFF9F5]">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="font-tajawal font-black text-3xl md:text-4xl text-charcoal">
              هل تعانين من هذي الأعراض؟
            </h2>
            <p className="mt-2 font-tajawal text-sm text-charcoal/60">
              إذا قلتي &ldquo;أيوه&rdquo; على واحدة — {product.nameAr} صُنعت لكِ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {beforeAfter.before.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-red-100 bg-white p-4 shadow-sm"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-red-50 text-xs font-black text-red-500">
                  ✓
                </span>
                <p className="font-tajawal text-sm font-medium leading-relaxed text-charcoal/85">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-3xl border-2 border-emerald/20 bg-emerald/5 p-6 text-center">
            <p className="font-tajawal text-base font-black text-emerald">
              ✨ {product.nameAr} تعالج هذي المشاكل من جذورها — من الداخل.
            </p>
          </div>

          {/* ── Pinned social-proof review ── */}
          {product.reviews[2] && (
            <div className="mt-6 rounded-2xl border-2 border-emerald/25 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-1 mb-3">
                {[1,2,3,4,5].map((s) => (
                  <svg key={s} className="w-4 h-4 text-saffron fill-saffron" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="font-tajawal text-sm leading-relaxed text-charcoal">
                &ldquo;{product.reviews[2].bodyAr}&rdquo;
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald/10">
                  <span className="font-tajawal text-[11px] font-bold text-emerald">
                    {product.reviews[2].authorFirstNameAr[0]}
                  </span>
                </div>
                <span className="font-tajawal text-xs font-semibold text-emerald">
                  {product.reviews[2].authorFirstNameAr}
                </span>
                <span className="font-tajawal text-[11px] text-charcoal/50">
                  · {product.reviews[2].authorCityAr}
                </span>
                <span className="ms-auto rounded-full bg-emerald/8 px-2 py-0.5 font-tajawal text-[10px] font-bold text-emerald border border-emerald/20">
                  مشترية موثّقة ✓
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ════ RESULT TIMELINE ════ */}
      <section className="bg-emerald py-16 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-saffron/15 blur-3xl" />
        <div className="container mx-auto px-4 max-w-5xl relative">
          <div className="text-center mb-10">
            <p className="font-tajawal text-sm font-bold text-saffron mb-2">السؤال اللي تسأله كل وحدة</p>
            <h2 className="font-tajawal font-black text-3xl md:text-4xl text-saffron">
              متى أشوف نتيجة؟
            </h2>
            <p className="mt-3 font-tajawal text-base text-saffron/80 max-w-xl mx-auto">
              مرحلة بمرحلة — هذا اللي راح يصير لكِ
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {timeline.map((step, i) => (
              <div
                key={step.when}
                className="relative rounded-2xl bg-white p-5 text-center shadow-[0_18px_42px_rgba(0,0,0,0.18)]"
              >
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald font-tajawal text-lg font-black text-saffron shadow-md">
                  {i + 1}
                </div>
                <p className="font-tajawal text-xs font-bold text-saffron uppercase tracking-wide">
                  {step.when}
                </p>
                <p className="mt-2 font-tajawal text-base font-black text-emerald leading-tight">
                  {step.result}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-10 rounded-2xl bg-white/10 border border-saffron/40 p-5 text-center backdrop-blur-sm">
            <p className="font-tajawal text-base font-bold text-saffron">
              ⭐ النتيجة الواقعية تحتاج استمرار ٨-١٢ أسبوع
            </p>
            <p className="mt-1 font-tajawal text-sm text-saffron/70">
              عشان كذا العلبتين أو ٣ علب هي الأفضل للالتزام، مو لأننا نبيع أكثر.
            </p>
          </div>
        </div>
      </section>

      {/* ════ BEFORE / AFTER ════ */}
      <section className="py-16 bg-[#FAFAF8]">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <span className="inline-block rounded-full bg-emerald/10 px-4 py-1.5 font-tajawal text-xs font-black text-emerald mb-3">
              التحوّل الحقيقي
            </span>
            <h2 className="font-tajawal font-black text-3xl md:text-4xl text-charcoal leading-tight">
              حياتكِ <span className="text-red-500">قبل</span> و<span className="text-emerald">بعد</span> {product.nameAr}
            </h2>
          </div>

          <div className="rounded-[32px] overflow-hidden border border-stone-200 bg-white shadow-[0_24px_60px_rgba(0,0,0,0.08)]">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* BEFORE */}
              <div className="bg-[#2C2C2C] p-8 md:p-10">
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/20 text-lg">😔</span>
                  <div>
                    <p className="font-tajawal text-lg font-black text-white">حياتكِ اليوم</p>
                    <p className="font-tajawal text-[11px] text-white/50">بدون {product.nameAr}</p>
                  </div>
                </div>
                <ul className="flex flex-col gap-4">
                  {beforeAfter.before.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-red-500/20 text-red-400 text-xs font-black">
                        ✕
                      </span>
                      <span className="font-tajawal text-sm leading-relaxed text-white/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* AFTER */}
              <div className="bg-gradient-to-br from-emerald to-[#00A85A] p-8 md:p-10 relative">
                <div className="absolute top-4 left-4 rounded-full bg-saffron px-3 py-1 font-tajawal text-[10px] font-black text-emerald shadow-lg">
                  ⭐ هدفكِ
                </div>
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-lg">✨</span>
                  <div>
                    <p className="font-tajawal text-lg font-black text-white">حياتكِ بعد الاستمرار</p>
                    <p className="font-tajawal text-[11px] text-saffron/90">مع {product.nameAr}</p>
                  </div>
                </div>
                <ul className="flex flex-col gap-4">
                  {beforeAfter.after.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white/25 text-white text-xs font-black">
                        ✓
                      </span>
                      <span className="font-tajawal text-sm leading-relaxed text-white font-semibold">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════ GUARANTEE — IMPOSSIBLE TO IGNORE ════ */}
      <section className="py-20 bg-gradient-to-br from-[#E8FFF4] via-[#F0FFF7] to-white border-y-4 border-emerald">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="rounded-[36px] border-4 border-emerald bg-white p-8 text-center shadow-[0_32px_80px_rgba(18,107,82,0.15)] md:p-14">
            <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-full border-4 border-emerald/30 bg-emerald/10">
              <span className="text-6xl">🛡️</span>
            </div>
            <p className="mb-2 font-tajawal text-sm font-black uppercase tracking-widest text-saffron">
              وعد رحيق لكِ
            </p>
            <h2
              className="font-tajawal font-black leading-tight text-emerald"
              style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)' }}
            >
              ضمان ٣٠ يوم كامل — أو فلوسكِ ترجع
            </h2>
            <p className="mx-auto mt-5 max-w-xl font-tajawal text-lg leading-relaxed text-charcoal/75">
              جرّبي لمدة ٣٠ يوم. إذا ما لاحظتي فرق أو ما عجبكِ لأي سبب — <span className="font-black text-emerald">نرجّع فلوسكِ كاملة. بدون أسئلة. بدون شروط.</span>
            </p>

            <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-2xl border-2 border-emerald/20 bg-emerald/5 p-5">
                <span className="text-3xl">📋</span>
                <p className="mt-2 font-tajawal text-base font-black text-emerald">مرخّص SFDA</p>
                <p className="mt-1 font-tajawal text-xs text-charcoal/60">مسجّل في الغذاء والدواء</p>
              </div>
              <div className="rounded-2xl border-2 border-emerald/20 bg-emerald/5 p-5">
                <span className="text-3xl">💵</span>
                <p className="mt-2 font-tajawal text-base font-black text-emerald">استرداد كامل</p>
                <p className="mt-1 font-tajawal text-xs text-charcoal/60">كل فلوسكِ ترجع</p>
              </div>
              <div className="rounded-2xl border-2 border-emerald/20 bg-emerald/5 p-5">
                <span className="text-3xl">❌</span>
                <p className="mt-2 font-tajawal text-base font-black text-emerald">بدون أسئلة</p>
                <p className="mt-1 font-tajawal text-xs text-charcoal/60">ما نسألكِ ليش</p>
              </div>
            </div>

            <div className="mx-auto mt-8 max-w-lg rounded-2xl bg-saffron/10 border border-saffron/30 p-4">
              <p className="font-tajawal text-sm font-bold text-charcoal/80">
                💬 يعني ببساطة: اطلبي، جرّبي ٣٠ يوم، لو ما عجبكِ — نرجّع فلوسكِ. انتهى.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════ COMPARISON TABLE — Why us vs alternatives ════ */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <p className="font-tajawal text-sm font-bold text-saffron mb-2">قارني بنفسكِ</p>
            <h2 className="font-tajawal font-black text-3xl md:text-4xl text-emerald">
              ليش {product.nameAr} أفضل؟
            </h2>
          </div>

          <div className="overflow-hidden rounded-3xl border border-[#E0D4C0] shadow-sm">
            <div className="grid grid-cols-4 border-b border-[#E0D4C0] bg-[#FAFAF8]">
              <div className="p-4" />
              <div className="border-s border-[#E0D4C0] p-4 text-center">
                <p className="font-tajawal text-[11px] text-charcoal/50">🧴</p>
                <p className="font-tajawal text-xs font-bold text-charcoal/70">كريمات خارجية</p>
              </div>
              <div className="border-s border-[#E0D4C0] p-4 text-center">
                <p className="font-tajawal text-[11px] text-charcoal/50">💊</p>
                <p className="font-tajawal text-xs font-bold text-charcoal/70">مكمّلات عادية</p>
              </div>
              <div className="border-s-2 border-emerald bg-emerald/5 p-4 text-center">
                <p className="font-tajawal text-[11px] text-emerald">🌿</p>
                <p className="font-tajawal text-xs font-black text-emerald">{product.nameAr}</p>
              </div>
            </div>
            {[
              { label: 'يوصل للخلايا من الداخل', a: false, b: true, c: true },
              { label: 'جرعات فعّالة ومثبتة', a: false, b: false, c: true },
              { label: 'فحص مخبري لكل دفعة', a: false, b: false, c: true },
              { label: 'طعم لذيذ أو كبسولة سهلة', a: true, b: false, c: true },
              { label: 'حلال ١٠٠٪ بدون جيلاتين', a: true, b: false, c: true },
              { label: 'ضمان استرداد', a: false, b: false, c: true },
            ].map((row, i) => (
              <div key={row.label} className={`grid grid-cols-4 ${i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAF8]'}`}>
                <div className="flex items-center p-4">
                  <p className="font-tajawal text-xs font-medium text-charcoal/80">{row.label}</p>
                </div>
                <CompareCell value={row.a} />
                <CompareCell value={row.b} />
                <CompareCell value={row.c} highlight />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ HOW TO USE ════ */}
      <section className="py-16 bg-ivory">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="font-tajawal font-black text-3xl md:text-4xl text-emerald">
              كيف تستخدمينها؟
            </h2>
            <p className="mt-2 font-tajawal text-base text-charcoal/60">أبسط روتين ممكن</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {howToUse.map((step, i) => (
              <div
                key={i}
                className="rounded-2xl border border-emerald/15 bg-white p-6 text-center"
              >
                <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald font-tajawal text-xl font-black text-saffron">
                  {i + 1}
                </div>
                <p className="font-tajawal text-base font-medium leading-relaxed text-charcoal">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ INGREDIENTS ════ */}
      <section className="py-16 bg-stone-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="font-tajawal font-black text-3xl md:text-4xl text-emerald">
              إيش فيها؟
            </h2>
            <p className="mt-2 font-tajawal text-base text-charcoal/60">
              مكوّنات سريرية بجرعات مدروسة
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.ingredients.map((ing) => (
              <div
                key={ing.nameAr}
                className="rounded-2xl border border-stone-200 bg-white p-5"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="font-tajawal font-bold text-lg text-emerald">{ing.nameAr}</p>
                  <Badge variant="ivory">{ing.dose}</Badge>
                </div>
                <p className="font-tajawal text-sm leading-relaxed text-charcoal/75">
                  {ing.whatItDoesAr}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ TRUST STRIP ════ */}
      <section className="bg-stone-50 py-10">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { icon: '📋', text: 'مرخّص من SFDA' },
              { icon: '🔬', text: 'جرعات سريرية' },
              { icon: '☪️', text: 'حلال ١٠٠٪' },
              { icon: '🛡️', text: 'ضمان ٣٠ يوم' },
            ].map((item) => (
              <div key={item.text} className="flex flex-col items-center gap-2 rounded-2xl border border-emerald/15 bg-white p-4 text-center">
                <span className="text-2xl">{item.icon}</span>
                <p className="font-tajawal text-xs font-bold text-emerald">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ REVIEWS ════ */}
      <section className="py-16 bg-ivory">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-10">
            <p className="mb-2 font-tajawal text-sm font-bold text-saffron">عميلات قرأن المكونات قبل ما يطلبن</p>
            <h2 className="font-tajawal font-black text-3xl md:text-4xl text-emerald">
              اختيار النساء اللي ما يصدّقن أي إعلان
            </h2>
            <div className="mt-3 inline-flex items-center gap-2">
              <StarRating value={product.ratingValue} showValue reviewCount={product.reviewCount} size="md" />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {product.reviews.map((review, i) => (
              <div key={i} className="rounded-2xl border border-stone-200 bg-white p-5">
                <StarRating value={review.rating} size="sm" />
                <p className="mt-3 font-tajawal text-sm leading-relaxed text-charcoal">
                  &ldquo;{review.bodyAr}&rdquo;
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald/10">
                    <span className="font-tajawal text-[10px] font-bold text-emerald">
                      {review.authorFirstNameAr[0]}
                    </span>
                  </div>
                  <span className="font-tajawal text-xs font-semibold text-emerald">
                    {review.authorFirstNameAr}
                  </span>
                  <span className="font-tajawal text-[11px] text-charcoal/50">
                    · {review.authorCityAr}
                  </span>
                  <Badge variant="ivory" className="ms-auto text-[10px]">مشترية موثّقة</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ FAQ ════ */}
      <section className="py-16 bg-stone-50">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-10">
            <h2 className="font-tajawal font-black text-3xl md:text-4xl text-emerald">
              أسئلة شائعة
            </h2>
          </div>
          <div className="flex flex-col gap-2">
            {product.faqs.map((faq, i) => (
              <details key={i} className="group rounded-2xl border border-stone-200 bg-white p-5 cursor-pointer">
                <summary className="flex items-center justify-between gap-3 font-tajawal font-bold text-base text-emerald list-none">
                  {faq.questionAr}
                  <svg className="w-5 h-5 shrink-0 transition-transform duration-200 group-open:rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </summary>
                <p className="mt-3 font-tajawal text-sm leading-relaxed text-charcoal/75">
                  {faq.answerAr}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ════ BUNDLE UPSELL — only on non-bundle PDPs ════ */}
      {product.slug !== 'bundle-glow-trio' && (
      <section className="py-16 bg-gradient-to-br from-[#FFF7E6] via-ivory to-[#FFEFD9]">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-8">
            <span className="inline-block rounded-full bg-emerald px-4 py-1.5 font-tajawal text-xs font-black text-saffron mb-3">
              💎 العرض الأقوى
            </span>
            <h2 className="font-tajawal font-black text-3xl md:text-4xl text-emerald leading-tight">
              صندوق الجمال الكامل
            </h2>
            <p className="mt-3 font-tajawal text-base text-charcoal/70 max-w-2xl mx-auto">
              خذي الـ 3 منتجات مع بعض ووفّري {formatSar(100)}
            </p>
          </div>

          <div className="rounded-3xl bg-white border-2 border-saffron/30 p-6 md:p-8 shadow-[0_24px_60px_rgba(18,107,82,0.15)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-white">
                <Image
                  src="/images/products/trio-real-photo.webp"
                  alt="المنتجات الثلاثة الحقيقية — نضرة + بريق + جذر"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              <div className="flex flex-col gap-4">
                <ul className="flex flex-col gap-2.5">
                  {[
                    '✨ بشرة مشدودة وأقل تجاعيد — حبّة نضرة',
                    '👁️ هالات أفتح بدون كونسيلر — حبّة بريق',
                    '💇‍♀️ شعر أكثف من الجذر — حبّة جذر',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 font-tajawal text-sm text-charcoal">
                      <span className="mt-0.5 text-emerald font-black">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="rounded-2xl bg-emerald/5 border border-emerald/15 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-emerald/10 pb-2">
                    <span className="font-tajawal text-sm text-charcoal/70">شراء فردي للـ 3</span>
                    <span className="font-tajawal text-base text-charcoal/55 line-through">
                      {formatSar(597)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-tajawal text-sm font-bold text-emerald">سعر الصندوق</p>
                      <p className="font-tajawal text-[11px] text-saffron font-bold">
                        ✨ توفّرين {formatSar(100)}
                      </p>
                    </div>
                    <span className="font-tajawal text-3xl font-black text-emerald">
                      {formatSar(499)}
                    </span>
                  </div>
                  <p className="font-tajawal text-xs text-charcoal/60 border-t border-emerald/10 pt-2">
                    🚚 شحن مجاني · 🛡️ ضمان ٣٠ يوم
                  </p>
                </div>

                <Link href="/p/bundle-glow-trio">
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    className="h-14 text-base shadow-[0_18px_42px_rgba(18,107,82,0.30)]"
                  >
                    اطلبي الصندوق · {formatSar(499)}
                  </Button>
                </Link>

                <p className="text-center font-tajawal text-[11px] text-charcoal/55">
                  💵 دفع عند الاستلام · بدون بطاقة
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* ════ CROSS-SELL ════ */}
      {(() => {
        const crossSlugs = PRODUCT_CROSS_SELLS[product.slug] ?? [];
        const crossProducts = crossSlugs
          .map((s) => getProductBySlug(s))
          .filter((p): p is NonNullable<typeof p> => Boolean(p));
        if (crossProducts.length === 0) return null;
        return (
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4 max-w-5xl">
              <div className="text-center mb-10">
                <p className="font-tajawal text-sm font-bold text-saffron mb-2">يكمّل روتينكِ</p>
                <h2 className="font-tajawal font-black text-3xl md:text-4xl text-emerald">
                  ممكن تعجبكِ كمان
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {crossProducts.map((cp) => (
                  <Link
                    key={cp.slug}
                    href={`/p/${cp.slug}`}
                    prefetch
                    className="group flex gap-4 rounded-2xl border border-stone-200 bg-white p-4 hover:border-emerald/40 hover:shadow-lg transition-all"
                  >
                    <div className="relative w-28 h-28 shrink-0 rounded-xl overflow-hidden bg-stone-100">
                      <Image
                        src={cp.coverImageUrl}
                        alt={cp.nameAr}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                        sizes="112px"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-tajawal font-black text-lg text-emerald">{cp.nameAr}</h3>
                        <p className="mt-1 font-tajawal text-xs text-charcoal/65 line-clamp-2">
                          {cp.heroTagAr}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-tajawal text-sm font-bold text-emerald">
                          من {formatSar(cp.offers[0]?.priceSar ?? 199)}
                        </span>
                        <span className="font-tajawal text-xs font-bold text-saffron group-hover:translate-x-1 transition-transform">
                          شوفي ←
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        );
      })()}

      {/* ════ FINAL CTA ════ */}
      <section className="py-16 bg-emerald text-ivory text-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <p className="font-tajawal text-sm font-bold text-saffron mb-3">
            🛡️ ضمان ٣٠ يوم كامل · دفع عند الاستلام · ما عندكِ شي تخسرينه
          </p>
          <h2 className="font-tajawal font-black text-3xl md:text-4xl mb-4">
            جاهزة تجرّبين {product.nameAr}؟
          </h2>
          <p className="font-tajawal text-base text-white/80 mb-8">
            حبّتين بالصباح · مؤشرات أولية خلال ٤-٨ أسابيع · شحن ١-٣ أيام
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={handleAddToCart}
            className="h-16 text-xl px-12 shadow-[0_18px_42px_rgba(0,0,0,0.3)]"
          >
            اطلبيها الآن · {formatSar(selectedOffer.priceSar)}
          </Button>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-ivory border-t border-stone-200">
        <div className="container mx-auto px-4 max-w-3xl">
          <p className="text-center font-tajawal text-xs leading-relaxed text-charcoal/50">
            {COPY.PDP.DISCLAIMER}
          </p>
        </div>
      </section>

      {/* Sticky CTA bar — mobile */}
      <div className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-white border-t border-stone-200 p-3 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] safe-bottom">
        <Button variant="primary" size="lg" fullWidth onClick={handleAddToCart} className="h-14 text-lg font-black cta-pulse">
          اطلبيها الآن · {formatSar(selectedOffer.priceSar)}
        </Button>
        <p className="mt-1.5 text-center font-tajawal text-[11px] font-bold text-emerald">
          🚚 الدفع عند الاستلام · 🛡️ ضمان ٣٠ يوم
        </p>
      </div>
    </>
  );
}

function CompareCell({ value, highlight = false }: { value: boolean; highlight?: boolean }) {
  return (
    <div
      className={`flex items-center justify-center border-s p-4 ${highlight ? 'border-s-2' : ''}`}
      style={highlight ? { borderColor: '#0F4D3D', backgroundColor: '#EEF7F2' } : { borderColor: '#E0D4C0' }}
    >
      {value ? (
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black"
          style={highlight ? { backgroundColor: '#0F4D3D', color: '#ffffff' } : { backgroundColor: '#D1EDE1', color: '#0F4D3D' }}
        >
          ✓
        </span>
      ) : (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-50 text-sm font-black text-red-400">
          ✕
        </span>
      )}
    </div>
  );
}

function getOfferTitle(tier: 1 | 2 | 3, isBundle = false): string {
  if (isBundle) {
    if (tier === 1) return 'صندوق واحد = ٣ منتجات';
    if (tier === 2) return 'صندوقين = ٦ منتجات';
    return '٣ صناديق = ٩ منتجات';
  }
  if (tier === 1) return 'علبة واحدة (٩٠ علكة)';
  if (tier === 2) return 'علبتين (١٨٠ علكة)';
  return '٣ علب (٢٧٠ علكة)';
}

function getOfferDuration(tier: 1 | 2 | 3, isBundle = false): string {
  if (isBundle) {
    if (tier === 1) return 'نضرة + بريق + جذر · تجربة شهر';
    if (tier === 2) return 'روتين شهرين كامل · قيمة أفضل';
    return 'روتين ٣ أشهر · أعلى توفير وأقوى التزام';
  }
  if (tier === 1) return 'يكفي شهر · تجربة';
  if (tier === 2) return 'يكفي شهرين · قيمة أفضل';
  return 'يكفي ٣ أشهر · النتيجة الكاملة';
}
