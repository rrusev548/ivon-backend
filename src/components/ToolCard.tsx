import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { Locale } from '@/lib/i18n';

type ToolCardProps = {
  locale: Locale;
  slug: string;
  name: string;
  tagline: string;
  iconUrl?: string | null;
  category: string;
  promptsCount: number;
};

export default function ToolCard(props: ToolCardProps) {
  const t = useTranslations('tools');
  return (
    <Link
      href={`/${props.locale}/tools/${props.slug}`}
      className="card group flex flex-col gap-3 p-5 transition hover:border-brand-300 hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white text-lg font-bold">
          {props.iconUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={props.iconUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            props.name.charAt(0).toUpperCase()
          )}
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 group-hover:text-brand-700">
            {props.name}
          </h3>
          <span className="text-xs uppercase tracking-wide text-slate-500">
            {props.category}
          </span>
        </div>
      </div>
      <p className="text-sm text-slate-600 line-clamp-3">{props.tagline}</p>
      <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
        <span>{t('promptsCount', { count: props.promptsCount })}</span>
        <span className="text-brand-600 font-medium">{t('details')} →</span>
      </div>
    </Link>
  );
}
