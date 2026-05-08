import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/db';
import { pick, pickOptional } from '@/lib/locale';
import type { Locale } from '@/lib/i18n';
import CourseCard from '@/components/CourseCard';
import Reveal from '@/components/Reveal';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('home');
  const ct = await getTranslations('courses');

  const [courses, credentials, testimonials] = await Promise.all([
    prisma.course.findMany({
      where: { published: true },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.credential.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.testimonial.findMany({
      where: { published: true },
      orderBy: { sortOrder: 'asc' },
    }),
  ]);

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="hero-mesh absolute inset-0 -z-10 animate-mesh" aria-hidden="true" />
        <div className="mx-auto max-w-6xl px-4 pt-20 pb-24 sm:pt-28 sm:pb-32">
          <Reveal>
            <span className="eyebrow">— {t('eyebrow')}</span>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="heading-xl mt-5 max-w-4xl">{t('heroTitle')}</h1>
          </Reveal>
          <Reveal delay={220}>
            <p className="mt-6 max-w-2xl text-lg text-cream-100/75">{t('heroSubtitle')}</p>
          </Reveal>
          <Reveal delay={320}>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href={`/${locale}/courses`} className="btn-primary">
                {t('heroPrimaryCta')}
              </Link>
              <Link href={`/${locale}/about`} className="btn-ghost">
                {t('heroSecondaryCta')}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {credentials.length > 0 && (
        <section className="border-t border-cream-100/10 bg-ink-800/40">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <Reveal>
              <span className="eyebrow">{t('trustEyebrow')}</span>
              <h2 className="heading-md mt-3">{t('credentialsTitle')}</h2>
            </Reveal>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {credentials.map((c, i) => (
                <Reveal key={c.id} delay={i * 80}>
                  <div className="border-l border-gold-300/30 pl-5">
                    <div className="serif text-4xl font-medium text-gold-300">
                      {pick(c, 'value', locale)}
                    </div>
                    <div className="mt-1 text-sm text-cream-100/65">
                      {pick(c, 'label', locale)}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 py-20 sm:py-24">
        <Reveal>
          <span className="eyebrow">{t('coursesEyebrow')}</span>
          <h2 className="heading-lg mt-3">{t('coursesTitle')}</h2>
          <p className="mt-3 max-w-xl text-cream-100/70">{t('coursesSubtitle')}</p>
        </Reveal>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
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
                ctaLabel={t('viewCourse')}
                levelLabel={ct('level', { level: c.level })}
                fromLabel={ct('from')}
              />
            </Reveal>
          ))}
        </div>
      </section>

      {testimonials.length > 0 && (
        <section className="border-y border-cream-100/10 bg-ink-800/40">
          <div className="mx-auto max-w-6xl px-4 py-20">
            <Reveal>
              <span className="eyebrow">{t('testimonialsEyebrow')}</span>
              <h2 className="heading-lg mt-3">{t('testimonialsTitle')}</h2>
            </Reveal>
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {testimonials.map((tm, i) => (
                <Reveal key={tm.id} delay={i * 100}>
                  <figure className="card-glass h-full p-7">
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="text-gold-300/70"
                    >
                      <path
                        d="M9 7c-3 0-5 2-5 5v5h5v-5H6c0-2 1.5-3 3-3V7zm10 0c-3 0-5 2-5 5v5h5v-5h-3c0-2 1.5-3 3-3V7z"
                        fill="currentColor"
                      />
                    </svg>
                    <blockquote className="serif mt-4 text-lg leading-relaxed text-cream-50">
                      {pick(tm, 'quote', locale)}
                    </blockquote>
                    <figcaption className="mt-5 text-sm text-cream-100/65">
                      <div className="font-medium text-cream-50">{pick(tm, 'author', locale)}</div>
                      {pickOptional(tm, 'role', locale) && (
                        <div className="mt-0.5">{pickOptional(tm, 'role', locale)}</div>
                      )}
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 py-20 sm:py-24">
        <Reveal>
          <div className="card-glass relative overflow-hidden p-10 sm:p-14">
            <div className="hero-mesh absolute inset-0 -z-10 opacity-60" aria-hidden="true" />
            <span className="eyebrow">{t('aboutEyebrow')}</span>
            <h2 className="heading-lg mt-3 max-w-xl">{t('aboutTeaserTitle')}</h2>
            <p className="mt-4 max-w-xl text-cream-100/75">{t('aboutTeaserBody')}</p>
            <Link href={`/${locale}/about`} className="btn-outline-gold mt-8">
              {t('aboutTeaserCta')} →
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
