'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/cn';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('admin_token');
    if (!token && !pathname.includes('/admin/login')) {
      router.push('/admin/login');
    }
  }, [pathname, router]);

  if (!mounted) return null;

  if (pathname.includes('/admin/login')) {
    return <div className="min-h-screen bg-stone-50">{children}</div>;
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-stone-50">
      {/* Sidebar */}
      <aside className="w-64 bg-emerald text-white p-6 flex flex-col">
        <div className="mb-10">
          <h1 className="font-tajawal font-black text-2xl text-saffron">لوحة التحكم</h1>
          <p className="font-tajawal text-xs text-white/60 mt-1">Raheeq Admin</p>
        </div>
        
        <nav className="flex-1 flex flex-col gap-2">
          <Link
            href="/admin"
            className={cn(
              "font-tajawal px-4 py-3 rounded-xl transition-colors",
              pathname === '/admin' ? "bg-white/10 text-saffron font-bold" : "text-white/80 hover:bg-white/5"
            )}
          >
            📊 الإحصائيات (Dashboard)
          </Link>
          <Link
            href="/admin/orders"
            className={cn(
              "font-tajawal px-4 py-3 rounded-xl transition-colors",
              pathname === '/admin/orders' ? "bg-white/10 text-saffron font-bold" : "text-white/80 hover:bg-white/5"
            )}
          >
            📦 الطلبات (Orders)
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          className="font-tajawal mt-auto px-4 py-3 rounded-xl text-red-300 hover:bg-red-500/10 transition-colors text-right"
        >
          تسجيل الخروج
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
