import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/db';
import { pickToolFields, pickPromptFields } from '@/lib/locale';
import type { Locale } from '@/lib/i18n';
import PromptCard from '@/components/PromptCard';

export default async function ToolDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations('tool');

  const tool = await prisma.tool.findUnique({
    where: { slug },
    include: { prompts: { orderBy: { sortOrder: 'asc' } } },
  });
  if (!tool) notFound();

  const fields = pickToolFields(tool, locale);

  return (
    <article className="mx-auto max-w-4xl px-4 py-12">
      <Link href={`/${locale}/tools`} className="text-sm text-brand-700 hover:underline">
        ← {t('back')}
      </Link>

      <header className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-2xl font-bold text-white">
          {fields.iconUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={fields.iconUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            fields.name.charAt(0).toUpperCase()
          )}
        </div>
        <div className="flex-1">
          <span className="text-xs uppercase tracking-wide text-slate-500">
            {fields.category}
          </span>
          <h1 className="text-3xl font-bold">{fields.name}</h1>
          <p className="mt-2 text-lg text-slate-600">{fields.tagline}</p>
        </div>
      </header>

      <div className="mt-6 rounded-2xl border border-brand-200 bg-brand-50 p-5">
        <p className="whitespace-pre-line text-slate-700">{fields.description}</p>
        <a
          href={fields.affiliateUrl}
          target="_blank"
          rel="nofollow sponsored noopener noreferrer"
          className="btn-primary mt-4"
        >
          {t('openCta', { name: fields.name })} →
        </a>
        <p className="mt-2 text-xs text-slate-500">{t('affiliateNote')}</p>
      </div>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">{t('promptsTitle')}</h2>
        {tool.prompts.length === 0 ? (
          <p className="mt-4 text-slate-500">{t('noPrompts')}</p>
        ) : (
          <div className="mt-4 grid gap-4">
            {tool.prompts.map((prompt) => {
              const p = pickPromptFields(prompt, locale);
              return <PromptCard key={p.id} title={p.title} content={p.content} />;
            })}
          </div>
        )}
      </section>
    </article>
  );
}
