'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) throw new Error('بيانات الدخول غير صحيحة');
      
      const data = await res.json();
      localStorage.setItem('admin_token', data.token);
      router.push('/admin');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('حدث خطأ غير متوقع');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-[0_18px_55px_rgba(0,0,0,0.05)] border border-stone-100">
        <div className="text-center mb-8">
          <h1 className="font-tajawal font-black text-3xl text-emerald mb-2">تسجيل الدخول</h1>
          <p className="font-tajawal text-sm text-charcoal/60">لوحة تحكم رحيق</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 font-tajawal text-sm text-center font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5 flex flex-col items-end text-right" dir="rtl">
          <div className="w-full">
            <label className="block font-tajawal font-bold text-sm text-charcoal mb-2">اسم المستخدم</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-stone-200 p-4 font-sans text-left bg-stone-50 focus:bg-white focus:border-emerald focus:ring-1 focus:ring-emerald outline-none transition-all"
              required
            />
          </div>
          
          <div className="w-full">
            <label className="block font-tajawal font-bold text-sm text-charcoal mb-2">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-stone-200 p-4 font-sans text-left bg-stone-50 focus:bg-white focus:border-emerald focus:ring-1 focus:ring-emerald outline-none transition-all"
              required
            />
          </div>

          <Button variant="primary" size="lg" fullWidth className="h-14 mt-4 text-lg" disabled={loading}>
            {loading ? 'جاري الدخول...' : 'دخول'}
          </Button>
        </form>
      </div>
    </div>
  );
}
