import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { CartButton } from './CartButton';
import { COPY } from '@/data/copy';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[#fffaf3]/95 backdrop-blur-sm border-b border-[#e5d6c1]">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Desktop nav — start (RTL = right side) */}
        <nav
          className="hidden md:flex items-center gap-6"
          aria-label="التنقل الرئيسي"
        >
          <Link
            href="/collection"
            className="font-tajawal text-sm font-medium text-charcoal hover:text-emerald transition-colors"
          >
            {COPY.NAV.COLLECTION}
          </Link>
          <Link
            href="/about"
            className="font-tajawal text-sm font-medium text-charcoal hover:text-emerald transition-colors"
          >
            {COPY.NAV.ABOUT}
          </Link>
          <Link
            href="/contact"
            className="font-tajawal text-sm font-medium text-charcoal hover:text-emerald transition-colors"
          >
            {COPY.NAV.CONTACT}
          </Link>
        </nav>

        {/* Logo — center */}
        <Link href="/" className="absolute start-1/2 -translate-x-1/2 rtl:translate-x-1/2">
          <Logo size="sm" />
        </Link>

        {/* Cart — end (RTL = left side) */}
        <div className="flex items-center gap-2 ms-auto">
          <CartButton />
        </div>
      </div>
    </header>
  );
}
