import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';

const Body = z.object({
  email: z.string().email(),
  locale: z.string().optional(),
});

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'BAD_REQUEST' }, { status: 400 });
  }
  const { email, locale } = parsed.data;
  await prisma.subscriber.upsert({
    where: { email },
    update: { locale },
    create: { email, locale, source: 'popup' },
  });
  return NextResponse.json({ ok: true });
}
