import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/db';
import { pickToolFields } from '@/lib/locale';
import type { Locale } from '@/lib/i18n';
import ToolCard from '@/components/ToolCard';

export default async function ToolsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('tools');
  const home = await getTranslations('home');

  const tools = await prisma.tool.findMany({
    orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }],
    include: { _count: { select: { prompts: true } } },
  });

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold">{t('title')}</h1>
      <p className="mt-2 text-slate-600">{t('subtitle')}</p>
      {tools.length === 0 ? (
        <p className="mt-8 text-slate-500">{home('noTools')}</p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
  );
}
