import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAdminApi } from '@/lib/adminGuard';
import { generateCode } from '@/lib/redeemCodes';

const Body = z.object({
  courseId: z.string().min(1),
  count: z.number().int().min(1).max(100),
});

export async function GET() {
  const guard = await requireAdminApi();
  if (guard) return guard;

  const codes = await prisma.redeemCode.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      course: { select: { slug: true, titleEn: true } },
    },
    take: 500,
  });

  const usedByIds = codes.map((c) => c.usedByUserId).filter((id): id is string => !!id);
  const users =
    usedByIds.length > 0
      ? await prisma.user.findMany({
          where: { id: { in: usedByIds } },
          select: { id: true, email: true },
        })
      : [];
  const emailMap = new Map(users.map((u) => [u.id, u.email]));

  return NextResponse.json({
    codes: codes.map((c) => ({
      id: c.id,
      code: c.code,
      courseSlug: c.course.slug,
      courseTitle: c.course.titleEn,
      usedAt: c.usedAt,
      usedByEmail: c.usedByUserId ? emailMap.get(c.usedByUserId) ?? null : null,
      createdAt: c.createdAt,
    })),
  });
}

export async function POST(req: Request) {
  const guard = await requireAdminApi();
  if (guard) return guard;

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'BAD_REQUEST' }, { status: 400 });
  }

  const course = await prisma.course.findUnique({ where: { id: parsed.data.courseId } });
  if (!course) {
    return NextResponse.json({ error: 'COURSE_NOT_FOUND' }, { status: 404 });
  }

  const codes: string[] = [];
  for (let i = 0; i < parsed.data.count; i++) {
    let attempt = 0;
    while (attempt < 5) {
      const code = generateCode();
      try {
        await prisma.redeemCode.create({
          data: { code, courseId: course.id },
        });
        codes.push(code);
        break;
      } catch {
        attempt += 1;
      }
    }
  }

  return NextResponse.json({ ok: true, codes });
}
