import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/db';
import { pick } from '@/lib/locale';
import type { Locale } from '@/lib/i18n';
import CourseCard from '@/components/CourseCard';
import Reveal from '@/components/Reveal';

export default async function CoursesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('courses');
  const ht = await getTranslations('home');

  const courses = await prisma.course.findMany({
    where: { published: true },
    orderBy: { sortOrder: 'asc' },
  });

  return (
    <section className="mx-auto max-w-6xl px-4 pt-20 pb-24 sm:pt-28">
      <Reveal>
        <span className="eyebrow">{ht('coursesEyebrow')}</span>
        <h1 className="heading-xl mt-5">{t('title')}</h1>
        <p className="mt-4 max-w-xl text-cream-100/70">{t('subtitle')}</p>
      </Reveal>
      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {courses.map((c, i) => (
          <Reveal key={c.id} delay={i * 100}>
            <CourseCard
              locale={locale}
              slug={c.slug}
              level={c.level}
              title={pick(c, 'title', locale)}
              shortDesc={pick(c, 'shortDesc', locale)}
              priceCents={c.priceCents}
              currency={c.currency}
              ctaLabel={ht('viewCourse')}
              levelLabel={t('level', { level: c.level })}
              fromLabel={t('from')}
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
