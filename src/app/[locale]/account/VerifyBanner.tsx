'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { Locale } from '@/lib/i18n';

export default function VerifyBanner({ email, locale }: { email: string; locale: Locale }) {
  const t = useTranslations('verifyEmail');
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error' | 'limited'>('idle');

  async function resend() {
    setStatus('loading');
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale }),
      });
      if (res.ok) {
        setStatus('sent');
        return;
      }
      if (res.status === 429) {
        setStatus('limited');
        return;
      }
      setStatus('error');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="mt-8 rounded-xl border border-amber-300/30 bg-amber-300/10 p-5">
      <div className="flex items-start gap-3">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="mt-0.5 shrink-0">
          <path
            d="M12 9v4m0 4h.01M4.93 19h14.14a2 2 0 001.74-3l-7.07-12a2 2 0 00-3.48 0L3.19 16a2 2 0 001.74 3z"
            stroke="#fcd34d"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="flex-1">
          <p className="text-sm font-medium text-amber-200">{t('bannerTitle')}</p>
          <p className="mt-1 text-sm text-amber-100/80">
            {t('bannerBody', { email })}
          </p>
          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={resend}
              disabled={status === 'loading' || status === 'sent'}
              className="rounded-md border border-amber-300/40 bg-amber-300/10 px-3 py-1.5 text-xs font-medium text-amber-100 transition hover:bg-amber-300/20 disabled:opacity-60"
            >
              {status === 'loading' ? t('sending') : status === 'sent' ? t('sent') : t('resend')}
            </button>
            {status === 'error' && <span className="text-xs text-red-300">{t('error')}</span>}
            {status === 'limited' && <span className="text-xs text-amber-200/80">{t('limited')}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
