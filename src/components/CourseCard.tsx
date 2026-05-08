import Link from 'next/link';
import type { Locale } from '@/lib/i18n';

type Props = {
  locale: Locale;
  slug: string;
  level: number;
  title: string;
  shortDesc: string;
  priceCents: number;
  currency: string;
  ctaLabel: string;
  levelLabel: string;
  fromLabel: string;
};

const fmt = (cents: number, currency: string, locale: Locale) =>
  new Intl.NumberFormat(locale === 'bg' ? 'bg-BG' : locale === 'de' ? 'de-DE' : 'en-GB', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);

export default function CourseCard({
  locale,
  slug,
  level,
  title,
  shortDesc,
  priceCents,
  currency,
  ctaLabel,
  levelLabel,
  fromLabel,
}: Props) {
  return (
    <Link
      href={`/${locale}/courses/${slug}`}
      className="gold-card group flex h-full flex-col p-7 sm:p-8"
    >
      <div className="flex items-center justify-between">
        <span className="eyebrow">{levelLabel}</span>
        <span className="serif text-5xl font-medium leading-none text-gold-300/30 transition group-hover:text-gold-300/50">
          0{level}
        </span>
      </div>
      <h3 className="heading-md mt-5">{title}</h3>
      <div className="divider-gold mt-4" />
      <p className="mt-5 text-sm leading-relaxed text-cream-100/70">{shortDesc}</p>
      <div className="mt-auto flex items-end justify-between pt-8">
        <div>
          <div className="text-xs uppercase tracking-wider text-cream-100/50">{fromLabel}</div>
          <div className="serif mt-1 text-2xl font-medium text-cream-50">
            {fmt(priceCents, currency, locale)}
          </div>
        </div>
        <span className="text-sm font-medium text-gold-300 transition group-hover:translate-x-1">
          {ctaLabel} →
        </span>
      </div>
    </Link>
  );
}
