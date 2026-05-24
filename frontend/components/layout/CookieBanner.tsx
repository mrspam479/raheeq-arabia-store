'use client';

import Link from 'next/link';
import { useUiStore } from '@/store/ui';
import { Button } from '@/components/ui/Button';
import { COPY } from '@/data/copy';

export function CookieBanner() {
  const { cookieBannerDismissed, dismissCookieBanner } = useUiStore();

  if (cookieBannerDismissed) return null;

  return (
    <div
      role="dialog"
      aria-label="إشعار ملفات تعريف الارتباط"
      className="fixed bottom-0 inset-x-0 z-[150] bg-charcoal text-ivory p-4 md:p-5 shadow-2xl"
    >
      <div className="container mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <p className="font-tajawal text-sm text-ivory/90 leading-relaxed flex-1">
          {COPY.COOKIE_BANNER.BODY}{' '}
          <Link
            href="/legal/privacy"
            className="underline underline-offset-2 hover:text-saffron transition-colors"
          >
            {COPY.COOKIE_BANNER.PRIVACY_LINK}
          </Link>
          .
        </p>
        <Button
          size="sm"
          variant="secondary"
          onClick={dismissCookieBanner}
          className="shrink-0"
        >
          {COPY.COOKIE_BANNER.ACCEPT}
        </Button>
      </div>
    </div>
  );
}
