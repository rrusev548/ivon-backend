'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import type { Locale } from '@/lib/i18n';

export default function SiteHeader({ locale, hasSession }: { locale: Locale; hasSession: boolean }) {
  const t = useTranslations('nav');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 transition-all duration-300 ${
        scrolled
          ? 'border-b border-cream-100/10 bg-ink-900/80 py-2 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent py-4'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4">
        <Link href={`/${locale}`} className="flex items-center gap-2.5">
          <Image
            src="/logo.jpg"
            alt="Digital S Team"
            width={36}
            height={36}
            priority
            className="h-9 w-9 rounded-xl object-cover ring-1 ring-gold-300/30"
          />
          <span className="text-lg font-bold tracking-tight text-cream-50">
            Digital <span className="text-gold-300">S</span> Team
          </span>
        </Link>
        <nav className="flex items-center gap-7 text-sm">
          <Link
            href={`/${locale}/courses`}
            className="text-cream-100/80 transition hover:text-gold-300"
          >
            {t('courses')}
          </Link>
          <Link
            href={`/${locale}/about`}
            className="text-cream-100/80 transition hover:text-gold-300"
          >
            {t('about')}
          </Link>
          {hasSession ? (
            <Link
              href={`/${locale}/account`}
              className="text-cream-100/80 transition hover:text-gold-300"
            >
              {t('account')}
            </Link>
          ) : (
            <Link
              href={`/${locale}/auth/login`}
              className="text-cream-100/80 transition hover:text-gold-300"
            >
              {t('login')}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
