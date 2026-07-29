'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cart';
import { PRODUCTS } from '@/data/products';
import { formatSar } from '@/lib/price';

export default function ThankYouPage() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const { lastOrderId, lastOrderCustomer, lastOrderSummary } = useCartStore();

  const [showPhoneEdit, setShowPhoneEdit] = useState(false);
  const [newPhone, setNewPhone] = useState('');
  const [phoneSaved, setPhoneSaved] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const orderedProductIds = lastOrderSummary?.lines.map((l) => l.productId) ?? [];
  const isMasc = orderedProductIds.some((id) => PRODUCTS.find((p) => p.slug === id)?.genderMasculine);
  const m = (masc: string, fem: string) => (isMasc ? masc : fem);

  const handlePhoneSave = () => {
    if (newPhone.trim().length < 9) return;
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('phone_correction', JSON.stringify({ orderId: lastOrderId, correctedPhone: newPhone.trim() }));
    }
    setPhoneSaved(true);
  };

  const faqs = [
    { q: 'هل لازم أدفع الآن؟', a: 'لا. الدفع نقدًا للمندوب فقط عند الاستلام. لا بطاقة، لا تحويل.' },
    { q: 'متى يوصلني الطلب؟', a: '١–٣ أيام عمل بعد تأكيد الطلب. المدن الرئيسية عادةً بكره أو بعده.' },
    { q: 'متى تظهر النتيجة؟', a: 'أول مؤشر بعد ٤ أسابيع. النتيجة الواضحة بعد ٨–١٢ أسبوع. الاستمرار هو السر.' },
    {
      q: m('إذا ما أعجبني المنتج؟', 'إذا ما أعجبكِ المنتج؟'),
      a: m('ضمان ٣٠ يوم. كلّمنا وبنرجّع فلوسك بدون أسئلة.', 'ضمان ٣٠ يوم. كلّمينا وبنرجّع فلوسكِ بدون أسئلة.'),
    },
  ];

  return (
    <div className="min-h-screen bg-[#F0EDE8]" dir="rtl">

      {/* ══ DARK HERO — same DNA as upsell popup ══════════════════ */}
      <div className="bg-[#0A2A1A] px-5 pt-10 pb-8 text-center">
        {/* Animated checkmark circle */}
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#4ADE80]/15 ring-4 ring-[#4ADE80]/30">
          <svg className="h-10 w-10 text-[#4ADE80]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="font-tajawal text-xs font-black text-[#F5C842] tracking-widest mb-1">
          ✅ تم تأكيد الطلب
        </p>
        <h1 className="font-tajawal text-2xl font-black text-white leading-snug">
          {m('طلبك وصلنا — شكراً لك!', 'طلبكِ وصلنا — شكراً لكِ!')}
        </h1>
        <p className="mt-2 font-tajawal text-sm text-white/60">
          فريقنا بيتصل خلال{' '}
          <span className="font-black text-[#F5C842]">٢٤ ساعة</span>{' '}
          {m('لتأكيد طلبك', 'لتأكيد طلبكِ')}
        </p>

        {/* "What happens next" — inside dark header */}
        <div className="mt-6 flex items-stretch justify-center gap-2">
          {[
            { icon: '📞', step: '١', title: 'نتصل نأكد', sub: 'خلال ٢٤ س' },
            { icon: '🚚', step: '٢', title: 'نشحن طلبك', sub: '١–٣ أيام' },
            { icon: '💵', step: '٣', title: 'تدفع عند الاستلام', sub: 'كاش فقط' },
          ].map((s, i) => (
            <div key={i} className="relative flex flex-1 flex-col items-center gap-1.5 rounded-2xl bg-white/5 ring-1 ring-white/10 px-2 py-3">
              <span className="text-xl">{s.icon}</span>
              <p className="font-tajawal text-[11px] font-black text-white leading-tight text-center">{s.title}</p>
              <p className="font-tajawal text-[10px] text-white/40 text-center">{s.sub}</p>
              {i < 2 && (
                <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 text-white/20 text-xs font-black">›</div>
              )}
            </div>
          ))}
        </div>

        <p className="mt-3 font-tajawal text-xs font-bold text-[#F5C842]/80">
          📞 {m('ردّ على مكالمة التأكيد — بدونها ما نقدر نشحن', 'ردّي على مكالمة التأكيد — بدونها ما نقدر نشحن')}
        </p>
      </div>

      <div className="mx-auto max-w-md space-y-4 px-4 py-5">

        {/* ══ RECEIPT / ORDER SUMMARY ════════════════════════════ */}
        {hydrated && lastOrderSummary && lastOrderSummary.lines.length > 0 && (
          <div className="overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/10">
            {/* Receipt header */}
            <div className="bg-[#0A2A1A] px-5 py-3.5 flex items-center justify-between">
              <div>
                <p className="font-tajawal text-[10px] font-bold text-[#F5C842]/70 uppercase tracking-widest">
                  وصل الطلب
                </p>
                {hydrated && lastOrderId && (
                  <p className="font-mono text-[10px] text-white/30 mt-0.5">#{lastOrderId}</p>
                )}
              </div>
              <span className="rounded-full bg-[#4ADE80]/15 px-3 py-1 font-tajawal text-xs font-black text-[#4ADE80]">
                مؤكّد ✓
              </span>
            </div>

            {/* Items */}
            <div className="bg-white px-5 py-4 space-y-3 border-b border-stone-100">
              {lastOrderSummary.lines.map((line, idx) => {
                const isUpsellLine = idx > 0; // first line = original order, rest = upsell
                return (
                  <div key={`${line.productId}-${idx}`}>
                    {isUpsellLine && (
                      <div className="flex items-center gap-2 mb-2 mt-1">
                        <div className="flex-1 h-px bg-stone-100" />
                        <span className="rounded-full bg-[#F5C842]/20 px-2 py-0.5 font-tajawal text-[10px] font-black text-amber-700">
                          ⚡ عرض خاص أُضيف
                        </span>
                        <div className="flex-1 h-px bg-stone-100" />
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <div className="relative h-14 w-11 shrink-0 overflow-hidden rounded-xl bg-stone-50 ring-1 ring-black/5">
                        <Image src={line.imageUrl} alt={line.nameAr} fill className="object-contain p-1" sizes="44px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-tajawal text-sm font-black text-charcoal line-clamp-2 leading-snug">
                          {isUpsellLine ? (
                            <>
                              علكات الشلاجيت{' '}
                              <span className="text-[#0A2A1A]">× {line.quantity} علب</span>
                            </>
                          ) : (
                            line.nameAr
                          )}
                        </p>
                        <p className="font-tajawal text-xs text-charcoal/45 mt-0.5">
                          {line.quantity === 1 ? 'علبة واحدة' : `${line.quantity} علب`}
                          {isUpsellLine && (
                            <span className="mr-1 text-amber-600 font-bold"> · عرض محدود</span>
                          )}
                        </p>
                      </div>
                      <div className="shrink-0 text-left">
                        <p className={`font-tajawal text-base font-black leading-none ${isUpsellLine ? 'text-amber-600' : 'text-charcoal'}`}>
                          {formatSar(line.totalPrice)}
                        </p>
                        {isUpsellLine && (
                          <p className="font-tajawal text-[10px] text-charcoal/35 line-through text-left mt-0.5">
                            398 ر.س
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Subtotal breakdown — visible only if upsell was accepted */}
            {lastOrderSummary.lines.length > 1 && (
              <div className="bg-stone-50 px-5 py-3 border-b border-stone-100 space-y-1.5">
                {lastOrderSummary.lines.map((line, idx) => (
                  <div key={`sub-${idx}`} className="flex items-center justify-between">
                    <p className="font-tajawal text-xs text-charcoal/50">
                      {idx === 0
                        ? `الطلب الأصلي (${line.quantity} علب)`
                        : `عرض خاص (${line.quantity} علب)`}
                    </p>
                    <p className="font-tajawal text-xs font-bold text-charcoal">{formatSar(line.totalPrice)}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Shipping row */}
            <div className="bg-white px-5 py-3 border-b border-stone-100 flex items-center justify-between">
              <p className="font-tajawal text-sm text-charcoal/50">الشحن</p>
              <p className="font-tajawal text-sm font-bold text-[#4ADE80]">مجاني 🎁</p>
            </div>

            {/* Total */}
            <div className="bg-[#0A2A1A] px-5 py-4 flex items-center justify-between">
              <p className="font-tajawal text-sm font-black text-white/70">المجموع الكلي</p>
              <div className="text-left">
                <p className="font-tajawal text-3xl font-black text-[#F5C842] leading-none">
                  {lastOrderSummary.totalSar}
                </p>
                <p className="font-tajawal text-[10px] font-bold text-[#F5C842]/60 text-left">ريال سعودي</p>
              </div>
            </div>

            {/* Payment note */}
            <div className="bg-[#0A2A1A]/5 px-5 py-3 flex items-center gap-2">
              <span className="text-base">💵</span>
              <p className="font-tajawal text-xs font-bold text-charcoal/60">
                الدفع نقداً عند الاستلام — لا تحويل، لا بطاقة
              </p>
            </div>
          </div>
        )}

        {/* ══ CUSTOMER INFO CARD ═════════════════════════════════ */}
        {hydrated && (
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
            <div className="bg-[#0A2A1A] px-5 py-3">
              <p className="font-tajawal text-[10px] font-bold text-[#F5C842]/70 uppercase tracking-widest">
                {m('بياناتك', 'بياناتكِ')}
              </p>
            </div>
            <div className="px-5 py-4 space-y-2.5">
              <InfoRow label="الاسم" value={lastOrderCustomer?.name ?? '—'} />
              <InfoRow label="الجوال" value={lastOrderCustomer?.phone ?? '—'} mono />
            </div>
            <div className="px-5 py-3 bg-stone-50 border-t border-stone-100">
              {!phoneSaved ? (
                !showPhoneEdit ? (
                  <button
                    onClick={() => setShowPhoneEdit(true)}
                    className="font-tajawal text-sm font-bold text-red-500 underline underline-offset-2"
                  >
                    {m('الرقم مو صح؟ صحّحه هنا', 'الرقم مو صح؟ صحّحيه هنا')}
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      type="tel" dir="ltr" placeholder="05xxxxxxxx"
                      value={newPhone} onChange={(e) => setNewPhone(e.target.value)}
                      className="flex-1 rounded-xl border border-stone-300 bg-white px-3 py-2 font-mono text-sm outline-none focus:border-[#0A2A1A]"
                      autoFocus
                    />
                    <button onClick={handlePhoneSave} className="rounded-xl bg-[#0A2A1A] px-4 py-2 font-tajawal text-sm font-black text-white">
                      حفظ
                    </button>
                    <button onClick={() => setShowPhoneEdit(false)} className="rounded-xl border border-stone-200 px-3 py-2 font-tajawal text-sm text-charcoal/60">
                      إلغاء
                    </button>
                  </div>
                )
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-lg">✅</span>
                  <p className="font-tajawal text-sm font-bold text-[#0A2A1A]">سجّلنا الرقم — فريقنا بيتصل عليه</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══ FAQ ════════════════════════════════════════════════ */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
          <div className="bg-[#0A2A1A] px-5 py-3">
            <p className="font-tajawal text-[10px] font-bold text-[#F5C842]/70 uppercase tracking-widest">
              أسئلة شائعة
            </p>
          </div>
          {faqs.map((faq, i) => (
            <button
              key={i}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="w-full text-right px-5 py-3.5 border-t border-stone-100 hover:bg-stone-50 transition-colors"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-tajawal text-sm font-black text-charcoal">{faq.q}</p>
                <span className={`text-[#0A2A1A] text-xl font-black transition-transform shrink-0 ${openFaq === i ? 'rotate-45' : ''}`}>
                  +
                </span>
              </div>
              {openFaq === i && (
                <p className="mt-2 font-tajawal text-sm leading-relaxed text-charcoal/60 text-right">{faq.a}</p>
              )}
            </button>
          ))}
        </div>

        {/* ══ GUARANTEE ══════════════════════════════════════════ */}
        <div className="flex items-center gap-3 rounded-2xl bg-[#0A2A1A]/5 ring-1 ring-[#0A2A1A]/10 px-4 py-3.5">
          <span className="text-2xl shrink-0">🛡️</span>
          <div>
            <p className="font-tajawal text-sm font-black text-[#0A2A1A]">ضمان ٣٠ يوم</p>
            <p className="font-tajawal text-xs text-charcoal/55">
              {m('لو ما عجبك — بنرجّع فلوسك بدون أسئلة.', 'لو ما عجبكِ — بنرجّع فلوسكِ بدون أسئلة.')}
            </p>
          </div>
        </div>

        {/* ══ CTA ════════════════════════════════════════════════ */}
        <Link
          href="/"
          className="flex h-13 w-full items-center justify-center rounded-2xl bg-[#0A2A1A] px-6 py-4 font-tajawal text-sm font-black text-white shadow-lg transition-opacity hover:opacity-90"
        >
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}

function InfoRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-tajawal text-sm text-charcoal/45">{label}</span>
      <span className={`font-tajawal text-sm font-black text-charcoal ${mono ? 'font-mono' : ''}`} dir={mono ? 'ltr' : 'auto'}>
        {value}
      </span>
    </div>
  );
}
