'use client';

import { useEffect, useState } from 'react';

type Props = {
  label: string;
  price: string;
  href: string | null;
};

export default function StickyMobileCta({ label, price, href }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!href) return null;

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-cream-100/10 bg-ink-900/90 backdrop-blur-xl transition-transform duration-300 sm:hidden ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div>
          <div className="text-xs uppercase tracking-wider text-cream-100/55">{price}</div>
        </div>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary flex-1 max-w-[60%] text-center"
        >
          {label}
        </a>
      </div>
    </div>
  );
}
