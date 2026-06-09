import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { StarRating } from '@/components/ui/StarRating';
import { MAIN_PRODUCTS } from '@/data/products';
import { formatSar } from '@/lib/price';
import { GLOBAL_REVIEWS, REVIEW_AGGREGATE } from '@/data/reviews';
import { GLOBAL_FAQS } from '@/data/faqs';
import { formatNumber } from '@/lib/price';

export const metadata: Metadata = {
  title: 'رحيق — مكمّلات جمال من الداخل · بشرة، هالات، شعر · دفع عند الاستلام',
  description:
    'حبّتين بالصباح. نتيجة في ٣٠ يوم — أو نردّ فلوسكِ. مكمّلات للبشرة، الهالات، والشعر، بطعم حلوى لذيذة. دفع عند الاستلام داخل المملكة.',
  openGraph: {
    title: 'رحيق — مكمّلات جمال من الداخل',
    description: 'حبّتين بالصباح. نتيجة في ٣٠ يوم — أو نردّ فلوسكِ.',
    images: [{ url: '/images/hero/home-hero.svg', width: 1200, height: 630 }],
  },
};

export default function HomePage() {
  return (
    <div className="bg-white">

      {/* ══ HERO — High-impact, single focus: bundle ═══════════════════ */}
      <section className="relative overflow-hidden border-b border-[#EAE0D0] px-4 py-12 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-bl from-[#FFF7E6] via-white to-white" />
        <div className="container relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 md:grid-cols-[1.1fr_0.9fr]">

          {/* Text side */}
          <div className="text-center md:text-right">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald/20 bg-emerald/5 px-4 py-1.5">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#00C97A]" />
              <span className="font-tajawal text-xs font-black text-emerald">
                مرخّصة من الغذاء والدواء (SFDA)
              </span>
            </div>

            <h1
              className="font-tajawal font-black leading-[1.1] text-emerald"
              style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4rem)' }}
            >
              صيدلية الجمال السعودية.
              <br />لجمال يبدأ من الداخل.
            </h1>

            <p className="mx-auto mt-5 max-w-lg font-tajawal text-lg font-bold leading-relaxed text-charcoal/80 md:mx-0 md:text-xl">
              ثلاث تركيبات سريرية مدعومة بأبحاث — تستهدف التجاعيد، الهالات، والتساقط من الداخل.
              <span className="mt-1 block font-black text-emerald">
                بدون إبر، بدون عيادات، وبدون مخاطرة.
              </span>
            </p>

            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row md:justify-start">
              <Button size="lg" variant="primary" asChild className="h-16 px-8 text-lg font-black shadow-[0_18px_42px_rgba(18,107,82,0.30)]">
                <Link href="/p/bundle-glow-trio">استكشفي الروتين السريري — {formatSar(499)}</Link>
              </Button>
              <div className="text-center sm:text-right">
                <p className="font-tajawal text-sm font-bold text-emerald">💵 الدفع عند الاستلام</p>
                <p className="font-tajawal text-xs text-charcoal/55">بدون دفع أونلاين · شحن ١-٣ أيام</p>
              </div>
            </div>

            {/* Social proof strip */}
            <div className="mt-8 grid grid-cols-3 gap-3 max-w-md mx-auto md:mx-0">
              <HeroProof number="SFDA" label="مرخّص رسمياً" />
              <HeroProof number="100%" label="حلال ونباتي" />
              <HeroProof number="30 يوم" label="ضمان استرجاع" />
            </div>
          </div>

          {/* Hero visual — REAL product photo */}
          <div className="relative mx-auto w-full max-w-[520px]">
            <Link
              href="/p/bundle-glow-trio"
              prefetch
              className="group block overflow-hidden rounded-[32px] border-2 border-[#E0D4C0] bg-white shadow-[0_24px_60px_rgba(18,107,82,0.12)] transition-all duration-300 hover:-translate-y-1 hover:border-emerald/40 hover:shadow-xl"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-white">
                <Image
                  src="/images/products/trio-real-photo.webp"
                  alt="المنتجات الثلاثة — نضرة + بريق + جذر"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 90vw, 520px"
                  priority
                />
                <span className="absolute top-4 right-4 rounded-full bg-saffron px-3 py-1.5 font-tajawal text-xs font-black text-emerald shadow-lg">
                  💎 الأكثر طلبًا
                </span>
              </div>
              <div className="border-t border-[#EAE0D0] bg-white p-5 text-center">
                <p className="font-tajawal text-xl font-black text-emerald">الـ ٣ منتجات — نفس اللي بالصورة</p>
                <p className="mt-1 font-tajawal text-sm text-charcoal/65">نضرة + بريق + جذر · يكفي شهر كامل</p>
                <div className="mt-2 inline-flex items-center gap-2">
                  <span className="font-tajawal text-sm text-charcoal/50 line-through">{formatSar(597)}</span>
                  <span className="font-tajawal text-2xl font-black text-emerald">{formatSar(499)}</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ══ PAIN AGITATION — "هل تعانين من..." ═══════════════════════ */}
      <section className="border-b border-[#EAE0D0] bg-[#FFF9F5] px-4 py-16 md:py-20">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <h2 className="font-tajawal text-3xl font-black leading-tight text-charcoal md:text-4xl">
              هل تعانين من هذي المشاكل؟
            </h2>
            <p className="mt-3 font-tajawal text-base text-charcoal/60">
              إذا قلتي &ldquo;أيوه&rdquo; على واحدة أو أكثر — رحيق صُنعت لكِ.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              'تلاحظين خطوط جديدة كل شهر وبشرتكِ فقدت نضارتها',
              'الناس يسألونكِ "تعبانة؟" مع إنكِ نايمة زين',
              'شعركِ يطيح على المخدة وبالمشط والفراغات بدأت تبين',
              'جرّبتي كريمات وزيوت غالية بس المشكلة ما انحلّت',
              'تحطين ٣ طبقات ميك أب عشان تبينين طبيعية',
              'خايفة من الفيلر والليزر بس ما تدرين إيش البديل',
            ].map((pain) => (
              <div
                key={pain}
                className="flex items-start gap-3 rounded-2xl border border-red-100 bg-white p-4 shadow-sm"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-red-50 text-xs font-black text-red-500">
                  ✓
                </span>
                <p className="font-tajawal text-sm font-medium leading-relaxed text-charcoal/85">{pain}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-3xl border-2 border-emerald/20 bg-emerald/5 p-6 text-center">
            <p className="font-tajawal text-lg font-black text-emerald">
              السبب الحقيقي؟ جسمكِ يفتقد فيتامينات ومعادن أساسية من الداخل.
            </p>
            <p className="mt-2 font-tajawal text-sm text-charcoal/65">
              الحل ما هو كريم يقعد على وجهكِ — الحل مكمّل يوصل لخلاياكِ من جوا.
            </p>
          </div>
        </div>
      </section>

      {/* ══ WHY SUPPLEMENTS > CREAMS — Comparison ═══════════════════════ */}
      <section className="border-b border-[#EAE0D0] px-4 py-16 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <span className="mb-3 inline-block rounded-full bg-saffron/15 px-4 py-1.5 font-tajawal text-xs font-black text-saffron">
              صيدلية، مو متجر تجميل
            </span>
            <h2 className="font-tajawal text-3xl font-black leading-tight text-emerald md:text-4xl">
              ليش العلكات السريرية أفضل من الكريمات؟
            </h2>
          </div>

          <div className="overflow-hidden rounded-3xl border border-[#E0D4C0] shadow-sm">
            <div className="grid grid-cols-4 border-b border-[#E0D4C0] bg-[#FAFAF8]">
              <div className="p-4" />
              <div className="border-s border-[#E0D4C0] p-4 text-center">
                <p className="font-tajawal text-xs font-black text-charcoal/50">🧴</p>
                <p className="font-tajawal text-sm font-bold text-charcoal/70">كريمات</p>
              </div>
              <div className="border-s border-[#E0D4C0] p-4 text-center">
                <p className="font-tajawal text-xs font-black text-charcoal/50">💉</p>
                <p className="font-tajawal text-sm font-bold text-charcoal/70">عيادات</p>
              </div>
              <div className="border-s-2 border-emerald bg-emerald/5 p-4 text-center">
                <p className="font-tajawal text-xs font-black text-emerald">🌿</p>
                <p className="font-tajawal text-sm font-black text-emerald">رحيق</p>
              </div>
            </div>
            {[
              { label: 'يوصل لخلايا البشرة', cream: false, clinic: true, raheeq: true },
              { label: 'بدون ألم أو إبر', cream: true, clinic: false, raheeq: true },
              { label: 'نتيجة دائمة من الداخل', cream: false, clinic: false, raheeq: true },
              { label: 'سعر أقل من ٧ ر.س/يوم', cream: false, clinic: false, raheeq: true },
              { label: 'بدون كيماويات سطحية', cream: false, clinic: false, raheeq: true },
              { label: 'فائدة للبشرة والشعر معًا', cream: false, clinic: false, raheeq: true },
            ].map((row, i) => (
              <div key={row.label} className={`grid grid-cols-4 ${i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAF8]'}`}>
                <div className="flex items-center p-4">
                  <p className="font-tajawal text-sm font-medium text-charcoal/80">{row.label}</p>
                </div>
                <CompareCell value={row.cream} />
                <CompareCell value={row.clinic} />
                <CompareCell value={row.raheeq} highlight />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PRODUCTS — Pick your problem ═══════════════════════════════ */}
      <section className="border-b border-[#EAE0D0] bg-white px-4 py-16 md:py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <span className="mb-3 inline-block rounded-full bg-saffron/15 px-4 py-1.5 font-tajawal text-xs font-black text-saffron">
              التركيبات السريرية
            </span>
            <h2 className="font-tajawal text-4xl font-black leading-tight text-emerald md:text-5xl">
              ثلاث علكات. ثلاث مشاكل. حلّ سريري واحد.
            </h2>
            <p className="mt-3 font-tajawal text-base text-charcoal/60">
              كل علكة تركيبة مستقلّة بجرعات مدروسة. اختاري المشكلة، أو ادمجي الثلاث للروتين الكامل.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {MAIN_PRODUCTS.map((product, idx) => {
              const cards = [
                { icon: '✨', issue: 'تجاعيد + بهتان', solution: 'أستازانتين + كولاجين بحري' },
                { icon: '👁️', issue: 'هالات سوداء', solution: 'حديد + حمض فوليك' },
                { icon: '💇‍♀️', issue: 'تساقط وفراغات', solution: 'بيوتين + كولاجين + كيراتين' },
              ];
              const card = cards[idx]!;

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
                      className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      priority={idx === 0}
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="font-tajawal text-xs font-black text-red-500">{card.icon} المشكلة: {card.issue}</p>
                    <h3 className="mt-2 font-tajawal text-2xl font-black text-emerald">{product.nameAr}</h3>
                    <p className="mt-2 font-tajawal text-sm leading-relaxed text-charcoal/65">
                      {card.solution}
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

      {/* ══ GUARANTEE — IMPOSSIBLE TO IGNORE ═══════════════════════════ */}
      <section className="border-b-4 border-emerald bg-gradient-to-br from-[#E8FFF4] via-[#F0FFF7] to-white px-4 py-20 md:py-28">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-[36px] border-4 border-emerald bg-white p-8 text-center shadow-[0_32px_80px_rgba(18,107,82,0.15)] md:p-14">
            <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-full border-4 border-emerald/30 bg-emerald/10">
              <span className="text-6xl">🛡️</span>
            </div>
            <p className="mb-2 font-tajawal text-sm font-black uppercase tracking-widest text-saffron">
              وعد رحيق لكِ
            </p>
            <h2
              className="font-tajawal font-black leading-tight text-emerald"
              style={{ fontSize: 'clamp(1.8rem, 5vw, 3.2rem)' }}
            >
              ضمان ٣٠ يوم كامل — أو فلوسكِ ترجع
            </h2>
            <p className="mx-auto mt-5 max-w-2xl font-tajawal text-lg leading-relaxed text-charcoal/75 md:text-xl">
              جرّبي رحيق لمدة ٣٠ يوم. إذا ما لاحظتي فرق، أو ما عجبكِ المنتج لأي سبب كان — <span className="font-black text-emerald">كلّمينا وبنرجّع فلوسكِ كاملة. بدون أسئلة. بدون شروط.</span>
            </p>

            <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-2xl border-2 border-emerald/20 bg-emerald/5 p-5">
                <span className="text-3xl">🚫</span>
                <p className="mt-2 font-tajawal text-base font-black text-emerald">بدون مخاطرة</p>
                <p className="mt-1 font-tajawal text-xs text-charcoal/60">ما تخسرين ولا ريال</p>
              </div>
              <div className="rounded-2xl border-2 border-emerald/20 bg-emerald/5 p-5">
                <span className="text-3xl">💵</span>
                <p className="mt-2 font-tajawal text-base font-black text-emerald">استرداد كامل</p>
                <p className="mt-1 font-tajawal text-xs text-charcoal/60">كل فلوسكِ ترجع لكِ</p>
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

      {/* ══ BUNDLE — High AOV push ═════════════════════════════════════ */}
      <section className="border-b border-[#EAE0D0] bg-gradient-to-br from-[#FFF7E6] via-white to-[#FFEFD9] px-4 py-16 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8 text-center">
            <span className="mb-3 inline-block rounded-full bg-emerald px-4 py-1.5 font-tajawal text-xs font-black text-saffron">
              💎 العرض الأقوى · وفّري {formatSar(100)}
            </span>
            <h2 className="font-tajawal text-3xl font-black leading-tight text-emerald md:text-4xl">
              صندوق الجمال المتكامل
            </h2>
            <p className="mx-auto mt-3 max-w-2xl font-tajawal text-base text-charcoal/70">
              الـ ٣ منتجات معًا — لأن بشرتكِ وشعركِ وعيونكِ يستحقون عناية شاملة.
            </p>
          </div>

          <div className="rounded-[28px] border-2 border-saffron/30 bg-white p-6 shadow-[0_24px_60px_rgba(18,107,82,0.15)] md:p-10">
            <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
              <div className="relative aspect-square overflow-hidden rounded-3xl border border-[#EAE0D0] bg-white">
                <Image
                  src="/images/products/trio-real-photo.webp"
                  alt="المنتجات الثلاثة الحقيقية — نضرة + بريق + جذر"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              <div className="flex flex-col gap-5">
                <ul className="flex flex-col gap-3">
                  {[
                    { icon: '✨', label: 'حبّة نضرة', desc: 'كولاجين + أستازانتين — بشرة أصغر بدون تجاعيد' },
                    { icon: '👁️', label: 'حبّة بريق', desc: 'حديد + فوليك — هالات أفتح بدون كونسيلر' },
                    { icon: '💇‍♀️', label: 'حبّة جذر', desc: 'بيوتين + كيراتين — شعر أكثف من الجذر' },
                  ].map((item) => (
                    <li key={item.label} className="flex items-start gap-3 rounded-2xl border border-emerald/15 bg-[#F3FAF6] p-4">
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
                    <span className="font-tajawal text-base text-charcoal/55 line-through">{formatSar(597)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-tajawal text-sm font-bold text-emerald">سعر الصندوق</p>
                      <p className="font-tajawal text-[11px] font-bold text-saffron">✨ توفّرين {formatSar(100)}</p>
                    </div>
                    <span className="font-tajawal text-3xl font-black text-emerald">{formatSar(499)}</span>
                  </div>
                  <p className="font-tajawal text-xs text-charcoal/60 border-t border-emerald/10 pt-2">
                    🚚 شحن مجاني · يكفي شهر كامل · 🛡️ ضمان ٣٠ يوم
                  </p>
                </div>

                <Button size="lg" variant="primary" asChild className="h-14 px-8 text-base font-black shadow-[0_18px_42px_rgba(18,107,82,0.30)]">
                  <Link href="/p/bundle-glow-trio" prefetch>
                    اطلبي الصندوق الآن · {formatSar(499)}
                  </Link>
                </Button>

                <p className="text-center font-tajawal text-[11px] text-charcoal/55">
                  💵 دفع عند الاستلام · بدون بطاقة · نتصل نأكد قبل الشحن
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS — 3 steps ═════════════════════════════════════ */}
      <section className="border-b border-[#EAE0D0] px-4 py-16 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-2 font-tajawal text-sm font-bold text-saffron">الطلب بـ ٣٠ ثانية</p>
            <h2 className="font-tajawal text-3xl font-black text-emerald md:text-4xl">
              ٣ خطوات — وتوصلكِ لبابكِ.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <StepCard number="1" title="اختاري مشكلتكِ" body="نضرة للبشرة · بريق للهالات · جذر للشعر — أو الصندوق الكامل." />
            <StepCard number="2" title="اكتبي اسمكِ وجوالكِ" body="بس. ٣٠ ثانية. ما نطلب بطاقة ولا عنوان — نتّصل نأكد." featured />
            <StepCard number="3" title="ادفعي عند الاستلام" body="نوصّل خلال ١-٣ أيام وتدفعين كاش للمندوب. بدون مخاطرة." />
          </div>
        </div>
      </section>

      {/* ══ TRUST BADGES — Scientific credibility ══════════════════════ */}
      <section className="border-b border-[#EAE0D0] bg-[#FAFAF8] px-4 py-12">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { icon: '📋', title: 'مرخّص SFDA', sub: 'مسجّل في الغذاء والدواء' },
              { icon: '🔬', title: 'جرعات سريرية', sub: 'مكونات بأبحاث منشورة' },
              { icon: '☪️', title: 'حلال ١٠٠٪', sub: 'بكتين نباتي · بدون جيلاتين' },
              { icon: '🛡️', title: 'ضمان ٣٠ يوم', sub: 'استرجاع كامل بدون مخاطرة' },
            ].map((item) => (
              <div key={item.title} className="flex flex-col items-center gap-2 rounded-2xl border border-emerald/10 bg-white p-5 text-center">
                <span className="text-3xl">{item.icon}</span>
                <p className="font-tajawal text-sm font-black text-emerald">{item.title}</p>
                <p className="font-tajawal text-[11px] text-charcoal/55">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ REVIEWS ═══════════════════════════════════════════════════ */}
      <section className="border-b border-[#EAE0D0] px-4 py-16 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <p className="mb-2 font-tajawal text-sm font-bold text-saffron">عميلات قرأن المكونات قبل ما يطلبن</p>
            <h2 className="font-tajawal text-3xl font-black text-emerald md:text-4xl">
              رحيق اختيار النساء اللي ما يصدّقن أي إعلان
            </h2>
            <div className="mt-3 flex items-center justify-center gap-2">
              <StarRating value={REVIEW_AGGREGATE.averageRating} showValue size="lg" />
              <span className="font-tajawal text-sm text-charcoal/55">
                ({formatNumber(REVIEW_AGGREGATE.totalReviews)} تقييم موثّق)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {GLOBAL_REVIEWS.slice(0, 6).map((r) => (
              <div
                key={r.id}
                className="flex flex-col gap-3 rounded-[24px] border border-[#E0D4C0] bg-white p-5"
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

      {/* ══ FAQ ═══════════════════════════════════════════════════════ */}
      <section className="border-b border-[#EAE0D0] px-4 py-16 md:py-20">
        <div className="container mx-auto max-w-2xl">
          <div className="mb-10 text-center">
            <h2 className="font-tajawal text-3xl font-black text-emerald">أسئلة شائعة</h2>
          </div>
          <div className="flex flex-col divide-y divide-[#EAE0D0]">
            {GLOBAL_FAQS.slice(0, 6).map((faq) => (
              <FaqItem key={faq.id} question={faq.questionAr} answer={faq.answerAr} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ═════════════════════════════════════════════════ */}
      <section className="bg-emerald px-4 py-20 text-center">
        <div className="container mx-auto max-w-xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
            <span className="text-3xl">🌿</span>
          </div>
          <h2 className="font-tajawal text-3xl font-black text-white md:text-4xl">
            جاهزة تبدئين التحوّل؟
          </h2>
          <p className="mx-auto mt-4 max-w-md font-tajawal text-base text-white/75">
            حبّتين بالصباح. مؤشرات أولية خلال ٤-٨ أسابيع. ضمان ٣٠ يوم.
            <br />ما عندكِ شي تخسرينه.
          </p>
          <div className="mt-8">
            <Button size="lg" variant="primary" asChild className="h-16 px-12 text-xl font-black">
              <Link href="/p/bundle-glow-trio">اطلبي الآن — دفع عند الاستلام</Link>
            </Button>
          </div>
          <p className="mt-4 font-tajawal text-sm text-white/50">
            💵 كاش للمندوب · 🚚 شحن ١-٣ أيام · 🛡️ ضمان ٣٠ يوم كامل
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
      <p className="mt-0.5 font-tajawal text-[11px] font-semibold text-charcoal/55">{label}</p>
    </div>
  );
}

function StepCard({
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
          ✓ أسهل خطوة
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

function CompareCell({ value, highlight = false }: { value: boolean; highlight?: boolean }) {
  return (
    <div className={`flex items-center justify-center border-s p-4 ${highlight ? 'border-emerald bg-emerald/5' : 'border-[#E0D4C0]'}`}>
      {value ? (
        <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-black ${highlight ? 'bg-emerald text-white' : 'bg-emerald/15 text-emerald'}`}>✓</span>
      ) : (
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-50 text-xs font-black text-red-400">✕</span>
      )}
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
