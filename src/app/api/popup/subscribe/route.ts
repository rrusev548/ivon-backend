import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { getClientIp, rateLimit } from '@/lib/rateLimit';

const Body = z.object({
  email: z.string().email(),
  locale: z.string().optional(),
  website: z.string().max(0).optional(),
});

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const limit = rateLimit(`popup:${ip}`, 10, 60 * 60);
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'TOO_MANY_REQUESTS' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSec) } },
    );
  }

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'BAD_REQUEST' }, { status: 400 });
  }
  if (parsed.data.website && parsed.data.website.length > 0) {
    return NextResponse.json({ ok: true });
  }
  const { email, locale } = parsed.data;
  await prisma.subscriber.upsert({
    where: { email },
    update: { locale },
    create: { email, locale, source: 'popup' },
  });
  return NextResponse.json({ ok: true });
}
