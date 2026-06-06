'use client';

import { useEffect, useState, useCallback } from 'react';

interface Metrics {
  clicks: number;
  orders: number;
  conversion_rate: number;
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState('30'); // days

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('admin_token');
      
      const now = new Date();
      const start = new Date();
      start.setDate(now.getDate() - parseInt(dateRange));
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/admin/metrics?start_date=${start.toISOString()}&end_date=${now.toISOString()}`, {
        headers: {
          'x-api-key': token || '',
        }
      });
      if (!res.ok) throw new Error('Failed to fetch metrics');
      
      const data = await res.json();
      setMetrics(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('حدث خطأ غير متوقع');
      }
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return (
    <div className="p-8" dir="rtl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-tajawal font-black text-3xl text-emerald">الإحصائيات (Dashboard)</h1>
          <p className="font-tajawal text-charcoal/60 mt-1">نظرة عامة على أداء المتجر</p>
        </div>
        
        <select 
          value={dateRange} 
          onChange={(e) => setDateRange(e.target.value)}
          className="font-tajawal rounded-xl border border-stone-200 bg-white px-4 py-2 outline-none focus:border-emerald"
        >
          <option value="1">اليوم</option>
          <option value="7">آخر 7 أيام</option>
          <option value="30">آخر 30 يوم</option>
          <option value="90">آخر 90 يوم</option>
        </select>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100 flex flex-col justify-between h-40">
          <p className="font-tajawal font-bold text-charcoal/60 text-lg">زيارات حقيقية (KSA, No VPN)</p>
          <p className="font-sans font-black text-5xl text-emerald">
            {loading ? '...' : metrics?.clicks.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100 flex flex-col justify-between h-40">
          <p className="font-tajawal font-bold text-charcoal/60 text-lg">عدد الطلبات</p>
          <p className="font-sans font-black text-5xl text-[#00A85A]">
            {loading ? '...' : metrics?.orders.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100 flex flex-col justify-between h-40">
          <p className="font-tajawal font-bold text-charcoal/60 text-lg">معدل التحويل (Conversion Rate)</p>
          <p className="font-sans font-black text-5xl text-saffron">
            {loading ? '...' : `${metrics?.conversion_rate}%`}
          </p>
        </div>
      </div>
    </div>
  );
}
