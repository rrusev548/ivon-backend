import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import CourseForm from '../CourseForm';
import ResourcesPanel from './ResourcesPanel';

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = await prisma.course.findUnique({
    where: { id },
    include: { resources: { orderBy: { sortOrder: 'asc' } } },
  });
  if (!course) notFound();

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="heading-lg">{course.titleEn}</h1>
        <Link href="/admin/courses" className="btn-ghost text-sm">
          ← Back
        </Link>
      </div>
      <CourseForm
        initial={{
          id: course.id,
          slug: course.slug,
          level: course.level,
          titleBg: course.titleBg,
          titleEn: course.titleEn,
          titleDe: course.titleDe,
          shortDescBg: course.shortDescBg,
          shortDescEn: course.shortDescEn,
          shortDescDe: course.shortDescDe,
          longDescBg: course.longDescBg,
          longDescEn: course.longDescEn,
          longDescDe: course.longDescDe,
          coverUrl: course.coverUrl,
          priceCents: course.priceCents,
          currency: course.currency,
          published: course.published,
          autoInvoice: course.autoInvoice,
          sortOrder: course.sortOrder,
        }}
      />
      <ResourcesPanel courseId={course.id} resources={course.resources} />
    </div>
  );
}
