import type { Metadata } from 'next';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { COPY } from '@/data/copy';

export const metadata: Metadata = {
  title: 'تواصلي معنا · رحيق',
  description: 'فريق رحيق متاح للإجابة عن أي سؤال.',
};

export default function ContactPage() {
  const { EYEBROW, H1, BODY, WHATSAPP_BTN, EMAIL, ADDRESS, NOTE, WHATSAPP_NUMBER } = COPY.CONTACT;

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=مرحبًا، أود الاستفسار عن منتجات رحيق`;

  return (
    <>
      <section className="bg-emerald text-ivory py-16 text-center">
        <div className="container mx-auto px-4">
          <Badge variant="saffron" className="mb-4">{EYEBROW}</Badge>
          <h1 className="font-tajawal font-black text-4xl md:text-5xl mb-4">{H1}</h1>
          <p className="font-tajawal text-lg text-ivory/80 max-w-xl mx-auto">{BODY}</p>
        </div>
      </section>

      <section className="py-16 bg-ivory">
        <div className="container mx-auto px-4 max-w-lg">
          <div className="flex flex-col gap-6 bg-white rounded-2xl border border-stone-200 p-8">
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              asChild
            >
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M11.963 2.099C6.48 2.099 2.015 6.561 2.015 12.04c0 1.79.468 3.517 1.362 5.053L2 22l5.054-1.327C8.534 21.538 10.23 22 11.963 22c5.48 0 9.946-4.462 9.946-9.96 0-5.48-4.466-9.941-9.946-9.941z" />
                </svg>
                {WHATSAPP_BTN}
              </a>
            </Button>

            <div className="border-t border-stone-200 pt-4 flex flex-col gap-3">
              <div className="flex items-center gap-3 font-tajawal text-sm text-charcoal/70">
                <span className="text-emerald">✉️</span>
                <a href={`mailto:${EMAIL}`} className="hover:text-emerald transition-colors">
                  {EMAIL}
                </a>
              </div>
              <div className="flex items-center gap-3 font-tajawal text-sm text-charcoal/70">
                <span className="text-emerald">📍</span>
                <span>{ADDRESS}</span>
              </div>
            </div>

            <p className="font-tajawal text-xs text-charcoal/50 leading-relaxed border-t border-stone-200 pt-4">
              {NOTE}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
