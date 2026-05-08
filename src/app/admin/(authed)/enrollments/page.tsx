import { prisma } from '@/lib/db';

export default async function AdminEnrollmentsPage() {
  const enrollments = await prisma.enrollment.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { email: true } },
      course: { select: { titleEn: true, slug: true } },
    },
  });
  return (
    <div className="space-y-6">
      <h1 className="heading-lg">Enrollments</h1>
      <div className="card-glass overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ink-800/60 text-cream-100/65">
            <tr>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Course</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3 text-right">Source</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((e) => (
              <tr key={e.id} className="border-t border-cream-100/10">
                <td className="px-4 py-3 text-cream-100/65">{e.createdAt.toLocaleDateString()}</td>
                <td className="px-4 py-3 font-mono text-xs">{e.user.email}</td>
                <td className="px-4 py-3">{e.course.titleEn}</td>
                <td className="px-4 py-3 text-right">
                  {(e.amountCents / 100).toFixed(2)} {e.currency}
                </td>
                <td className="px-4 py-3 text-right text-cream-100/55">{e.source}</td>
              </tr>
            ))}
            {enrollments.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-cream-100/55">
                  No enrollments yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
