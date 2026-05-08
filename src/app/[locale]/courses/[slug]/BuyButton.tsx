'use client';

import { useState } from 'react';

export default function BuyButton({ courseId, label }: { courseId: string; label: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onClick = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/checkout/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? 'Checkout error');
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError('Network error');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <button type="button" onClick={onClick} disabled={loading} className="btn-cta">
        {loading ? '…' : label}
      </button>
      {error && <span className="text-xs text-red-300">{error}</span>}
    </div>
  );
}
