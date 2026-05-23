import type { Metadata } from 'next';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { COPY } from '@/data/copy';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'عن رحيق — قصّة البراند · رحيق',
  description: 'رحيق — مكمّلات عربية بمكوّنات عالمية. قصّة المؤسِّسة والرؤية.',
};

export default function AboutPage() {
  const { HERO, STORY, PILLARS, PROCESS, CTA } = COPY.ABOUT;

  return (
    <>
      {/* Hero */}
      <section className="bg-emerald text-ivory py-20 text-center">
        <div className="container mx-auto px-4">
          <Badge variant="saffron" className="mb-4">{HERO.EYEBROW}</Badge>
          <h1 className="font-tajawal font-black text-4xl md:text-5xl mb-4">{HERO.H1}</h1>
          <p className="font-tajawal text-lg text-ivory/80 max-w-2xl mx-auto">{HERO.LEDE}</p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 bg-ivory">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="prose prose-lg font-tajawal text-charcoal/80 leading-relaxed whitespace-pre-line">
            {STORY}
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-16 bg-stone-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PILLARS.map((pillar) => (
              <div
                key={pillar.title}
                className="bg-white rounded-2xl p-6 border border-stone-200 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-emerald/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-emerald font-bold text-xl">✓</span>
                </div>
                <h3 className="font-tajawal font-bold text-lg text-emerald mb-2">{pillar.title}</h3>
                <p className="font-tajawal text-sm text-charcoal/70">{pillar.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 bg-emerald text-ivory">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="font-tajawal font-bold text-2xl md:text-3xl text-center mb-10">
            من الفكرة إلى يدكِ
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {PROCESS.map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-saffron text-emerald font-tajawal font-bold text-sm flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="font-tajawal text-sm text-ivory/90">{step}</span>
                {i < PROCESS.length - 1 && (
                  <span className="text-ivory/30 mx-1">←</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-ivory text-center">
        <div className="container mx-auto px-4">
          <Button variant="primary" size="lg" asChild>
            <Link href="/collection">{CTA}</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
