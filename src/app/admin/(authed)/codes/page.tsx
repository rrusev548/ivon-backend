import { prisma } from '@/lib/db';
import CodesClient from './CodesClient';

export default async function AdminCodesPage() {
  const courses = await prisma.course.findMany({
    orderBy: { sortOrder: 'asc' },
    select: { id: true, titleEn: true, slug: true },
  });
  return (
    <div className="space-y-6">
      <h1 className="heading-lg">Redeem codes</h1>
      <p className="text-sm text-cream-100/65">
        Generate codes here and share them with customers after external payment. Each code unlocks one
        enrollment for one course.
      </p>
      <CodesClient courses={courses} />
    </div>
  );
}
