'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const COOKIE_KEY = 'popup_dismissed';
const TTL_DAYS = 7;

function isDismissed() {
  if (typeof document === 'undefined') return false;
  return document.cookie.split('; ').some((c) => c.startsWith(`${COOKIE_KEY}=`));
}

function dismiss() {
  const expires = new Date(Date.now() + TTL_DAYS * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${COOKIE_KEY}=1; expires=${expires}; path=/; SameSite=Lax`;
}

export default function OfferPopup({
  title,
  body,
  ctaLabel,
  ctaUrl,
  delaySec,
  emailPlaceholder,
  closeLabel,
  locale,
}: {
  title: string;
  body: string;
  ctaLabel: string;
  ctaUrl: string;
  delaySec: number;
  emailPlaceholder: string;
  closeLabel: string;
  locale: string;
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');

  useEffect(() => {
    if (isDismissed()) return;
    const t = setTimeout(() => setOpen(true), delaySec * 1000);
    return () => clearTimeout(t);
  }, [delaySec]);

  if (!open) return null;

  const close = () => {
    dismiss();
    setOpen(false);
  };

  const submit = async () => {
    if (email && email.includes('@')) {
      try {
        await fetch('/api/popup/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, locale, website: honeypot }),
        });
      } catch {
        /* swallow */
      }
    }
    dismiss();
    window.location.href = ctaUrl;
  };

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 sm:right-6 sm:bottom-6 sm:left-auto sm:max-w-md">
      <div className="card-glass animate-slideInUp p-6">
        <button
          type="button"
          onClick={close}
          aria-label={closeLabel}
          className="absolute right-3 top-3 rounded-md p-1 text-cream-100/60 transition hover:text-cream-50"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 6l12 12M6 18L18 6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <span className="eyebrow">★ {/* offer */}</span>
        <h3 className="serif mt-2 text-xl font-medium text-cream-50">{title}</h3>
        <p className="mt-2 text-sm text-cream-100/75">{body}</p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            type="email"
            placeholder={emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input flex-1"
          />
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            aria-hidden="true"
            className="hidden"
          />
          <Link href={ctaUrl} onClick={submit} className="btn-primary whitespace-nowrap">
            {ctaLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
