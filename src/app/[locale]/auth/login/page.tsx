import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/lib/i18n';
import LoginForm from './LoginForm';

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('auth');
  return (
    <section className="mx-auto max-w-md px-4 py-20">
      <h1 className="heading-lg">{t('loginTitle')}</h1>
      <div className="card-glass mt-8 p-8">
        <LoginForm locale={locale} />
      </div>
      <p className="mt-6 text-sm text-cream-100/60">
        {t('noAccount')}{' '}
        <Link
          href={`/${locale}/auth/register`}
          className="font-medium text-gold-300 hover:underline"
        >
          {t('signUp')}
        </Link>
      </p>
    </section>
  );
}
