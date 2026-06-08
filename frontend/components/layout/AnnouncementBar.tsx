'use client';

import { useUiStore } from '@/store/ui';
import { cn } from '@/lib/cn';

const messages = [
  { icon: '🚚', text: 'شحن سريع 1–3 أيام داخل المملكة' },
  { icon: '💳', text: 'دفع عند الاستلام — بدون بطاقة' },
  { icon: '✅', text: 'ضمان رضا 30 يوم كامل' },
  { icon: '🌿', text: 'مفحوصة مخبريًا — حلال 100%' },
  { icon: '📦', text: 'تغليف فاخر مع كل طلب' },
  { icon: '🇸🇦', text: 'شركة سعودية — خدمة محلية' },
];

export function AnnouncementBar() {
  const { announcementDismissed, dismissAnnouncement } = useUiStore();

  if (announcementDismissed) return null;

  const doubled = [...messages, ...messages, ...messages];

  return (
    <div className="relative overflow-hidden bg-[#072820]">
      {/* Saffron glow line at top */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-saffron to-transparent opacity-70" />

      <div className="py-3.5 pe-12">
        <div className="raheeq-marquee flex w-max items-center gap-0 whitespace-nowrap">
          {doubled.map((msg, index) => (
            <span
              key={`${msg.text}-${index}`}
              className="flex items-center gap-2.5 px-6 font-tajawal text-[13px] font-bold tracking-wide text-white"
            >
              <span className="text-[15px] leading-none" aria-hidden="true">
                {msg.icon}
              </span>
              {msg.text}
              <span
                className="inline-block h-1.5 w-1.5 rounded-full bg-[#00C97A]"
                aria-hidden="true"
              />
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={dismissAnnouncement}
        className={cn(
          'absolute top-1/2 -translate-y-1/2 end-3',
          'flex h-6 w-6 items-center justify-center rounded-full',
          'text-white/50 hover:bg-white/10 hover:text-white transition-colors',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40',
        )}
        aria-label="إغلاق الشريط"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
