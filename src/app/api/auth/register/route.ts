import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { getUserSession } from '@/lib/userSession';
import { getClientIp, rateLimit } from '@/lib/rateLimit';

const Body = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).max(120).optional(),
  locale: z.enum(['bg', 'en', 'de']).optional(),
  website: z.string().max(0).optional(),
});

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const limit = rateLimit(`register:${ip}`, 5, 60 * 60);
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
  const { email, password, name, locale } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: 'EMAIL_EXISTS' }, { status: 409 });
  const passwordHash = await bcrypt.hash(password, 10);
  const data: {
    email: string;
    passwordHash: string;
    nameBg?: string;
    nameEn?: string;
    nameDe?: string;
  } = { email, passwordHash };
  if (name) {
    if (locale === 'bg') data.nameBg = name;
    else if (locale === 'de') data.nameDe = name;
    else data.nameEn = name;
  }
  const user = await prisma.user.create({ data });
  const session = await getUserSession();
  session.userId = user.id;
  session.email = user.email;
  await session.save();
  return NextResponse.json({ ok: true });
}
