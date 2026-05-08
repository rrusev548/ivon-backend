'use client';

import { useRouter } from 'next/navigation';
import type { Locale } from '@/lib/i18n';

export default function LogoutButton({ locale, label }: { locale: Locale; label: string }) {
  const router = useRouter();
  const onClick = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push(`/${locale}`);
    router.refresh();
  };
  return (
    <button type="button" onClick={onClick} className="btn-ghost text-sm">
      {label}
    </button>
  );
}
