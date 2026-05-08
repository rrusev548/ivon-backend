import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/lib/i18n';

export default async function CheckoutSuccess({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('checkout');
  return (
    <section className="mx-auto max-w-2xl px-4 py-24 text-center">
      <span className="eyebrow">★</span>
      <h1 className="heading-xl mt-5">{t('successTitle')}</h1>
      <p className="mt-5 text-cream-100/75">{t('successBody')}</p>
      <Link href={`/${locale}/account`} className="btn-primary mt-10">
        {t('goToAccount')}
      </Link>
    </section>
  );
}
