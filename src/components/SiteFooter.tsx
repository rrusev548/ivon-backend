import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import LocaleSwitcher from './LocaleSwitcher';
import { aboutConfig } from '@/content/about';
import type { Locale } from '@/lib/i18n';

const Instagram = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
  </svg>
);
const TikTok = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M14 4v9a3.5 3.5 0 1 1-3.5-3.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M14 4c.5 2.5 2.3 4.3 5 4.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

export default async function SiteFooter({ locale }: { locale: Locale }) {
  const t = await getTranslations('footer');
  const year = new Date().getFullYear();
  const lead = aboutConfig.members[0];
  return (
    <footer className="border-t border-cream-100/10 bg-ink-900/60 backdrop-blur-sm">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 text-sm font-black text-ink-900 ring-1 ring-cyan-500/40">
              AI
            </span>
            <span className="text-base font-black tracking-tight text-cream-50">
              AI <span className="bg-gradient-to-r from-cyan-400 to-lime-400 bg-clip-text text-transparent">Playground</span>
            </span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-cream-100/60">{t('tagline')}</p>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-cream-100/50">
            <Link href={`/${locale}/legal/privacy`} className="transition hover:text-gold-300">
              {t('privacy')}
            </Link>
            <Link href={`/${locale}/legal/terms`} className="transition hover:text-gold-300">
              {t('terms')}
            </Link>
          </div>
        </div>
        <div className="flex gap-4 text-cream-100/70 sm:justify-center">
          <a
            href={lead.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="rounded-lg border border-cream-100/15 p-2.5 transition hover:border-gold-300/40 hover:text-gold-300"
          >
            <Instagram />
          </a>
          <a
            href={lead.socials.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
            className="rounded-lg border border-cream-100/15 p-2.5 transition hover:border-gold-300/40 hover:text-gold-300"
          >
            <TikTok />
          </a>
        </div>
        <div className="flex flex-col items-start gap-3 text-sm text-cream-100/55 sm:items-end">
          <LocaleSwitcher current={locale} />
          <p>
            © {year} AI Playground. {t('rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
