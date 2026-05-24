/**
 * Server-side proxy for POST /api/orders
 * Forwards to the backend, forwarding the real client IP.
 * Using a proxy eliminates all CORS issues and removes the need
 * to bake NEXT_PUBLIC_API_URL into the frontend bundle.
 */
import { type NextRequest, NextResponse } from 'next/server';

const BACKEND = process.env.BACKEND_URL || 'https://api.raheeqarabia.com';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();

    const clientIp =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      '';

    const idempotencyKey = req.headers.get('idempotency-key') || '';

    const res = await fetch(`${BACKEND}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey,
        'X-Forwarded-For': clientIp,
        'X-Real-IP': clientIp,
        'User-Agent': req.headers.get('user-agent') || '',
      },
      body,
    });

    const data = await res.text();

    return new NextResponse(data, {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[orders proxy] error:', err);
    return NextResponse.json(
      { detail: { code: 'NETWORK_ERROR', message: 'تعذّر الاتصال بالخادم، حاولي مرة أخرى.' } },
      { status: 503 },
    );
  }
}
