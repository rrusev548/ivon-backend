import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/lib/i18n';
import VerifyEmailClient from './VerifyEmailClient';

export default async function VerifyEmailPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { locale } = await params;
  const { token } = await searchParams;
  const t = await getTranslations('verifyEmail');

  if (!token) {
    return (
      <section className="mx-auto max-w-md px-4 py-20">
        <h1 className="heading-lg">{t('title')}</h1>
        <div className="card-glass mt-8 p-8">
          <p className="text-sm text-cream-100/80">{t('checkInbox')}</p>
          <p className="mt-6 text-sm text-cream-100/60">
            <Link
              href={`/${locale}/account`}
              className="font-medium text-gold-300 hover:underline"
            >
              {t('goToAccount')}
            </Link>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-md px-4 py-20">
      <h1 className="heading-lg">{t('title')}</h1>
      <div className="card-glass mt-8 p-8">
        <VerifyEmailClient token={token} locale={locale} />
      </div>
    </section>
  );
}
