import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Serves pixel IDs at runtime from server-side environment variables.
 * This bypasses the Next.js NEXT_PUBLIC_ build-time baking limitation —
 * even if EasyPanel only injects env vars at runtime (not as Docker build args),
 * this API route can still read them and return them to the client.
 */
export async function GET() {
  return NextResponse.json({
    tiktok: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID ?? 'D8PIOU3C77U082M85FM0',
    snap: process.env.NEXT_PUBLIC_SNAP_PIXEL_ID ?? 'f2c54c8f-1550-44e8-8832-515ff3d8865c',
    meta: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? '',
  });
}
