import { NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyCredentials } from '@/lib/auth';
import { getAdminSession } from '@/lib/session';
import { getClientIp, rateLimit } from '@/lib/rateLimit';

const Body = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const limit = rateLimit(`admin-login:${ip}`, 5, 15 * 60);
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Too many attempts. Try again later.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSec) } },
    );
  }

  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const user = await verifyCredentials(parsed.data.email, parsed.data.password);
  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const session = await getAdminSession();
  session.userId = user.id;
  session.email = user.email;
  await session.save();

  return NextResponse.json({ ok: true });
}
