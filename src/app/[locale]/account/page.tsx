import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/db';
import { pick } from '@/lib/locale';
import { getCurrentUserId } from '@/lib/userSession';
import type { Locale } from '@/lib/i18n';
import LogoutButton from './LogoutButton';

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const userId = await getCurrentUserId();
  if (!userId) redirect(`/${locale}/auth/login`);

  const t = await getTranslations('account');
  const at = await getTranslations('auth');

  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        include: { resources: { orderBy: { sortOrder: 'asc' } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <section className="mx-auto max-w-4xl px-4 pt-20 pb-24 sm:pt-28">
      <div className="flex items-center justify-between">
        <h1 className="heading-xl">{t('title')}</h1>
        <LogoutButton locale={locale} label={at('logout')} />
      </div>

      <h2 className="heading-md mt-12">{t('myCourses')}</h2>
      <div className="divider-gold mt-3" />

      {enrollments.length === 0 ? (
        <div className="mt-8 text-cream-100/65">
          <p>{t('noCourses')}</p>
          <Link href={`/${locale}/courses`} className="btn-primary mt-6">
            {t('browseCourses')}
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          {enrollments.map((en) => (
            <div key={en.id} className="card-glass p-7">
              <div className="flex items-center justify-between">
                <h3 className="serif text-xl font-medium text-cream-50">
                  {pick(en.course, 'title', locale)}
                </h3>
                <Link
                  href={`/${locale}/courses/${en.course.slug}`}
                  className="text-sm text-gold-300 hover:underline"
                >
                  {t('open')} →
                </Link>
              </div>
              {en.course.resources.length > 0 && (
                <>
                  <div className="mt-5 text-xs uppercase tracking-wider text-cream-100/55">
                    {t('downloadResources')}
                  </div>
                  <ul className="mt-3 space-y-2">
                    {en.course.resources.map((r) => (
                      <li key={r.id}>
                        <a
                          href={`/api/resources/${r.id}/download`}
                          className="inline-flex items-center gap-2 text-cream-100/85 transition hover:text-gold-300"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                            />
                          </svg>
                          {pick(r, 'title', locale)}
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
