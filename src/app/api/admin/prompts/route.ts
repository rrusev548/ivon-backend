import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/session';

const PromptInput = z.object({
  toolId: z.string().min(1),
  titleEn: z.string().min(1),
  titleBg: z.string().min(1),
  contentEn: z.string().min(1),
  contentBg: z.string().min(1),
  sortOrder: z.number().int(),
});

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const json = await req.json().catch(() => null);
  const parsed = PromptInput.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
      { status: 400 },
    );
  }
  const tool = await prisma.tool.findUnique({ where: { id: parsed.data.toolId } });
  if (!tool) return NextResponse.json({ error: 'Tool not found' }, { status: 400 });

  const prompt = await prisma.prompt.create({ data: parsed.data });
  return NextResponse.json({ id: prompt.id });
}
