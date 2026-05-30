import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { StarRating } from '@/components/ui/StarRating';
import { COPY } from '@/data/copy';
import { MAIN_PRODUCTS, BUNDLE_PRODUCT } from '@/data/products';
import { formatNumber, formatSar } from '@/lib/price';

export const metadata: Metadata = {
  title: 'المجموعة — حبّة نضرة، حبّة بريق، حبّة جذر · رحيق',
  description: 'ثلاث حبّات — ثلاث طقوس. تجاعيد، هالات، وشعر. اختاري الباقة التي تليق بكِ.',
};

export default function CollectionPage() {
  const { HERO, COMBO } = COPY.COLLECTION;

  return (
    <>
      {/* Hero */}
      <section className="bg-emerald text-ivory py-16 md:py-24 text-center">
        <div className="container mx-auto px-4">
          <Badge variant="saffron" className="mb-4">{HERO.EYEBROW}</Badge>
          <h1 className="font-tajawal font-black text-4xl md:text-5xl mb-4">{HERO.H1}</h1>
          <p className="font-tajawal text-lg text-ivory/80 max-w-xl mx-auto">{HERO.SUB}</p>
        </div>
      </section>

      {/* Product grid */}
      <section className="py-16 bg-ivory">
        <div className="container mx-auto px-4">
          {/* Bundle hero card — always at the top */}
          <Link
            href={`/p/${BUNDLE_PRODUCT.slug}`}
            prefetch
            className="group block max-w-5xl mx-auto mb-10 rounded-3xl border-2 border-saffron/40 bg-white p-6 md:p-8 shadow-[0_24px_60px_rgba(18,107,82,0.12)] hover:border-saffron transition-all"
          >
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-6 items-center">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-stone-100">
                <Image
                  src={BUNDLE_PRODUCT.coverImageUrl}
                  alt={BUNDLE_PRODUCT.nameAr}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
                <span className="absolute top-3 right-3 rounded-full bg-saffron px-3 py-1 font-tajawal text-xs font-black text-emerald shadow">
                  💎 الأكثر طلبًا
                </span>
              </div>
              <div>
                <h2 className="font-tajawal font-black text-3xl text-emerald">{BUNDLE_PRODUCT.nameAr}</h2>
                <p className="mt-2 font-tajawal text-base text-charcoal/70">{BUNDLE_PRODUCT.heroTagAr}</p>
                <div className="mt-4 flex items-center gap-3">
                  <span className="font-tajawal text-2xl font-black text-emerald">{formatSar(499)}</span>
                  <span className="font-tajawal text-sm text-charcoal/55 line-through">{formatSar(597)}</span>
                  <span className="rounded-full bg-emerald/10 px-2.5 py-0.5 font-tajawal text-[11px] font-bold text-emerald">
                    وفّري {formatSar(100)}
                  </span>
                </div>
                <span className="mt-5 inline-flex h-12 items-center justify-center rounded-xl bg-emerald px-6 font-tajawal text-sm font-bold text-white group-hover:bg-emerald/90 transition">
                  شوفي الصندوق ←
                </span>
              </div>
            </div>
          </Link>

          {/* OR — divider */}
          <div className="max-w-5xl mx-auto mb-8 flex items-center gap-3">
            <div className="flex-1 h-px bg-stone-200" />
            <span className="font-tajawal text-xs font-bold text-charcoal/50">أو اختاري منتج فردي</span>
            <div className="flex-1 h-px bg-stone-200" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {MAIN_PRODUCTS.map((product) => (
              <article
                key={product.slug}
                className="group rounded-2xl border border-stone-200 overflow-hidden hover:shadow-xl hover:border-emerald/30 transition-all duration-300 bg-white flex flex-col"
              >
                <Link href={`/p/${product.slug}`} prefetch className="block relative aspect-square overflow-hidden">
                  <Image
                    src={product.coverImageUrl}
                    alt={product.nameAr}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </Link>
                <div className="p-6 flex flex-col flex-1 gap-3">
                  <div>
                    <Link href={`/p/${product.slug}`} prefetch>
                      <h2 className="font-tajawal font-bold text-2xl text-emerald hover:text-emerald/80 transition-colors">
                        {product.nameAr}
                      </h2>
                    </Link>
                    <p className="font-tajawal text-sm text-charcoal/60 mt-1 line-clamp-1">{product.heroTagAr}</p>
                  </div>

                  <p className="font-tajawal text-sm text-charcoal/70 line-clamp-2 flex-1">
                    {product.shortDescriptionAr}
                  </p>

                  <div className="flex items-center gap-2">
                    <StarRating value={product.ratingValue} size="sm" />
                    <span className="font-tajawal text-xs text-charcoal/50">
                      ({formatNumber(product.reviewCount)})
                    </span>
                  </div>

                  {/* Offer tiles row */}
                  <div className="flex gap-2">
                    {product.offers.map((offer) => (
                      <div
                        key={offer.code}
                        className={`flex-1 rounded-lg border p-2 text-center transition-colors ${
                          offer.isRecommended
                            ? 'border-emerald bg-emerald text-ivory'
                            : 'border-stone-200 text-charcoal/70'
                        }`}
                      >
                        <p className="font-tajawal text-[10px] font-medium">{offer.labelAr}</p>
                        <p className="font-tajawal text-xs font-bold mt-0.5">
                          {formatSar(offer.priceSar)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Link
                    href={`/p/${product.slug}`}
                    prefetch
                    className="mt-1 block w-full py-3 px-4 bg-emerald text-ivory font-tajawal font-semibold text-center rounded-xl hover:bg-emerald/90 transition-colors"
                  >
                    {COPY.CTA.SHOP_NOW}
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Combo note */}
          <div className="mt-16 max-w-2xl mx-auto text-center p-8 rounded-2xl bg-emerald/5 border border-emerald/15">
            <Badge variant="saffron" className="mb-3">{COMBO.HEADING}</Badge>
            <p className="font-tajawal text-charcoal/70 text-sm leading-relaxed">{COMBO.NOTE}</p>
          </div>
        </div>
      </section>
    </>
  );
}
