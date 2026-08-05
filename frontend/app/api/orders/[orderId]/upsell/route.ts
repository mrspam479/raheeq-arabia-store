/**
 * Server-side proxy for PATCH /api/orders/:orderId/upsell
 *
 * BACKEND_URL must be the internal Docker/EasyPanel hostname (e.g. http://raheeqarabia_backend:8000)
 * — see orders/route.ts for the full explanation.
 */
import { type NextRequest, NextResponse } from 'next/server';

const BACKEND = process.env.BACKEND_URL || 'https://api.raheeqarabia.com';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  try {
    const { orderId } = await params;
    const body = await req.text();
    const upsellToken = req.headers.get('x-upsell-token') ?? '';

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000);

    let res: Response;
    try {
      res = await fetch(`${BACKEND}/api/orders/${orderId}/upsell`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Upsell-Token': upsellToken,
        },
        body,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    const data = await res.text();
    return new NextResponse(data, {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const msg = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    console.error('[api/orders/upsell] backend fetch failed — BACKEND_URL:', process.env.BACKEND_URL ?? '(not set)', '—', msg);
    return NextResponse.json(
      { detail: { code: 'NETWORK_ERROR', message: 'تعذّر الاتصال بالخادم، حاولي مرة أخرى.' } },
      { status: 503 },
    );
  }
}
