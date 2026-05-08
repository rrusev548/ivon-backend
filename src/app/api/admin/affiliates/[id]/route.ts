import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAdminApi } from '@/lib/adminGuard';

const Body = z.object({
  nameBg: z.string().optional(),
  nameEn: z.string().optional(),
  nameDe: z.string().optional(),
  descBg: z.string().optional(),
  descEn: z.string().optional(),
  descDe: z.string().optional(),
  url: z.string().url().optional(),
  iconUrl: z.string().nullable().optional(),
  sortOrder: z.coerce.number().int().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdminApi();
  if (guard) return guard;
  const { id } = await params;
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ error: 'BAD_REQUEST', issues: parsed.error.flatten() }, { status: 400 });
  const updated = await prisma.affiliateLink.update({ where: { id }, data: parsed.data });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdminApi();
  if (guard) return guard;
  const { id } = await params;
  await prisma.affiliateLink.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
