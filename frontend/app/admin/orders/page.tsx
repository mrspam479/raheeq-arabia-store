'use client';

import { useEffect, useState } from 'react';
import { formatSar } from '@/lib/price';

interface OrderLine {
  product_slug: string;
  product_name_ar: string;
  offer_code: string;
  offer_label_ar: string;
  quantity: number;
  unit_price_sar: number;
  is_upsell: boolean;
}

interface Order {
  id: string;
  status: string;
  total_sar: number;
  lines: OrderLine[];
  created_at: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('admin_token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/admin/orders?limit=100`, {
          headers: { 'x-api-key': token || '' }
        });
        if (!res.ok) throw new Error('Failed to fetch orders');
        const data = await res.json();
        setOrders(data.items);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const translateStatus = (status: string) => {
    const map: Record<string, string> = {
      pending: 'قيد الانتظار',
      confirmed: 'مؤكد',
      shipped: 'تم الشحن',
      delivered: 'تم التوصيل',
      returned: 'مسترجع',
      cancelled: 'ملغي'
    };
    return map[status] || status;
  };

  const getStatusColor = (status: string) => {
    const map: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      returned: 'bg-orange-100 text-orange-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return map[status] || 'bg-stone-100 text-stone-800';
  };

  return (
    <div className="p-8" dir="rtl">
      <div className="mb-8">
        <h1 className="font-tajawal font-black text-3xl text-emerald">الطلبات (Orders)</h1>
        <p className="font-tajawal text-charcoal/60 mt-1">إدارة أحدث الطلبات</p>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right font-tajawal">
            <thead className="bg-stone-50 border-b border-stone-100 text-charcoal/60 text-sm">
              <tr>
                <th className="p-4 font-bold">رقم الطلب (ID)</th>
                <th className="p-4 font-bold">التاريخ</th>
                <th className="p-4 font-bold">المنتجات</th>
                <th className="p-4 font-bold">الإجمالي</th>
                <th className="p-4 font-bold">الحالة</th>
                <th className="p-4 font-bold text-center">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-sm">
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-charcoal/50">جاري التحميل...</td></tr>
              ) : orders.map(order => (
                <tr key={order.id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="p-4 font-sans text-xs text-charcoal/50">{order.id.split('-')[0]}...</td>
                  <td className="p-4 text-charcoal/80" dir="ltr">{new Date(order.created_at).toLocaleString('en-GB')}</td>
                  <td className="p-4">
                    {order.lines.map((l, i) => (
                      <div key={i} className="text-emerald font-bold">
                        {l.product_name_ar} <span className="text-charcoal/50 font-normal">x{l.quantity}</span>
                      </div>
                    ))}
                  </td>
                  <td className="p-4 font-sans font-bold text-charcoal">{formatSar(order.total_sar)}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                      {translateStatus(order.status)}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="text-emerald hover:text-emerald/70 font-bold underline"
                    >
                      عرض التفاصيل
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && orders.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-charcoal/50">لا يوجد طلبات</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Preview Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" dir="rtl">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-stone-100 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="font-tajawal font-black text-2xl text-emerald">تفاصيل الطلب</h2>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 text-charcoal hover:bg-stone-200 transition-colors font-sans"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4 bg-stone-50 p-4 rounded-2xl">
                <div>
                  <p className="font-tajawal text-xs text-charcoal/50 mb-1">رقم الطلب</p>
                  <p className="font-sans text-sm font-bold text-charcoal">{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="font-tajawal text-xs text-charcoal/50 mb-1">تاريخ الطلب</p>
                  <p className="font-sans text-sm font-bold text-charcoal" dir="ltr">{new Date(selectedOrder.created_at).toLocaleString('en-GB')}</p>
                </div>
                <div>
                  <p className="font-tajawal text-xs text-charcoal/50 mb-1">الحالة</p>
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(selectedOrder.status)}`}>
                    {translateStatus(selectedOrder.status)}
                  </span>
                </div>
                <div>
                  <p className="font-tajawal text-xs text-charcoal/50 mb-1">الإجمالي</p>
                  <p className="font-sans text-lg font-black text-emerald">{formatSar(selectedOrder.total_sar)}</p>
                </div>
              </div>

              <div>
                <h3 className="font-tajawal font-bold text-lg text-emerald mb-3">المنتجات المطلوبة</h3>
                <div className="space-y-3">
                  {selectedOrder.lines.map((line, idx) => (
                    <div key={idx} className="flex justify-between items-center p-4 rounded-2xl border border-stone-100 bg-white">
                      <div>
                        <p className="font-tajawal font-bold text-charcoal">{line.product_name_ar}</p>
                        <p className="font-tajawal text-xs text-charcoal/60 mt-1">{line.offer_label_ar}</p>
                        {line.is_upsell && (
                          <span className="inline-block mt-2 bg-saffron/20 text-saffron px-2 py-0.5 rounded text-[10px] font-bold">
                            ➕ عرض إضافي (Upsell)
                          </span>
                        )}
                      </div>
                      <div className="text-left">
                        <p className="font-sans font-bold text-emerald">{formatSar(line.unit_price_sar * line.quantity)}</p>
                        <p className="font-tajawal text-xs text-charcoal/50 mt-1">الكمية: {line.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
