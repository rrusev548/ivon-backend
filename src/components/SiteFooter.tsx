import { useTranslations } from 'next-intl';

export default function SiteFooter() {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-slate-500 sm:flex-row">
        <p>{t('tagline')}</p>
        <p>© {year} Ivon. {t('rights')}</p>
      </div>
    </footer>
  );
}
