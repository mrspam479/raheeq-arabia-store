'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { COPY } from '@/data/copy';

export default function ErrorPage() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center bg-ivory">
      <div className="container mx-auto px-4 text-center">
        <p className="font-tajawal font-black text-8xl text-emerald/10 mb-4">500</p>
        <h1 className="font-tajawal font-bold text-3xl text-emerald mb-3">
          {COPY.ERROR_PAGES.ERROR_500_H1}
        </h1>
        <p className="font-tajawal text-charcoal/60 mb-8 max-w-sm mx-auto">
          {COPY.ERROR_PAGES.ERROR_500_SUB}
        </p>
        <Button variant="primary" size="lg" asChild>
          <Link href="/">{COPY.ERROR_PAGES.NOT_FOUND_CTA}</Link>
        </Button>
      </div>
    </section>
  );
}
