import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { getCurrentUserId } from '@/lib/userSession';
import { normalizeCode } from '@/lib/redeemCodes';
import { getClientIp, rateLimit } from '@/lib/rateLimit';

const Body = z.object({ code: z.string().min(1).max(64) });

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const limit = rateLimit(`redeem:${ip}`, 10, 60 * 60);
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'TOO_MANY_REQUESTS' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSec) } },
    );
  }

  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: 'AUTH_REQUIRED' }, { status: 401 });
  }

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'BAD_REQUEST' }, { status: 400 });
  }
  const code = normalizeCode(parsed.data.code);

  const redeem = await prisma.redeemCode.findUnique({
    where: { code },
    include: { course: true },
  });

  if (!redeem) {
    return NextResponse.json({ error: 'INVALID_CODE' }, { status: 404 });
  }

  if (redeem.usedAt) {
    return NextResponse.json({ error: 'ALREADY_USED' }, { status: 409 });
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.redeemCode.update({
        where: { id: redeem.id, usedAt: null },
        data: { usedAt: new Date(), usedByUserId: userId },
      });
      await tx.enrollment.upsert({
        where: { userId_courseId: { userId, courseId: redeem.courseId } },
        update: {},
        create: {
          userId,
          courseId: redeem.courseId,
          source: 'redeem',
          externalId: redeem.id,
          amountCents: redeem.course.priceCents,
          currency: redeem.course.currency,
        },
      });
    });
  } catch (err) {
    console.error('[redeem] tx failed:', err);
    return NextResponse.json({ error: 'ALREADY_USED' }, { status: 409 });
  }

  return NextResponse.json({ ok: true, courseSlug: redeem.course.slug });
}
