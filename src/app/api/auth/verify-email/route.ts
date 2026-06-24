import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';

const Body = z.object({ token: z.string().min(1) });

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'BAD_REQUEST' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { verificationToken: parsed.data.token },
  });

  if (!user) {
    return NextResponse.json({ error: 'INVALID_TOKEN' }, { status: 404 });
  }

  if (user.emailVerifiedAt) {
    return NextResponse.json({ ok: true, alreadyVerified: true });
  }

  if (user.verificationTokenExpiresAt && user.verificationTokenExpiresAt < new Date()) {
    return NextResponse.json({ error: 'TOKEN_EXPIRED' }, { status: 410 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerifiedAt: new Date(),
      verificationToken: null,
      verificationTokenExpiresAt: null,
    },
  });

  return NextResponse.json({ ok: true });
}
