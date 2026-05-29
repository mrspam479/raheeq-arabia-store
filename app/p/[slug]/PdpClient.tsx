'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StarRating } from '@/components/ui/StarRating';
import { COPY } from '@/data/copy';
import { formatSar } from '@/lib/price';
import { useCartStore } from '@/store/cart';
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

interface PdpClientProps {
  product: Product;
  benefits: Benefit[];
  timeline: TimelineStep[];
  howToUse: string[];
}

export function PdpClient({
  product,
  benefits,
  timeline,
  howToUse,
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

      {/* ════ RESULT TIMELINE — answers "متى أشوف نتيجة؟" ════ */}
      <section className="bg-emerald py-16 text-ivory">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-10">
            <p className="font-tajawal text-sm font-bold text-saffron mb-2">السؤال اللي تسأله كل وحدة</p>
            <h2 className="font-tajawal font-black text-3xl md:text-4xl">
              متى أشوف نتيجة؟
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {timeline.map((step, i) => (
              <div
                key={step.when}
                className="relative rounded-2xl bg-white/10 p-5 text-center backdrop-blur-sm border border-white/15"
              >
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-saffron font-tajawal text-base font-black text-emerald">
                  {i + 1}
                </div>
                <p className="font-tajawal text-sm font-bold text-saffron">
                  {step.when}
                </p>
                <p className="mt-2 font-tajawal text-base font-bold text-white">
                  {step.result}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center font-tajawal text-sm text-white/70">
            للنتيجة الكاملة — استمري ٩٠ يوم. عشان كذا ٣ علب هي الأنصح.
          </p>
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

      {/* ════ FINAL CTA ════ */}
      <section className="py-16 bg-emerald text-ivory text-center">
        <div className="container mx-auto px-4 max-w-2xl">
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
