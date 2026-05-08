import Link from 'next/link';
import { useTranslations } from 'next-intl';
import LocaleSwitcher from './LocaleSwitcher';
import type { Locale } from '@/lib/i18n';

export default function SiteHeader({ locale }: { locale: Locale }) {
  const t = useTranslations('nav');
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-30">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href={`/${locale}`} className="flex items-center gap-2 font-bold text-lg">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
            iv
          </span>
          <span>Ivon</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-700">
          <Link href={`/${locale}`} className="hover:text-brand-700">
            {t('home')}
          </Link>
          <Link href={`/${locale}/tools`} className="hover:text-brand-700">
            {t('tools')}
          </Link>
          <LocaleSwitcher current={locale} />
        </nav>
      </div>
    </header>
  );
}
