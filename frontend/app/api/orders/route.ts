/**
 * Server-side proxy for POST /api/orders
 *
 * IP forwarding note:
 * The ideal chain is: Browser → Cloudflare → EasyPanel(frontend) → EasyPanel(backend) [internal]
 * BACKEND_URL must be set to the internal Docker/EasyPanel hostname (e.g. http://raheeqarabia_backend:8000)
 * so this proxy talks directly to the backend container without going back through Cloudflare.
 * Going via the public URL causes Cloudflare to block or slow the server-to-server request,
 * resulting in a 9 s timeout and the "تعذّر الاتصال بالخادم" error.
 *
 * CF-Connecting-IP on the *incoming* request always carries the real user IP from Cloudflare.
 * We forward it as X-Real-Client-IP so the backend can still read the true client IP even
 * though the TCP connection now comes from the frontend container.
 *
 * Google Sheets webhook and CAPI events are handled entirely by the Python backend
 * as FastAPI BackgroundTasks — no duplicate sheet calls from this proxy.
 */
import { type NextRequest, NextResponse } from 'next/server';

const BACKEND = process.env.BACKEND_URL || 'https://api.raheeqarabia.com';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();

    const realUserIp =
      req.headers.get('cf-connecting-ip') ||
      req.headers.get('x-forwarded-for')?.split(',').at(0)?.trim() ||
      req.headers.get('x-real-ip') ||
      '';

    const idempotencyKey = req.headers.get('idempotency-key') ?? '';

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000);

    let res: Response;
    try {
      res = await fetch(`${BACKEND}/api/orders`, {
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
    console.error('[api/orders] backend fetch failed — BACKEND_URL:', process.env.BACKEND_URL ?? '(not set)', '—', msg);
    return NextResponse.json(
      { detail: { code: 'NETWORK_ERROR', message: 'تعذّر الاتصال بالخادم، حاولي مرة أخرى.' } },
      { status: 503 },
    );
  }
}
