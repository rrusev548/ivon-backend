import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Inter } from 'next/font/google';
import { locales, type Locale } from '@/lib/i18n';
import { prisma } from '@/lib/db';
import { pick } from '@/lib/locale';
import { getCurrentUserId } from '@/lib/userSession';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import OfferPopup from '@/components/OfferPopup';
import CookieBanner from '@/components/CookieBanner';

export const metadata = {
  title: 'Digital S Team — AI & Social Media Academy',
  description:
    'Three programs built on real principles — no hype, no fake hacks. Master AI and social media systematically.',
  other: { robots: 'index, follow, noai, noimageai' },
};

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
});

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();

  const [popupCfg, t, ct, userId] = await Promise.all([
    prisma.popupConfig.findUnique({ where: { id: 'singleton' } }),
    getTranslations('popup'),
    getTranslations('cookie'),
    getCurrentUserId(),
  ]);

  return (
    <html lang={locale} className={inter.variable}>
      <body className="flex min-h-screen flex-col">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SiteHeader locale={locale as Locale} hasSession={Boolean(userId)} />
          <main className="flex-1">{children}</main>
          <SiteFooter locale={locale as Locale} />
          {popupCfg?.enabled && (
            <OfferPopup
              locale={locale}
              title={pick(popupCfg, 'title', locale as Locale)}
              body={pick(popupCfg, 'body', locale as Locale)}
              ctaLabel={pick(popupCfg, 'ctaLabel', locale as Locale)}
              ctaUrl={`/${locale}${popupCfg.ctaUrl.startsWith('/') ? popupCfg.ctaUrl : `/${popupCfg.ctaUrl}`}`}
              delaySec={popupCfg.delaySec}
              emailPlaceholder={t('emailPlaceholder')}
              closeLabel={t('close')}
            />
          )}
          <CookieBanner
            title={ct('title')}
            body={ct('body')}
            acceptLabel={ct('accept')}
            declineLabel={ct('decline')}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
