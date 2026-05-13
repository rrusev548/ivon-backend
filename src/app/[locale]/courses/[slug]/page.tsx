import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/db';
import { pick } from '@/lib/locale';
import type { Locale } from '@/lib/i18n';
import Reveal from '@/components/Reveal';
import BuyButton from './BuyButton';
import FaqAccordion from '@/components/FaqAccordion';
import GuaranteeBadge from '@/components/GuaranteeBadge';
import StickyMobileCta from '@/components/StickyMobileCta';

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations('courses');

  const course = await prisma.course.findUnique({
    where: { slug },
    include: { resources: { orderBy: { sortOrder: 'asc' } } },
  });
  if (!course || !course.published) notFound();

  const fmt = new Intl.NumberFormat(
    locale === 'bg' ? 'bg-BG' : locale === 'de' ? 'de-DE' : 'en-GB',
    { style: 'currency', currency: course.currency, maximumFractionDigits: 0 },
  ).format(course.priceCents / 100);

  const longDesc = pick(course, 'longDesc', locale);
  const linktreeUrl = process.env.LINKTREE_URL?.trim() || null;
  const rt = await getTranslations('redeem');

  return (
    <>
      <section className="mx-auto max-w-4xl px-4 pt-20 pb-24 sm:pt-28">
        <Reveal>
          <span className="eyebrow">{t('level', { level: course.level })}</span>
          <h1 className="heading-xl mt-5">{pick(course, 'title', locale)}</h1>
          <p className="mt-5 text-lg leading-relaxed text-cream-100/80">
            {pick(course, 'shortDesc', locale)}
          </p>
        </Reveal>

        <Reveal delay={100}>
          <div className="card-glass mt-12 flex flex-col gap-5 p-7 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-cream-100/55">{t('from')}</div>
              <div className="mt-1 text-4xl font-bold text-gold-300">{fmt}</div>
            </div>
            <BuyButton
              label={t('buyCta')}
              href={linktreeUrl}
              comingSoonLabel={t('comingSoon')}
            />
          </div>
          <p className="mt-3 text-xs text-cream-100/50">
            <Link href={`/${locale}/redeem`} className="text-gold-300 hover:underline">
              {rt('haveCode')}
            </Link>
          </p>
        </Reveal>

        <Reveal delay={200}>
          <div className="mt-16">
            <span className="eyebrow">★</span>
            <h2 className="heading-md mt-3">{t('longDescTitle')}</h2>
            <div className="divider-gold mt-4" />
            <p className="mt-6 whitespace-pre-line text-cream-100/80">{longDesc}</p>
          </div>
        </Reveal>

        <Reveal delay={250}>
          <div className="mt-16">
            <GuaranteeBadge title={t('guaranteeTitle')} body={t('guaranteeBody')} />
          </div>
        </Reveal>

        <Reveal delay={300}>
          <div className="mt-16">
            <span className="eyebrow">FAQ</span>
            <h2 className="heading-md mt-3">{t('faqTitle')}</h2>
            <div className="divider-gold mt-4" />
            <div className="mt-8">
              <FaqAccordion locale={locale} />
            </div>
          </div>
        </Reveal>
      </section>
      <StickyMobileCta label={t('stickyCta')} price={fmt} href={linktreeUrl} />
    </>
  );
}
