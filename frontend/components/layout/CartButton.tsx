'use client';

import { useEffect, useState } from 'react';
import { useCartStore } from '@/store/cart';
import { cn } from '@/lib/cn';

export function CartButton() {
  const { openCart, totalItems } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Read cart count only after hydration to avoid SSR/client mismatch.
  const count = mounted ? totalItems() : 0;

  return (
    <button
      onClick={openCart}
      className={cn(
        'relative flex items-center justify-center w-10 h-10 rounded-full',
        'text-emerald hover:bg-emerald/8 transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald',
      )}
      aria-label={`السلة${count > 0 ? ` (${count} منتج)` : ''}`}
    >
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
        />
      </svg>
      {count > 0 && (
        <span
          className="absolute -top-0.5 -end-0.5 w-5 h-5 rounded-full bg-saffron text-emerald text-[10px] font-bold font-tajawal flex items-center justify-center"
          aria-hidden="true"
        >
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  );
}
