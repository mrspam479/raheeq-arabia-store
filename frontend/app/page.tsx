import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { StarRating } from '@/components/ui/StarRating';
import { COPY } from '@/data/copy';
import { PRODUCTS } from '@/data/products';
import { GLOBAL_REVIEWS, REVIEW_AGGREGATE } from '@/data/reviews';
import { GLOBAL_FAQS } from '@/data/faqs';
import { formatNumber } from '@/lib/price';

export const metadata: Metadata = {
  title: 'رحيق — حلوى للبشرة، الهالات، والشعر · دفع عند الاستلام',
  description:
    'حبّتين بالصباح. نتيجة في ٣٠ يوم — أو نردّ فلوسكِ. مكمّلات للبشرة، الهالات، والشعر، بطعم حلوى لذيذة. دفع عند الاستلام داخل المملكة.',
  openGraph: {
    title: 'رحيق — حلوى للبشرة، الهالات، والشعر',
    description: 'حبّتين بالصباح. نتيجة في ٣٠ يوم — أو نردّ فلوسكِ.',
    images: [{ url: '/images/hero/home-hero.svg', width: 1200, height: 630 }],
  },
};

/* ─────────────────────────────────────────────────────
   Single background: white (#FFFFFF) throughout.
   Text: emerald headings · charcoal body · saffron accents.
   CTA: #00C97A (one bright pop per page).
   Final section: dark emerald (intentional closer).
───────────────────────────────────────────────────── */

export default function HomePage() {
  return (
    <div className="bg-white">

      {/* ══ HERO ══════════════════════════════════════════ */}
      <section className="border-b border-[#EAE0D0] px-4 py-16 md:py-24">
        <div className="container mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 md:grid-cols-[1fr_0.9fr]">

          {/* Text */}
          <div className="text-center md:text-right">

            <p className="mb-4 inline-block font-tajawal text-sm font-bold text-saffron">
              🇸🇦 يُصنع للسعودية · فحص مخبري لكل دفعة
            </p>

            <h1
              className="font-tajawal font-black leading-[1.1] text-emerald"
              style={{ fontSize: 'clamp(2.4rem, 6vw, 4.8rem)' }}
            >
              حبّتين بالصباح.
              <span className="block text-saffron">ونتيجة تشوفينها بعينكِ.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-lg font-tajawal text-lg font-semibold leading-relaxed text-charcoal md:mx-0 md:text-xl">
              حلوى لذيذة — تعمل من داخل بشرتكِ وشعركِ.
              <span className="block mt-1 text-charcoal/70">
                ٣٠ يوم — أو نردّ فلوسكِ كاملة.
              </span>
            </p>

            <div className="mt-6 grid grid-cols-3 gap-2 max-w-md mx-auto md:mx-0">
              <div className="rounded-2xl border border-emerald/20 bg-[#F3FAF6] p-3 text-center">
                <p className="text-2xl">✨</p>
                <p className="mt-1 font-tajawal text-xs font-bold text-emerald">للبشرة</p>
              </div>
              <div className="rounded-2xl border border-emerald/20 bg-[#F3FAF6] p-3 text-center">
                <p className="text-2xl">👁️</p>
                <p className="mt-1 font-tajawal text-xs font-bold text-emerald">للهالات</p>
              </div>
              <div className="rounded-2xl border border-emerald/20 bg-[#F3FAF6] p-3 text-center">
                <p className="text-2xl">💇‍♀️</p>
                <p className="mt-1 font-tajawal text-xs font-bold text-emerald">للشعر</p>
              </div>
            </div>

            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row md:justify-start">
              <Button size="lg" variant="primary" asChild className="h-16 px-10 text-xl font-black">
                <Link href="/collection">اطلبي حبّتكِ — ١٩٩ ر.س</Link>
              </Button>
              <div className="text-center sm:text-right">
                <p className="font-tajawal text-sm font-bold text-emerald">💵 دفع عند الاستلام</p>
                <p className="font-tajawal text-xs text-charcoal/55">ما تحتاجين بطاقة · شحن ١-٣ أيام</p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3">
              <HeroProof number="4.9/5" label="تقييم" />
              <HeroProof number="+12k" label="عميلة" />
              <HeroProof number="1–3" label="أيام شحن" />
            </div>
          </div>

          {/* Product cards */}
          <div className="relative mx-auto w-full max-w-[460px]">
            <div className="relative grid grid-cols-3 items-end gap-3">
              {PRODUCTS.map((product, index) => (
                <Link
                  key={product.slug}
                  href={`/p/${product.slug}`}
                  className={`group rounded-[24px] border-2 border-[#E0D4C0] bg-[#FAFAF8] p-2 pb-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald/40 hover:shadow-md ${
                    index === 1 ? 'translate-y-6 md:translate-y-8' : ''
                  }`}
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
                    <Image
                      src={product.coverImageUrl}
                      alt={product.nameAr}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 30vw, 160px"
                    />
                  </div>
                  <p className="mt-2 text-center font-tajawal text-xs font-black leading-tight text-emerald md:text-sm">
                    {product.nameAr}
                  </p>
                </Link>
              ))}
            </div>
            <div className="mx-auto mt-10 max-w-xs rounded-2xl border-2 border-saffron/30 bg-[#FAFAF8] p-4 text-center shadow-sm">
              <p className="font-tajawal text-xs font-bold text-saffron">⭐ الأكثر طلبًا</p>
              <p className="mt-0.5 font-tajawal text-base font-black text-emerald">Glow Kit · 3 علب بـ 349 SAR</p>
              <p className="mt-0.5 font-tajawal text-xs text-charcoal/50">وفّري 248 SAR مقارنة بالشراء منفرد</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ PRODUCTS ══════════════════════════════════════ */}
      <section className="border-b border-[#EAE0D0] px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <p className="mb-2 font-tajawal text-sm font-bold text-saffron">{COPY.HOME.PRODUCTS_BADGE}</p>
            <h2 className="font-tajawal text-3xl font-black text-emerald md:text-4xl">
              {COPY.HOME.PRODUCTS_HEADING}
            </h2>
            <p className="mx-auto mt-3 max-w-xl font-tajawal text-base text-charcoal/65">
              {COPY.HOME.PRODUCTS_SUBHEADING}
            </p>
          </div>

          <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:pb-0">
            {PRODUCTS.map((product) => (
              <Link
                key={product.slug}
                href={`/p/${product.slug}`}
                className="group min-w-[82%] snap-center overflow-hidden rounded-[28px] border-2 border-[#E0D4C0] bg-[#FAFAF8] transition-all duration-300 hover:border-emerald/40 hover:shadow-lg md:min-w-0"
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={product.coverImageUrl}
                    alt={product.nameAr}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-tajawal text-xl font-black text-emerald">{product.nameAr}</h3>
                  <p className="mt-1 mb-3 font-tajawal text-sm text-charcoal/65 line-clamp-2">{product.heroTagAr}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-tajawal font-bold text-emerald">
                      {COPY.HOME.FROM_PRICE.replace('{price}', '199')}
                    </span>
                    <StarRating value={product.ratingValue} size="sm" />
                  </div>
                  <span className="mt-4 flex h-11 items-center justify-center rounded-xl bg-emerald font-tajawal text-sm font-bold text-white">
                    شوفي التفاصيل
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HIGH-AOV BUNDLE — Beauty Ritual Box ═══════════ */}
      <section className="border-b border-[#EAE0D0] bg-gradient-to-br from-[#FFF7E6] via-ivory to-[#FFEFD9] px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8 text-center">
            <span className="mb-3 inline-block rounded-full bg-emerald px-4 py-1.5 font-tajawal text-xs font-black text-saffron">
              💎 العرض الأقوى
            </span>
            <h2 className="font-tajawal text-3xl font-black leading-tight text-emerald md:text-4xl">
              صندوق الجمال الكامل
            </h2>
            <p className="mx-auto mt-3 max-w-2xl font-tajawal text-base text-charcoal/70">
              الـ ٣ منتجات معًا — لأن جمالكِ ما هو جزء واحد
            </p>
          </div>

          <div className="rounded-[28px] border-2 border-saffron/30 bg-white p-6 shadow-[0_24px_60px_rgba(18,107,82,0.15)] md:p-10">
            <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
              {/* Image placeholder */}
              <div className="relative flex aspect-square items-center justify-center rounded-3xl border-2 border-dashed border-emerald/25 bg-emerald/5">
                <div className="px-4 text-center">
                  <p className="mb-2 text-5xl">🎁</p>
                  <p className="font-tajawal text-sm font-bold text-emerald">
                    [صورة الـ ٣ منتجات معًا]
                  </p>
                  <p className="mt-1 font-tajawal text-xs text-charcoal/55">
                    نضرة + بريق + جذر بتغليف فاخر
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <ul className="flex flex-col gap-3">
                  {[
                    { icon: '✨', label: 'حبّة نضرة', desc: 'بشرة مشدودة وأقل تجاعيد' },
                    { icon: '👁️', label: 'حبّة بريق', desc: 'هالات أفتح وعيون متحمّسة' },
                    { icon: '💇‍♀️', label: 'حبّة جذر', desc: 'شعر أكثف ويوقف التساقط' },
                  ].map((item) => (
                    <li key={item.label} className="flex items-start gap-3 rounded-2xl border border-emerald/15 bg-[#F3FAF6] p-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <p className="font-tajawal text-sm font-black text-emerald">{item.label}</p>
                        <p className="font-tajawal text-xs text-charcoal/70">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="rounded-2xl border border-emerald/15 bg-emerald/5 p-4">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-tajawal text-sm text-charcoal/55 line-through">٥٩٧ ر.س</span>
                    <span className="rounded-full bg-saffron px-2.5 py-0.5 font-tajawal text-[11px] font-black text-emerald">
                      وفّري ١٠٠ ر.س
                    </span>
                  </div>
                  <p className="font-tajawal text-3xl font-black text-emerald">٤٩٩ ر.س</p>
                  <p className="mt-1 font-tajawal text-xs text-charcoal/60">
                    شحن مجاني · يكفي شهر كامل من الـ ٣ منتجات
                  </p>
                </div>

                <Button size="lg" variant="primary" asChild className="h-14 px-8 text-base font-black shadow-[0_18px_42px_rgba(18,107,82,0.30)]">
                  <Link href="/collection">اطلبي الصندوق الكامل · ٤٩٩ ر.س</Link>
                </Button>

                <p className="text-center font-tajawal text-[11px] text-charcoal/55">
                  💵 دفع عند الاستلام · 🚚 شحن مجاني · ↩️ ضمان ١٤ يوم
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ LIFESTYLE IMAGE DIVIDER ═══════════════════════ */}
      <section className="border-b border-[#EAE0D0] bg-white px-4 py-12">
        <div className="container mx-auto max-w-5xl">
          <div className="relative flex aspect-[21/9] items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-emerald/25 bg-emerald/5">
            <div className="px-4 text-center">
              <p className="font-tajawal text-2xl">📸</p>
              <p className="mt-2 font-tajawal text-sm font-bold text-emerald">
                [مكان لصورة لايف ستايل — Lifestyle banner]
              </p>
              <p className="mt-1 font-tajawal text-xs text-charcoal/55">
                صورة عريضة: امرأة سعودية تستمتع بفطورها مع علب رحيق
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══════════════════════════════════ */}
      <section className="border-b border-[#EAE0D0] px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-2 font-tajawal text-sm font-bold text-saffron">الطلب بـ ٣٠ ثانية</p>
            <h2 className="font-tajawal text-3xl font-black text-emerald md:text-4xl">
              ٣ خطوات. بدون تعقيد.
            </h2>
            <p className="mt-3 font-tajawal text-base text-charcoal/65">
              ما تحتاجين بطاقة. ما تحتاجين عنوان في الفورم. اسمكِ + جوالكِ فقط.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <TrustStep number="1" title="اختاري المنتج" body="نضرة للبشرة · بريق للهالات · جذر للشعر. اختاري واحد أو الثلاثة." />
            <TrustStep number="2" title="اكتبي اسمكِ وجوالكِ" body="فقط. ما نطلب بطاقة ولا عنوان في الفورم. ٣٠ ثانية وخلاص." featured />
            <TrustStep number="3" title="نتصل ونوصّل" body="نتصل للتأكيد، نشحن خلال ١-٣ أيام، وتدفعين عند الاستلام." />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
            {['✓ اتصال تأكيد قبل الشحن', '✓ ضمان رضا 14 يوم', '✓ فحص مخبري لكل دفعة'].map((item) => (
              <p key={item} className="rounded-2xl border border-emerald/15 bg-[#F3FAF6] px-4 py-3 text-center font-tajawal text-sm font-bold text-emerald">
                {item}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ══ INGREDIENTS ═══════════════════════════════════ */}
      <section className="border-b border-[#EAE0D0] px-4 py-20">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <p className="mb-2 font-tajawal text-sm font-bold text-saffron">{COPY.HOME.INGREDIENTS_BADGE}</p>
            <h2 className="font-tajawal text-3xl font-black text-emerald md:text-4xl">
              {COPY.HOME.INGREDIENTS_HEADING}
            </h2>
            <p className="mx-auto mt-3 max-w-xl font-tajawal text-base text-charcoal/65">
              {COPY.HOME.INGREDIENTS_BODY}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {COPY.HOME.TRUST_PILLS.map((pill) => (
              <div
                key={pill}
                className="flex items-center justify-center rounded-2xl border border-emerald/15 bg-[#F3FAF6] px-4 py-4 text-center"
              >
                <span className="font-tajawal text-sm font-bold text-emerald">{pill}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ REVIEWS ═══════════════════════════════════════ */}
      <section className="border-b border-[#EAE0D0] px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <p className="mb-2 font-tajawal text-sm font-bold text-saffron">{COPY.HOME.REVIEWS_BADGE}</p>
            <h2 className="font-tajawal text-3xl font-black text-emerald md:text-4xl">
              {COPY.HOME.REVIEWS_HEADING}
            </h2>
            <div className="mt-3 flex items-center justify-center gap-2">
              <StarRating value={REVIEW_AGGREGATE.averageRating} showValue size="lg" />
              <span className="font-tajawal text-sm text-charcoal/55">
                ({formatNumber(REVIEW_AGGREGATE.totalReviews)} تقييم)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {GLOBAL_REVIEWS.slice(0, 6).map((r) => (
              <div
                key={r.id}
                className="flex flex-col gap-3 rounded-[24px] border border-[#E0D4C0] bg-[#FAFAF8] p-5"
              >
                <StarRating value={r.rating} size="sm" />
                <p className="flex-1 font-tajawal text-sm leading-relaxed text-charcoal">
                  &ldquo;{r.bodyAr}&rdquo;
                </p>
                <div className="flex items-center gap-2 border-t border-[#EAE0D0] pt-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald/10">
                    <span className="font-tajawal text-xs font-black text-emerald">
                      {r.authorFirstNameAr[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-tajawal text-xs font-bold text-emerald">{r.authorFirstNameAr}</p>
                    <p className="font-tajawal text-[10px] text-charcoal/45">{r.authorCityAr}</p>
                  </div>
                  <span className="ms-auto rounded-full border border-saffron/25 bg-saffron/8 px-2 py-0.5 font-tajawal text-[10px] font-bold text-saffron">
                    {r.productNameAr}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FAQ ═══════════════════════════════════════════ */}
      <section className="border-b border-[#EAE0D0] px-4 py-20">
        <div className="container mx-auto max-w-2xl">
          <div className="mb-10 text-center">
            <h2 className="font-tajawal text-3xl font-black text-emerald">{COPY.HOME.FAQ_HEADING}</h2>
          </div>
          <div className="flex flex-col divide-y divide-[#EAE0D0]">
            {GLOBAL_FAQS.slice(0, 6).map((faq) => (
              <FaqItem key={faq.id} question={faq.questionAr} answer={faq.answerAr} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA — the one dark accent ══════════════ */}
      <section className="bg-emerald px-4 py-20 text-center">
        <div className="container mx-auto max-w-xl">
          <h2 className="font-tajawal text-3xl font-black text-white md:text-4xl">
            {COPY.HOME.FINAL_CTA_HEADING}
          </h2>
          <p className="mx-auto mt-4 font-tajawal text-base text-white/70">
            {COPY.HOME.FINAL_CTA_BODY}
          </p>
          <div className="mt-8">
            <Button size="lg" variant="primary" asChild className="h-16 px-12 text-xl font-black">
              <Link href="/collection">{COPY.HOME.FINAL_CTA_BUTTON}</Link>
            </Button>
          </div>
          <p className="mt-4 font-tajawal text-sm text-white/55">
            دفع عند الاستلام · بدون بطاقة · شحن 1–3 أيام
          </p>
        </div>
      </section>

    </div>
  );
}

/* ─── Sub-components ──────────────────────────────── */

function HeroProof({ number, label }: { number: string; label: string }) {
  return (
    <div className="rounded-2xl border border-emerald/15 bg-[#F3FAF6] px-3 py-3.5 text-center">
      <p className="font-inter text-xl font-black text-emerald md:text-2xl">{number}</p>
      <p className="mt-0.5 font-tajawal text-xs font-semibold text-charcoal/55">{label}</p>
    </div>
  );
}

function TrustStep({
  number,
  title,
  body,
  featured = false,
}: {
  number: string;
  title: string;
  body: string;
  featured?: boolean;
}) {
  return (
    <div
      className={`relative rounded-[28px] p-6 text-right transition-transform hover:-translate-y-1 ${
        featured
          ? 'border-[3px] border-[#00C97A] bg-white shadow-[0_20px_48px_rgba(0,201,122,0.14)]'
          : 'border border-[#E0D4C0] bg-[#FAFAF8]'
      }`}
    >
      {featured && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#00C97A] px-4 py-1 font-tajawal text-[11px] font-black text-[#082a1c] shadow">
          ✓ الخطوة الأهم
        </div>
      )}
      <div
        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl font-inter text-xl font-black ${
          featured ? 'bg-[#00C97A] text-[#082a1c]' : 'bg-emerald/10 text-emerald'
        }`}
      >
        {number}
      </div>
      <h3 className="font-tajawal text-xl font-black text-emerald">{title}</h3>
      <p className="mt-2 font-tajawal text-sm leading-relaxed text-charcoal/70">{body}</p>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group cursor-pointer py-5">
      <summary className="flex list-none items-center justify-between gap-3 font-tajawal text-base font-semibold text-emerald">
        {question}
        <svg
          className="h-4 w-4 shrink-0 transition-transform duration-200 group-open:rotate-45"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </summary>
      <p className="mt-3 font-tajawal text-sm leading-relaxed text-charcoal/65">{answer}</p>
    </details>
  );
}
