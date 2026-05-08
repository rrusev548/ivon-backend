import Link from 'next/link';
import { prisma } from '@/lib/db';

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { _count: { select: { resources: true, enrollments: true } } },
  });
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="heading-lg">Courses</h1>
        <Link href="/admin/courses/new" className="btn-primary text-sm">
          + New course
        </Link>
      </div>
      <div className="card-glass overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ink-800/60 text-cream-100/65">
            <tr>
              <th className="px-4 py-3 text-left">Level</th>
              <th className="px-4 py-3 text-left">Slug</th>
              <th className="px-4 py-3 text-left">Title (EN)</th>
              <th className="px-4 py-3 text-right">Price</th>
              <th className="px-4 py-3 text-right">Resources</th>
              <th className="px-4 py-3 text-right">Enrollments</th>
              <th className="px-4 py-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c.id} className="border-t border-cream-100/10">
                <td className="px-4 py-3 text-gold-300">{c.level}</td>
                <td className="px-4 py-3 font-mono text-xs text-cream-100/70">{c.slug}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/courses/${c.id}`} className="hover:text-gold-300">
                    {c.titleEn}
                  </Link>
                </td>
                <td className="px-4 py-3 text-right">
                  {(c.priceCents / 100).toFixed(0)} {c.currency}
                </td>
                <td className="px-4 py-3 text-right text-cream-100/70">{c._count.resources}</td>
                <td className="px-4 py-3 text-right text-cream-100/70">{c._count.enrollments}</td>
                <td className="px-4 py-3 text-right">
                  <span
                    className={
                      c.published
                        ? 'rounded-full bg-emerald-400/10 px-2 py-0.5 text-xs text-emerald-300'
                        : 'rounded-full bg-cream-100/10 px-2 py-0.5 text-xs text-cream-100/60'
                    }
                  >
                    {c.published ? 'Live' : 'Draft'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
