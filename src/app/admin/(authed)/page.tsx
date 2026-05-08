import Link from 'next/link';
import { prisma } from '@/lib/db';

export default async function AdminDashboardPage() {
  const [toolsCount, promptsCount, featuredCount] = await Promise.all([
    prisma.tool.count(),
    prisma.prompt.count(),
    prisma.tool.count({ where: { featured: true } }),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Tools" value={toolsCount} href="/admin/tools" />
        <Stat label="Prompts" value={promptsCount} href="/admin/prompts" />
        <Stat label="Featured" value={featuredCount} />
      </div>
      <div className="card p-6">
        <h2 className="font-semibold">Quick actions</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/admin/tools/new" className="btn-primary">+ New tool</Link>
          <Link href="/admin/prompts/new" className="btn-ghost">+ New prompt</Link>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, href }: { label: string; value: number; href?: string }) {
  const inner = (
    <div className="card flex flex-col gap-1 p-5">
      <span className="text-xs uppercase tracking-wide text-slate-500">{label}</span>
      <span className="text-3xl font-bold">{value}</span>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}
