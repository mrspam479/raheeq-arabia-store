'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/cn';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authState, setAuthState] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (pathname.includes('/admin/login')) {
      setAuthState(token ? 'authenticated' : 'unauthenticated');
      return;
    }
    if (!token) {
      setAuthState('unauthenticated');
      router.replace('/admin/login');
    } else {
      setAuthState('authenticated');
    }
  }, [pathname, router]);

  // Login page — render with minimal wrapper, no sidebar
  if (pathname.includes('/admin/login')) {
    return <div className="min-h-screen bg-stone-50">{children}</div>;
  }

  // Still checking auth — show a loading state instead of flashing
  if (authState !== 'authenticated') {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <p className="font-tajawal text-charcoal/50 text-lg">Loading...</p>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.replace('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-stone-50">
      <aside className="w-64 bg-emerald text-white p-6 flex flex-col shrink-0">
        <div className="mb-10">
          <h1 className="font-tajawal font-black text-2xl text-saffron">Raheeq Admin</h1>
          <p className="font-tajawal text-xs text-white/60 mt-1">Dashboard</p>
        </div>
        
        <nav className="flex-1 flex flex-col gap-2">
          <Link
            href="/admin"
            className={cn(
              "font-tajawal px-4 py-3 rounded-xl transition-colors",
              pathname === '/admin' ? "bg-white/15 text-saffron font-bold" : "text-white/80 hover:bg-white/5"
            )}
          >
            Dashboard
          </Link>
          <Link
            href="/admin/orders"
            className={cn(
              "font-tajawal px-4 py-3 rounded-xl transition-colors",
              pathname === '/admin/orders' ? "bg-white/15 text-saffron font-bold" : "text-white/80 hover:bg-white/5"
            )}
          >
            Orders
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          className="font-tajawal mt-auto px-4 py-3 rounded-xl text-red-300 hover:bg-red-500/10 transition-colors text-left"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
