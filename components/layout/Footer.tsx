import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { COPY } from '@/data/copy';

export function Footer() {
  return (
    <footer className="bg-emerald text-ivory" dir="rtl">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand col */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <Logo size="md" variant="light" />
            <p className="font-tajawal text-sm text-ivory/70 max-w-xs leading-relaxed">
              {COPY.FOOTER.TAGLINE}
            </p>
            <p className="font-tajawal text-xs text-ivory/50">
              {COPY.FOOTER.DISCLAIMER}
            </p>
          </div>

          {/* Products */}
          <div className="flex flex-col gap-3">
            <h3 className="font-tajawal font-semibold text-sm text-ivory">
              {COPY.FOOTER.PRODUCTS_HEADING}
            </h3>
            <nav className="flex flex-col gap-2" aria-label="روابط المنتجات">
              <FooterLink href="/p/habba-jathr">حبّة جذر</FooterLink>
              <FooterLink href="/p/habba-layali">حبّة ليالي</FooterLink>
              <FooterLink href="/p/habba-noura">حبّة نورة</FooterLink>
              <FooterLink href="/collection">{COPY.NAV.COLLECTION}</FooterLink>
            </nav>
          </div>

          {/* Legal + Info */}
          <div className="flex flex-col gap-3">
            <h3 className="font-tajawal font-semibold text-sm text-ivory">
              {COPY.FOOTER.HELP_HEADING}
            </h3>
            <nav className="flex flex-col gap-2" aria-label="روابط المساعدة">
              <FooterLink href="/about">{COPY.NAV.ABOUT}</FooterLink>
              <FooterLink href="/contact">{COPY.NAV.CONTACT}</FooterLink>
              <FooterLink href="/legal/shipping">{COPY.FOOTER.LEGAL_SHIPPING}</FooterLink>
              <FooterLink href="/legal/returns">{COPY.FOOTER.LEGAL_RETURNS}</FooterLink>
              <FooterLink href="/legal/privacy">{COPY.FOOTER.LEGAL_PRIVACY}</FooterLink>
              <FooterLink href="/legal/terms">{COPY.FOOTER.LEGAL_TERMS}</FooterLink>
            </nav>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-ivory/15 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="font-tajawal text-xs text-ivory/50">
            {COPY.FOOTER.COPYRIGHT}
          </p>
          <p className="font-tajawal text-xs text-ivory/50">
            {COPY.FOOTER.PAYMENT_NOTE}
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="font-tajawal text-sm text-ivory/70 hover:text-ivory transition-colors"
    >
      {children}
    </Link>
  );
}
