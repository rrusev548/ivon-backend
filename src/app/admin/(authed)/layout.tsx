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
      /* ignore */
    }
  }
}

const NAV: Array<[string, string]> = [
  ['/admin', 'Dashboard'],
  ['/admin/courses', 'Courses'],
  ['/admin/codes', 'Redeem codes'],
  ['/admin/popup', 'Popup'],
  ['/admin/affiliates', 'Affiliates'],
  ['/admin/testimonials', 'Testimonials'],
  ['/admin/credentials', 'Credentials'],
  ['/admin/users', 'Users'],
  ['/admin/enrollments', 'Enrollments'],
];

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
      <aside className="w-64 shrink-0 border-r border-cream-100/10 bg-ink-800 p-5">
        <Link href="/admin" className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-gold-300/40 bg-ink-900 text-sm font-medium text-gold-300">
            iv
          </span>
          <span className="serif font-medium text-cream-50">Ivon Admin</span>
        </Link>
        <nav className="mt-8 flex flex-col gap-1 text-sm">
          {NAV.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="rounded-md px-3 py-2 text-cream-100/75 transition hover:bg-ink-700 hover:text-gold-300"
            >
              {label}
            </Link>
          ))}
        </nav>
        <form action="/api/admin/logout" method="post" className="mt-10">
          <button className="btn-ghost w-full text-sm">Sign out</button>
        </form>
        <p className="mt-6 break-all text-xs text-cream-100/45">{session.email}</p>
      </aside>
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}
