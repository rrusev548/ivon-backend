import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Inter, Fraunces } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { locales, type Locale } from '@/lib/i18n';
import { prisma } from '@/lib/db';
import { pick } from '@/lib/locale';
import { getCurrentUserId } from '@/lib/userSession';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import OfferPopup from '@/components/OfferPopup';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
});
const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
  axes: ['SOFT', 'opsz'],
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

  const [popupCfg, t, userId] = await Promise.all([
    prisma.popupConfig.findUnique({ where: { id: 'singleton' } }),
    getTranslations('popup'),
    getCurrentUserId(),
  ]);

  return (
    <html lang={locale} className={`${inter.variable} ${fraunces.variable}`}>
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
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
