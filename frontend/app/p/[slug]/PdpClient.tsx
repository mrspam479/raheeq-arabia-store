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
import Link from 'next/link';

interface PdpClientProps {
  product: Product;
  benefits: string[];
  howToUse: string[];
  whyHeading: string;
  whyBody: string;
  crossSells: Product[];
}

export function PdpClient({
  product,
  benefits,
  howToUse,
  whyHeading,
  whyBody,
  crossSells,
}: PdpClientProps) {
  const { addLine, openCart } = useCartStore();
  const [selectedTier, setSelectedTier] = useState<1 | 2 | 3>(3); // Default T3 (Glow Kit)
  const [activeImage, setActiveImage] = useState(0);

  const selectedOffer = product.offers.find((o) => o.code === `T${selectedTier}`)!;
  const productSwitcherItems = [product, ...crossSells];

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
    });
    openCart();
    showToast(COPY.TOAST.ADDED, 'success');
    trackAddToCart(product.slug, selectedOffer.priceSar, selectedOffer.quantity);
  };

  return (
    <>
      {/* Main PDP section */}
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

            {/* Product info */}
            <div className="flex flex-col gap-5 rounded-[28px] border border-emerald/10 bg-white p-5 shadow-[0_18px_55px_rgba(74,56,46,0.08)] md:p-6">
              {/* Trust badges */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="ivory">{COPY.BADGES.COD}</Badge>
                <Badge variant="ivory">{COPY.BADGES.LAB_TESTED}</Badge>
                <Badge variant="ivory">{COPY.BADGES.VEGAN}</Badge>
              </div>

              {/* Title */}
              <div>
                <h1 className="font-tajawal font-black text-3xl md:text-4xl text-emerald">
                  {product.nameAr}
                </h1>
                <p className="font-cormorant italic text-lg text-saffron mt-1">
                  {product.heroTagAr}
                </p>
              </div>

              <div className="rounded-2xl bg-ivory p-2">
                <p className="mb-2 px-2 font-tajawal text-xs font-bold text-emerald">
                  اختاري طقس رحيق:
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {productSwitcherItems.map((item) => {
                    const isActive = item.slug === product.slug;
                    return (
                      <Link
                        key={item.slug}
                        href={`/p/${item.slug}`}
                        className={cn(
                          'flex min-h-[44px] items-center justify-center rounded-xl border px-2 py-1.5 text-center font-tajawal text-xs font-bold leading-tight transition-all',
                          isActive
                            ? 'border-saffron bg-emerald text-white shadow-sm'
                            : 'border-emerald/10 bg-white text-emerald hover:border-emerald/30 hover:bg-emerald/5',
                        )}
                      >
                        {item.nameAr}
                      </Link>
                    );
                  })}
                </div>
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

              <div className="rounded-2xl border border-emerald/10 bg-ivory p-4">
                <p className="mb-1 font-tajawal text-xs font-bold text-saffron">
                  العرض واضح:
                </p>
                <p className="font-tajawal text-base font-bold leading-relaxed text-emerald">
                  3 علب بسعر 349 SAR — الأفضل لدورة 90 يوم.
                </p>
                <p className="mt-1 font-tajawal text-sm leading-relaxed text-charcoal/75">
                  {product.shortDescriptionAr}
                </p>
              </div>

              {/* Benefits */}
              <ul className="flex flex-col gap-2">
                {benefits.map((b) => (
                  <li key={b} className="flex items-center gap-2 font-tajawal text-sm font-medium text-charcoal/85">
                    <span className="w-5 h-5 rounded-full bg-saffron/20 text-emerald flex items-center justify-center text-[11px] font-bold">
                      ✓
                    </span>
                    {b}
                  </li>
                ))}
              </ul>

              {/* Offer selector */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-tajawal font-bold text-sm text-emerald">
                    اختاري الكميّة:
                  </p>
                  <span className="rounded-full bg-red-50 px-2.5 py-0.5 font-tajawal text-[11px] font-bold text-red-600">
                    ⏳ العرض لفترة محدودة
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  {product.offers.map((offer) => {
                    const tier = parseInt(offer.code.replace('T', '')) as 1 | 2 | 3;
                    const isActive = selectedTier === tier;
                    return (
                      <button
                        key={offer.code}
                        onClick={() => setSelectedTier(tier)}
                        className={cn(
                          'relative flex w-full items-center justify-between rounded-2xl border-[3px] px-4 py-4 text-right transition-all duration-200',
                          isActive
                            ? 'border-[#00C97A] bg-white shadow-[0_8px_28px_rgba(0,201,122,0.18)]'
                            : 'border-[#ddd0bc] bg-[#fafaf8] opacity-65 hover:opacity-100 hover:border-[#00C97A]/50',
                        )}
                        aria-pressed={isActive}
                      >
                        {/* Checkmark — selected */}
                        <span className={cn(
                          'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all',
                          isActive
                            ? 'border-[#00C97A] bg-[#00C97A]'
                            : 'border-[#ccc4b8] bg-white',
                        )}>
                          {isActive && (
                            <svg className="h-3.5 w-3.5 text-[#082a1c]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5} aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </span>

                        {/* Label + hint */}
                        <div className="mx-3 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-tajawal text-base font-black text-charcoal">
                              {getOfferTitle(tier)}
                            </span>
                            {offer.isRecommended && (
                              <span className={cn(
                                'inline-flex rounded-full px-2 py-0.5 text-[10px] font-tajawal font-bold',
                                isActive ? 'bg-[#00C97A] text-[#082a1c]' : 'bg-emerald text-white',
                              )}>
                                الأنصح
                              </span>
                            )}
                          </div>
                          <span className={cn(
                            'block font-tajawal text-xs',
                            isActive ? 'text-charcoal/65' : 'text-charcoal/40',
                          )}>
                            {getOfferHint(tier)}
                          </span>
                        </div>

                        {/* Price */}
                        <span className={cn(
                          'font-tajawal text-lg font-black',
                          isActive ? 'text-[#00A85A]' : 'text-charcoal/45',
                        )}>
                          {formatSar(offer.priceSar)}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <p className="mt-2 text-center font-tajawal text-xs text-charcoal/55">
                  استفيدي من العرض — الأكثر توفيرًا هو Glow Kit
                </p>
              </div>

              {/* Stock label */}
              <p className="font-tajawal text-xs text-red-600 font-medium">
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

              <p className="rounded-xl bg-saffron/15 px-4 py-3 text-center font-tajawal text-sm font-bold text-emerald">
                لا تحتاجين عنوان الآن — ندق عليكِ ونوصّلها لكِ والدفع عند الاستلام.
              </p>

              {/* Trust row */}
              <div className="flex flex-wrap gap-3 justify-center">
                {[COPY.BADGES.COD, COPY.BADGES.FAST_SHIP, COPY.BADGES.HALAL].map((badge) => (
                  <span key={badge} className="font-tajawal text-xs text-charcoal/60 flex items-center gap-1">
                    ✓ {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why section */}
      <section className="py-16 bg-stone-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="font-tajawal font-bold text-2xl md:text-3xl text-emerald mb-4">
            {whyHeading}
          </h2>
          <p className="font-tajawal text-base text-charcoal/80 leading-relaxed">
            {whyBody}
          </p>
        </div>
      </section>

      {/* Ingredients */}
      <section className="py-16 bg-ivory">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="font-tajawal font-bold text-2xl md:text-3xl text-emerald mb-8">
            المكوّنات الفعّالة
          </h2>
          <div className="flex flex-col divide-y divide-stone-200">
            {product.ingredients.map((ing) => (
              <div key={ing.nameAr} className="py-5 flex flex-col md:flex-row gap-3 md:gap-6">
                <div className="md:w-1/3">
                  <p className="font-tajawal font-bold text-base text-emerald">{ing.nameAr}</p>
                  <p className="font-inter text-xs text-charcoal/50 mt-0.5">{ing.nameEn}</p>
                  <Badge variant="ivory" className="mt-1">{ing.dose}</Badge>
                </div>
                <div className="md:w-2/3">
                  <p className="font-tajawal text-sm text-charcoal/80 leading-relaxed">
                    {ing.whatItDoesAr}
                  </p>
                  <p className="font-inter text-[11px] text-charcoal/40 mt-1 italic">
                    {ing.scienceSourceShort}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to use */}
      <section className="py-16 bg-emerald text-ivory">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="font-tajawal font-bold text-2xl md:text-3xl mb-8">
            طريقة الاستخدام
          </h2>
          <ol className="flex flex-col gap-4">
            {howToUse.map((step, i) => (
              <li key={i} className="flex gap-4 items-start">
                <span className="w-7 h-7 rounded-full bg-saffron text-emerald font-tajawal font-bold text-sm flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <p className="font-tajawal text-base text-ivory/90 leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 bg-stone-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="font-tajawal font-bold text-2xl md:text-3xl text-emerald mb-8">
            ماذا قالت عميلاتنا؟
          </h2>
          <div className="flex flex-col gap-4">
            {product.reviews.map((review, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-stone-200">
                <StarRating value={review.rating} size="sm" />
                <p className="font-tajawal text-sm text-charcoal leading-relaxed mt-3">
                  &ldquo;{review.bodyAr}&rdquo;
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <div className="w-6 h-6 rounded-full bg-emerald/10 flex items-center justify-center">
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

      {/* FAQs */}
      <section className="py-16 bg-ivory">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="font-tajawal font-bold text-2xl md:text-3xl text-emerald mb-8">
            أسئلة شائعة
          </h2>
          <div className="flex flex-col divide-y divide-stone-200">
            {product.faqs.map((faq, i) => (
              <details key={i} className="group py-5 cursor-pointer">
                <summary className="font-tajawal font-semibold text-base text-emerald flex items-center justify-between gap-3 list-none">
                  {faq.questionAr}
                  <svg
                    className="w-4 h-4 shrink-0 transition-transform duration-200 group-open:rotate-45"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </summary>
                <p className="font-tajawal text-sm text-charcoal/70 leading-relaxed mt-3">
                  {faq.answerAr}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-sells */}
      {crossSells.length > 0 && (
        <section className="py-16 bg-stone-50">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="font-tajawal font-bold text-2xl text-emerald mb-8 text-center">
              يضيف لتجربتكِ
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {crossSells.map((p) => (
                <Link
                  key={p.slug}
                  href={`/p/${p.slug}`}
                  className="group flex gap-4 p-5 bg-white rounded-2xl border border-stone-200 hover:border-emerald/30 hover:shadow-md transition-all"
                >
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                    <Image
                      src={p.coverImageUrl}
                      alt={p.nameAr}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="80px"
                    />
                  </div>
                  <div>
                    <h3 className="font-tajawal font-bold text-lg text-emerald">{p.nameAr}</h3>
                    <p className="font-tajawal text-sm text-charcoal/60 mt-1">{p.heroTagAr}</p>
                    <p className="font-tajawal font-bold text-emerald mt-2">
                      {formatSar(p.offers[0]?.priceSar ?? 199)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Disclaimer */}
      <section className="py-8 bg-ivory border-t border-stone-200">
        <div className="container mx-auto px-4 max-w-3xl">
          <p className="font-tajawal text-xs text-charcoal/50 leading-relaxed text-center">
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
  return 'Glow Kit';
}

function getOfferHint(tier: 1 | 2 | 3): string {
  if (tier === 1) return 'تجربة سريعة';
  if (tier === 2) return 'قيمة أفضل';
  return 'الأكثر طلبًا';
}
