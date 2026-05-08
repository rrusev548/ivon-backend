import Link from 'next/link';
import { prisma } from '@/lib/db';

export default async function AdminPromptsPage() {
  const prompts = await prisma.prompt.findMany({
    orderBy: [{ tool: { sortOrder: 'asc' } }, { sortOrder: 'asc' }],
    include: { tool: { select: { nameEn: true, slug: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Prompts</h1>
        <Link href="/admin/prompts/new" className="btn-primary">+ New prompt</Link>
      </div>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Tool</th>
              <th className="px-4 py-3">Title (EN)</th>
              <th className="px-4 py-3">Order</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {prompts.map((p) => (
              <tr key={p.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium">{p.tool.nameEn}</td>
                <td className="px-4 py-3">{p.titleEn}</td>
                <td className="px-4 py-3">{p.sortOrder}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/prompts/${p.id}`} className="text-brand-700 hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {prompts.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                  No prompts yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
