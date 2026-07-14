/**
 * Server-side proxy for POST /api/orders
 *
 * IP forwarding note:
 * The chain is: Browser → Cloudflare → EasyPanel(frontend) → Cloudflare → EasyPanel(backend)
 * When this proxy calls the backend, Cloudflare replaces X-Forwarded-For with the
 * frontend container IP, so MaxMind gets a data center IP → fail-open → geo check bypassed.
 *
 * Fix: Cloudflare always sets CF-Connecting-IP on the *incoming* request with the
 * real user IP. We read it here and forward it as X-Real-Client-IP (a custom header
 * that Cloudflare passes through unchanged). The backend reads X-Real-Client-IP first.
 */
import { type NextRequest, NextResponse } from 'next/server';

const BACKEND = process.env.BACKEND_URL || 'https://api.raheeqarabia.com';
const SHEET_WEBHOOK_URL = process.env.SHEET_WEBHOOK_URL || '';

const PRODUCT_NAMES: Record<string, string> = {
  'habba-nadra': 'حبّة نضرة',
  'habba-bareeq': 'حبّة بريق',
  'habba-jathr': 'حبّة جذر',
  'bundle-glow-trio': 'صندوق الجمال الكامل',
};

const PRODUCT_SKUS: Record<string, string> = {
  'habba-nadra': 'RHQ-NDR-001',
  'habba-bareeq': 'RHQ-BRQ-001',
  'habba-jathr': 'RHQ-JTR-001',
  'bundle-glow-trio': 'RHQ-BND-001',
};

const OFFER_QUANTITIES: Record<string, number> = {
  T1: 1,
  T2: 2,
  T3: 3,
};

function formatPhone(raw: string): string {
  const phone = raw.trim().replace(/[\s\-().]/g, '');
  if (phone.startsWith('+966')) return phone;
  if (phone.startsWith('00966')) return `+${phone.slice(2)}`;
  if (phone.startsWith('966')) return `+${phone}`;
  if (phone.startsWith('05')) return `+966${phone.slice(1)}`;
  if (phone.startsWith('5')) return `+966${phone}`;
  return phone;
}

function todayFormatted(): string {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${now.getFullYear()}`;
}

async function sendToSheet(orderInput: {
  customer: { full_name: string; phone: string };
  lines: { product_slug: string; offer_code: string }[];
}, totalSar: number) {
  if (!SHEET_WEBHOOK_URL) return;

  const products = orderInput.lines.map((l) => PRODUCT_NAMES[l.product_slug] || l.product_slug);
  const skus = orderInput.lines.map((l) => PRODUCT_SKUS[l.product_slug] || l.product_slug);
  const quantities = orderInput.lines.map((l) => String(OFFER_QUANTITIES[l.offer_code] || 1));

  const payload = {
    date: todayFormatted(),
    country: 'KSA',
    name: orderInput.customer.full_name,
    phone: formatPhone(orderInput.customer.phone),
    product: products.join('/'),
    sku: skus.join('/'),
    quantity: quantities.join('/'),
    totalprice: totalSar,
    currency: 'SAR',
    status: '',
  };

  try {
    await fetch(SHEET_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind: 'order', payload }),
      redirect: 'follow',
    });
  } catch {
    // best-effort, don't block the order response
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const parsed = JSON.parse(body);

    const realUserIp =
      req.headers.get('cf-connecting-ip') ||
      req.headers.get('x-forwarded-for')?.split(',').at(0)?.trim() ||
      req.headers.get('x-real-ip') ||
      '';

    const idempotencyKey = req.headers.get('idempotency-key') ?? '';

    const res = await fetch(`${BACKEND}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey,
        'X-Real-Client-IP': realUserIp,
        'X-Forwarded-For': realUserIp,
        'X-Real-IP': realUserIp,
        'User-Agent': req.headers.get('user-agent') ?? '',
      },
      body,
    });

    const data = await res.text();

    if (res.status === 201 && !parsed.honeypot) {
      const orderRes = JSON.parse(data);
      const totalSar = orderRes?.order?.total_sar ?? 0;
      sendToSheet(parsed, totalSar);
    }

    return new NextResponse(data, {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return NextResponse.json(
      { detail: { code: 'NETWORK_ERROR', message: 'تعذّر الاتصال بالخادم، حاولي مرة أخرى.' } },
      { status: 503 },
    );
  }
}
