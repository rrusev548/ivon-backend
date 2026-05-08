import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAdminApi } from '@/lib/adminGuard';

const Body = z.object({
  slug: z.string().min(1).optional(),
  level: z.coerce.number().int().min(1).optional(),
  titleBg: z.string().optional(),
  titleEn: z.string().optional(),
  titleDe: z.string().optional(),
  shortDescBg: z.string().optional(),
  shortDescEn: z.string().optional(),
  shortDescDe: z.string().optional(),
  longDescBg: z.string().optional(),
  longDescEn: z.string().optional(),
  longDescDe: z.string().optional(),
  coverUrl: z.string().nullable().optional(),
  priceCents: z.coerce.number().int().nonnegative().optional(),
  currency: z.string().optional(),
  published: z.boolean().optional(),
  autoInvoice: z.boolean().optional(),
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
  const updated = await prisma.course.update({ where: { id }, data: parsed.data });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdminApi();
  if (guard) return guard;
  const { id } = await params;
  await prisma.course.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
