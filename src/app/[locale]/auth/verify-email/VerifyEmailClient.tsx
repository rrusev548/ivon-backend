'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { Locale } from '@/lib/i18n';

type Status = 'pending' | 'ok' | 'expired' | 'invalid' | 'error';

export default function VerifyEmailClient({ token, locale }: { token: string; locale: Locale }) {
  const t = useTranslations('verifyEmail');
  const [status, setStatus] = useState<Status>('pending');

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        const res = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
        if (cancelled) return;
        if (res.ok) {
          setStatus('ok');
          return;
        }
        if (res.status === 410) {
          setStatus('expired');
          return;
        }
        if (res.status === 404) {
          setStatus('invalid');
          return;
        }
        setStatus('error');
      } catch {
        if (!cancelled) setStatus('error');
      }
    }
    void run();
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (status === 'pending') {
    return <p className="text-sm text-cream-100/80">{t('verifying')}</p>;
  }

  if (status === 'ok') {
    return (
      <div className="space-y-4">
        <p className="text-sm text-emerald-300">{t('success')}</p>
        <Link href={`/${locale}/account`} className="btn-primary inline-block">
          {t('goToAccount')}
        </Link>
      </div>
    );
  }

  if (status === 'expired') {
    return (
      <div className="space-y-4">
        <p className="text-sm text-red-300">{t('expired')}</p>
        <Link href={`/${locale}/account`} className="font-medium text-gold-300 hover:underline">
          {t('resendFromAccount')}
        </Link>
      </div>
    );
  }

  if (status === 'invalid') {
    return <p className="text-sm text-red-300">{t('invalid')}</p>;
  }

  return <p className="text-sm text-red-300">{t('error')}</p>;
}
