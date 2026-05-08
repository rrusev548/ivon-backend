import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/session';
import { ensureAdminUser } from '@/lib/auth';

async function bootstrapAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (email && password) {
    try {
      await ensureAdminUser(email, password);
    } catch {
      // ignore — DB might not be ready during first build
    }
  }
}

export default async function AuthedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await bootstrapAdmin();

  const session = await getAdminSession();
  if (!session.userId) redirect('/admin/login');

  return (
    <div className="flex min-h-screen">
      <aside className="w-60 shrink-0 border-r border-slate-200 bg-white p-4">
        <Link href="/admin" className="flex items-center gap-2 font-bold">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
            iv
          </span>
          <span>Ivon Admin</span>
        </Link>
        <nav className="mt-8 flex flex-col gap-1 text-sm">
          <Link href="/admin" className="rounded px-3 py-2 hover:bg-slate-100">
            Dashboard
          </Link>
          <Link href="/admin/tools" className="rounded px-3 py-2 hover:bg-slate-100">
            Tools
          </Link>
          <Link href="/admin/prompts" className="rounded px-3 py-2 hover:bg-slate-100">
            Prompts
          </Link>
        </nav>
        <form action="/api/admin/logout" method="post" className="mt-8">
          <button className="btn-ghost w-full text-sm">Sign out</button>
        </form>
        <p className="mt-6 break-all text-xs text-slate-500">{session.email}</p>
      </aside>
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}
