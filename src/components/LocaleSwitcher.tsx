'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { locales, type Locale } from '@/lib/i18n';

const labels: Record<Locale, string> = {
  bg: 'Български',
  en: 'English',
  de: 'Deutsch',
};

export default function LocaleSwitcher({ current }: { current: Locale }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const change = (next: Locale) => {
    if (!pathname) return;
    const segments = pathname.split('/');
    if (segments[1] && (locales as readonly string[]).includes(segments[1])) {
      segments[1] = next;
    } else {
      segments.splice(1, 0, next);
    }
    const target = segments.join('/') || `/${next}`;
    startTransition(() => router.replace(target));
  };

  return (
    <label className="inline-flex items-center gap-2 text-xs text-cream-100/60">
      <select
        value={current}
        onChange={(e) => change(e.target.value as Locale)}
        disabled={isPending}
        className="rounded-md border border-cream-100/15 bg-ink-800 px-2 py-1 text-cream-100 transition focus:border-gold-300/50 focus:outline-none"
        aria-label="Language"
      >
        {locales.map((l) => (
          <option key={l} value={l}>
            {labels[l]}
          </option>
        ))}
      </select>
    </label>
  );
}
