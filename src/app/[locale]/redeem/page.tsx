import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getCurrentUserId } from '@/lib/userSession';
import type { Locale } from '@/lib/i18n';
import RedeemForm from './RedeemForm';

export default async function RedeemPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const userId = await getCurrentUserId();
  if (!userId) {
    redirect(`/${locale}/auth/login?next=/${locale}/redeem`);
  }

  const t = await getTranslations('redeem');
  return (
    <section className="mx-auto max-w-md px-4 py-20">
      <h1 className="heading-lg">{t('title')}</h1>
      <p className="mt-3 text-sm text-cream-100/70">{t('subtitle')}</p>
      <div className="card-glass mt-8 p-8">
        <RedeemForm locale={locale} />
      </div>
    </section>
  );
}
