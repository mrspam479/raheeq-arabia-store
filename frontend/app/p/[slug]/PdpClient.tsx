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
  whyUs,
}: PdpClientProps) {
  const { addLine, openCart } = useCartStore();
  const [selectedTier, setSelectedTier] = useState<1 | 2 | 3>(3);
  const [activeImage, setActiveImage] = useState(0);

  const selectedOffer = product.offers.find((o) => o.code === `T${selectedTier}`)!;
  const singleBoxPrice = product.offers.find((o) => o.code === 'T1')?.priceSar ?? 199;

  useEffect(() => {
    trackViewContent(product.slug, product.nameAr);
  }, [product.slug, product.nameAr]);

  useEffect(() => {
    setSelectedTier(3);
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

            {/* Info card */}
            <div className="flex flex-col gap-5 rounded-[28px] border border-emerald/10 bg-white p-5 shadow-[0_18px_55px_rgba(74,56,46,0.08)] md:p-6">
              {/* Trust badges */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="ivory">{COPY.BADGES.COD}</Badge>
                <Badge variant="ivory">{COPY.BADGES.HALAL}</Badge>
                <Badge variant="ivory">{COPY.BADGES.VEGAN}</Badge>
              </div>

              {/* Title + ONE-LINE tagline */}
              <div>
                <h1 className="font-tajawal font-black text-3xl md:text-4xl text-emerald">
                  {product.nameAr}
                </h1>
                <p className="font-tajawal text-base text-charcoal/75 mt-2 leading-relaxed">
                  {product.heroTagAr}
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <StarRating
                  value={product.ratingValue}
                  showValue
                  reviewCount={product.reviewCount}
                  size="md"
                />
              </div>

              {/* 3 BIG benefits — visual */}
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

              {/* WHAT THIS IS — one clear sentence */}
              <div className="rounded-2xl border border-saffron/30 bg-saffron/5 p-4">
                <p className="mb-1 font-tajawal text-xs font-bold text-saffron">
                  ما هي هذه الحبّة؟
                </p>
                <p className="font-tajawal text-sm font-medium leading-relaxed text-charcoal">
                  {product.shortDescriptionAr}
                </p>
              </div>

              {/* OFFER SELECTOR — savings clearly shown */}
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

                        {/* Radio circle */}
                        <span className={cn(
                          'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all',
                          isActive ? 'border-[#00C97A] bg-[#00C97A]' : 'border-[#ccc4b8] bg-white',
                        )}>
                          {isActive && (
                            <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </span>

                        {/* Title + duration */}
                        <div className="mx-3 flex-1">
                          <p className="font-tajawal text-base font-black text-charcoal">
                            {getOfferTitle(tier)}
                          </p>
                          <p className={cn(
                            'font-tajawal text-xs mt-0.5',
                            isActive ? 'text-charcoal/65' : 'text-charcoal/45',
                          )}>
                            {getOfferDuration(tier)}
                          </p>
                          {savings > 0 && (
                            <p className="mt-1 font-tajawal text-[11px] font-bold text-[#00A85A]">
                              وفّري {formatSar(savings)}
                            </p>
                          )}
                        </div>

                        {/* Price */}
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
                  💵 الدفع عند الاستلام
                </p>
                <p className="mt-1 font-tajawal text-xs text-charcoal/70">
                  ما تحتاجين بطاقة. نتّصل بكِ ونوصّل لبابكِ خلال ١-٣ أيام.
                </p>
              </div>

              {/* Trust row */}
              <div className="flex flex-wrap justify-center gap-3 border-t border-stone-100 pt-3">
                {[COPY.BADGES.COD, COPY.BADGES.FAST_SHIP, COPY.BADGES.HALAL].map((badge) => (
                  <span key={badge} className="flex items-center gap-1 font-tajawal text-xs text-charcoal/60">
                    ✓ {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════ IMAGE DIVIDER — lifestyle shot ════ */}
      <section className="bg-gradient-to-b from-ivory to-[#faf5ec] py-10">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="relative aspect-[21/9] rounded-3xl border-2 border-dashed border-emerald/25 bg-emerald/5 overflow-hidden flex items-center justify-center">
            <div className="text-center px-4">
              <p className="font-tajawal text-2xl">📸</p>
              <p className="mt-2 font-tajawal text-sm font-bold text-emerald">
                [مكان لإضافة صورة لايف ستايل — Lifestyle photo]
              </p>
              <p className="mt-1 font-tajawal text-xs text-charcoal/55">
                صورة عريضة: العلبة على رخام كريمي مع قهوة الصباح
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════ RESULT TIMELINE — high contrast cards on emerald bg ════ */}
      <section className="bg-emerald py-16 text-ivory relative overflow-hidden">
        {/* Soft saffron blob */}
        <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-saffron/20 blur-3xl" />
        <div className="container mx-auto px-4 max-w-5xl relative">
          <div className="text-center mb-10">
            <p className="font-tajawal text-sm font-bold text-saffron mb-2">السؤال اللي تسأله كل وحدة</p>
            <h2 className="font-tajawal font-black text-3xl md:text-4xl text-white">
              متى أشوف نتيجة؟
            </h2>
            <p className="mt-3 font-tajawal text-base text-white/75 max-w-xl mx-auto">
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
          <div className="mt-10 rounded-2xl bg-saffron/15 border border-saffron/30 p-5 text-center">
            <p className="font-tajawal text-base font-bold text-saffron">
              ⭐ للنتيجة الكاملة — استمري ٩٠ يوم
            </p>
            <p className="mt-1 font-tajawal text-sm text-white/80">
              عشان كذا ٣ علب هي الأنصح — والأكثر توفيرًا.
            </p>
          </div>
        </div>
      </section>

      {/* ════ BEFORE / AFTER — emotional contrast with side-by-side image placeholder ════ */}
      <section className="py-16 bg-ivory">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-10">
            <p className="font-tajawal text-sm font-bold text-saffron mb-2">الفرق الحقيقي · ليس فيلتر</p>
            <h2 className="font-tajawal font-black text-3xl md:text-4xl text-emerald">
              حياتكِ قبل {product.nameAr} وبعدها
            </h2>
            <p className="mt-3 font-tajawal text-base text-charcoal/60 max-w-xl mx-auto">
              نتائج حقيقية من نساء سعوديات — بعد ٦٠-٩٠ يوم استمرار
            </p>
          </div>

          {/* IMAGE DIVIDER — before/after photo placeholder */}
          <div className="mb-8 grid grid-cols-2 gap-3">
            <div className="relative aspect-square rounded-2xl border-2 border-dashed border-red-300 bg-red-50/40 flex items-center justify-center">
              <div className="text-center px-3">
                <p className="text-2xl">📸</p>
                <p className="mt-1 font-tajawal text-xs font-bold text-red-700">[صورة «قبل»]</p>
                <p className="font-tajawal text-[10px] text-charcoal/55">وجه طبيعي بدون فلتر</p>
              </div>
            </div>
            <div className="relative aspect-square rounded-2xl border-2 border-dashed border-emerald/40 bg-emerald/5 flex items-center justify-center">
              <div className="text-center px-3">
                <p className="text-2xl">📸</p>
                <p className="mt-1 font-tajawal text-xs font-bold text-emerald">[صورة «بعد ٩٠ يوم»]</p>
                <p className="font-tajawal text-[10px] text-charcoal/55">نفس الإضاءة، نفس الزاوية</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* BEFORE */}
            <div className="rounded-3xl border-2 border-red-200 bg-red-50/40 p-6">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1">
                <span className="text-base">😔</span>
                <p className="font-tajawal text-xs font-black text-red-700">حياتكِ اليوم</p>
              </div>
              <ul className="flex flex-col gap-3">
                {beforeAfter.before.map((item) => (
                  <li key={item} className="flex items-start gap-3 font-tajawal text-sm text-charcoal/80">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-200 text-red-700 text-[11px] font-black">
                      ✕
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            {/* AFTER */}
            <div className="rounded-3xl border-2 border-emerald/40 bg-[#F3FAF6] p-6 shadow-[0_18px_42px_rgba(18,107,82,0.15)] relative">
              <div className="absolute -top-3 right-6 rounded-full bg-saffron px-3 py-1 font-tajawal text-[10px] font-black text-emerald shadow">
                ⭐ هدفكِ
              </div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald px-3 py-1">
                <span className="text-base">✨</span>
                <p className="font-tajawal text-xs font-black text-white">حياتكِ بعد ٩٠ يوم</p>
              </div>
              <ul className="flex flex-col gap-3">
                {beforeAfter.after.map((item) => (
                  <li key={item} className="flex items-start gap-3 font-tajawal text-sm font-semibold text-charcoal">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald text-white text-[11px] font-black">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ════ WHY US — logic + emotion ════ */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-10">
            <p className="font-tajawal text-sm font-bold text-saffron mb-2">ليش رحيق؟</p>
            <h2 className="font-tajawal font-black text-3xl md:text-4xl text-emerald">
              لأن العلم والشعور — لازم يتقابلون.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* LOGIC card */}
            <div className="rounded-3xl border border-emerald/15 bg-[#FAFAF8] p-6">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald px-3 py-1">
                <span className="text-base">🔬</span>
                <p className="font-tajawal text-xs font-black text-white">العقل · الحقائق</p>
              </div>
              <ul className="flex flex-col gap-3">
                {whyUs.logic.map((item) => (
                  <li key={item} className="flex items-start gap-3 font-tajawal text-sm text-charcoal/85 leading-relaxed">
                    <span className="mt-0.5 text-emerald font-black">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            {/* EMOTION card */}
            <div className="rounded-3xl border border-saffron/30 bg-saffron/5 p-6">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-saffron px-3 py-1">
                <span className="text-base">💛</span>
                <p className="font-tajawal text-xs font-black text-emerald">القلب · الشعور</p>
              </div>
              <ul className="flex flex-col gap-3">
                {whyUs.emotion.map((item) => (
                  <li key={item} className="flex items-start gap-3 font-tajawal text-sm text-charcoal/85 leading-relaxed">
                    <span className="mt-0.5 text-saffron font-black">★</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ════ HOW TO USE — 3 simple steps ════ */}
      <section className="py-16 bg-ivory">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="font-tajawal font-black text-3xl md:text-4xl text-emerald">
              كيف تستخدمينها؟
            </h2>
            <p className="mt-2 font-tajawal text-base text-charcoal/60">٣ خطوات بسيطة</p>
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

      {/* ════ INGREDIENTS — clean cards ════ */}
      <section className="py-16 bg-stone-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="font-tajawal font-black text-3xl md:text-4xl text-emerald">
              إيش فيها؟
            </h2>
            <p className="mt-2 font-tajawal text-base text-charcoal/60">
              مكوّنات عالمية بشهادة تحليل لكل دفعة
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

      {/* ════ IMAGE DIVIDER — happy customer / results montage ════ */}
      <section className="bg-stone-50 py-10">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="relative aspect-[21/9] rounded-3xl border-2 border-dashed border-saffron/40 bg-saffron/5 overflow-hidden flex items-center justify-center">
            <div className="text-center px-4">
              <p className="font-tajawal text-2xl">📸</p>
              <p className="mt-2 font-tajawal text-sm font-bold text-emerald">
                [مكان لصورة عميلة سعيدة — Happy customer]
              </p>
              <p className="mt-1 font-tajawal text-xs text-charcoal/55">
                أو كولاج صور قبل/بعد من عدة عميلات
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════ REVIEWS ════ */}
      <section className="py-16 bg-ivory">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="font-tajawal font-black text-3xl md:text-4xl text-emerald">
              ماذا قالت عميلاتنا؟
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

      {/* ════ HIGH-AOV BUNDLE — only on non-bundle PDPs ════ */}
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
              خذي الـ 3 منتجات مع بعض ووفّري 100 ريال سعودي
            </p>
          </div>

          <div className="rounded-3xl bg-white border-2 border-saffron/30 p-6 md:p-8 shadow-[0_24px_60px_rgba(18,107,82,0.15)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="relative aspect-square rounded-2xl border-2 border-dashed border-emerald/25 bg-emerald/5 flex items-center justify-center">
                <div className="text-center px-4">
                  <p className="text-4xl mb-2">🎁</p>
                  <p className="font-tajawal text-sm font-bold text-emerald">
                    [صورة الـ 3 منتجات معًا]
                  </p>
                  <p className="mt-1 font-tajawal text-xs text-charcoal/55">
                    نضرة + بريق + جذر — صندوق فاخر
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <ul className="flex flex-col gap-2.5">
                  {[
                    'بشرة مشدودة وأقل تجاعيد — حبّة نضرة',
                    'هالات أفتح وعيون متحمّسة — حبّة بريق',
                    'شعر أكثف ويوقف التساقط — حبّة جذر',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 font-tajawal text-sm text-charcoal">
                      <span className="mt-0.5 text-emerald font-black">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>

                {/* PRICE COMPARISON — clear "before vs after" */}
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
                    🚚 شحن مجاني · يكفي شهر كامل
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
                  💵 دفع عند الاستلام · 🚚 شحن مجاني · ↩️ ضمان 14 يوم
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* ════ YOU MAY ALSO LIKE — cross-sell ════ */}
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
            ⏰ آخر فرصة — السعر يرجع لـ ٢٤٩ ر.س قريبًا
          </p>
          <h2 className="font-tajawal font-black text-3xl md:text-4xl mb-4">
            جاهزة تجرّبين {product.nameAr}؟
          </h2>
          <p className="font-tajawal text-base text-white/80 mb-8">
            دفع عند الاستلام · شحن ١-٣ أيام · ضمان ١٤ يوم
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
      <div className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-ivory border-t border-stone-200 p-3 safe-bottom">
        <Button variant="primary" size="lg" fullWidth onClick={handleAddToCart}>
          اطلبيها الآن · {formatSar(selectedOffer.priceSar)}
        </Button>
      </div>
    </>
  );
}

function getOfferTitle(tier: 1 | 2 | 3): string {
  if (tier === 1) return 'علبة واحدة';
  if (tier === 2) return 'علبتين';
  return '٣ علب';
}

function getOfferDuration(tier: 1 | 2 | 3): string {
  if (tier === 1) return 'يكفي شهر · تجربة';
  if (tier === 2) return 'يكفي شهرين · قيمة أفضل';
  return 'يكفي ٣ أشهر · النتيجة الكاملة';
}
