'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { Locale } from '@/lib/i18n';

export default function RedeemForm({ locale }: { locale: Locale }) {
  const t = useTranslations('redeem');
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch('/api/redeem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    setLoading(false);
    if (res.ok) {
      router.push(`/${locale}/account?redeemed=1`);
      router.refresh();
      return;
    }
    if (res.status === 404) setError(t('invalid'));
    else if (res.status === 409) setError(t('alreadyUsed'));
    else if (res.status === 401) setError(t('needAuth'));
    else if (res.status === 429) setError(t('limited'));
    else setError(t('error'));
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="label" htmlFor="code">
          {t('codeLabel')}
        </label>
        <input
          id="code"
          className="input font-mono tracking-wider"
          type="text"
          required
          value={code}
          autoFocus
          autoComplete="off"
          spellCheck={false}
          placeholder="XXXX-XXXX-XXXX"
          onChange={(e) => setCode(e.target.value.toUpperCase())}
        />
      </div>
      {error && <p className="text-sm text-red-300">{error}</p>}
      <button type="submit" disabled={loading || !code.trim()} className="btn-primary w-full">
        {loading ? t('loading') : t('submit')}
      </button>
    </form>
  );
}
