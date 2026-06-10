'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/cart';
import { Button } from '@/components/ui/Button';

export default function ThankYouPage() {
  const { lastOrderId, lastOrderCustomer } = useCartStore();
  const [showPhoneEdit, setShowPhoneEdit] = useState(false);
  const [newPhone, setNewPhone] = useState('');
  const [phoneSaved, setPhoneSaved] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handlePhoneSave = () => {
    if (newPhone.trim().length < 9) return;
    // Store the corrected phone locally — our team will see it when they call
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('phone_correction', JSON.stringify({ orderId: lastOrderId, correctedPhone: newPhone.trim() }));
    }
    setPhoneSaved(true);
  };

  const faqs = [
    { q: 'هل لازم أدفع الآن؟', a: 'لا. الدفع نقدًا للمندوب فقط عند الاستلام. لا بطاقة، لا تحويل.' },
    { q: 'متى يوصلني الطلب؟', a: '١–٣ أيام عمل بعد تأكيد الطلب. المدن الرئيسية عادةً بكره أو بعده.' },
    { q: 'متى تظهر النتيجة؟', a: 'أول مؤشر بعد ٤ أسابيع. النتيجة الواضحة بعد ٨–١٢ أسبوع. الاستمرار هو السر.' },
    { q: 'إذا ما أعجبني المنتج؟', a: 'ضمان ٣٠ يوم. كلّمينا وبنرجّع فلوسكِ بدون أسئلة.' },
  ];

  return (
    <div className="min-h-screen bg-[#F7F5F0]" dir="rtl">
      {/* ── HERO — tight & confident ──────────────────────────── */}
      <div className="bg-emerald px-4 pt-10 pb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
          <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="font-tajawal text-2xl font-black text-white">تم استلام طلبكِ ✓</h1>
        <p className="mt-1 font-tajawal text-sm text-white/80">
          فريقنا بيتصل خلال <span className="font-black text-saffron">٢٤ ساعة</span> لتأكيد الطلب
        </p>
      </div>

      <div className="mx-auto max-w-md space-y-4 px-4 py-5">

        {/* ── CONFIRMATION CARD ─────────────────────────────────── */}
        <div className="rounded-2xl bg-white border border-stone-200 overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-stone-100">
            <p className="font-tajawal text-xs font-bold text-charcoal/50 uppercase mb-3">تأكّدي من بياناتكِ</p>
            <div className="space-y-2">
              <Row label="الاسم" value={lastOrderCustomer?.name ?? '—'} />
              <Row label="الجوال" value={lastOrderCustomer?.phone ?? '—'} mono />
            </div>
          </div>

          {/* Phone correction */}
          <div className="px-5 py-3 bg-stone-50">
            {!phoneSaved ? (
              !showPhoneEdit ? (
                <button
                  onClick={() => setShowPhoneEdit(true)}
                  className="font-tajawal text-sm font-bold text-red-600 underline underline-offset-2"
                >
                  الرقم مو صح؟ صحّحيه هنا
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="tel"
                    dir="ltr"
                    placeholder="05xxxxxxxx"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="flex-1 rounded-xl border border-stone-300 bg-white px-3 py-2 font-mono text-sm outline-none focus:border-emerald"
                    autoFocus
                  />
                  <button
                    onClick={handlePhoneSave}
                    className="rounded-xl bg-emerald px-4 py-2 font-tajawal text-sm font-black text-white"
                  >
                    حفظ
                  </button>
                  <button
                    onClick={() => setShowPhoneEdit(false)}
                    className="rounded-xl border border-stone-200 px-3 py-2 font-tajawal text-sm text-charcoal/60"
                  >
                    إلغاء
                  </button>
                </div>
              )
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-lg">✅</span>
                <p className="font-tajawal text-sm font-bold text-emerald">
                  سجّلنا الرقم الجديد — فريقنا بيتصل عليه
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── NEXT STEPS ────────────────────────────────────────── */}
        <div className="rounded-2xl bg-white border border-stone-200 px-5 py-4 shadow-sm">
          <p className="font-tajawal text-xs font-bold text-charcoal/50 uppercase mb-4">إيش يصير الحين؟</p>
          <div className="relative flex items-start">
            {/* connector line between circles */}
            <div className="absolute top-4 right-4 left-4 h-px bg-stone-200 -translate-y-px" style={{ right: 'calc(16.67% + 16px)', left: 'calc(16.67% + 16px)' }} />
            {[
              { n: '١', t: 'نراجع طلبكِ', sub: 'وصلنا في النظام' },
              { n: '٢', t: 'نتصل نأكّد', sub: 'خلال ٢٤ ساعة' },
              { n: '٣', t: 'تستلمين', sub: 'وتدفعين للمندوب' },
            ].map((s, i) => (
              <div key={i} className="relative z-10 flex flex-1 flex-col items-center text-center gap-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald font-tajawal text-sm font-black text-white shadow-sm">
                  {s.n}
                </div>
                <p className="font-tajawal text-xs font-black text-charcoal leading-tight">{s.t}</p>
                <p className="font-tajawal text-[10px] text-charcoal/50">{s.sub}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 rounded-xl bg-saffron/10 px-3 py-2 text-center font-tajawal text-xs font-bold text-emerald">
            📞 ردّي على مكالمة التأكيد — بدونها ما نقدر نشحن
          </p>
        </div>

        {/* ── FAQ ACCORDION ─────────────────────────────────────── */}
        <div className="rounded-2xl bg-white border border-stone-200 overflow-hidden shadow-sm">
          <p className="px-5 pt-4 pb-2 font-tajawal text-xs font-bold text-charcoal/50 uppercase">أسئلة شائعة</p>
          {faqs.map((faq, i) => (
            <button
              key={i}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="w-full text-right px-5 py-3 border-t border-stone-100 hover:bg-stone-50 transition-colors"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-tajawal text-sm font-black text-charcoal">{faq.q}</p>
                <span className={`text-emerald text-lg font-bold transition-transform shrink-0 ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
              </div>
              {openFaq === i && (
                <p className="mt-2 font-tajawal text-sm leading-relaxed text-charcoal/65 text-right">
                  {faq.a}
                </p>
              )}
            </button>
          ))}
        </div>

        {/* ── GUARANTEE STRIP ───────────────────────────────────── */}
        <div className="flex items-center gap-3 rounded-2xl border border-emerald/20 bg-emerald/5 px-4 py-3">
          <span className="text-2xl shrink-0">🛡️</span>
          <div>
            <p className="font-tajawal text-sm font-black text-emerald">ضمان ٣٠ يوم</p>
            <p className="font-tajawal text-xs text-charcoal/60">لو ما عجبكِ — بنرجّع فلوسكِ بدون أسئلة.</p>
          </div>
        </div>

        {/* ── CTA ───────────────────────────────────────────────── */}
        <Button variant="primary" size="lg" asChild className="w-full h-12 font-black">
          <Link href="/">العودة للرئيسية</Link>
        </Button>

        {lastOrderId && (
          <p className="text-center font-mono text-[10px] text-charcoal/30 break-all">
            #{lastOrderId}
          </p>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-tajawal text-sm text-charcoal/50">{label}</span>
      <span className={`font-tajawal text-sm font-black text-charcoal ${mono ? 'font-mono' : ''}`} dir={mono ? 'ltr' : 'auto'}>
        {value}
      </span>
    </div>
  );
}
