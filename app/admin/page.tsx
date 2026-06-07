'use client';

import { useEffect, useState, useCallback } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.raheeqarabia.com';

interface Overview {
  clicks: number;
  total_orders: number;
  gross_revenue: number;
  net_revenue: number;
  aov: number;
  conversion_rate: number;
  confirmation_rate: number;
  delivery_rate: number;
  return_rate: number;
  cancel_rate: number;
  upsell_rate: number;
  upsell_revenue: number;
  by_status: {
    pending: number;
    confirmed: number;
    shipped: number;
    delivered: number;
    returned: number;
    cancelled: number;
  };
}

interface ProductRow { slug: string; name_ar: string; quantity: number; revenue: number; orders: number; }
interface CityRow { city: string; orders: number; revenue: number; }
interface SourceRow { source: string; orders: number; revenue: number; }
interface DayRow { day: string; orders: number; revenue: number; }

const fmtSar = (n: number) => `${Math.round(n).toLocaleString()} ﷼`;

export default function AdminDashboard() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [topProducts, setTopProducts] = useState<ProductRow[]>([]);
  const [topCities, setTopCities] = useState<CityRow[]>([]);
  const [topSources, setTopSources] = useState<SourceRow[]>([]);
  const [timeseries, setTimeseries] = useState<DayRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState('30');

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('admin_token');
      const now = new Date();
      const start = new Date();
      start.setDate(now.getDate() - parseInt(dateRange));
      const params = `start_date=${start.toISOString()}&end_date=${now.toISOString()}`;
      const headers = { Authorization: `Bearer ${token || ''}` };

      const [ovRes, prodRes, cityRes, srcRes, tsRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/metrics/overview?${params}`, { headers }),
        fetch(`${API_URL}/api/admin/metrics/top-products?${params}`, { headers }),
        fetch(`${API_URL}/api/admin/metrics/top-cities?${params}`, { headers }),
        fetch(`${API_URL}/api/admin/metrics/top-sources?${params}`, { headers }),
        fetch(`${API_URL}/api/admin/metrics/timeseries?${params}`, { headers }),
      ]);

      if (ovRes.status === 401) {
        localStorage.removeItem('admin_token');
        window.location.href = '/admin/login';
        return;
      }
      if (!ovRes.ok) throw new Error('Failed to load metrics');

      setOverview(await ovRes.json());
      setTopProducts((await prodRes.json()).items || []);
      setTopCities((await cityRes.json()).items || []);
      setTopSources((await srcRes.json()).items || []);
      setTimeseries((await tsRes.json()).items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const maxOrders = Math.max(1, ...timeseries.map(d => d.orders));

  return (
    <div className="p-6 md:p-8 bg-stone-50 min-h-screen" dir="ltr">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-6">
        <div>
          <h1 className="font-sans font-black text-3xl text-charcoal">Dashboard</h1>
          <p className="font-sans text-charcoal/60 mt-1 text-sm">Overview of your store performance</p>
        </div>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="font-sans rounded-xl border border-stone-200 bg-white px-4 py-2.5 outline-none focus:border-emerald shadow-sm"
        >
          <option value="1">Today</option>
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last year</option>
        </select>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 font-sans text-sm">{error}</div>}

      {loading && !overview && <div className="text-center py-20 text-charcoal/50">Loading...</div>}

      {overview && (
        <>
          {/* ── Top KPIs ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <KpiCard label="Total Revenue" value={fmtSar(overview.gross_revenue)} hint={`Net (delivered): ${fmtSar(overview.net_revenue)}`} color="emerald" />
            <KpiCard label="Total Orders" value={overview.total_orders.toLocaleString()} hint={`AOV: ${fmtSar(overview.aov)}`} color="blue" />
            <KpiCard label="Valid Visitors" value={overview.clicks.toLocaleString()} hint="KSA only · no VPN" color="purple" />
            <KpiCard label="Conversion Rate" value={`${overview.conversion_rate}%`} hint="Orders / Visitors" color="amber" />
          </div>

          {/* ── COD Performance ── */}
          <div className="bg-white rounded-2xl border border-stone-100 p-6 mb-6 shadow-sm">
            <h2 className="font-sans font-bold text-lg text-charcoal mb-4">COD Performance</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <PerfBar label="Confirmation Rate" value={overview.confirmation_rate} hint="% confirmed by call" goodAbove={70} />
              <PerfBar label="Delivery Rate" value={overview.delivery_rate} hint="% confirmed → delivered" goodAbove={75} />
              <PerfBar label="Return Rate" value={overview.return_rate} hint="Lower is better" goodBelow={10} />
              <PerfBar label="Cancel Rate" value={overview.cancel_rate} hint="Lower is better" goodBelow={20} />
            </div>
          </div>

          {/* ── Order Funnel (status breakdown) ── */}
          <div className="bg-white rounded-2xl border border-stone-100 p-6 mb-6 shadow-sm">
            <h2 className="font-sans font-bold text-lg text-charcoal mb-4">Order Status Breakdown</h2>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              <StatusPill label="Pending" count={overview.by_status.pending} color="yellow" />
              <StatusPill label="Confirmed" count={overview.by_status.confirmed} color="blue" />
              <StatusPill label="Shipped" count={overview.by_status.shipped} color="indigo" />
              <StatusPill label="Delivered" count={overview.by_status.delivered} color="green" />
              <StatusPill label="Returned" count={overview.by_status.returned} color="orange" />
              <StatusPill label="Cancelled" count={overview.by_status.cancelled} color="red" />
            </div>
          </div>

          {/* ── Upsell Performance ── */}
          <div className="bg-gradient-to-br from-saffron/10 to-emerald/5 border border-saffron/20 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="font-sans font-bold text-charcoal text-sm">Upsell Performance</p>
                <p className="font-sans text-3xl font-black text-emerald mt-1">{overview.upsell_rate}%</p>
                <p className="font-sans text-xs text-charcoal/60 mt-1">of orders accepted the upsell</p>
              </div>
              <div className="text-right">
                <p className="font-sans text-xs text-charcoal/60">Extra revenue from upsells</p>
                <p className="font-sans text-2xl font-black text-saffron">{fmtSar(overview.upsell_revenue)}</p>
              </div>
            </div>
          </div>

          {/* ── Daily Orders Chart ── */}
          <div className="bg-white rounded-2xl border border-stone-100 p-6 mb-6 shadow-sm">
            <h2 className="font-sans font-bold text-lg text-charcoal mb-4">Orders Per Day</h2>
            {timeseries.length === 0 ? (
              <p className="text-charcoal/40 text-center py-10 font-sans text-sm">No data for this range</p>
            ) : (
              <div className="flex items-end gap-1 h-40">
                {timeseries.map(d => (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-1 group relative">
                    <div className="absolute -top-8 bg-charcoal text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10 font-sans">
                      {d.orders} orders · {fmtSar(d.revenue)}
                    </div>
                    <div
                      className="w-full bg-emerald rounded-t transition-all hover:bg-emerald/80"
                      style={{ height: `${(d.orders / maxOrders) * 100}%`, minHeight: d.orders > 0 ? '2px' : '0' }}
                    />
                    <span className="font-sans text-[9px] text-charcoal/50 rotate-45 origin-top-left whitespace-nowrap mt-1">
                      {new Date(d.day).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Tables ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <DataTable
              title="Top Products"
              headers={['Product', 'Qty', 'Revenue']}
              rows={topProducts.map(p => [p.name_ar, p.quantity.toString(), fmtSar(p.revenue)])}
            />
            <DataTable
              title="Top Cities"
              headers={['City', 'Orders', 'Revenue']}
              rows={topCities.map(c => [c.city, c.orders.toString(), fmtSar(c.revenue)])}
            />
          </div>

          <div className="grid grid-cols-1 gap-6">
            <DataTable
              title="Traffic Sources (UTM)"
              headers={['Source', 'Orders', 'Revenue']}
              rows={topSources.map(s => [s.source, s.orders.toString(), fmtSar(s.revenue)])}
            />
          </div>
        </>
      )}
    </div>
  );
}

function KpiCard({ label, value, hint, color }: { label: string; value: string; hint: string; color: 'emerald' | 'blue' | 'purple' | 'amber' }) {
  const colorMap = {
    emerald: 'text-emerald',
    blue: 'text-blue-600',
    purple: 'text-purple-600',
    amber: 'text-amber-600',
  };
  return (
    <div className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
      <p className="font-sans text-xs font-bold text-charcoal/60 uppercase tracking-wide">{label}</p>
      <p className={`font-sans font-black text-2xl md:text-3xl mt-2 ${colorMap[color]}`}>{value}</p>
      <p className="font-sans text-xs text-charcoal/50 mt-1">{hint}</p>
    </div>
  );
}

function PerfBar({ label, value, hint, goodAbove, goodBelow }: { label: string; value: number; hint: string; goodAbove?: number; goodBelow?: number }) {
  let color = 'bg-charcoal/40';
  if (goodAbove !== undefined) {
    color = value >= goodAbove ? 'bg-emerald' : value >= goodAbove * 0.7 ? 'bg-amber-500' : 'bg-red-500';
  } else if (goodBelow !== undefined) {
    color = value <= goodBelow ? 'bg-emerald' : value <= goodBelow * 1.5 ? 'bg-amber-500' : 'bg-red-500';
  }
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="font-sans text-xs font-bold text-charcoal/70">{label}</p>
        <p className="font-sans text-xl font-black text-charcoal">{value}%</p>
      </div>
      <div className="w-full h-2 bg-stone-100 rounded-full mt-2 overflow-hidden">
        <div className={`${color} h-full rounded-full transition-all`} style={{ width: `${Math.min(value, 100)}%` }} />
      </div>
      <p className="font-sans text-[10px] text-charcoal/50 mt-1.5">{hint}</p>
    </div>
  );
}

function StatusPill({ label, count, color }: { label: string; count: number; color: string }) {
  const colorMap: Record<string, string> = {
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    red: 'bg-red-50 text-red-700 border-red-200',
  };
  return (
    <div className={`rounded-xl border-2 px-4 py-3 text-center ${colorMap[color]}`}>
      <p className="font-sans text-xs font-bold">{label}</p>
      <p className="font-sans text-2xl font-black mt-1">{count}</p>
    </div>
  );
}

function DataTable({ title, headers, rows }: { title: string; headers: string[]; rows: string[][] }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-stone-100">
        <h2 className="font-sans font-bold text-lg text-charcoal">{title}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full font-sans text-sm">
          <thead className="bg-stone-50 text-charcoal/60 text-xs uppercase">
            <tr>{headers.map(h => <th key={h} className="px-6 py-3 text-left font-bold">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {rows.length === 0 ? (
              <tr><td colSpan={headers.length} className="px-6 py-8 text-center text-charcoal/40">No data</td></tr>
            ) : rows.map((r, i) => (
              <tr key={i} className="hover:bg-stone-50 transition-colors">
                {r.map((cell, j) => (
                  <td key={j} className={`px-6 py-3 ${j === 0 ? 'font-bold text-charcoal' : 'text-charcoal/80'}`}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
