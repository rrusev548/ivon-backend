import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAdminApi } from '@/lib/adminGuard';

const Body = z.object({
  nameBg: z.string().min(1),
  nameEn: z.string().min(1),
  nameDe: z.string().min(1),
  descBg: z.string().min(1),
  descEn: z.string().min(1),
  descDe: z.string().min(1),
  url: z.string().url(),
  iconUrl: z.string().nullable().optional(),
  sortOrder: z.coerce.number().int().default(0),
});

export async function POST(req: Request) {
  const guard = await requireAdminApi();
  if (guard) return guard;
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ error: 'BAD_REQUEST', issues: parsed.error.flatten() }, { status: 400 });
  const created = await prisma.affiliateLink.create({ data: parsed.data });
  return NextResponse.json(created);
}
