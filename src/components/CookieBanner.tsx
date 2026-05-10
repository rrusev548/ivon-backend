'use client';

import { useEffect, useState } from 'react';

type Props = {
  title: string;
  body: string;
  acceptLabel: string;
  declineLabel: string;
};

const STORAGE_KEY = 'cookie-consent';

export default function CookieBanner({ title, body, acceptLabel, declineLabel }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {}
  }, []);

  const decide = (value: 'accepted' | 'declined') => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-2 bottom-2 z-50 sm:inset-x-auto sm:right-4 sm:bottom-4 sm:max-w-md">
      <div className="card-glass flex flex-col gap-3 p-5">
        <div>
          <div className="font-semibold text-cream-50">{title}</div>
          <p className="mt-1 text-sm text-cream-100/70">{body}</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => decide('accepted')} className="btn-primary flex-1">
            {acceptLabel}
          </button>
          <button type="button" onClick={() => decide('declined')} className="btn-ghost flex-1">
            {declineLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
