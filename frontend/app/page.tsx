import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { StarRating } from '@/components/ui/StarRating';
import { COPY } from '@/data/copy';
import { MAIN_PRODUCTS } from '@/data/products';
import { formatSar } from '@/lib/price';
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
  const issueCards = [
    {
      icon: '✨',
      issue: 'تجاعيد + بهتان',
      product: 'حبّة نضرة',
      solution: 'كولاجين + أستازانتين',
      outcome: 'لبشرة أصفى ومشدودة من الداخل',
    },
    {
      icon: '👁️',
      issue: 'هالات سوداء',
      product: 'حبّة بريق',
      solution: 'حديد + حمض فوليك',
      outcome: 'لوجه أفتح بدون كونسيلر يومي',
    },
    {
      icon: '💇‍♀️',
      issue: 'تساقط وفراغات',
      product: 'حبّة جذر',
      solution: 'بيوتين + كولاجين + كيراتين',
      outcome: 'لشعر أقوى وأكثف من الجذر',
    },
  ];

  return (
    <div className="bg-white">

      {/* ══ HERO — Bundle focused, high AOV ═════════════════════════ */}
      <section className="border-b border-[#EAE0D0] px-4 py-16 md:py-24">
        <div className="container mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 md:grid-cols-[1fr_1fr]">

          {/* Text */}
          <div className="text-center md:text-right">

            <p className="mb-4 inline-block font-tajawal text-sm font-bold text-saffron">
              🇸🇦 يُصنع للسعودية · فحص مخبري لكل دفعة
            </p>

            <h1
              className="font-tajawal font-black leading-[1.1] text-emerald"
              style={{ fontSize: 'clamp(2.4rem, 6vw, 4.4rem)' }}
            >
              تعبتي من الترقيع؟
              <span className="block mt-2 text-3xl md:text-4xl">بشرة باهتة، هالات واضحة، وشعر يتساقط؟</span>
            </h1>

            <p className="mx-auto mt-6 max-w-lg font-tajawal text-lg font-bold leading-relaxed text-charcoal md:mx-0 md:text-xl">
              لا تضيعين فلوسكِ على كريمات وزيوت مؤقتة.
              <span className="block mt-1 text-emerald">
                الحل الجذري يبدأ من الداخل — صندوق الجمال المتكامل.
              </span>
            </p>

            <div className="mt-6 grid grid-cols-3 gap-2 max-w-md mx-auto md:mx-0">
              <div className="rounded-2xl border border-emerald/20 bg-[#F3FAF6] p-3 text-center">
                <p className="text-2xl">✨</p>
                <p className="mt-1 font-tajawal text-[11px] font-bold text-emerald">بشرة نضرة<br/>(حبّة نضرة)</p>
              </div>
              <div className="rounded-2xl border border-emerald/20 bg-[#F3FAF6] p-3 text-center">
                <p className="text-2xl">👁️</p>
                <p className="mt-1 font-tajawal text-[11px] font-bold text-emerald">مسح الهالات<br/>(حبّة بريق)</p>
              </div>
              <div className="rounded-2xl border border-emerald/20 bg-[#F3FAF6] p-3 text-center">
                <p className="text-2xl">💇‍♀️</p>
                <p className="mt-1 font-tajawal text-[11px] font-bold text-emerald">إيقاف التساقط<br/>(حبّة جذر)</p>
              </div>
            </div>

            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row md:justify-start">
              <Button size="lg" variant="primary" asChild className="h-16 px-8 text-lg font-black shadow-lg">
                <Link href="/p/bundle-glow-trio">اطلبي الصندوق الكامل — ووفري {formatSar(100)}</Link>
              </Button>
              <div className="text-center sm:text-right">
                <p className="font-tajawal text-sm font-bold text-emerald">💵 دفع عند الاستلام</p>
                <p className="font-tajawal text-xs text-charcoal/55">ما تحتاجين بطاقة · شحن ١-٣ أيام</p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 max-w-md mx-auto md:mx-0">
              <HeroProof number="4.9/5" label="تقييم" />
              <HeroProof number="60" label="يوم للنتيجة" />
              <HeroProof number="1–3" label="أيام شحن" />
            </div>
          </div>

          {/* Hero visual — bundle image */}
          <div className="relative mx-auto w-full max-w-[500px]">
            <Link
              href="/p/bundle-glow-trio"
              prefetch
              className="group block overflow-hidden rounded-[28px] border-2 border-[#E0D4C0] bg-[#FAFAF8] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald/40 hover:shadow-md"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#f8f6f0]">
                <Image
                  src="/images/products/bundle-glow-trio/cover.png"
                  alt="رحيق — صندوق الجمال المتكامل"
                  fill
                  className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 90vw, 500px"
                  priority
                />
                <span className="absolute top-3 right-3 rounded-full bg-saffron px-3 py-1 font-tajawal text-xs font-black text-emerald shadow">
                  💎 الأكثر طلبًا
                </span>
                <span className="absolute bottom-3 left-3 rounded-full bg-emerald px-3 py-1 font-tajawal text-[10px] font-black text-white shadow">
                  وفرّي {formatSar(100)}
                </span>
              </div>
              <div className="p-5 text-center">
                <p className="font-tajawal text-xl font-black text-emerald">
                  صندوق الجمال المتكامل
                </p>
                <p className="mt-1 font-tajawal text-sm text-charcoal/70">
                  روتينكِ اليومي من الداخل · يكفي لشهر كامل
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ══ PICK YOUR ISSUE — products front and center ═════ */}
      <section className="border-b border-[#EAE0D0] bg-white px-4 py-16 md:py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <span className="mb-3 inline-block rounded-full bg-saffron/15 px-4 py-1.5 font-tajawal text-xs font-black text-saffron">
              ✨ اختاري مشكلتكِ — نعطيكِ الحل
            </span>
            <h2 className="font-tajawal text-4xl font-black leading-tight text-emerald md:text-5xl">
              شوفي مشكلتكِ. اختاري الحل فورًا.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl font-tajawal text-base text-charcoal/65 md:text-lg">
              بدون قراءة طويلة: كل بطاقة تقول لكِ المشكلة، المنتج، والمكوّن الأساسي.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {MAIN_PRODUCTS.map((product, idx) => {
              const card = issueCards[idx] ?? {
                icon: '✨',
                issue: product.nameAr,
                product: product.nameAr,
                solution: 'حل من الداخل',
                outcome: product.heroTagAr,
              };
              return (
                <Link
                  key={product.slug}
                  href={`/p/${product.slug}`}
                  prefetch
                  className="group flex flex-col overflow-hidden rounded-[32px] border-2 border-[#E0D4C0] bg-white transition-all duration-300 hover:-translate-y-2 hover:border-emerald hover:shadow-[0_24px_60px_rgba(18,107,82,0.18)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#FAFAF8]">
                    <Image
                      src={product.coverImageUrl}
                      alt={product.nameAr}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      priority={idx === 0}
                    />
                    <div className="absolute inset-x-3 bottom-3 rounded-2xl border border-white/60 bg-white/92 p-3 text-right shadow-lg backdrop-blur">
                      <p className="font-tajawal text-[11px] font-black text-red-600">
                        المشكلة: {card.issue}
                      </p>
                      <div className="mt-1 flex items-center justify-between gap-2">
                        <p className="font-tajawal text-sm font-black text-emerald">
                          {card.icon} الحل: {card.product}
                        </p>
                        <span className="rounded-full bg-emerald/10 px-2 py-1 font-tajawal text-[9px] font-black text-emerald">
                          {card.solution}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-tajawal text-2xl font-black text-emerald">{card.issue}</h3>
                    <p className="mt-2 font-tajawal text-sm leading-relaxed text-charcoal/70 line-clamp-2">
                      {card.outcome}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <p className="font-tajawal text-[11px] text-charcoal/55">يبدأ من</p>
                        <p className="font-tajawal text-2xl font-black text-emerald">{formatSar(199)}</p>
                      </div>
                      <StarRating value={product.ratingValue} size="sm" />
                    </div>
                    <span className="mt-5 flex h-12 items-center justify-center gap-2 rounded-xl bg-[#00C97A] font-tajawal text-base font-black text-[#082a1c] transition-all group-hover:scale-[1.02]">
                      اطلبيها الآن ←
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ MISSION STATEMENT ═════════════════════════════ */}
      <section className="border-b border-[#EAE0D0] bg-emerald px-4 py-16 md:py-20">
        <div className="container mx-auto max-w-3xl text-center">
          <span className="mb-4 inline-block rounded-full bg-saffron/20 px-4 py-1.5 font-tajawal text-xs font-black text-saffron">
            رسالة رحيق
          </span>
          <h2 className="font-tajawal text-2xl font-black leading-snug text-saffron md:text-3xl">
            نؤمن أن الجمال الحقيقي يبدأ من الداخل.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl font-tajawal text-base leading-relaxed text-white/80">
            في رحيق، ما نبيع وعود فارغة. نبيع مكوّنات مثبتة علميًا، بجرعات فعّالة، في حلوى تحبّينها. كل علبة تمرّ بفحص مخبري، وكل تركيبة حلال ١٠٠٪. هدفنا بسيط — إن حبّتين بالصباح تخلّي بشرتكِ وشعركِ وعيونكِ أحلى من أمس.
          </p>
          <div className="mx-auto mt-8 flex flex-wrap justify-center gap-4">
            {['🧪 مكوّنات مثبتة', '🔬 فحص مخبري كل دفعة', '☪️ حلال ١٠٠٪', '💵 دفع عند الاستلام'].map((badge) => (
              <span key={badge} className="rounded-full border border-saffron/30 bg-white/10 px-4 py-2 font-tajawal text-xs font-bold text-saffron backdrop-blur-sm">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HIGH-AOV BUNDLE — Beauty Ritual Box ═══════════ */}
      <section className="border-b border-[#EAE0D0] bg-gradient-to-br from-[#FFF7E6] via-ivory to-[#FFEFD9] px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8 text-center">
            <span className="mb-3 inline-block rounded-full bg-emerald px-4 py-1.5 font-tajawal text-xs font-black text-saffron">
              💎 العرض الأقوى للنتيجة الأكفى
            </span>
            <h2 className="font-tajawal text-3xl font-black leading-tight text-emerald md:text-4xl">
              صندوق الجمال المتكامل
            </h2>
            <p className="mx-auto mt-3 max-w-2xl font-tajawal text-base text-charcoal/70">
              الـ ٣ منتجات معًا — لأن الجمال الحقيقي لا يتجزأ. عوّضي النقص من الداخل.
            </p>
          </div>

          <div className="rounded-[28px] border-2 border-saffron/30 bg-white p-6 shadow-[0_24px_60px_rgba(18,107,82,0.15)] md:p-10">
            <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-[#f8f6f0] border border-[#EAE0D0] p-4">
                <Image
                  src="/images/products/bundle-glow-trio/cover.png"
                  alt="صندوق الجمال المتكامل — نضرة + بريق + جذر"
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
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

                <div className="rounded-2xl border border-emerald/15 bg-emerald/5 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-emerald/10 pb-2">
                    <span className="font-tajawal text-sm text-charcoal/70">شراء فردي للـ 3</span>
                    <span className="font-tajawal text-base text-charcoal/55 line-through">
                      {formatSar(597)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-tajawal text-sm font-bold text-emerald">سعر الصندوق</p>
                      <p className="font-tajawal text-[11px] font-bold text-saffron">
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

                <Button size="lg" variant="primary" asChild className="h-14 px-8 text-base font-black shadow-[0_18px_42px_rgba(18,107,82,0.30)]">
                  <Link href="/p/bundle-glow-trio" prefetch>
                    اطلبي الصندوق · {formatSar(499)}
                  </Link>
                </Button>

                <p className="text-center font-tajawal text-[11px] text-charcoal/55">
                  💵 دفع عند الاستلام · 🚚 شحن مجاني · ↩️ ضمان 14 يوم
                </p>
              </div>
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
