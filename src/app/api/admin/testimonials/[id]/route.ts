import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAdminApi } from '@/lib/adminGuard';

const Body = z.object({
  authorBg: z.string().optional(),
  authorEn: z.string().optional(),
  authorDe: z.string().optional(),
  roleBg: z.string().nullable().optional(),
  roleEn: z.string().nullable().optional(),
  roleDe: z.string().nullable().optional(),
  photoUrl: z.string().nullable().optional(),
  quoteBg: z.string().optional(),
  quoteEn: z.string().optional(),
  quoteDe: z.string().optional(),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  sortOrder: z.coerce.number().int().optional(),
  published: z.boolean().optional(),
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
  const updated = await prisma.testimonial.update({ where: { id }, data: parsed.data });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdminApi();
  if (guard) return guard;
  const { id } = await params;
  await prisma.testimonial.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
