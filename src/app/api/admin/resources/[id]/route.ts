import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAdminApi } from '@/lib/adminGuard';

const Body = z.object({
  titleBg: z.string().optional(),
  titleEn: z.string().optional(),
  titleDe: z.string().optional(),
  fileUrl: z.string().url().optional(),
  fileSize: z.coerce.number().int().nullable().optional(),
  fileType: z.string().nullable().optional(),
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
  const updated = await prisma.resource.update({ where: { id }, data: parsed.data });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdminApi();
  if (guard) return guard;
  const { id } = await params;
  await prisma.resource.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
