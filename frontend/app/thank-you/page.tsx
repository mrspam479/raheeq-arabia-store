'use client';

import Link from 'next/link';
import { useCartStore } from '@/store/cart';
import { Button } from '@/components/ui/Button';
import { COPY } from '@/data/copy';

export default function ThankYouPage() {
  const { lastOrderId } = useCartStore();

  return (
    <div className="bg-white">
      <section className="bg-gradient-to-b from-emerald to-[#00A85A] px-4 py-14 text-center md:py-20">
        <div className="container mx-auto max-w-2xl">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <p className="mb-2 font-tajawal text-sm font-bold text-saffron uppercase tracking-wider">
            {COPY.THANK_YOU.EYEBROW}
          </p>
          <h1 className="font-tajawal text-3xl font-black leading-tight text-white md:text-5xl">
            تم استلام طلبكِ بنجاح
          </h1>
          <p className="mx-auto mt-4 max-w-xl font-tajawal text-lg font-bold leading-relaxed text-white/85">
            لا تدفعين الآن. فريق رحيق بيتصل عليكِ لتأكيد الطلب، وبعدها تدفعين عند الاستلام فقط.
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

          <div className="mx-auto mt-8 grid max-w-xl grid-cols-1 gap-3 md:grid-cols-3">
            <TrustPill icon="📞" text="انتظري اتصال التأكيد" />
            <TrustPill icon="💵" text="الدفع عند الاستلام فقط" />
            <TrustPill icon="🛡️" text="ضمان ٣٠ يوم" />
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:py-16">
        <div className="container mx-auto max-w-3xl">
          <h2 className="mb-8 text-center font-tajawal text-2xl font-black text-emerald md:text-3xl">
            بالضبط، إيش يصير الحين؟
          </h2>
          <div className="flex flex-col gap-4">
            {[
              {
                step: '1',
                title: 'نراجع طلبكِ',
                desc: 'وصلنا طلبكِ في النظام. ما تحتاجين تسوين أي شيء الآن.',
                note: 'لا يوجد دفع أونلاين ولا بطاقة.',
                active: true,
              },
              {
                step: '2',
                title: 'نتصل عليكِ للتأكيد',
                desc: 'فريقنا بيتصل خلال ٢٤ ساعة لتأكيد الاسم، المدينة، العنوان، والمنتج.',
                note: 'لو ما رديتِ، نحاول مرة ثانية.',
                active: true,
              },
              {
                step: '3',
                title: 'نجهّز ونشحن',
                desc: 'بعد التأكيد، نجهّز الطلب ونرسله لكِ. التوصيل عادة خلال ١-٣ أيام عمل حسب المدينة.',
                note: 'راح توصلكِ تفاصيل التوصيل بعد التأكيد.',
                active: false,
              },
              {
                step: '4',
                title: 'تستلمين وتدفعين',
                desc: 'الدفع يكون للمندوب عند وصول الطلب. إذا عندكِ سؤال قبل الدفع، اسألي المندوب أو فريقنا.',
                note: 'لا تدفعين إلا عند الاستلام.',
                active: false,
              },
            ].map((item) => (
              <div
                key={item.step}
                className={`flex items-start gap-4 rounded-3xl border p-5 ${
                  item.active
                    ? 'border-emerald/30 bg-emerald/5 shadow-sm'
                    : 'border-stone-200 bg-[#FAFAF8]'
                }`}
              >
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-inter text-xl font-black ${
                  item.active ? 'bg-emerald text-white' : 'bg-stone-200 text-charcoal/50'
                }`}>
                  {item.step}
                </div>
                <div>
                  <p className="font-tajawal text-lg font-black text-charcoal">{item.title}</p>
                  <p className="mt-1 font-tajawal text-sm leading-relaxed text-charcoal/70">{item.desc}</p>
                  <p className="mt-2 inline-block rounded-full bg-white px-3 py-1 font-tajawal text-xs font-bold text-emerald">
                    {item.note}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-3xl border-2 border-saffron/30 bg-saffron/5 p-6">
            <h3 className="font-tajawal text-xl font-black text-emerald">مهم جدًا عشان ما يتأخر طلبكِ</h3>
            <p className="mt-2 font-tajawal text-sm leading-relaxed text-charcoal/75">
              ردي على مكالمة التأكيد. بدون التأكيد ما نقدر نشحن الطلب، عشان نتأكد إن المنتج والمدينة والعنوان صحيحين.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-stone-200 bg-[#FAFAF8] px-4 py-12">
        <div className="container mx-auto max-w-3xl">
          <h2 className="mb-6 text-center font-tajawal text-2xl font-black text-emerald">
            إجابات سريعة قبل ما نقفّل الصفحة
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <AnswerCard
              question="هل لازم أدفع الآن؟"
              answer="لا. طلبكِ دفع عند الاستلام. لا بطاقة، لا تحويل، لا دفع قبل ما تستلمين."
            />
            <AnswerCard
              question="إذا أخطأت في الرقم أو المدينة؟"
              answer="عادي. لما نتصل عليكِ للتأكيد، صحّحي أي معلومة قبل الشحن."
            />
            <AnswerCard
              question="متى أبدأ الاستخدام؟"
              answer="ابدئي بعد الاستلام من اليوم التالي بعد الفطور. المهم الالتزام اليومي."
            />
            <AnswerCard
              question="متى تظهر النتيجة؟"
              answer="توقعي مؤشرات أولية خلال ٤-٨ أسابيع، والتقييم الأفضل بعد ٨-١٢ أسبوع حسب المنتج والجسم."
            />
          </div>
        </div>
      </section>

      <section className="px-4 py-12 text-center">
        <div className="container mx-auto max-w-2xl">
          <div className="rounded-[32px] border-4 border-emerald bg-white p-6 shadow-[0_24px_60px_rgba(18,107,82,0.10)] md:p-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald/10 text-3xl">
              🛡️
            </div>
            <h2 className="font-tajawal text-2xl font-black text-emerald">
              تذكير: ضمان ٣٠ يوم
            </h2>
            <p className="mx-auto mt-3 max-w-lg font-tajawal text-sm leading-relaxed text-charcoal/70">
              جرّبي المنتج براحة. إذا ما عجبكِ لأي سبب، كلمينا خلال ٣٠ يوم ونرجّع فلوسكِ. هدفنا إنكِ تطلبين بدون خوف.
            </p>
          </div>

          <Button variant="primary" size="lg" asChild className="mt-8">
            <Link href="/">العودة للرئيسية</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

function TrustPill({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">
      <span className="text-2xl">{icon}</span>
      <p className="mt-1 font-tajawal text-xs font-black text-white">{text}</p>
    </div>
  );
}

function AnswerCard({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5">
      <p className="font-tajawal text-base font-black text-emerald">{question}</p>
      <p className="mt-2 font-tajawal text-sm leading-relaxed text-charcoal/70">{answer}</p>
    </div>
  );
}
