import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAdminApi } from '@/lib/adminGuard';

const Body = z.object({
  slug: z.string().min(1),
  level: z.coerce.number().int().min(1),
  titleBg: z.string().min(1),
  titleEn: z.string().min(1),
  titleDe: z.string().min(1),
  shortDescBg: z.string().min(1),
  shortDescEn: z.string().min(1),
  shortDescDe: z.string().min(1),
  longDescBg: z.string().default(''),
  longDescEn: z.string().default(''),
  longDescDe: z.string().default(''),
  coverUrl: z.string().nullable().optional(),
  priceCents: z.coerce.number().int().nonnegative(),
  currency: z.string().default('EUR'),
  published: z.boolean().default(true),
  autoInvoice: z.boolean().default(false),
  sortOrder: z.coerce.number().int().default(0),
});

export async function POST(req: Request) {
  const guard = await requireAdminApi();
  if (guard) return guard;
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ error: 'BAD_REQUEST', issues: parsed.error.flatten() }, { status: 400 });
  const created = await prisma.course.create({ data: parsed.data });
  return NextResponse.json(created);
}
