import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/db';
import { pickToolFields } from '@/lib/locale';
import type { Locale } from '@/lib/i18n';
import ToolCard from '@/components/ToolCard';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('home');

  const tools = await prisma.tool.findMany({
    orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }],
    include: { _count: { select: { prompts: true } } },
  });

  const featured = tools.filter((tool) => tool.featured).slice(0, 3);

  return (
    <>
      <section className="border-b border-slate-200 bg-gradient-to-br from-brand-50 via-white to-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <div className="max-w-2xl">
            <span className="inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700">
              AI · {new Date().getFullYear()}
            </span>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              {t('heroTitle')}
            </h1>
            <p className="mt-4 text-lg text-slate-600">{t('heroSubtitle')}</p>
            <div className="mt-6 flex gap-3">
              <Link href={`/${locale}/tools`} className="btn-primary">
                {t('heroCta')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-12">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-bold">{t('featuredTitle')}</h2>
            <Link
              href={`/${locale}/tools`}
              className="text-sm font-medium text-brand-700 hover:underline"
            >
              {t('viewAll')} →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((tool) => {
              const fields = pickToolFields(tool, locale);
              return (
                <ToolCard
                  key={tool.id}
                  locale={locale}
                  slug={fields.slug}
                  name={fields.name}
                  tagline={fields.tagline}
                  iconUrl={fields.iconUrl}
                  category={fields.category}
                  promptsCount={tool._count.prompts}
                />
              );
            })}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="mb-6 text-2xl font-bold">{t('allToolsTitle')}</h2>
        {tools.length === 0 ? (
          <p className="text-slate-500">{t('noTools')}</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => {
              const fields = pickToolFields(tool, locale);
              return (
                <ToolCard
                  key={tool.id}
                  locale={locale}
                  slug={fields.slug}
                  name={fields.name}
                  tagline={fields.tagline}
                  iconUrl={fields.iconUrl}
                  category={fields.category}
                  promptsCount={tool._count.prompts}
                />
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
