import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAdminApi } from '@/lib/adminGuard';

const Body = z.object({
  authorBg: z.string().min(1),
  authorEn: z.string().min(1),
  authorDe: z.string().min(1),
  roleBg: z.string().nullable().optional(),
  roleEn: z.string().nullable().optional(),
  roleDe: z.string().nullable().optional(),
  photoUrl: z.string().nullable().optional(),
  quoteBg: z.string().min(1),
  quoteEn: z.string().min(1),
  quoteDe: z.string().min(1),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  sortOrder: z.coerce.number().int().default(0),
  published: z.boolean().default(true),
});

export async function POST(req: Request) {
  const guard = await requireAdminApi();
  if (guard) return guard;
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ error: 'BAD_REQUEST', issues: parsed.error.flatten() }, { status: 400 });
  const created = await prisma.testimonial.create({ data: parsed.data });
  return NextResponse.json(created);
}
