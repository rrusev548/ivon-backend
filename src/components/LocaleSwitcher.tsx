'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { locales, type Locale } from '@/lib/i18n';

export default function LocaleSwitcher({ current }: { current: Locale }) {
  const pathname = usePathname();

  function pathFor(locale: Locale) {
    if (!pathname) return `/${locale}`;
    const segments = pathname.split('/');
    if (segments[1] && (locales as readonly string[]).includes(segments[1])) {
      segments[1] = locale;
      return segments.join('/') || `/${locale}`;
    }
    return `/${locale}${pathname}`;
  }

  return (
    <div className="flex items-center gap-1 text-xs">
      {locales.map((l) => (
        <Link
          key={l}
          href={pathFor(l)}
          className={`rounded px-2 py-1 uppercase ${
            l === current
              ? 'bg-brand-600 text-white'
              : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          {l}
        </Link>
      ))}
    </div>
  );
}
