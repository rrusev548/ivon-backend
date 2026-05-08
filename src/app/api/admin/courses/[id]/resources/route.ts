import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAdminApi } from '@/lib/adminGuard';

const Body = z.object({
  titleBg: z.string().min(1),
  titleEn: z.string().min(1),
  titleDe: z.string().min(1),
  fileUrl: z.string().url(),
  fileSize: z.coerce.number().int().nullable().optional(),
  fileType: z.string().nullable().optional(),
  sortOrder: z.coerce.number().int().default(0),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdminApi();
  if (guard) return guard;
  const { id: courseId } = await params;
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ error: 'BAD_REQUEST', issues: parsed.error.flatten() }, { status: 400 });
  const created = await prisma.resource.create({ data: { ...parsed.data, courseId } });
  return NextResponse.json(created);
}
