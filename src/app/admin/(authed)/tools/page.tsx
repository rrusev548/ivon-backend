import Link from 'next/link';
import { prisma } from '@/lib/db';

export default async function AdminToolsPage() {
  const tools = await prisma.tool.findMany({
    orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }],
    include: { _count: { select: { prompts: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tools</h1>
        <Link href="/admin/tools/new" className="btn-primary">+ New tool</Link>
      </div>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Prompts</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3">Order</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {tools.map((tool) => (
              <tr key={tool.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium">{tool.nameEn}</td>
                <td className="px-4 py-3 text-slate-500">{tool.slug}</td>
                <td className="px-4 py-3">{tool.category}</td>
                <td className="px-4 py-3">{tool._count.prompts}</td>
                <td className="px-4 py-3">{tool.featured ? '★' : '—'}</td>
                <td className="px-4 py-3">{tool.sortOrder}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/tools/${tool.id}`}
                    className="text-brand-700 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {tools.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                  No tools yet. <Link href="/admin/tools/new" className="text-brand-700 underline">Add one</Link>.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
