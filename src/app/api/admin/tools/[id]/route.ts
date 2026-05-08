import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/session';

const ToolInput = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  nameEn: z.string().min(1),
  nameBg: z.string().min(1),
  taglineEn: z.string().min(1),
  taglineBg: z.string().min(1),
  descriptionEn: z.string().min(1),
  descriptionBg: z.string().min(1),
  iconUrl: z.string().optional().transform((v) => (v ? v : null)),
  affiliateUrl: z.string().url(),
  category: z.string().min(1),
  featured: z.boolean(),
  sortOrder: z.number().int(),
});

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await ctx.params;
  const json = await req.json().catch(() => null);
  const parsed = ToolInput.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
      { status: 400 },
    );
  }
  try {
    await prisma.tool.update({ where: { id }, data: parsed.data });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message =
      err instanceof Error && err.message.includes('Unique')
        ? 'Slug is already in use.'
        : 'Could not update tool.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await ctx.params;
  await prisma.tool.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
