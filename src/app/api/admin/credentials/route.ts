import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAdminApi } from '@/lib/adminGuard';

const Body = z.object({
  valueBg: z.string().min(1),
  valueEn: z.string().min(1),
  valueDe: z.string().min(1),
  labelBg: z.string().min(1),
  labelEn: z.string().min(1),
  labelDe: z.string().min(1),
  sortOrder: z.coerce.number().int().default(0),
});

export async function POST(req: Request) {
  const guard = await requireAdminApi();
  if (guard) return guard;
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ error: 'BAD_REQUEST', issues: parsed.error.flatten() }, { status: 400 });
  const created = await prisma.credential.create({ data: parsed.data });
  return NextResponse.json(created);
}
