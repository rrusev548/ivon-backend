import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/lib/i18n';
import RegisterForm from './RegisterForm';

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('auth');
  return (
    <section className="mx-auto max-w-md px-4 py-20">
      <h1 className="heading-lg">{t('registerTitle')}</h1>
      <div className="card-glass mt-8 p-8">
        <RegisterForm locale={locale} />
      </div>
      <p className="mt-6 text-sm text-cream-100/60">
        {t('haveAccount')}{' '}
        <Link
          href={`/${locale}/auth/login`}
          className="font-medium text-gold-300 hover:underline"
        >
          {t('signIn')}
        </Link>
      </p>
    </section>
  );
}
