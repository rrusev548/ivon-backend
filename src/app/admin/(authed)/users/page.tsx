import { prisma } from '@/lib/db';

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { enrollments: true } } },
  });
  return (
    <div className="space-y-6">
      <h1 className="heading-lg">Users</h1>
      <div className="card-glass overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ink-800/60 text-cream-100/65">
            <tr>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-right">Enrollments</th>
              <th className="px-4 py-3 text-right">Created</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-cream-100/10">
                <td className="px-4 py-3 font-mono text-xs">{u.email}</td>
                <td className="px-4 py-3">{u.nameEn ?? u.nameBg ?? u.nameDe ?? '—'}</td>
                <td className="px-4 py-3 text-right">{u._count.enrollments}</td>
                <td className="px-4 py-3 text-right text-cream-100/55">
                  {u.createdAt.toLocaleDateString()}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-cream-100/55">
                  No users yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
