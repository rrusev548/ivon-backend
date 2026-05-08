import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAdminApi } from '@/lib/adminGuard';

const Body = z.object({
  enabled: z.boolean(),
  titleBg: z.string(),
  titleEn: z.string(),
  titleDe: z.string(),
  bodyBg: z.string(),
  bodyEn: z.string(),
  bodyDe: z.string(),
  ctaLabelBg: z.string(),
  ctaLabelEn: z.string(),
  ctaLabelDe: z.string(),
  ctaUrl: z.string(),
  delaySec: z.coerce.number().int().min(0),
});

export async function PATCH(req: Request) {
  const guard = await requireAdminApi();
  if (guard) return guard;
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ error: 'BAD_REQUEST', issues: parsed.error.flatten() }, { status: 400 });
  const updated = await prisma.popupConfig.upsert({
    where: { id: 'singleton' },
    update: parsed.data,
    create: { id: 'singleton', ...parsed.data },
  });
  return NextResponse.json(updated);
}
