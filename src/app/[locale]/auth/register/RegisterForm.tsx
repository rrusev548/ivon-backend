'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { Locale } from '@/lib/i18n';

export default function RegisterForm({ locale }: { locale: Locale }) {
  const t = useTranslations('auth');
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [website, setWebsite] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError(t('weakPassword'));
      return;
    }
    setLoading(true);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, locale, website }),
    });
    if (res.status === 409) {
      setError(t('exists'));
      setLoading(false);
      return;
    }
    if (!res.ok) {
      setError(t('invalid'));
      setLoading(false);
      return;
    }
    router.push(`/${locale}/account`);
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label className="label" htmlFor="name">
          {t('name')}
        </label>
        <input
          id="name"
          className="input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label className="label" htmlFor="email">
          {t('email')}
        </label>
        <input
          id="email"
          className="input"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label className="label" htmlFor="password">
          {t('password')}
        </label>
        <input
          id="password"
          className="input"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        aria-hidden="true"
        className="hidden"
      />
      {error && <p className="text-sm text-red-300">{error}</p>}
      <button type="submit" disabled={loading} className="btn-primary w-full">
        {t('signUp')}
      </button>
    </form>
  );
}
