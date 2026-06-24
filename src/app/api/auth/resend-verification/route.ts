import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { getCurrentUserId } from '@/lib/userSession';
import { generateVerificationToken, sendVerificationEmail } from '@/lib/email';
import { getClientIp, rateLimit } from '@/lib/rateLimit';

const Body = z.object({ locale: z.enum(['bg', 'en', 'de']).optional() });

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const limit = rateLimit(`resend-verify:${ip}`, 3, 60 * 60);
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

  const parsed = Body.safeParse(await req.json().catch(() => ({})));
  const locale = parsed.success ? parsed.data.locale ?? 'en' : 'en';

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: 'AUTH_REQUIRED' }, { status: 401 });
  }
  if (user.emailVerifiedAt) {
    return NextResponse.json({ ok: true, alreadyVerified: true });
  }

  const { token, expiresAt } = generateVerificationToken();
  await prisma.user.update({
    where: { id: user.id },
    data: { verificationToken: token, verificationTokenExpiresAt: expiresAt },
  });

  try {
    await sendVerificationEmail({ to: user.email, token, locale });
  } catch (err) {
    console.error('[resend-verification] failed:', err);
    return NextResponse.json({ error: 'SEND_FAILED' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
