import Link from 'next/link';
import { prisma } from '@/lib/db';

export default async function AdminDashboard() {
  const [coursesCount, enrollmentsCount, usersCount, subscribersCount, popup] = await Promise.all([
    prisma.course.count(),
    prisma.enrollment.count(),
    prisma.user.count(),
    prisma.subscriber.count(),
    prisma.popupConfig.findUnique({ where: { id: 'singleton' } }),
  ]);

  return (
    <div className="space-y-8">
      <h1 className="heading-lg">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Courses" value={coursesCount} href="/admin/courses" />
        <Stat label="Users" value={usersCount} href="/admin/users" />
        <Stat label="Enrollments" value={enrollmentsCount} href="/admin/enrollments" />
        <Stat label="Subscribers" value={subscribersCount} />
      </div>
      <div className="card-glass p-6">
        <h2 className="serif text-lg font-medium text-cream-50">Popup status</h2>
        <p className="mt-2 text-sm text-cream-100/70">
          {popup?.enabled ? 'Active' : 'Disabled'} — delay {popup?.delaySec ?? 0}s
        </p>
        <Link href="/admin/popup" className="btn-outline-gold mt-4 text-sm">
          Configure popup →
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value, href }: { label: string; value: number; href?: string }) {
  const inner = (
    <div className="card-glass flex flex-col gap-1 p-5 transition hover:border-gold-300/30">
      <span className="text-xs uppercase tracking-wide text-cream-100/55">{label}</span>
      <span className="serif text-3xl font-medium text-cream-50">{value}</span>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}
