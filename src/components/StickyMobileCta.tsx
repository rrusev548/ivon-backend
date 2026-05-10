'use client';

import { useEffect, useState } from 'react';

type Props = {
  courseId: string;
  label: string;
  price: string;
};

export default function StickyMobileCta({ courseId, label, price }: Props) {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const onClick = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
    } catch {}
    setLoading(false);
  };

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
        <button
          type="button"
          onClick={onClick}
          disabled={loading}
          className="btn-primary flex-1 max-w-[60%]"
        >
          {loading ? '…' : label}
        </button>
      </div>
    </div>
  );
}
