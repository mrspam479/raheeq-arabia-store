/**
 * Server-side proxy for PATCH /api/orders/:orderId/upsell
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

    const res = await fetch(`${BACKEND}/api/orders/${orderId}/upsell`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Upsell-Token': upsellToken,
      },
      body,
    });

    const data = await res.text();
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
