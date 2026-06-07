'use client';

import { useEffect, useState, useCallback } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.raheeqarabia.com';

interface OrderLine {
  product_slug: string;
  product_name_ar: string;
  offer_label_ar: string;
  quantity: number;
  unit_price_sar: number;
  is_upsell: boolean;
}

interface Order {
  id: string;
  status: string;
  full_name: string;
  phone: string;
  city: string | null;
  address_line: string | null;
  notes: string | null;
  subtotal_sar: number;
  upsell_added_sar: number;
  total_sar: number;
  currency: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  created_at: string;
  lines: OrderLine[];
}

const STATUSES = ['all', 'pending', 'confirmed', 'shipped', 'delivered', 'returned', 'cancelled'] as const;
const STATUS_LABELS: Record<string, string> = {
  all: 'All',
  pending: 'Pending',
  confirmed: 'Confirmed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  returned: 'Returned',
  cancelled: 'Cancelled',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  shipped: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  delivered: 'bg-green-100 text-green-800 border-green-200',
  returned: 'bg-orange-100 text-orange-800 border-orange-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
};

const fmtSar = (n: number) => `${Math.round(n).toLocaleString()} ﷼`;

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(t);
  }, [query]);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('admin_token');
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (debouncedQuery) params.set('q', debouncedQuery);
      params.set('limit', '200');

      const res = await fetch(`${API_URL}/api/admin/orders?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token || ''}` },
      });
      if (res.status === 401) {
        localStorage.removeItem('admin_token');
        window.location.href = '/admin/login';
        return;
      }
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      setOrders(data.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, debouncedQuery]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`${API_URL}/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token || ''}` },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Update failed');
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selected && selected.id === orderId) setSelected({ ...selected, status: newStatus });
    } catch (err) {
      alert('Failed to update: ' + (err instanceof Error ? err.message : 'unknown'));
    }
  };

  const deleteOrder = async (order: Order) => {
    const ok = window.confirm(`Delete this order permanently?\n\n${order.full_name} · ${fmtSar(order.total_sar)}\n\nUse this only for fake/test orders.`);
    if (!ok) return;

    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`${API_URL}/api/admin/orders/${order.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token || ''}` },
      });
      if (!res.ok) throw new Error('Delete failed');
      setOrders(prev => prev.filter(o => o.id !== order.id));
      if (selected?.id === order.id) setSelected(null);
    } catch (err) {
      alert('Failed to delete: ' + (err instanceof Error ? err.message : 'unknown'));
    }
  };

  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = s === 'all' ? orders.length : orders.filter(o => o.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-6 md:p-8 bg-stone-50 min-h-screen" dir="ltr">
      <div className="mb-6">
        <h1 className="font-sans font-black text-3xl text-charcoal">Orders</h1>
        <p className="font-sans text-charcoal/60 mt-1 text-sm">Manage all customer orders</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          <input
            type="text"
            placeholder="Search by name, phone, or city..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-emerald font-sans text-sm"
          />
          <div className="flex flex-wrap gap-2">
            {STATUSES.map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg font-sans text-xs font-bold border transition-colors ${
                  statusFilter === s
                    ? 'bg-emerald text-white border-emerald'
                    : 'bg-white text-charcoal/70 border-stone-200 hover:border-emerald/50'
                }`}
              >
                {STATUS_LABELS[s]} {statusFilter === s ? `(${counts[s]})` : ''}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 font-sans text-sm">{error}</div>}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full font-sans text-sm">
            <thead className="bg-stone-50 text-charcoal/60 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left font-bold">Date</th>
                <th className="px-4 py-3 text-left font-bold">Customer</th>
                <th className="px-4 py-3 text-left font-bold">Phone</th>
                <th className="px-4 py-3 text-left font-bold">City</th>
                <th className="px-4 py-3 text-left font-bold">Products</th>
                <th className="px-4 py-3 text-left font-bold">Total</th>
                <th className="px-4 py-3 text-left font-bold">Status</th>
                <th className="px-4 py-3 text-center font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-charcoal/50">Loading...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-charcoal/40">No orders found</td></tr>
              ) : orders.map(o => (
                <tr key={o.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="px-4 py-3 text-charcoal/70 text-xs">
                    {new Date(o.created_at).toLocaleDateString('en-GB')}<br />
                    <span className="text-charcoal/40">{new Date(o.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
                  </td>
                  <td className="px-4 py-3 font-bold text-charcoal">{o.full_name}</td>
                  <td className="px-4 py-3 text-charcoal/70" dir="ltr">{o.phone}</td>
                  <td className="px-4 py-3 text-charcoal/70">{o.city || '—'}</td>
                  <td className="px-4 py-3 text-charcoal/80">
                    {o.lines.length === 1 ? (o.lines[0]?.product_name_ar ?? '—') : `${o.lines.length} products`}
                    {o.upsell_added_sar > 0 && <span className="ml-1 text-saffron text-[10px] font-bold">+UPSELL</span>}
                  </td>
                  <td className="px-4 py-3 font-bold text-emerald">{fmtSar(o.total_sar)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${STATUS_COLORS[o.status]}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => setSelected(o)}
                        className="text-emerald hover:underline font-bold text-xs"
                      >
                        View
                      </button>
                      <button
                        onClick={() => deleteOrder(o)}
                        className="text-red-600 hover:underline font-bold text-xs"
                        title="Delete fake/test order"
                      >
                        Trash
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setSelected(null)}>
          <div
            className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="sticky top-0 bg-white border-b border-stone-100 px-6 py-4 flex justify-between items-center z-10">
              <div>
                <h2 className="font-sans font-black text-2xl text-charcoal">Order Details</h2>
                <p className="font-mono text-xs text-charcoal/40 mt-1">{selected.id}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 transition-colors text-charcoal"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6 font-sans">
              {/* Status actions */}
              <div>
                <p className="text-xs font-bold text-charcoal/60 uppercase mb-2">Quick Status Update</p>
                <div className="flex flex-wrap gap-2">
                  {(['pending', 'confirmed', 'shipped', 'delivered', 'returned', 'cancelled'] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selected.id, s)}
                      className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${
                        selected.status === s
                          ? 'bg-emerald text-white border-emerald shadow-md'
                          : 'bg-white text-charcoal/70 border-stone-200 hover:border-emerald hover:text-emerald'
                      }`}
                    >
                      {STATUS_LABELS[s]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-red-100 bg-red-50 p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="font-sans text-sm font-black text-red-700">Fake/Test order?</p>
                    <p className="font-sans text-xs text-red-700/70 mt-1">Delete it from dashboard metrics permanently.</p>
                  </div>
                  <button
                    onClick={() => deleteOrder(selected)}
                    className="rounded-xl bg-red-600 px-4 py-2 font-sans text-xs font-black text-white hover:bg-red-700"
                  >
                    Trash this order
                  </button>
                </div>
              </div>

              {/* Customer info */}
              <div>
                <p className="text-xs font-bold text-charcoal/60 uppercase mb-2">Customer Information</p>
                <div className="bg-stone-50 rounded-2xl p-4 grid grid-cols-2 gap-4 text-sm">
                  <Field label="Full Name" value={selected.full_name} />
                  <Field label="Phone" value={selected.phone} mono />
                  <Field label="City" value={selected.city || '—'} />
                  <Field label="Date" value={new Date(selected.created_at).toLocaleString('en-GB')} />
                  {selected.address_line && <Field label="Address" value={selected.address_line} full />}
                  {selected.notes && <Field label="Notes" value={selected.notes} full />}
                </div>
              </div>

              {/* Items */}
              <div>
                <p className="text-xs font-bold text-charcoal/60 uppercase mb-2">Order Items</p>
                <div className="space-y-2">
                  {selected.lines.map((l, i) => (
                    <div key={i} className="flex justify-between items-center p-4 rounded-xl border border-stone-100 bg-white">
                      <div>
                        <p className="font-bold text-charcoal">{l.product_name_ar}</p>
                        <p className="text-xs text-charcoal/60 mt-1">{l.offer_label_ar} · qty: {l.quantity}</p>
                        {l.is_upsell && <span className="inline-block mt-1 bg-saffron/20 text-saffron px-2 py-0.5 rounded text-[10px] font-bold">UPSELL</span>}
                      </div>
                      <p className="font-bold text-emerald">{fmtSar(l.unit_price_sar * l.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="bg-emerald/5 rounded-2xl p-4 space-y-2 border border-emerald/15">
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal/60">Subtotal</span>
                  <span className="font-bold">{fmtSar(selected.subtotal_sar)}</span>
                </div>
                {selected.upsell_added_sar > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-saffron font-bold">Upsell</span>
                    <span className="font-bold text-saffron">+{fmtSar(selected.upsell_added_sar)}</span>
                  </div>
                )}
                <div className="border-t border-emerald/10 pt-2 flex justify-between text-lg">
                  <span className="font-bold text-charcoal">Total</span>
                  <span className="font-black text-emerald">{fmtSar(selected.total_sar)}</span>
                </div>
              </div>

              {/* Marketing attribution */}
              {(selected.utm_source || selected.utm_medium || selected.utm_campaign) && (
                <div>
                  <p className="text-xs font-bold text-charcoal/60 uppercase mb-2">Marketing Attribution</p>
                  <div className="bg-stone-50 rounded-2xl p-4 grid grid-cols-3 gap-4 text-xs">
                    <Field label="Source" value={selected.utm_source || '—'} />
                    <Field label="Medium" value={selected.utm_medium || '—'} />
                    <Field label="Campaign" value={selected.utm_campaign || '—'} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, mono = false, full = false }: { label: string; value: string; mono?: boolean; full?: boolean }) {
  return (
    <div className={full ? 'col-span-2' : ''}>
      <p className="text-[10px] text-charcoal/50 uppercase font-bold">{label}</p>
      <p className={`font-bold text-charcoal mt-1 ${mono ? 'font-mono' : ''}`} dir={mono ? 'ltr' : 'auto'}>{value}</p>
    </div>
  );
}
